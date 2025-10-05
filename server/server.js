import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import asteroidRoutes from "./routes/route.asteroid.js";
import usgsRoutes from "./routes/route.usgs.js";
import mitigationRoutes from "./routes/route.mitigation.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/asteroids", asteroidRoutes);
app.use("/api/usgs", usgsRoutes);
app.use("/api/mitigation", mitigationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      asteroids: "operational",
      usgs: "operational",
      mitigation: "operational",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler (Express 5 / path-to-regexp v6 compatible)
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
