import express from "express";
const router = express.Router();
import { addB } from "./addB.js";
import { editB } from "./editB.js";
import { removeB } from "./removeB.js";
import { searchBusiness } from "./search.js";

router.post("/addB", addB);
router.patch("/editB", editB);
router.delete("/removeB", removeB);
router.post("/search", searchBusiness);

export default router;