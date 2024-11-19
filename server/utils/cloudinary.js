import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "LMS app",
    });
    return {
      secureUrl: result.secure_url,
      public_id: result.public_id,
    };
  } catch {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const deleteImageFromCloudinary = async (profilePicId) => {
  try {
    const result = await cloudinary.uploader.destroy(profilePicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    return null;
  }
};
