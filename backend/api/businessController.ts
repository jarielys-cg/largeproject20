import type { Request, Response } from "express";
import Business from "../models/Business.js";

export const addBusiness = async (req: Request, res: Response) => {
    const { name, ownerId, category, description, image, address, phone, websiteLink } = req.body;

    const newBusiness = new Business({
        name,
        ownerId,
        category,
        description,
        image,
        address,
        phone,
        websiteLink
    });

    try {
        const saved = await newBusiness.save();
        res.status(201).json(saved);
    } catch (err) {
        return res.status(400).json({ error: "Error adding business" });
    }
};

export const editBusiness = async (req: Request, res: Response) => {
    const { id } = req.params;
    const update = req.body;

    try {
        const updated = await Business.findByIdAndUpdate(id, update, { new: true });
        if (!updated) return res.status(404).json({ error: "Business not found" });
        res.status(200).json(updated);
    } catch (err) {
        return res.status(400).json({ error: "Error updating business" });
    }
};

export const removeBusiness = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const removed = await Business.findByIdAndDelete(id);
        if (!removed) return res.status(404).json({ error: "Business not found" });
        res.status(200).json({ success: true });
    } catch (err) {
        return res.status(400).json({ error: "Error removing business" });
    }
};

export const getBusinesses = async (_req: Request, res: Response) => {
    try {
        const list = await Business.find();
        res.status(200).json(list);
    } catch (err) {
        return res.status(400).json({ error: "Error fetching businesses" });
    }
};

export const getBusinessById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const biz = await Business.findById(id);
        if (!biz) return res.status(404).json({ error: "Business not found" });
        res.status(200).json(biz);
    } catch (err) {
        return res.status(400).json({ error: "Error fetching business" });
    }
};
