// scripts/backfill-featured-order.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Category = require("../models/Category");
const Room = require("../models/Room");

/**
 * Script: Backfill featured & order fields for Category and Room
 * - Ensures default values (featured=false, order=0) if missing
 */
(async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri || typeof uri !== "string") {
      console.error(
        "❌ Missing MONGO_URI (or MONGODB_URI) in backend/.env. " +
        "Example: MONGO_URI=mongodb://127.0.0.1:27017/furniture_store"
      );
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB…");
    await mongoose.connect(uri);

    console.log("🛠️ Backfilling Category.featured/order…");
    await Category.updateMany(
      { featured: { $exists: false } },
      { $set: { featured: false, order: 0 } }
    );

    console.log("🛠️ Backfilling Room.featured/order…");
    await Room.updateMany(
      { featured: { $exists: false } },
      { $set: { featured: false, order: 0 } }
    );

    console.log("✅ Backfill done.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("💥 Backfill failed:", err?.message || err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
})();
