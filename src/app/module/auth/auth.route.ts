import { Router } from "express";

import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validatiReqest";
import { loginValidation, registerValidation } from "./auth.validation";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.post(
    "/register",
    validateRequest(registerValidation),
    authController.register,
);

router.post(
    "/verification",
    authController.verification,
);

router.post(
    "/login",
    validateRequest(loginValidation),
    authController.login,
);

router.post(
    "/refresh-token",
    
    authController.refreshToken,
);

router.post(
    "/google-login",
    authController.googlelogin,
);

export const authRouter = router;