import { z } from "zod";

export const createReviewValidation = z.object({
    complaintId: z
        .string()
        .uuid("Invalid complaint ID"),

    rating: z
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must not exceed 5"),

    comment: z
        .string()
        .max(1000, "Comment must not exceed 1000 characters")
        .optional(),
});

export const updateReviewValidation = z.object({
    rating: z
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must not exceed 5")
        .optional(),

    comment: z
        .string()
        .max(1000, "Comment must not exceed 1000 characters")
        .optional(),

    status: z
        .enum(["PUBLISHED", "HIDDEN"])
        .optional(),
});

export type CreateReviewInput = z.infer<
    typeof createReviewValidation
>;

export type UpdateReviewInput = z.infer<
    typeof updateReviewValidation
>;