import type { Request, Response } from "express";
import Business from "../models/Business.js";
import mongoose from "mongoose";

export const removeB = async (req: Request, res: Response) => 
{
    const { name, ownerId } = req.body;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const existingBusiness = await Business.findOne({ ownerId: ownerObjectId, name: name });
    if(existingBusiness)
    {
        try 
        {
            await existingBusiness.deleteOne();
            res.status(200).json({ success: "Successfully deleted" });
        } 
        catch (err) 
        {
            return res.status(400).json({ error: "Error deleting business" });
        }
    }
    else
    {
        return res.status(404).json({ message: "Business not found" });
    }
}