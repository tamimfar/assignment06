import { z } from "zod";


export const createPaymentValidation = z.object({
    complaintId: z
        .string()
        .uuid("Invalid complaint ID"),
});


export const executePaymentValidation = z.object({
    paymentId: z
        .string()
        .min(1, "Payment ID is required"),
});


export type CreatePaymentInput = z.infer<
    typeof createPaymentValidation
>;

export type ExecutePaymentInput = z.infer<
    typeof executePaymentValidation
>;