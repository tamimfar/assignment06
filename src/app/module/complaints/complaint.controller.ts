import type { Request, Response } from "express";
import  catchAsync  from "../../utils/catchAsync";
import { complaintService } from "./complaint.service";


const createComplaint = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const result = await complaintService.createComplaint(
            user.userId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Complaint created successfully.",
            data: result,
        });
    }
);


const getComplaints = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const result = await complaintService.getComplaints(
            user.userId,
            user.role
        );

        res.status(200).json({
            success: true,
            message: "Complaints retrieved successfully.",
            data: result,
        });
    }
);


const getComplaintById = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const complaintId = String(req.params.id);

        const result =
            await complaintService.getComplaintById(
                complaintId,
                user.userId,
                user.role
            );

        res.status(200).json({
            success: true,
            message: "Complaint retrieved successfully.",
            data: result,
        });
    }
);


const updateComplaint = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const complaintId = String(req.params.id);

        const result =
            await complaintService.updateComplaint(
                complaintId,
                user.userId,
                user.role,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Complaint updated successfully.",
            data: result,
        });
    }
);


const deleteComplaint = catchAsync(
    async (req: Request, res: Response) => {

        const user = req.user!;

        const complaintId = String(req.params.id);

        await complaintService.deleteComplaint(
            complaintId,
            user.userId,
            user.role
        );

        res.status(200).json({
            success: true,
            message: "Complaint deleted successfully.",
            data: null,
        });
    }
);


export const complaintController = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
};