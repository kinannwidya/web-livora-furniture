// scripts/change-admin-email.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // current admin email to search for
    const oldEmail = process.env.ADMIN_EMAIL || "admin@furniture.com";
    // new email to update to
    const newEmail = "admin@livora.com";

    // update admin email
    const result = await User.updateOne(
      { email: oldEmail },
      { $set: { email: newEmail } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ Admin with email ${oldEmail} not found.`);
    } else {
      console.log(`✅ Admin email updated to ${newEmail}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("💥 Error updating admin email:", err.message);
    process.exit(1);
  }
})();
