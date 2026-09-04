import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { generateOTP } from "../../utils/otp";
import { jwtUtils } from "../../utils/jwt";
import { IGoogleLoginPayload, LoginInput, RegisterInput } from "./auth.interface";
import { AuthProvider, UserRole, UserStatus } from "../../../generated/prisma/enums";
import transporter from "../../lib/nodemailer";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { googleClient } from "../../lib/googleAuth";
import { TokenPayload } from "google-auth-library";



const registerDB = async (payload: RegisterInput) => {
    const { name, email, password, phone } = payload;

    // Check existing user
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const data = {
        name,
        email,
        password: hashedPassword,
        phone,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        authProvider: AuthProvider.CRENTIAL,
        emailVerified: false,
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP in Redis
    const otpkey = `email-verification:${email}`;
    await redisClient.set(
        otpkey,
        otp,
        {
            EX: 5 * 60,
        },
    );
    // Save DATA in Redis
    const datakey = `data-email:${email}`;
    await redisClient.set(datakey, JSON.stringify(data), {
        expiration: {
            type: "EX",
            value: 5 * 60
        }
    })

    // Send OTP
    await transporter.sendMail({
        from: config.smtp_username,
        to: email,
        subject: "Verify Your Email",
        text: `Your OTP is ${otp}`,
    })

    return {
        message: "OTP sent successfully",
    };
};

const verificationDB = async (email: string, OTP: string) => {
    if (!email && !OTP) {
        throw new Error("email is missing");
    }
    const otpkey = `email-verification:${email}`;
    const datakey = `data-email:${email}`;

    const otp = await redisClient.get(otpkey);
    const data = await redisClient.get(datakey);


    if (otp !== OTP) {
        throw new Error("Invalid OTP");
    }
    if (!data) {
        throw new Error("Invalid Data");
    }
    // const {name,email,password,phone,role,status,authProvider,emailVerified}= JSON.parse(data);
    const result = JSON.parse(data);
    const user = await prisma.user.create({
        data: {
            name: result.name,
            email: result.email,
            password: result.password,
            phone: result.phone,
            role: result.role,
            status: result.status,
            authProvider: result.authProvider,
            emailVerified: true
        }, omit: { password: true }
    })
    if (user) {
        await redisClient.del(otpkey);
        await redisClient.del(datakey);
    }

    return user
}


// login
const login = async (payload: LoginInput) => {
    const { email, password } = payload;

    // Find user
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    // Check password exists
    if (!user.password) {
        throw new Error(
            "This account does not have a password. Please use Google login.",
        );
    }

    // Check password
    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password,
    );

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password.");
    }

    // Check account status
    if (user.status === "BLOCKED") {
        throw new Error(
            "Your account has been blocked. Please contact support.",
        );
    }

    if (user.status === "INACTIVE") {
        throw new Error(
            "Your account is inactive. Please contact support.",
        );
    }

    // Check email verification
    if (!user.emailVerified) {
        throw new Error(
            "Please verify your email before logging in.",
        );
    }

    // JWT payload
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    // Access Token
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    // Refresh Token
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
        },
    };
};

// refresh token for create new access token
const refreshToken = async (token: string) => {
    const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_refresh_secret,
        
    );

    if (!verifiedToken.success) {
        throw new Error("Invalid or expired refresh token.");
    }

    const { userId } = verifiedToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("Your account is not active.");
    }

    const newAccessToken = jwtUtils.createToken(
        {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    return {
        accessToken: newAccessToken,
    };
};

// google login

const googleLogin = async (payload: IGoogleLoginPayload) => {

	let googleIdTokenPayload: TokenPayload | null | undefined = null;
    

	try {

		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});
		googleIdTokenPayload = ticket.getPayload();


	} catch (error) {
		console.log("Google ID Token Verification Failed", error);
		throw new Error("Invalid Or Expired Google Id Token");
	}

	if (!googleIdTokenPayload) {
		throw new Error("Invalid Or Expired Google Id Token");
	}

	if (!googleIdTokenPayload.email) {
		throw new Error("Google ID Token Payload Does Not Contain Email");
	}
	if (!googleIdTokenPayload.name) {
		throw new Error("Google ID Token Payload Does Not Contain Name");
	}

	const ifPatientExistWithGoogleAuth = await prisma.user.findUnique({
		where: {
			email: googleIdTokenPayload.email,
			role:UserRole.USER,
			googleId: googleIdTokenPayload.sub,
		}
	});

	let user = ifPatientExistWithGoogleAuth;

	if (!ifPatientExistWithGoogleAuth) {
		const ifPatientExistWithGoogleCredentials = await prisma.user.findUnique({
			where: {
				email: googleIdTokenPayload.email,
				role:UserRole.USER,
				authProvider: AuthProvider.CRENTIAL,
			}
		});
		if (ifPatientExistWithGoogleCredentials) {

			if (!ifPatientExistWithGoogleCredentials.emailVerified) {
				throw new Error("Email is not verified");
			}

			if (ifPatientExistWithGoogleCredentials.status === UserStatus.BLOCKED) {
				throw new Error("User Is Blocked")
			}
			

			user = await prisma.user.update({
				where: {
					id: ifPatientExistWithGoogleCredentials.id
				},
				data: {
					googleId: googleIdTokenPayload.sub
				}
			})
		} else {
			user = await prisma.user.create({
				data: {
					name: googleIdTokenPayload.name,
					email: googleIdTokenPayload.email,
					role: UserRole.USER,
					googleId: googleIdTokenPayload.sub,
					authProvider: AuthProvider.GOOGLE,
					emailVerified: true,
					status: UserStatus.ACTIVE
				}
			});

		}

	}

	if (!user) {
		throw new Error("User not found");
	}
	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is blocked");
	}
	
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};
	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);
	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	)

	return {
		accessToken,
		refreshToken
	}
}
export const authService = {
    registerDB,
    verificationDB,
    login,
    refreshToken,
    googleLogin
};