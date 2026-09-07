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

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Create a new review. USER only.
 *     tags:
 *       - Review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - complaintId
 *               - rating
 *               - comment
 *             properties:
 *               userId:
 *                 type: string
 *               complaintId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *             example:
 *               userId: 1
 *               complaintId: 1
 *               rating: 5
 *               comment: "Great service!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         description: Unauthorized
 *       403:     
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /reviews/my:
 *   get:
 *     summary: Get my reviews
 *     description: Get my reviews. USER only.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/my",
    auth(UserRole.USER),
    reviewController.getAllReviews
);


// =====================================================
// ALL REVIEWS
// ADMIN
// =====================================================

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Get all reviews. ADMIN only.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    auth(UserRole.ADMIN),
    reviewController.getAllReviews
);


// =====================================================
// SINGLE REVIEW
// USER / ADMIN
// =====================================================

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review
 *     description: Get a single review. USER, ADMIN.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     description: Update a review. USER, ADMIN.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               complaintId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *             example:
 *               userId: 1
 *               complaintId: 1
 *               rating: 5
 *               comment: "Great service!"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete a review. USER, ADMIN.
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden   
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:id",
    auth(
       
        UserRole.ADMIN
    ),
    reviewController.deleteReview
);


export const reviewRouter = router;