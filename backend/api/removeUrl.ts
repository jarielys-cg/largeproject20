import type { Request, Response } from "express";
import mongoose from "mongoose";
import Business from "../models/Business.js";

export const removeUrl = async (req: Request, res: Response) => 
{
    const ownerId = (req as any).user.id;
    const { name, key } = req.body;

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

    try
    {
        const result = await Business.updateOne(
        { ownerId: ownerObjectId, name },
        {
            $pull: { image: key }
        }
        );
        if (result.matchedCount === 0) 
        {
            return res.status(404).json({ error: "Business not found" });
        }

        if (result.modifiedCount === 0) 
        {
            return res.status(400).json({ error: "Image not found in array" });
        }

        await existingBusiness.save();
        res.status(200).json({ success: "Successfully deleted" });
    }
    catch
    {
        return res.status(400).json({ error: "Failed to remove" });
    }
}
