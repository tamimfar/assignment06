import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";

cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

const upload = multer({
    storage: multer.memoryStorage()
});

export { upload, cloudinary };