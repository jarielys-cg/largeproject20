import type { Request, Response } from "express";
import User from "../models/User.js";

export const passwordReset = async (req: Request, res: Response) => 
{
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email});
    if (existingUser) 
    {
        if(existingUser.password == password)
        {
            return res.status(400).json({ error: "Can't use some password" });
        }

        const updateData: Record<string, string> = {};
        updateData["password"] = password;

        try 
        {
            Object.entries(updateData).forEach(([key, value]) => 
            {
                (existingUser as any)[key] = value;
            });

            const savedUser = await existingUser.save();

            const { password: _password, ...sanitizedUser } = savedUser.toObject();
            
            return res.status(200).json({savedUser: sanitizedUser});
        } 
        catch
        {
            return res.status(400).json({ error: "Error updating password" });
        }
    }
    else
    {
        return res.status(404).json({ error: "User not found" });
    }
}