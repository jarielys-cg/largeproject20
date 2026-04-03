import type { Request, Response } from "express";
import User from "../models/User.js";

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
        const savedUser = await newUser.save(); // saves to MongoDB
        res.status(201).json(savedUser);       // respond with the saved user
    } 
    catch (err) 
    {
        console.log("DB ERROR:", err);
        return res.status(400).json({ error: "Error adding to database" });
    }
};