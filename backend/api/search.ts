// Search API - search and display businesses based on name, category, and/or location
import type { Request, Response } from "express";
import Business from "../models/Business.js";

export const searchBusiness = async(req: Request, res: Response) => {
    try {

        // POST request, handles empty string
        const search = ((req.body.search as string) || "").trim();
        const location = ((req.body.location as string) || "").trim();

        // If search is empty, returns all types of businesses
        const results = search 
        ? { 
            $or : [
                { name : { $regex: search, $options: "i" } }, 
                { category : { $regex: search, $options: "i" } }
            ] 
        } 
        : {};

        const zip = parseInt(location, 10); // String to integer conversion
        const isZip = !isNaN(zip) && /^\d+$/.test(location); // Checks if location input is not a zipcode
        
        // If location is empty, returns businesses from any location
        const locationResults = location 
        ? { 
            $or : [
                { city : { $regex: location, $options: "i" } },
                { state : { $regex: location, $options: "i" }},
                ...(isZip ? [{ zipCode: zip }] : [])
            ] 
        } 
        : {};
        
        // Combines results for search and location
        let combinedResult;

        // Returns businesses from specified name/category and within specified location
        if(search && location) {
            combinedResult = { $and : [results, locationResults] };
        }
        // Returns businesses from specified name/category from any location
        else if(search && !location) {
            combinedResult = results;
        }
        // Returns any businesses within specified location
        else if(location && !search) {
            combinedResult = locationResults;
        }
        // Returns all businesses
        else {
            combinedResult = {};
        }

        // Pagination, displays 10 businesses per page
        const page = Math.max(1, parseInt(req.body.page) || 1);
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        // Stores all business in descending order 
        const[businesses, total] = await Promise.all ([
            Business
                .find(combinedResult)
                .sort({ averageReviewScore: -1 })
                .skip(skip)
                .limit(pageSize),

            Business.countDocuments(combinedResult)
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