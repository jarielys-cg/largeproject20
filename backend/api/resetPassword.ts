import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body as { token: string; password: string };

    if (!token || !password) {
        return res.status(400).json({ error: "Token and new password are required" });
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
};
