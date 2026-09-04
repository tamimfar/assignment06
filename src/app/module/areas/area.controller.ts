import type { Request, Response } from "express";

import { areaService } from "./area.service";
import  catchAsync  from "../../utils/catchAsync";

const createArea = catchAsync(
    async (req: Request, res: Response) => {

        const result = await areaService.createArea(req.body);

        res.status(201).json({
            success: true,
            message: "Area created successfully.",
            data: result,
        });
    }
);


const getAllAreas = catchAsync(
    async (req: Request, res: Response) => {

        const result = await areaService.getAllAreas();

        res.status(200).json({
            success: true,
            message: "Areas retrieved successfully.",
            data: result,
        });
    }
);


const getAreaById = catchAsync(
    async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const result = await areaService.getAreaById(id);

        res.status(200).json({
            success: true,
            message: "Area retrieved successfully.",
            data: result,
        });
    }
);


const updateArea = catchAsync(
    async (req: Request, res: Response) => {

        const { id } = req.params as { id: string };

        const result = await areaService.updateArea(
            id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Area updated successfully.",
            data: result,
        });
    }
);


const deleteArea = catchAsync(
    async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            throw new Error("Area id is required.");
        }

        await areaService.deleteArea(id as string);

        res.status(200).json({
            success: true,
            message: "Area deleted successfully.",
            data: null,
        });
    }
);


export const areaController = {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea,
};