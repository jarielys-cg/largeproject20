import express from "express";
const router = express.Router();
import { addB } from "./addB.js";
import { editB } from "./editB.js";
import { removeB } from "./removeB.js";
<<<<<<< Updated upstream
import { searchBusiness } from "./search.js";
=======
import Business from "../models/Business.js";
import jwt from "jsonwebtoken";
>>>>>>> Stashed changes

router.post("/addB", addB);
router.patch("/editB", editB);
router.delete("/removeB", removeB);
router.post("/search", searchBusiness);

// GET all businesses for logged in owner
router.get("/businesses/mine", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    const businesses = await Business.find({ ownerId: payload.userId })
    res.json(businesses)
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

// GET single business by ID
router.get("/businesses/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
    if (!business) return res.status(404).json({ error: 'Business not found' })
    res.json(business)
  } catch {
    res.status(400).json({ error: 'Invalid business ID' })
  }
})

export default router;