import z from "zod";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";


const validateRequest = (zodSchema:z.ZodObject)=> {
    return catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
        const payload = req.body ?? {};
        const result = zodSchema.safeParse(payload);
        if(!result.success){
            console.log(result.error)
           console.log(result.error.issues)
            
           throw new Error("Invalid Request")
        
        }
        req.body = result.data;
        next();
    })

    }
export default validateRequest;