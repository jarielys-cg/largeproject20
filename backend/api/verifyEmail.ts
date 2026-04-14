import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.get("/verify-email/:token", async (req, res) => {
    try
    {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (!user)
        {
            return res.status(400).json({ error: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;

        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    }
    catch
    {
        return res.status(500).json({ error: "Error verifying email" });
    }
});

export default router;
