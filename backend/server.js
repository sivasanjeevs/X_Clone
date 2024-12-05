import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongooseDB.js";


const app = express();
dotenv.config();
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("The server is running on port ${PORT}.....");
    connectMongoDB();
});