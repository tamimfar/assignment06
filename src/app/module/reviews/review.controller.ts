import type {
    Request,
    Response,
} from "express";

import catchAsync from "../../utils/catchAsync";
import { reviewService } from "./review.service";

// =====================================================
// CREATE
// =====================================================

const createReview = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.user!.userId;

        const result =
            await reviewService.createReview(
                userId,
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Review created successfully.",
            data: result,
        });
    }
);

// =====================================================
// GET ALL
// =====================================================

const getAllReviews = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
       
        const result =
            await reviewService.getAllReviews();

        res.status(200).json({
            success: true,
            message:
                "Reviews retrieved successfully.",
            data: result,
        });
    }
);

// =====================================================
// GET SINGLE
// =====================================================

const getReviewById = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.user!.userId;

        const reviewId =
            String(req.params.id);

        const result =
            await reviewService.getReviewById(
                reviewId,
                userId
            );

        res.status(200).json({
            success: true,
            message:
                "Review retrieved successfully.",
            data: result,
        });
    }
);

// =====================================================
// UPDATE
// =====================================================

const updateReview = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.user!.userId;

        const reviewId =
            String(req.params.id);

        const result =
            await reviewService.updateReview(
                reviewId,
                userId,
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "Review updated successfully.",
            data: result,
        });
    }
);

// =====================================================
// DELETE
// =====================================================

const deleteReview = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.user!.userId;

        const reviewId =
            String(req.params.id);

        const result =
            await reviewService.deleteReview(
                reviewId,
                userId 
            );

        res.status(200).json({
            success: true,
            message:
                "Review deleted successfully.",
            data: result,
        });
    }
);

export const reviewController = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
};