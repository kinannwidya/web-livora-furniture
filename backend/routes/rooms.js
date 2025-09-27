const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Product = require("../models/Product");
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
 * GET /rooms?featured=true&limit=6
 * - Fetch rooms (optional filter by featured, limit results)
 */
router.get("/", async (req, res) => {
  try {
    const { featured, limit } = req.query;
    const filter = {};
    if (typeof featured !== "undefined") filter.featured = parseBool(featured);

    const q = Room.find(filter).sort({ order: 1, createdAt: -1 });
    const lim = parseNum(limit, 0);
    if (lim > 0) q.limit(lim);

    const rooms = await q;
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

/**
 * POST /rooms
 * - Create new room (force lowercase key, optional featured/order)
 */
router.post("/", async (req, res) => {
  try {
    const { key, name, imageUrl, publicId, featured, order } = req.body;

    const room = await Room.create({
      key: (key || "").toLowerCase(),
      name,
      imageUrl: imageUrl || "",
      publicId: publicId || "",
      featured: parseBool(featured),
      order: parseNum(order, 0),
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * PUT /rooms/:id
 * - Update room (delete old image if publicId changed)
 */
router.put("/:id", async (req, res) => {
  try {
    const existing = await Room.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Room not found" });

    if (
      existing.publicId &&
      typeof req.body.publicId === "string" &&
      req.body.publicId !== existing.publicId
    ) {
      try {
        await cloudinary.uploader.destroy(existing.publicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed (room):", e?.message || e);
      }
    }

    if (typeof req.body.key === "string") {
      req.body.key = req.body.key.toLowerCase();
    }
    if (typeof req.body.featured !== "undefined") {
      req.body.featured = parseBool(req.body.featured);
    }
    if (typeof req.body.order !== "undefined") {
      req.body.order = parseNum(req.body.order, existing.order || 0);
    }

    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE /rooms/:id
 * - Delete room (block if used by products, cleanup Cloudinary)
 */
router.delete("/:id", async (req, res) => {
  try {
    const used = await Product.countDocuments({ room: req.params.id }).catch(() => 0);
    if (used > 0) {
      return res.status(400).json({ message: "Room is used by products" });
    }

    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.publicId) {
      try {
        await cloudinary.uploader.destroy(room.publicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed (room delete):", e?.message || e);
      }
    }

    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
