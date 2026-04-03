import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "./mailer.js";

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    // Always return 200 to avoid user enumeration
    if (!user) {
        return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    try {
        await sendPasswordResetEmail(email, resetToken);
    } catch {
        return res.status(500).json({ error: "Failed to send reset email. Try again later." });
    }

    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
};
