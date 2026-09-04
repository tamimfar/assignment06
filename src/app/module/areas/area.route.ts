import { Router } from "express";

import { areaController } from "./area.controller";
import { areaValidation } from "./area.validation";

import  validateRequest  from "../../middleware/validatiReqest";
import { auth } from "../../middleware/checkAuth";

import { UserRole } from "../../../generated/prisma/enums";

const router = Router();


/*
|--------------------------------------------------------------------------
| Create Area
|--------------------------------------------------------------------------
| ADMIN only
*/

router.post(
    "/",
    auth(UserRole.USER),
    validateRequest(areaValidation.createAreaValidation),
    areaController.createArea
);


/*
|--------------------------------------------------------------------------
| Get All Areas
|--------------------------------------------------------------------------
| USER, TECHNICIAN, ADMIN
*/

router.get(
    "/",
    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),
    areaController.getAllAreas
);


/*
|--------------------------------------------------------------------------
| Get Area By ID
|--------------------------------------------------------------------------
| USER, TECHNICIAN, ADMIN
*/

router.get(
    "/:id",
    auth(
        UserRole.USER,
        UserRole.TECHNICIAN,
        UserRole.ADMIN
    ),
    areaController.getAreaById
);


/*
|--------------------------------------------------------------------------
| Update Area
|--------------------------------------------------------------------------
| ADMIN only
*/

router.patch(
    "/:id",
    auth(UserRole.USER),
    validateRequest(areaValidation.updateAreaValidation),
    areaController.updateArea
);


/*
|--------------------------------------------------------------------------
| Delete Area
|--------------------------------------------------------------------------
| ADMIN only
*/

router.delete(
    "/:id",
    auth(UserRole.USER),
    areaController.deleteArea
);


export const areaRouter = router;