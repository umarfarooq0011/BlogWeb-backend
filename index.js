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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // Allows us to parse incoming requests with JSON payloads
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  process.env.CLIENT_URL, // Production frontend
].filter(Boolean); // Filter out undefined/null values

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
  credentials: true, // Allow cookies to be sent
}));

// app.get('/', (req, res) => {
//     res.send("Hello World!");
// })

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Routes
app.use("/api", authRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, async () => {
    await connectDB();
    await seedAdminUser(); // Seed admin user after DB connection
    console.log(`SERVER is running on http://localhost:${PORT}`);
});
