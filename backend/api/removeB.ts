import type { Request, Response } from "express";
import Business from "../models/Business.js";

export const removeB = async (req: Request, res: Response) => 
{
    const { name, ownerId } = req.body;

    const existingBusiness = await Business.findOne({ ownerId: ownerId, name: name });
    if(existingBusiness)
    {
        try 
        {
            existingBusiness.deleteOne();
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