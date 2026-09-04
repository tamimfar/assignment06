import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn:RequestHandler ) => {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            fn(req, res, next); 
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};

export default catchAsync