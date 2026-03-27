import type { Request, Response } from "express";
import User from "../models/User.js";

export const login = async (req: Request, res: Response) => 
{
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email});
    if (existingUser) 
    {
        if(existingUser.password == password)
        {
            res.status(201).json(existingUser); 
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