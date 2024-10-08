import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
dotenv.config();
import userRoutes from "./routes/user.route.js"
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

const PORT = process.env.PORT || 8001;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello World"});
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});