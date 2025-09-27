const { Schema, model } = require("mongoose");

// Define Room schema
const roomSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },  // Unique key (e.g., "living-room")
    name: { type: String, required: true, trim: true },   // Display name (e.g., "Living Room")
    imageUrl: { type: String, default: "" },              // Optional image URL
    publicId: { type: String, default: "" },              // Cloudinary public ID

    // Featured & order for layout sorting
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true } // Auto createdAt & updatedAt
);

// Index for faster queries on featured + order
roomSchema.index({ featured: 1, order: 1 });

// Export Room model
module.exports = model("Room", roomSchema);
