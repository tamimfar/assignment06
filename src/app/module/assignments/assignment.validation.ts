import { z } from "zod";

export const createAssignmentValidation = z.object({
    complaintId: z
        .string()
        .uuid("Invalid complaint ID"),

    technicianId: z
        .string()
        .uuid("Invalid technician ID"),
});


export const updateAssignmentValidation = z.object({
    status: z.enum([
        "PENDING",
        "ACCEPTED",
        "IN_PROGRESS",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
    ]),
});


export type CreateAssignmentInput = z.infer<
    typeof createAssignmentValidation
>;

export type UpdateAssignmentInput = z.infer<
    typeof updateAssignmentValidation
>;