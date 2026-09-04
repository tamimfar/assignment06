import { z } from "zod";

export const createComplaintValidation = z.object({
    areaId: z.string().uuid("Invalid area ID"),

    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(150, "Title must not exceed 150 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description must not exceed 2000 characters"),

    priority: z
        .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
        .default("MEDIUM"),

    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(300, "Address must not exceed 300 characters"),
});

export const updateComplaintValidation = z.object({
    areaId: z.string().uuid("Invalid area ID").optional(),

    title: z
        .string()
        .min(5)
        .max(150)
        .optional(),

    description: z
        .string()
        .min(10)
        .max(2000)
        .optional(),

    priority: z
        .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
        .optional(),

    address: z
        .string()
        .min(5)
        .max(300)
        .optional(),

    status: z
        .enum([
            "PENDING",
            "ASSIGNED",
            "IN_PROGRESS",
            "RESOLVED",
            "CLOSED",
            "CANCELLED",
        ])
        .optional(),
});

export type CreateComplaintInput = z.infer<
    typeof createComplaintValidation
>;

export type UpdateComplaintInput = z.infer<
    typeof updateComplaintValidation
>;