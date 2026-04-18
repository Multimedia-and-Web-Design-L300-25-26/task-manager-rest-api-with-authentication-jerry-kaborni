import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

import connectDB from "../src/config/db.js";
import mongoose from "mongoose";

// Connect to test database
await connectDB();

// Clear the test database
await mongoose.connection.db.dropDatabase();

import app from "../src/app.js";

export default app;

afterAll(async () => {
  await mongoose.connection.close();
});









