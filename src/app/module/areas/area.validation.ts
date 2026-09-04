import { z } from "zod";

const createAreaValidation = z.object({
    name: z
        .string()
        .min(2, "Area name must be at least 2 characters")
        .max(100, "Area name must not exceed 100 characters"),

    district: z
        .string()
        .min(2, "District is required")
        .max(100, "District must not exceed 100 characters"),

    division: z
        .string()
        .min(2, "Division is required")
        .max(100, "Division must not exceed 100 characters"),

    description: z
        .string()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
});

const updateAreaValidation = z.object({
    name: z
        .string()
        .min(2)
        .max(100)
        .optional(),

    district: z
        .string()
        .min(2)
        .max(100)
        .optional(),

    division: z
        .string()
        .min(2)
        .max(100)
        .optional(),

    description: z
        .string()
        .max(500)
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

export const areaValidation = {
    createAreaValidation,
    updateAreaValidation,
};