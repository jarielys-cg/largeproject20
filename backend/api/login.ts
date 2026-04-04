import type { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => 
{
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email});
    if (existingUser) 
    {
        if(existingUser.password == password)
        {
            const user = new User({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isBusinessOwner: existingUser.isBusinessOwner
            })

            const token = jwt.sign(
                { userId: existingUser._id, email: existingUser.email },
                process.env.JWT_SECRET!,
                { expiresIn: "24h" }
            )       
             
            return res.status(200).json({
                token,
                user
            });
        }
        else
        {
            return res.status(400).json({ error: "Incorrect password" });
        }
    }
    else
    {
        return res.status(400).json({ error: "Account not found" });
    }
};