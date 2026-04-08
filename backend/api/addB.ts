import type { Request, Response } from "express";
import Business from "../models/Business.js";
import mongoose from "mongoose";

export const addB = async (req: Request, res: Response) => 
{
    const { name, ownerId, category, description, image, address, phone, websiteLink,  } = req.body;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const newBusiness = new Business({
        name,
        ownerId: ownerObjectId,
        category,
        description,
        image,
        address,
        phone,
        websiteLink
    });

    const existingBusiness = await Business.findOne({ ownerId: newBusiness.ownerId, name: newBusiness.name });
    if(existingBusiness)
    {
        return res.status(400).json({ error: "Business name already exists under this account" });
    }

    try 
    {
        const savedB = await newBusiness.save(); // saves to MongoDB
        res.status(201).json(savedB);       // respond with the saved user
    } 
    catch (_err) 
    {
        return res.status(400).json({ error: "Error adding to database" });
    }
}