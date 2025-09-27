const { Schema, model } = require("mongoose");

// Define Category schema
const categorySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },  // Unique key identifier
    name: { type: String, required: true, trim: true },   // Category display name
    imageUrl: { type: String, default: "" },              // Optional image URL
    publicId: { type: String, default: "" },              // Cloudinary public ID
    featured: { type: Boolean, default: false },          // Highlighted category flag
    order: { type: Number, default: 0 },                  // Sorting order
  },
  { timestamps: true } // Auto createdAt & updatedAt
);

// Index for faster queries on featured + order
categorySchema.index({ featured: 1, order: 1 });

// Export Category model
module.exports = model("Category", categorySchema);
