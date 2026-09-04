import { z } from "zod";

export const registerValidation = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),

    email: z
        .string()
        .email("Please provide a valid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters"),

    phone: z
        .string()
        .regex(/^01[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
});

export type RegisterInput = z.infer<typeof registerValidation>;

export const loginValidation = z.object({
    email: z
        .string()
        .email("Please provide a valid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginValidation>;