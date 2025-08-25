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
import path from "path"; // <-- ADD THIS
import { fileURLToPath } from "url"; // <-- ADD THIS

dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url); // <-- ADD THIS
const __dirname = path.dirname(__filename); // <-- ADD THIS

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
if (process.env.FRONTEND_URL) {
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    allowedOrigins.push(frontendUrl);
}
app.use(cors({ origin: true, credentials: true }));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist"))); // <-- CHANGE THIS

// API Routes
app.use("/api", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Catch-all route to serve the frontend's index.html
app.get("*", (req, res) => { // <-- ADD THIS
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, async () => {
    await connectDB();
    await seedAdminUser();
    console.log(`SERVER is running on http://localhost:${PORT}`);
});