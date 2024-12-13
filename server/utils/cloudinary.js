import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../config/cloudinaryConfig.js";

export const uploadImage = async (profilePic) => {
  try {
    cloudinaryConfig();

    if (!profilePic) return null;
    const result = await cloudinary.uploader.upload(profilePic, {
      resource_type: "auto",
      folder: "LMS app",
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const deleteImageFromCloudinary = async (profilePicId) => {
  try {
    cloudinaryConfig();
    if (!profilePicId) {
      console.error("Profile Picture ID is missing. Skipping deletion.");
      return null;
    }
    console.log("Deleting Image with public_id:", profilePicId);
    const result = await cloudinary.uploader.destroy(profilePicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    return null;
  } 
};
