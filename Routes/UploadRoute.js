// UploadRoute.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Corrected Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "social_media_uploads"
    });

    fs.unlinkSync(file.path); // Delete temp file

    res.status(200).json({
      public_id: result.public_id,
      url: result.secure_url
    });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});

export default router;
