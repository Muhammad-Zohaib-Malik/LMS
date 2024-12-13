import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";

export const verify = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    throw new ApiError(400, "Unauthorized User");
  }

  const decoded = await jwt.verify(token, config.jwt_secret);
  const user = await User.findById(decoded.userId).select("-password");
  req.user = user;
  next();
});
