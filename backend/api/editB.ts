import type { Request, Response } from "express";
import Business from "../models/Business.js";
import mongoose from "mongoose";

export const editB = async (req: Request, res: Response) => 
{
    const { name, newName, category, description, image, address, phone, websiteLink,  } = req.body;

    const ownerId = (req as any).user.id;

    if(!mongoose.isValidObjectId(ownerId))
    {
        return res.status(400).json({ error: "Invalid ID" });
    }
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const existingBusiness = await Business.findOne({ ownerId: ownerObjectId, name: name });
    if(!existingBusiness)
    {
        return res.status(404).json({ error: "Business not found" });
    }

    const params = { newName, category: Array.isArray(category) ? category : category ? [category] : undefined, description, image, address, phone, websiteLink }

    const updateData: Record<string, any> = {};
    Object.entries(params).forEach(([key, value]) => 
    {
        if (value !== undefined) 
        {
            if (key === "newName") 
            {
                updateData["name"] = value;
            } 
            else 
            {
                updateData[key] = value;
            }
        }
    });

    try 
    {
        Object.entries(updateData).forEach(([key, value]) => 
        {
            (existingBusiness as any)[key] = value;
        });

        const savedBusiness = await existingBusiness.save();
        res.status(200).json(savedBusiness);
    } 
    catch
    {
        return res.status(400).json({ error: "Error updating business" });
    }
}