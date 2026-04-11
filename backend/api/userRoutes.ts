import express from "express";
const router = express.Router();

import { signUp } from "./signUp.js";
import { login } from "./login.js";
import { passwordReset } from "./passwordReset.js";
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

router.post("/signUp", signUp);
router.post("/login", login);
router.patch("/passwordReset", passwordReset);
router.get('/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(payload.userId).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    
    res.json(user)
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router;