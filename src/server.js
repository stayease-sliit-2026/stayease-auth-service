import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiPath = path.resolve(__dirname, "../openapi.yaml");
let swaggerDocument = null;

if (fs.existsSync(openApiPath)) {
  swaggerDocument = YAML.load(openApiPath);
} else {
  console.warn("openapi.yaml not found. /docs endpoint will be unavailable.");
}

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
});

if (swaggerDocument) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    const port = Number(process.env.PORT) || 8080;

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    app.listen(port, "0.0.0.0", () =>
      console.log(`Auth Service Running on port ${port}`)
    );

    const connectWithRetry = async () => {
      try {
        await connectDB();
      } catch (error) {
        console.error("MongoDB connection failed, retrying in 5s", error.message);
        setTimeout(connectWithRetry, 5000);
      }
    };

    await connectWithRetry();
  } catch (error) {
    console.error("Server startup failed", error.message);
    process.exit(1);
  }
};

startServer();