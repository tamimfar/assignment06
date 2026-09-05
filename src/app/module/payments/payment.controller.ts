import type {
    Request,
    Response,
} from "express";

import  catchAsync  from "../../utils/catchAsync";

import { paymentService } from "./payment.service";


// =====================================================
// CREATE
// =====================================================

const createBkashPayment = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const userId =
            req.user!.userId;


        const result =
            await paymentService.createBkashPayment(
                userId,
                req.body
            );


        res.status(201).json({
            success: true,

            message:
                "bKash payment created successfully.",

            data: result,
        });
    }
);


// =====================================================
// EXECUTE
// =====================================================

const executeBkashPayment = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const userId =
            req.user!.userId;


        const result =
            await paymentService.executeBkashPayment(
                userId,
                req.body.paymentId
            );


        res.status(200).json({
            success: true,

            message:
                "Payment executed successfully.",

            data: result,
        });
    }
);


// =====================================================
// MY PAYMENTS
// =====================================================

const getMyPayments = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const userId =
            req.user!.userId;


        const result =
            await paymentService.getMyPayments(
                userId
            );


        res.status(200).json({
            success: true,

            message:
                "Payments retrieved successfully.",

            data: result,
        });
    }
);


// =====================================================
// GET SINGLE
// =====================================================

const getPaymentById = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const userId =
            req.user!.userId;


        const paymentId =
            String(req.params.id);


        const result =
            await paymentService.getPaymentById(
                paymentId,
                userId
            );


        res.status(200).json({
            success: true,

            message:
                "Payment retrieved successfully.",

            data: result,
        });
    }
);


// =====================================================
// ADMIN → ALL
// =====================================================

const getAllPayments = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const result =
            await paymentService.getAllPayments();


        res.status(200).json({
            success: true,

            message:
                "All payments retrieved successfully.",

            data: result,
        });
    }
);


export const paymentController = {
    createBkashPayment,
    executeBkashPayment,
    getMyPayments,
    getPaymentById,
    getAllPayments,
};