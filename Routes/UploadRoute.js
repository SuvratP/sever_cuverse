// UploadRoute.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import User from "../Models/userModel.js";

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


// Upload route
router.post("/uploadProfileOrCover" ,upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: req.body.type === "profile" ? "profile_pics" : "cover_pics",
    });

    // Delete local temp file
    fs.unlinkSync(file.path);

    // Update user's profile/cover image in DB
    const userId = req.body.userId;
    const imageUrl = result.secure_url;
    const update =
      req.body.type === "profile"
        ? { profilePicture: imageUrl }
        : { coverPicture: imageUrl };

    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });

    res.status(200).json({
      msg: `${req.body.type} picture updated successfully`,
      imageUrl: result.secure_url,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
});



export default router;
