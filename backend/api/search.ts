// Search API - search and display businesses based on name and category
import type { Request, Response } from "express";
import Business from "../models/Business.js";

export const searchBusiness = async(req: Request, res: Response) => {
    try {

        // GET request, handles empty string
        const search = ((req.query.search as string) || "").trim();

        // If search is empty, return all businesses
        const results = search 
        ? { 
            $or : [
                { name : { $regex: search, $options: "i" } }, 
                { category : { $regex: search, $options: "i" } }
            ] 
        } 
        : {};

        // Pagination, displays 20 businesses per page
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const pageSize = 20;
        const skip = (page - 1) * pageSize;

        // Stores all business in descending order 
        const[businesses, total] = await Promise.all ([
            Business
                .find(results)
                .sort({ averageReviewScore: -1 })
                .skip(skip)
                .limit(pageSize),

            Business.countDocuments(results)
        ]);

        res.json({
            data: businesses,
            page,
            totalPages: Math.ceil(total / pageSize),
            total
        });

    }catch (err) {
        console.error("Search error: ", err);
        res.status(500).json({ error: "Server error" });
    }
};