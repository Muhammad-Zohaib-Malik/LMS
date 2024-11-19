import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verify } from "../middlewares/verify.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/get-profile", verify, getUserProfile);
userRouter.put(
  "/update-profile",
  upload.single("profilePic"),
  verify,
  updateUserProfile
);

logoutUser;

export default userRouter;
