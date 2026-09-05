import { Router } from "express";

import { auth } from "../../middleware/checkAuth";

import validateRequest from "../../middleware/validatiReqest";

import { UserRole } from "../../../generated/prisma/enums";

import {
    createReviewValidation,
    updateReviewValidation,
} from "./review.validation";

import {
    reviewController,
} from "./review.controller";


const router = Router();


// =====================================================
// CREATE REVIEW
// USER
// =====================================================

router.post(
    "/",
    auth(UserRole.USER),
    validateRequest(
        createReviewValidation
    ),
    reviewController.createReview
);


// =====================================================
// MY REVIEWS
// USER
// =====================================================

router.get(
    "/my",
    auth(UserRole.USER),
    reviewController.getAllReviews
);


// =====================================================
// ALL REVIEWS
// ADMIN
// =====================================================

router.get(
    "/",
    auth(UserRole.ADMIN),
    reviewController.getAllReviews
);


// =====================================================
// SINGLE REVIEW
// USER / ADMIN
// =====================================================

router.get(
    "/:id",
    auth(
        UserRole.USER,
        UserRole.ADMIN
    ),
    reviewController.getReviewById
);


// =====================================================
// UPDATE REVIEW
// USER / ADMIN
// =====================================================

router.patch(
    "/:id",
    auth(
        UserRole.USER,
        UserRole.ADMIN
    ),
    validateRequest(
        updateReviewValidation
    ),
    reviewController.updateReview
);


// =====================================================
// DELETE REVIEW
// USER / ADMIN
// =====================================================

router.delete(
    "/:id",
    auth(
        UserRole.USER,
        UserRole.ADMIN
    ),
    reviewController.deleteReview
);


export const reviewRouter = router;