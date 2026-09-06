import { Router } from "express";

import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validatiReqest";
import { loginValidation, registerValidation } from "./auth.validation";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";

const router = Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     description: Register user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: s41296193@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: 01712345678
 *               
 *                 responses:
 *       200:
 *         description: User registered successfully
 *       401:
 *         description: user already registered
 *       403:
 *         description: Forbidden
 *       404:
 *         description: data not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/register",
    validateRequest(registerValidation),
    authController.register,
);

/**
 * @swagger
 * /auth/verification:
 *   post:
 *     summary: Verify user
 *     description: Verify user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: s41296193@gmail.com
 *               OTP:
 *                 type: string
 *                 example: 123456
 *       responses:
 *       200:
 *         description: User verified successfully
 *       401:
 *         description: user already verified
 *       403:
 *         description: Forbidden
 *       404:
 *         description: data not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/verification",
    authController.verification,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Login user with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@powersafe.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@12345
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Account is blocked or inactive
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/login",
    validateRequest(loginValidation),
    authController.login,
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh token
 *     description: Refresh token
 *     tags:
 *       - Auth
 * 
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: user already logged in
 *       403:
 *         description: Forbidden
 *       404:
 *         description: data not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/refresh-token",

    authController.refreshToken,
);

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Google login
 *     description: Login or register a user using a Google ID token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token received from Google Sign-In
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Google ID token is required or invalid
 *       401:
 *         description: Google authentication failed
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post(
    "/google-login",
    authController.googlelogin,
);

export const authRouter = router;