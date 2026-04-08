import type { Request, Response } from "express";
import Business from "../models/Business.js";

export const editB = async (req: Request, res: Response) => 
{
    const { name, ownerId, newName, category, description, image, address, phone, websiteLink,  } = req.body;

    const existingBusiness = await Business.findOne({ ownerId: ownerId, name: name });
    if(!existingBusiness)
    {
        return res.status(400).json({ error: "Error business not found" });
    }

    const params = { name, ownerId, newName, category, description, image, address, phone, websiteLink };

    let updateData: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => 
    {
        if (value !== undefined) 
        {
            updateData[key] = value;
        }
    });

    try 
    {
        const savedB = await existingBusiness.updateOne(updateData);
        res.status(201).json(savedB);
    } 
    catch (err) 
    {
        return res.status(400).json({ error: "Error updating business" });
    }
}