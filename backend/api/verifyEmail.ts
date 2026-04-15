import { Router } from "express";
import User from "../models/User.js";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

const router = Router();
const resendCooldowns = new Map<string, number>();

const RESEND_COOLDOWN_MS = 60 * 1000;

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

router.post("/resend-email", async (req, res) =>
{
    const { email } = req.body;

    if (!email)
    {
        return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const now = Date.now();
    const resendAvailableAt = resendCooldowns.get(normalizedEmail) ?? 0;

    if (resendAvailableAt > now)
    {
        const retryAfterSeconds = Math.ceil((resendAvailableAt - now) / 1000);
        return res.status(429).json({
            error: `Please wait ${retryAfterSeconds} seconds before requesting another verification email.`,
            retryAfterSeconds
        });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if(!existingUser)
    {
        return res.status(400).json({ error: "Account not found" });
    }

    if (existingUser.isVerified)
    {
        return res.status(400).json({ error: "Account is already verified" });
    }

    existingUser.emailVerificationToken = crypto.randomBytes(32).toString("hex");
    existingUser.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await existingUser.save();
    resendCooldowns.set(normalizedEmail, now + RESEND_COOLDOWN_MS);

    const frontendUrl = (process.env.FRONTEND_URL || "http://colors-lab-cop4331c.xyz").replace(/\/$/, "");
    const verifyLink = `${frontendUrl}/verify-email/${existingUser.emailVerificationToken}`;

    try
    {
        await sgMail.send({
        to: existingUser.email,
        from: process.env.EMAIL_FROM as string,
        subject: "Verify Your Email",
        text: `Click this link to verify your email: ${verifyLink}`,
        html: `
            <h2>Email Verification</h2>
            <p>Click the link below to verify your account:</p>
            <a href="${verifyLink}">${verifyLink}</a>
            <p>This link expires in 1 hour.</p>
        `
        });

        res.status(200).json({ success: "Email sent", retryAfterSeconds: 60 });
    }
    catch
    {
        return res.status(400).json({ error: "Failed to send email" });
    }
    
});

export default router;
