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
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// --- Database Connection and Seeding ---
// This will run when the serverless function initializes, not on every request.
connectDB().then(() => {
    seedAdminUser();
    console.log("Database connected and admin user seeded.");
}).catch(err => {
    console.error("Database connection failed on startup:", err);
});

// --- Middleware ---
app.set('trust proxy', 1); // Important for Vercel's proxy
app.use(express.json());
app.use(cookieParser());

// A more robust CORS configuration for production
const allowedOrigins = ["http://localhost:5173"]; // Your local frontend
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


// --- API Routes ---
// All your backend routes are prefixed with /api
app.use("/api", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

// --- Vercel requires the app to be the default export ---
// We do NOT call app.listen()
export default app;