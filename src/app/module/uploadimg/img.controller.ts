
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { imgService } from "./img.service";

const imgUpload = catchAsync(async (req: Request, res: Response) => {
    const user = req.user?.userId;
    const result = await imgService.uploadImage(req.file, user!)

    
    res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
    
    });
});

export const imgController = {
    imgUpload
};