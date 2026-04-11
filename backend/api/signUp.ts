import type { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req: Request, res: Response) => 
{
    const { firstName, lastName, username, email, password, isBusinessOwner, zipCode } = req.body;

    const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password,
        isBusinessOwner,
        zipCode
    });

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser)
    {
        return res.status(400).json({ error: "Email already exists" });
    }
    const existingUser2 = await User.findOne({ username: newUser.username });
    if (existingUser2)
    {
        return res.status(400).json({ error: "Username already exists" });
    }

    try 
    {
        const jwtSecret = process.env.JWT_SECRET
        if(!jwtSecret) {
            return res.status(500).json({ error: "JWT secret is not configured" })
        }

        const savedUser = await newUser.save(); // saves to MongoDB

        const token = jwt.sign(
            { userId: savedUser._id.toString() },
            jwtSecret,
            { expiresIn: "24h" }
        ) 

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...sanitizedUser } = savedUser.toObject();

        return res.status(200).json({
                token,
                savedUser: sanitizedUser
            });
    } 
    catch (err) 
    {
        console.log("DB ERROR:", err);
        return res.status(400).json({ error: "Error adding to database" });
    }
};