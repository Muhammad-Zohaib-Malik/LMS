import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateToken = (res, userId, message) => {
  const token = jwt.sign({ userId }, config.jwt_secret, {
    expiresIn: "1d",
  });

  // Set JWT as HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 days
  });

  return token;
};
