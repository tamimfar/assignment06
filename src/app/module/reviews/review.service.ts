import {
    ComplaintStatus,
    PaymentStatus,
    ReviewStatus,
} from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";

import type {
    CreateReviewInput,
    UpdateReviewInput,
} from "./review.validation";


// =====================================================
// CREATE REVIEW
// =====================================================

const createReview = async (
    userId: string,
    payload: CreateReviewInput
) => {

    // -------------------------------------------------
    // Find complaint
    // -------------------------------------------------

    const complaint =
        await prisma.complaint.findUnique({

            where: {
                id: payload.complaintId,
            },

            include: {
                payment: true,
                review: true,
            },
        });


    if (!complaint) {
        throw new Error(
            "Complaint not found."
        );
    }


    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (complaint.userId !== userId) {
        throw new Error(
            "You can only review your own complaint."
        );
    }


    // -------------------------------------------------
    // Complaint must be resolved
    // -------------------------------------------------

    if (
        complaint.status !==
        ComplaintStatus.RESOLVED
    ) {
        throw new Error(
            "Review is available only after the complaint is resolved."
        );
    }


    // -------------------------------------------------
    // Payment must be completed
    // -------------------------------------------------

    if (
        !complaint.payment ||
        complaint.payment.status !==
        PaymentStatus.PAID
    ) {
        throw new Error(
            "Review is available only after successful payment."
        );
    }


    // -------------------------------------------------
    // Check existing review
    // -------------------------------------------------

    if (complaint.review) {
        throw new Error(
            "This complaint has already been reviewed."
        );
    }


    // -------------------------------------------------
    // Create review
    // -------------------------------------------------

    const review =
        await prisma.review.create({

            data: {
                userId,

                complaintId:
                    payload.complaintId,

                rating:
                    payload.rating,

                comment:
                    payload.comment,
            },

            include: {
                complaint: {
                    include: {
                        area: true,
                    },
                },

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });


    return review;
};


// =====================================================
// GET MY REVIEWS
// =====================================================

const getMyReviews = async (
    userId: string
) => {

    return prisma.review.findMany({

        where: {
            userId,
        },

        include: {
            complaint: {
                include: {
                    area: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};


// =====================================================
// GET REVIEW BY ID
// =====================================================

const getReviewById = async (
    reviewId: string,
    userId: string
) => {

    const review =
        await prisma.review.findUnique({

            where: {
                id: reviewId,
            },

            include: {
                complaint: {
                    include: {
                        area: true,

                        assignment: {
                            include: {
                                technician: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        phone: true,
                                    },
                                },
                            },
                        },
                    },
                },

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });


    if (!review) {
        throw new Error(
            "Review not found."
        );
    }


    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (review.userId !== userId) {
        throw new Error(
            "Forbidden. You can only access your own review."
        );
    }


    return review;
};


// =====================================================
// UPDATE REVIEW
// =====================================================

const updateReview = async (
    reviewId: string,
    userId: string,
    payload: UpdateReviewInput
) => {

    // -------------------------------------------------
    // Find review
    // -------------------------------------------------

    const review =
        await prisma.review.findUnique({

            where: {
                id: reviewId,
            },
        });


    if (!review) {
        throw new Error(
            "Review not found."
        );
    }


    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (review.userId !== userId) {
        throw new Error(
            "Forbidden. You can only update your own review."
        );
    }


    // -------------------------------------------------
    // Update review
    // -------------------------------------------------

    const updatedReview =
        await prisma.review.update({

            where: {
                id: reviewId,
            },

            data: {
                ...(payload.rating !== undefined && {
                    rating: payload.rating,
                }),

                ...(payload.comment !== undefined && {
                    comment: payload.comment,
                }),

                ...(payload.status !== undefined && {
                    status: payload.status,
                }),
            },

            include: {
                complaint: {
                    include: {
                        area: true,
                    },
                },
            },
        });


    return updatedReview;
};


// =====================================================
// DELETE REVIEW
// =====================================================

const deleteReview = async (
    reviewId: string,
    userId: string
) => {

    // -------------------------------------------------
    // Find review
    // -------------------------------------------------

    const review =
        await prisma.review.findUnique({

            where: {
                id: reviewId,
            },
        });


    if (!review) {
        throw new Error(
            "Review not found."
        );
    }


    // -------------------------------------------------
    // Check ownership
    // -------------------------------------------------

    if (review.userId !== userId) {
        throw new Error(
            "Forbidden. You can only delete your own review."
        );
    }


    // -------------------------------------------------
    // Delete review
    // -------------------------------------------------

    await prisma.review.delete({

        where: {
            id: reviewId,
        },
    });


    return null;
};


// =====================================================
// ADMIN → GET ALL REVIEWS
// =====================================================

const getAllReviews = async () => {

    return prisma.review.findMany({

        include: {
            complaint: {
                include: {
                    area: true,

                    assignment: {
                        include: {
                            technician: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            },

            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};


export const reviewService = {
    createReview,
    getMyReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviews,
};