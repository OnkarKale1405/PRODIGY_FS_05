import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFile) => {
  try {
    if (!localFile) {
      return "Local File Path not found";
    }
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });
    console.log("File successfully uploaded on cloudinary", response.url);
    fs.unlinkSync(localFile);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFile);
    return null;
  }
};

export { uploadFileOnCloudinary };
