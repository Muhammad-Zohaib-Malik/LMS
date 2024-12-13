import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import { deleteImageFromCloudinary, uploadImage } from "../utils/cloudinary.js";
import fs from "fs";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Email and password format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const newUser = await User.findById(user._id).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, newUser, "User Registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User Can't Found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect email or password");
  }

  const newUser = await User.findById(user._id).select("-password");
  generateToken(res, newUser._id);

  res.status(200).json(new ApiResponse(200, newUser, "Login Successfully"));
});

export const logoutUser = asyncHandler(async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json(new ApiResponse(200, {}, "User Logout Successfully"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");

  if (!user) throw new ApiError(400, "Profile Not Found");

  res.status(200).json(new ApiResponse(200, user, ""));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, password } = req.body;
  const profilePic = req.file;

  const user = await User.findById(userId).select("-password");
  if (!user) throw new ApiError(400, "User Not Found");

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  try {
    if (profilePic) {
      if (user.profilePicId) {
        await deleteImageFromCloudinary(user.profilePicId);
      }
      const { secure_url, public_id } = await uploadImage(profilePic.path);
      user.profilePic = secure_url;
      user.profilePicId = public_id;
      fs.unlinkSync(profilePic.path);
    }
    user.name = name || user.name;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, user, "User Profile Updated Successfully"));
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});
