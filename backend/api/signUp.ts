import type { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const signUp = async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password, isBusinessOwner, zipCode } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const existingUser2 = await User.findOne({ username: username });
    if (existingUser2) {
        return res.status(400).json({ error: "Username already exists" });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret is not configured" });
        }

        const emailVerificationToken = crypto.randomBytes(32).toString("hex");
        const emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,
            isBusinessOwner,
            zipCode,
            isVerified: false,
            emailVerificationToken,
            emailVerificationExpires
        });

        const savedUser = await newUser.save();

        const frontendUrl = (process.env.FRONTEND_URL || "http://colors-lab-cop4331c.xyz").replace(/\/$/, "");
        const verifyLink = `${frontendUrl}/verify-email/${emailVerificationToken}`;

        await sgMail.send({
            to: savedUser.email,
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

        const token = jwt.sign(
            { userId: savedUser._id.toString() },
            jwtSecret,
            { expiresIn: "24h" }
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...sanitizedUser } = savedUser.toObject();

        return res.status(200).json({
            token,
            savedUser: sanitizedUser,
            message: "Signup successful. Please verify your email."
        });
    }
    catch (err) {
        console.log("DB ERROR:", err);
        return res.status(400).json({ error: "Error adding user / sending verification email" });
    }
};
