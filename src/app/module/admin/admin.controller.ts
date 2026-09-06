import type {
    Request,
    Response,
} from "express";

import catchAsync from "../../utils/catchAsync";

import {
    adminService,
} from "./admin.service";

// =====================================================
// GET ALL USERS
// =====================================================
const getAllUsers = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const result =
            await adminService.getAllUsers();

        res.status(200).json({
            success: true,
            message:
                "Users retrieved successfully.",
            data: result,
        });
    }
);

// =====================================================
// GET SINGLE USER
// =====================================================
const getUserById = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.params.id;

        if (typeof userId !== "string") {
            throw new Error("User id is required.");
        }

        const result =
            await adminService.getUserById(
                userId
            );

        res.status(200).json({
            success: true,
            message:
                "User retrieved successfully.",
            data: result,
        });
    }
);

// =====================================================
// GET ALL TECHNICIANS
// =====================================================
const getAllTechnicians = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const result =
            await adminService.getAllTechnicians();

        res.status(200).json({
            success: true,
            message:
                "Technicians retrieved successfully.",
            data: result,
        });
    }
);

// =====================================================
// UPDATE USER STATUS
// =====================================================
const updateUserStatus = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.params.id;

        if (typeof userId !== "string") {
            throw new Error("User id is required.");
        }

        const result =
            await adminService.updateUserStatus(
                userId,
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "User status updated successfully.",
            data: result,
        });
    }
);

// =====================================================
// UPDATE USER ROLE
// =====================================================
const updateUserRole = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.params.id;

        if (typeof userId !== "string") {
            throw new Error("User id is required.");
        }

        const result =
            await adminService.updateUserRole(
                userId,
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "User role updated successfully.",
            data: result,
        });
    }
);

// =====================================================
// DELETE USER
// =====================================================
const deleteUser = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            req.params.id;

        if (typeof userId !== "string") {
            throw new Error("User id is required.");
        }

        await adminService.deleteUser(
            userId
        );

        res.status(200).json({
            success: true,
            message:
                "User deleted successfully.",
            data: null,
        });
    }
);

// =====================================================
// ADMIN DASHBOARD
// =====================================================
const getDashboard = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const result =
            await adminService.getDashboard();

        res.status(200).json({
            success: true,
            message:
                "Admin dashboard retrieved successfully.",
            data: result,
        });
    }
);

export const adminController = {
    getAllUsers,
    getUserById,
    getAllTechnicians,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    getDashboard,
};