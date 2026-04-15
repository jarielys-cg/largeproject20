import express from "express";
const router = express.Router();
import { addB } from "./addB.js";
import { editB } from "./editB.js";
import { removeB } from "./removeB.js";
import { searchBusiness } from "./search.js";
import Business from "../models/Business.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware.js";
import { getUploadUrl } from "./getUploadUrl.js";
import { removeUrl } from "./removeUrl.js";
import { confirmUpload } from "./confirmUpload.js";
import { mapBusinessImageUrls } from "./spacesConfig.js";

router.post("/addB", authMiddleware, addB);
router.patch("/editB", authMiddleware, editB);
router.delete("/removeB", authMiddleware, removeB);
router.post("/search", searchBusiness);
router.post("/getUploadUrl", authMiddleware, getUploadUrl);
router.post("/confirmUpload", authMiddleware, confirmUpload);
router.delete("/removeUrl", authMiddleware, removeUrl)

// GET all businesses for logged in owner
router.get("/businesses/mine", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    const businesses = await Business.find({ ownerId: payload.userId })
    res.json(await Promise.all(businesses.map((business) => mapBusinessImageUrls(business))))
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

// GET single business by ID
router.get("/businesses/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
    if (!business) return res.status(404).json({ error: 'Business not found' })
    res.json(await mapBusinessImageUrls(business))
  } catch {
    res.status(400).json({ error: 'Invalid business ID' })
  }
})

export default router;