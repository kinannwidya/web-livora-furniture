const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product"); // Optional: check before delete
const cloudinary = require("../config/cloudinary");

// Helpers: safe parsing for boolean/number
function parseBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "true" || v === "1";
  return false;
}
function parseNum(v, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

/**
 * GET /categories?featured=true&limit=3
 * - Fetch categories (optional: filter by featured, limit results)
 */
router.get("/", async (req, res) => {
  try {
    const { featured, limit } = req.query;
    const filter = {};
    if (typeof featured !== "undefined") filter.featured = parseBool(featured);

    const q = Category.find(filter).sort({ order: 1, createdAt: -1 });
    const lim = parseNum(limit, 0);
    if (lim > 0) q.limit(lim);

    const categories = await q;
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

/**
 * POST /categories
 * - Create new category (force lowercase key, optional featured/order)
 */
router.post("/", async (req, res) => {
  try {
    const { key, name, imageUrl, publicId, featured, order } = req.body;

    const cat = new Category({
      key: (key || "").toLowerCase(),
      name,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
      featured: parseBool(featured),
      order: parseNum(order, 0),
    });

    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * PUT /categories/:id
 * - Update category (delete old image if publicId changed)
 */
router.put("/:id", async (req, res) => {
  try {
    const existing = await Category.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Category not found" });

    // Delete old image if replaced
    if (
      existing.publicId &&
      typeof req.body.publicId === "string" &&
      req.body.publicId !== existing.publicId
    ) {
      try {
        await cloudinary.uploader.destroy(existing.publicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed (category):", e?.message || e);
      }
    }

    // Normalize key + sanitize featured/order
    if (typeof req.body.key === "string") req.body.key = req.body.key.toLowerCase();
    if (typeof req.body.featured !== "undefined") req.body.featured = parseBool(req.body.featured);
    if (typeof req.body.order !== "undefined") req.body.order = parseNum(req.body.order, existing.order || 0);

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE /categories/:id
 * - Delete category (optional: block if still used by products)
 */
router.delete("/:id", async (req, res) => {
  try {
    const used = await Product.countDocuments({ category: req.params.id }).catch(() => 0);
    if (used > 0) {
      return res.status(400).json({ message: "Category is used by products" });
    }

    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    if (cat.publicId) {
      try {
        await cloudinary.uploader.destroy(cat.publicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed (category delete):", e?.message || e);
      }
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
