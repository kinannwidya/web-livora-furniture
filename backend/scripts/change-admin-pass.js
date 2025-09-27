// scripts/change-admin-pass.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

(async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // the admin email to update
    const email = process.env.ADMIN_EMAIL || "admin@furniture.com";
    // new password (replace directly here or load from ENV)
    const newPassword = "admin123"; 

    // hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // update user with the new password
    const result = await User.updateOne(
      { email },
      { $set: { passwordHash } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ Admin with email ${email} not found.`);
    } else {
      console.log(`✅ Password for ${email} updated successfully.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("💥 Error updating admin password:", err.message);
    process.exit(1);
  }
})();
