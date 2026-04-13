import type { Request, Response } from "express";
import Business from "../models/Business.js";
import mongoose from "mongoose";

export const addB = async (req: Request, res: Response) => 
{
    const { name, category, description, image, address, city, state, zipCode, phone, websiteLink,  } = req.body;
    const categoryArray = Array.isArray(category) ? category : [category]

    const ownerId = (req as any).user.id;
    
    if(!mongoose.isValidObjectId(ownerId))
    {
        return res.status(400).json({ error: "Invalid ID" });
    }
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const newBusiness = new Business({
        name,
        ownerId: ownerObjectId,
        category: categoryArray,
        description,
        image,
        address,
        city,
        state,
        zipCode,
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
    catch
    {
        return res.status(400).json({ error: "Error adding to database" });
    }
}