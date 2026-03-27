import express from "express";
const router = express.Router();

import { searchBusiness } from "./search.js";
router.get("/search", searchBusiness);

export default router;