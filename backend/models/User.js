const { Schema, model } = require("mongoose");

// Define User schema
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },                       // Full name
    email: { type: String, required: true, trim: true, unique: true, lowercase: true }, // User email (unique)
    passwordHash: { type: String, required: true },                           // Hashed password
    role: { type: String, enum: ["admin", "user"], default: "user" },         // Role (admin or user)
  },
  { timestamps: true } // Auto createdAt & updatedAt
);

// Export User model
module.exports = model("User", userSchema);
