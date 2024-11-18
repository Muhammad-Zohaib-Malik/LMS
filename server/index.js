import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { config } from "./config/config.js";
import userRoutes from "./routes/user.route.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
const port = config.port || 3000;

// Routes
app.use("/api/users", userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
