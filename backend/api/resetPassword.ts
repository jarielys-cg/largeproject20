import type { Request, Response } from "express";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import User from "../models/User.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    const resetLink = `http://colors-lab-cop4331c.xyz/resetPassword/${resetToken}`;

    const msg = {
      to: existingUser.email,
      from: process.env.EMAIL_FROM, // must be your authenticated domain
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `
    };

    await sgMail.send(msg);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("SENDGRID ERROR:", err.response?.body || err);
    return res.status(500).json({ error: "Error sending reset email" });
  }
};

// 2. RESET PASSWORD USING TOKEN
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) return res.status(400).json({ error: "Invalid token" });

    const existingUser = await User.findOne({
      resetPasswordToken: token as string,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    existingUser.password = password;
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordExpires = undefined;

    const savedUser = await (existingUser as any).save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: removedPassword, ...sanitizedUser } = savedUser.toObject();

    return res.status(200).json({ savedUser: sanitizedUser });
  } catch {
    return res.status(400).json({ error: "Error updating password" });
  }
};
