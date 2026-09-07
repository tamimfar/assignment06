import type { Request, Response } from "express";

import { scheduleService } from "./schedule.service";
import catchAsync  from "../../utils/catchAsync";


const createSchedule = catchAsync(
    async (req: Request, res: Response) => {

        const result =
            await scheduleService.createSchedule(
                req.body
            );


        res.status(201).json({
            success: true,
            message: "Load shedding schedule created successfully.",
            data: result,
        });
    }
);


const getAllSchedules = catchAsync(async (req, res) => {
    const result = await scheduleService.getAllSchedules(
        req.query as {
            search?: string;
            areaId?: string;
            status?: string;
            date?: string;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            page?: string;
            limit?: string;
        }
    );

    res.status(200).json({
        success: true,
        message: "Schedules retrieved successfully.",
        data: result.schedules,
        meta: result.meta,
    });
});


const getScheduleById = catchAsync(
    async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };


        const result =
            await scheduleService.getScheduleById(
                id
            );


        res.status(200).json({
            success: true,
            message: "Load shedding schedule retrieved successfully.",
            data: result,
        });
    }
);


const updateSchedule = catchAsync(
    async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };


        const result =
            await scheduleService.updateSchedule(
                id,
                req.body
            );


        res.status(200).json({
            success: true,
            message: "Load shedding schedule updated successfully.",
            data: result,
        });
    }
);


const deleteSchedule = catchAsync(
    async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };


        await scheduleService.deleteSchedule(
            id
        );


        res.status(200).json({
            success: true,
            message: "Load shedding schedule deleted successfully.",
            data: null,
        });
    }
);


export const scheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};