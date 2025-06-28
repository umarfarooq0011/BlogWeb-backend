import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connectDB.js";
import authRoutes from "./Routes/authRoutes.js";
import blogRouter from "./Routes/BlogRoutes.js";
import adminRoutes from "./Admin/adminRoutes.js";
import { seedAdminUser } from "./Admin/adminUtils.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import newsletterRoutes from "./Routes/newsletter.routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Trust first proxy - required for Railway, Heroku, etc.
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // Allows us to parse incoming requests with JSON payloads
app.use(cookieParser());

// Configure CORS to be more robust for production
const allowedOrigins = ["http://localhost:5173"];
if (process.env.FRONTEND_URL) {
  // Remove any trailing slash from the environment variable to ensure a clean comparison
  const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
  allowedOrigins.push(frontendUrl);
}

app.use(cors({ origin: true, credentials: true }));

// app.get('/', (req, res) => {
//     res.send("Hello World!");
// })

app.use(express.static('dist'))

// Routes
app.use("/api", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Catch-all route to serve the frontend's index.html for any other GET request
// This is essential for single-page applications like React to handle routing correctly.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, async () => {
    await connectDB();
    await seedAdminUser(); // Seed admin user after DB connection
    console.log(`SERVER is running on http://localhost:${PORT}`);
});
