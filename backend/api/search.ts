// Search API - search and display businesses based on name and category
import type { Request, Response } from "express";
import Business from "../models/Business.js";

export const searchBusiness = async(req: Request, res: Response) => {
    try {

        // GET request, handles empty string
        const search = (req.query.search as string) || "";

        // If search is empty, return all businesses
        const results = search ? { $or : [ {name : { $regex: search, $options: "i" }}, { category : { $regex: search, $options: "i" } } ] } : {};

        const businesses = await Business.find(results);

        res.json(businesses);

    }catch (err) {
        console.error("Search error: ", err);
        res.status(500).json({ error: "Server error" });
    }
}; 

// Add pagination
// Display highest to lowest rating