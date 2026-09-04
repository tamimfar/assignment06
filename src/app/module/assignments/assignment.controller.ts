import type { Request, Response } from "express";

import  catchAsync  from "../../utils/catchAsync";

import { assignmentService } from "./assignment.service";


const createAssignment = catchAsync(
    async (req: Request, res: Response) => {

        const adminId = req.user!.userId;

        const result =
            await assignmentService.createAssignment(
                adminId,
                req.body
            );


        res.status(201).json({
            success: true,
            message: "Assignment created successfully.",
            data: result,
        });
    }
);


const getAssignments = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const result =
            await assignmentService.getAssignments(
                user.userId,
                user.role
            );


        res.status(200).json({
            success: true,
            message: "Assignments retrieved successfully.",
            data: result,
        });
    }
);


const getAssignmentById = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const assignmentId =
            String(req.params.id);


        const result =
            await assignmentService.getAssignmentById(
                assignmentId,
                user.userId,
                user.role
            );


        res.status(200).json({
            success: true,
            message: "Assignment retrieved successfully.",
            data: result,
        });
    }
);


const updateAssignment = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const assignmentId =
            String(req.params.id);


        const result =
            await assignmentService.updateAssignment(
                assignmentId,
                user.userId,
                user.role,
                req.body
            );


        res.status(200).json({
            success: true,
            message: "Assignment updated successfully.",
            data: result,
        });
    }
);


const deleteAssignment = catchAsync(
    async (req: Request, res: Response) => {

        const assignmentId =
            String(req.params.id);


        await assignmentService.deleteAssignment(
            assignmentId
        );


        res.status(200).json({
            success: true,
            message: "Assignment deleted successfully.",
            data: null,
        });
    }
);


export const assignmentController = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};