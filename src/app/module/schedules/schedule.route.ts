import { Router } from "express";

import { scheduleController } from "./schedule.controller";
import { scheduleValidation } from "./schedule.validation";

import  validateRequest  from "../../middleware/validatiReqest";
import { auth } from "../../middleware/checkAuth";

import { UserRole } from "../../../generated/prisma/enums";


const router = Router();


// ------------------------------------------------------------
// Create Schedule
// ADMIN only
// ------------------------------------------------------------

router.post(
    "/",
    auth(UserRole.USER),
    validateRequest(
        scheduleValidation.createScheduleValidation
    ),
    scheduleController.createSchedule
);


// ------------------------------------------------------------
// Get All Schedules
// USER, TECHNICIAN, ADMIN
// ------------------------------------------------------------

router.get(
    "/",
    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),
    scheduleController.getAllSchedules
);


// ------------------------------------------------------------
// Get Schedule By ID
// USER, TECHNICIAN, ADMIN
// ------------------------------------------------------------

router.get(
    "/:id",
    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),
    scheduleController.getScheduleById
);


// ------------------------------------------------------------
// Update Schedule
// ADMIN only
// ------------------------------------------------------------

router.patch(
    "/:id",
    auth(UserRole.USER),
    validateRequest(
        scheduleValidation.updateScheduleValidation
    ),
    scheduleController.updateSchedule
);


// ------------------------------------------------------------
// Delete Schedule
// ADMIN only
// ------------------------------------------------------------

router.delete(
    "/:id",
    auth(UserRole.USER),
    scheduleController.deleteSchedule
);


export const scheduleRouter = router;