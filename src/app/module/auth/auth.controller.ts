import type { Request, Response } from "express";
import httpStatus from "http-status";

import { authService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerDB(req.body);

    res.status(httpStatus.CREATED).json({
        success: true,
        message:
            "Registration successful. Please check your email for the verification OTP.",
        data: result,
    });
}); 

const verification =catchAsync( async (req: Request, res: Response) => {
    const result = await authService.verificationDB(req.body.email, req.body.OTP);

    res.status(httpStatus.CREATED).json({
        success: true,
        message:
            "Registration successful. Please check your email for the verification OTP.",
        data: result,
    });
})

const login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(httpStatus.OK).json({
        success: true,
        message: "Login successful.",
        data: {
            user: result.user,
        },
    });
};

const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        throw new Error("Refresh token not found.");
    }

    const result = await authService.refreshToken(token);

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });

    res.status(httpStatus.OK).json({
        success: true,
        message: "Access token refreshed successfully.",
        data: null,
    });
};

const googlelogin = catchAsync( async (req: Request, res: Response)=>{
	const { idToken } = req.body 
    
	const result = await authService.googleLogin(req.body);
    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(httpStatus.OK).json({
        success: true,
        message: "Login successful.",
        data: result        
    })
});

export const authController = {
    register,
    verification,
    login,
    refreshToken,
    googlelogin
};