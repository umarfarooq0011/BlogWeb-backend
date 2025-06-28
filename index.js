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

dotenv.config();

const app = express();

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

app.use(cors({
  origin: (origin, callback) => {
    // The 'origin' header sent by browsers does not include a trailing slash.
    // We allow requests with no origin (like server-to-server or mobile apps)
    // and requests from our list of allowed origins.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log the failed origin for easier debugging
      console.error(`CORS error: Origin '${origin}' not allowed.`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent
}));

// app.get('/', (req, res) => {
//     res.send("Hello World!");
// })

app.use(express.static('dist'))

// Routes
app.use("/api", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.listen(PORT, async () => {
    await connectDB();
    await seedAdminUser(); // Seed admin user after DB connection
    console.log(`SERVER is running on http://localhost:${PORT}`);
});
