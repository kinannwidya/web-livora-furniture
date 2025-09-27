const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Room = require("../models/Room");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const { Types } = require("mongoose");

const router = express.Router();

// Helpers: resolve category/room by ID or key
async function resolveCategoryId(input) {
  if (!input) return null;
  if (Types.ObjectId.isValid(input)) return input;
  const doc = await Category.findOne({ key: input });
  if (!doc) throw new Error("Category not found");
  return doc._id;
}
async function resolveRoomId(input) {
  if (!input) return null;
  if (Types.ObjectId.isValid(input)) return input;
  const doc = await Room.findOne({ key: input });
  if (!doc) throw new Error("Room not found");
  return doc._id;
}

/**
 * GET /products
 * - Fetch all products (optional filter by category/room)
 * - Sorted by featured → order → name
 */
router.get("/", async (req, res) => {
  try {
    const { category, categoryId, room, roomId } = req.query;
    const filter = {};

    if (category || categoryId) {
      const cid = await resolveCategoryId(categoryId || category);
      if (cid) filter.category = cid;
    }
    if (room || roomId) {
      const rid = await resolveRoomId(roomId || room);
      if (rid) filter.room = rid;
    }

    const products = await Product.find(filter)
      .sort({ featured: -1, order: 1, name: 1 })
      .populate("category", "key name imageUrl")
      .populate("room", "key name imageUrl")
      .lean();

    return res.json(products);
  } catch (err) {
    console.error("Get products error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /products/search?q=...
 * - Search products using MongoDB text index
 */
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .select("_id name imageUrl");

    return res.json(products);
  } catch (err) {
    console.error("Search products error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /products/:id
 * - Fetch product detail by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id)
      .populate("category", "key name imageUrl")
      .populate("room", "key name imageUrl");
    if (!p) return res.status(404).json({ message: "Product not found" });
    return res.json(p);
  } catch (err) {
    console.error("Get product error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /products
 * - Create new product (requires admin)
 */
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      name, description, price, discount, stock, brand, origin,
      weight, dimensions, material, imageUrl, publicId,
      category, categoryId, room, roomId, featured, order
    } = req.body || {};

    if (!name || price == null || (!category && !categoryId) || (!room && !roomId)) {
      return res.status(400).json({ message: "Name, price, category, and room are required" });
    }

    const cid = await resolveCategoryId(categoryId || category);
    const rid = await resolveRoomId(roomId || room);

    const created = await Product.create({
      name,
      description: description || "",
      price,
      discount: discount || 0,
      stock: stock || 0,
      brand: brand || "",
      origin: origin || "",
      weight: weight || 0,
      dimensions: dimensions || "",
      material: material || "",
      imageUrl: imageUrl || "",
      publicId: publicId || "",
      category: cid,
      room: rid,
      featured: !!featured,
      order: typeof order === "number" ? order : 0,
    });

    const populated = await Product.findById(created._id)
      .populate("category", "key name imageUrl")
      .populate("room", "key name imageUrl");

    return res.status(201).json(populated);
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

/**
 * PUT /products/:id
 * - Update product (requires admin)
 * - Delete old image if replaced
 */
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Product not found" });

    const {
      name, description, price, discount, stock, brand, origin,
      weight, dimensions, material, imageUrl, publicId,
      category, categoryId, room, roomId, featured, order
    } = req.body || {};

    if (existing.publicId && publicId && publicId !== existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    let cid, rid;
    if (category || categoryId) cid = await resolveCategoryId(categoryId || category);
    if (room || roomId) rid = await resolveRoomId(roomId || room);

    const payload = {
      name, description, price, discount, stock, brand, origin,
      weight, dimensions, material, imageUrl, publicId,
      ...(cid ? { category: cid } : {}),
      ...(rid ? { room: rid } : {}),
    };

    if (typeof featured === "boolean") payload.featured = featured;
    if (typeof order === "number") payload.order = order;

    const updated = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })
      .populate("category", "key name imageUrl")
      .populate("room", "key name imageUrl");

    return res.json(updated);
  } catch (err) {
    console.error("Update product error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /products/:id
 * - Delete product (requires admin) + remove image if exists
 */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    if (deleted.publicId) {
      await cloudinary.uploader.destroy(deleted.publicId);
    }

    return res.json({ message: "Deleted", _id: deleted._id });
  } catch (err) {
    console.error("Delete product error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
