require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const uploadRoutes = require("./routes/upload");
const categoryRoutes = require("./routes/categories");
const roomRoutes = require("./routes/rooms");

const app = express();

// Enable CORS (dev: allow all, can restrict via ENV)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check route
app.get("/", (_req, res) => res.send("API running..."));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rooms", roomRoutes);

// Env config
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const MONGO_URI = process.env.MONGO_URI;

/**
 * Start server:
 * - Connect to MongoDB
 * - Run Express server on HOST:PORT
 */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, HOST, () =>
      console.log(`🚀 Server running at http://${HOST}:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
