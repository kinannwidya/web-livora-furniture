require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Room = require("../models/Room");

/**
 * Script: Migrate Product references
 * - Converts legacy string-based category/room into ObjectId references
 */
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const products = await Product.find().lean();
    let updated = 0;

    for (const p of products) {
      const update = {};

      // If category is still string → resolve by key
      if (p.category && typeof p.category === "string") {
        const cat = await Category.findOne({ key: p.category });
        if (cat) update.category = cat._id;
      }

      // If room is still string → resolve by key
      if (p.room && typeof p.room === "string") {
        const rm = await Room.findOne({ key: p.room });
        if (rm) update.room = rm._id;
      }

      // Apply migration update
      if (Object.keys(update).length) {
        await Product.updateOne({ _id: p._id }, { $set: update });
        updated++;
      }
    }

    console.log(`Done. Updated ${updated} products.`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
