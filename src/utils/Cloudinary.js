import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
});


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadImage = async(filePath)=>{
    try {
        if(!filePath) return null
        const response = await cloudinary.uploader.upload(filePath,{
            resource_type: 'auto'
        })
        console.log("File is Uploaded", response.url);
        return response;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(filePath) //remove the locally saved file as operation got failed
        return null
    }
}

export {uploadImage}