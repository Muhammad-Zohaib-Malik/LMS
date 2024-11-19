import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/config.js";

export const verify = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    throw new ApiError(400, "Unauthorized User");
  }
  console.log(token);

  const decode = await jwt.verify(token, config.jwt_secret);
  if (!decode) {
    throw new ApiError(400, "Invalid Token");
  }

  console.log(decode);
  req.id = decode.userId;

  next();
});
