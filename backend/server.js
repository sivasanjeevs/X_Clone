import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongooseDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());//to parse req.body
app.use(express.urlencoded({extended: true})); // to parse from data(urlencoded)
 
app.use("/api/auth", authRoutes);

app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
    connectMongoDB();
});