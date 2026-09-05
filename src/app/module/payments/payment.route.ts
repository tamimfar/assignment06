import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import  validateRequest  from "../../middleware/validatiReqest";
import { UserRole } from "../../../generated/prisma/enums";

import {
    createPaymentValidation,
    executePaymentValidation,
} from "./payment.validation";

import {
    paymentController,
} from "./payment.controller";


const router = Router();


// =====================================================
// CREATE BKASH PAYMENT
// USER
// =====================================================

router.post(
    "/create",

    auth(UserRole.USER),

    validateRequest(
        createPaymentValidation
    ),

    paymentController.createBkashPayment
);


// =====================================================
// EXECUTE BKASH PAYMENT
// USER
// =====================================================

router.post(
    "/execute",

    auth(UserRole.USER),

    validateRequest(
        executePaymentValidation
    ),

    paymentController.executeBkashPayment
);


// =====================================================
// MY PAYMENTS
// =====================================================

router.get(
    "/my",

    auth(UserRole.USER),

    paymentController.getMyPayments
);


// =====================================================
// ADMIN → ALL PAYMENTS
// =====================================================

router.get(
    "/",

    auth(UserRole.ADMIN),

    paymentController.getAllPayments
);


// =====================================================
// SINGLE PAYMENT
// =====================================================

router.get(
    "/:id",

    auth(
        UserRole.USER,
        UserRole.ADMIN
    ),

    paymentController.getPaymentById
);


export const paymentRouter = router;