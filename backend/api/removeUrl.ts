import type { Request, Response } from "express";
import mongoose from "mongoose";
import Business from "../models/Business.js";
import dotenv from "dotenv";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const s3 = new S3Client({
  region: "us-east-1", // required but ignored by Spaces
  endpoint: "https://sfo3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

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

        if (result.modifiedCount > 0) 
        {
            try
            {
                await s3.send(
                new DeleteObjectCommand({
                Bucket: "marketplacegroup20",
                Key: key,
                })
            );
            }
            catch
            {
                return res.status(400).json({ error: "Failed to remove from cloud" });
            }
        }
        res.status(200).json({ success: "Successfully deleted" });
    }
    catch
    {
        return res.status(400).json({ error: "Failed to remove" });
    }
}
