import type { Request, Response } from "express";
import User from "../models/User.js";

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query as { token: string };

    if (!token) {
        return res.status(400).json({ error: "Verification token is required" });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully. You can now log in." });
};
