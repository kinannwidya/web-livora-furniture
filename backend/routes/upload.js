const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * POST /upload
 * - Upload single image to Cloudinary (stored as .webp)
 * - Returns { url, publicId }
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "furniture-store",
      format: "webp",
    });

    // Remove local temp file
    fs.unlinkSync(req.file.path);

    // Return uploaded file info
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
