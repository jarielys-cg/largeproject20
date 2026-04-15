import type { Request, Response } from "express";
import mongoose from "mongoose";
import Business from "../models/Business.js";
import { toSpaceKey, toSignedGetImageUrl } from "./spacesConfig.js";

export const confirmUpload = async (req: Request, res: Response) => {
  const ownerId = (req as any).user.id;
  const { name, key } = req.body;
  const normalizedKey = toSpaceKey(key);

  if (!name || !normalizedKey) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!mongoose.isValidObjectId(ownerId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
  const existingBusiness = await Business.findOne({ ownerId: ownerObjectId, name });

  if (!existingBusiness) {
    return res.status(404).json({ error: "Business not found" });
  }

  try {
    await Business.updateOne(
      { ownerId: ownerObjectId, name },
      {
        $addToSet: { image: normalizedKey },
      }
    );

    return res.status(200).json({
      success: true,
      key: normalizedKey,
      publicUrl: await toSignedGetImageUrl(normalizedKey),
    });
  } catch {
    return res.status(400).json({ error: "Failed to confirm upload" });
  }
};