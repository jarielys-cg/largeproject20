import type { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Business from "../models/Business.js";

dotenv.config();

const s3 = new S3Client({
  region: "us-east-1", // required but ignored by Spaces
  endpoint: "https://sfo3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

export const getUploadUrl = async (req: Request, res: Response) => 
{
    const ownerId = (req as any).user.id;
    const { name, fileType } = req.body;

    const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    };

    const extension = mimeToExt[fileType];

    if (!extension) {
      return res.status(400).json({ error: "Invalid file type" });
    }

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
    try {
        const fileName = `uploads/${Date.now()}.${extension}`;

        const command = new PutObjectCommand({
        Bucket: "marketplacegroup20",
        Key: fileName,
        ContentType: `image/${extension}`,
        ACL: "public-read",
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 60 });

        try
        {
          existingBusiness.image.push(fileName);
          await existingBusiness.save();
        }
        catch
        {
          return res.status(400).json({ error: "Failed to upload to database" });
        }

        res.json({
        url,
        key: fileName,
        });
  } 
  catch
  {
        res.status(400).json({ error: "Failed to generate URL" });
  }
};