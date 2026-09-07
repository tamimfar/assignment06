import { cloudinary, upload } from "../../middleware/upload";
import { Router } from "express";

import { auth } from "../../middleware/checkAuth";



import { UserRole } from "../../../generated/prisma/enums";
import { imgController } from "./img.controller";




const router = Router();

router.post("/upload", upload.single('img'),auth(UserRole.USER,UserRole.TECHNICIAN,UserRole.ADMIN), imgController.imgUpload)

export const imgRouter =  router