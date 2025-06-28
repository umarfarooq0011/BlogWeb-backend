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

// Add the deployed frontend URL to the list of allowed origins
const allowedOrigins = ["http://localhost:5173"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or from our list of allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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
