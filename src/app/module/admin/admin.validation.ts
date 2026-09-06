import { z } from "zod";

// =====================================================
// UPDATE USER STATUS
// =====================================================
export const updateUserStatusValidation =
    z.object({
        status: z.enum(
            ["ACTIVE", "INACTIVE", "BLOCKED"],
            {
                message:
                    "Invalid user status.",
            }
        ),
    });

// =====================================================
// UPDATE USER ROLE
// =====================================================
export const updateUserRoleValidation =
    z.object({
        role: z.enum(
            ["USER", "TECHNICIAN", "ADMIN"],
            {
                message:
                    "Invalid user role.",
            }
        ),
    });

export type UpdateUserStatusInput =
    z.infer<
        typeof updateUserStatusValidation
    >;

export type UpdateUserRoleInput =
    z.infer<
        typeof updateUserRoleValidation
    >;