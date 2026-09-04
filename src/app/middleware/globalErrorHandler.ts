import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

import config from "../config";

export const globalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (config.node_env === "development") {
        console.error("Error from Global Error Handler:", err);
    }

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let errors: unknown[] = [];

    // Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Invalid data provided.";
        errors = [
            {
                type: "PrismaValidationError",
                details: "Please check your request fields and field types.",
            },
        ];
    }

    // Prisma Known Request Error
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.CONFLICT;
            message = "A record with this value already exists.";
            errors = [
                {
                    type: "DuplicateError",
                    details: "Unique field value already exists.",
                },
            ];
        }

        else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Foreign key constraint failed.";
            errors = [
                {
                    type: "ForeignKeyError",
                    details: "The referenced record does not exist.",
                },
            ];
        }

        else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            message = "The requested record was not found.";
            errors = [
                {
                    type: "NotFoundError",
                    details: "Required record does not exist.",
                },
            ];
        }
    }

    // Prisma Initialization Error
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Database connection failed.";

        errors = [
            {
                type: "DatabaseError",
                details:
                    config.node_env === "development"
                        ? err.message
                        : "Unable to connect to database.",
            },
        ];
    }

    // Prisma Unknown Request Error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "An error occurred while processing the database request.";

        errors = [
            {
                type: "DatabaseError",
                details:
                    config.node_env === "development"
                        ? err.message
                        : "Unknown database error.",
            },
        ];
    }

    // Normal Error
    else if (err instanceof Error) {
        statusCode =
            (err as Error & { statusCode?: number }).statusCode ||
            httpStatus.INTERNAL_SERVER_ERROR;
        message = err.message || "Something went wrong.";
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};