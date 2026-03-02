import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () =>
      console.log("Auth Service Running")
    );
  } catch (error) {
    console.error("Server startup failed");
    process.exit(1);
  }
};

startServer();