import type { Request, Response } from "express";
import User from "../models/User.js";

export const signUp = async (req: Request, res: Response) => 
{
    const { username, email, password, isBusinessOwner } = req.body;

    const newUser = new User({
        username,
        email,
        password,
        isBusinessOwner
    });

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) 
    {
        return res.status(400).json({ error: "Email already exists" });
    }

    try 
    {
        const savedUser = await newUser.save(); // saves to MongoDB
        res.status(201).json(savedUser);       // respond with the saved user
    } 
    catch (err) 
    {
        return res.status(400).json({ error: "Error adding to database" });
    }
};