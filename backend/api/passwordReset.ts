import type { Request, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

// email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. SEND RESET EMAIL
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = resetExpires;

    await existingUser.save();

    const resetLink = `http://64.23.138.213/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: existingUser.email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    return res.status(500).json({ error: "Error sending reset email" });
  }
};

// 2. RESET PASSWORD USING TOKEN
export const passwordReset = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const existingUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    existingUser.password = password;
    existingUser.resetPasswordToken = null;
    existingUser.resetPasswordExpires = null;

    const savedUser = await existingUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: removedPassword, ...sanitizedUser } = savedUser.toObject();

    return res.status(200).json({ savedUser: sanitizedUser });
  } catch (error) {
    return res.status(400).json({ error: "Error updating password" });
  }
};
