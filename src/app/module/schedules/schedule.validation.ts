import { z } from "zod";

const createScheduleValidation = z.object({
    areaId: z
        .string()
        .uuid("Invalid area ID"),

    date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be in YYYY-MM-DD format"
        ),

    startTime: z
        .string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "Start time must be in HH:mm format"
        ),

    endTime: z
        .string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "End time must be in HH:mm format"
        ),

    reason: z
        .string()
        .max(500, "Reason must not exceed 500 characters")
        .optional(),
});


const updateScheduleValidation = z.object({
    areaId: z
        .string()
        .uuid("Invalid area ID")
        .optional(),

    date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be in YYYY-MM-DD format"
        )
        .optional(),

    startTime: z
        .string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "Start time must be in HH:mm format"
        )
        .optional(),

    endTime: z
        .string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "End time must be in HH:mm format"
        )
        .optional(),

    reason: z
        .string()
        .max(500)
        .optional(),

    status: z
        .enum([
            "SCHEDULED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
        ])
        .optional(),
});


export const scheduleValidation = {
    createScheduleValidation,
    updateScheduleValidation,
};