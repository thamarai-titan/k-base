import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { categoriesRouter } from "./modules/categories/categories.routes.js";
import { entriesRouter } from "./modules/entries/entries.routes.js";
import { tagsRouter } from "./modules/tags/tags.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "k-base-api",
  });
});

// API Routes
app.use("/api/categories", categoriesRouter);
app.use("/api/entries", entriesRouter);
app.use("/api/tags", tagsRouter);

// Centralized Error Handling Middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API Error:", err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      issues: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof Error) {
    // Handle Prisma not found or uniqueness error messages gracefully
    if (err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    if (err.message.includes("Unique constraint failed")) {
      res.status(409).json({ error: "A record with this unique value already exists" });
      return;
    }

    res.status(500).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 k-base backend API running at http://localhost:${PORT}`);
});
