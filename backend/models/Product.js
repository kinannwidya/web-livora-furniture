const { Schema, model } = require("mongoose");

// Define Product schema
const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },          // Product name
    description: { type: String, default: "", trim: true },      // Short description
    price: { type: Number, required: true, min: 0 },             // Base price
    discount: { type: Number, default: 0, min: 0 },              // Discount percentage
    stock: { type: Number, default: 0, min: 0 },                 // Stock quantity
    brand: { type: String, default: "", trim: true },            // Brand name
    origin: { type: String, default: "", trim: true },           // Country of origin
    weight: { type: Number, default: 0 },                        // Weight in kg
    dimensions: { type: String, default: "", trim: true },       // Product dimensions
    material: { type: String, default: "", trim: true },         // Material type

    imageUrl: { type: String, default: "" },                     // Product image URL
    publicId: { type: String, default: "" },                     // Cloudinary public ID

    // Relations
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // Linked category
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },         // Linked room

    // Featured & order for layout
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true } // Auto createdAt & updatedAt
);

// Text index for search on name & description
productSchema.index({ name: "text", description: "text" });

// Export Product model
module.exports = model("Product", productSchema);
