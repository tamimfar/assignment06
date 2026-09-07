import { UploadApiResponse } from "cloudinary";
import { cloudinary, upload } from "../../middleware/upload";
import { prisma } from "../../lib/prisma";
const uploadImage = async (file: any, user: string) => {
    
   console.log(user);

    const uploaddata = await new Promise<UploadApiResponse>((resolve, rejects) => {
        cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {

            if (error) {
                rejects(error);
            }
            if (!result) {
                return rejects(new Error("no result returned from cloudinary"))
            }
            resolve(result);
        }).end(file.buffer);
    });
 const userDetails = await prisma.user.findUnique({
     where: {
         id: user
     }
     
 })
 if(userDetails?.imgId){
     await cloudinary.uploader.destroy(userDetails?.imgId);
 
 }
    
    const uploadImage = await prisma.user.update({
        where: {
            id: user
        },
        data: {
            avatar: uploaddata.url,
            imgId: uploaddata.public_id
        }
        
    })

   return uploadImage

}



export const imgService = {
    uploadImage
}