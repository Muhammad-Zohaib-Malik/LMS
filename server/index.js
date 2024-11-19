import express from "express";
import connectDB from "./config/db.js";
import { config } from "./config/config.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
const port = config.port || 3000;

// Routes
app.use("/api/users", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
