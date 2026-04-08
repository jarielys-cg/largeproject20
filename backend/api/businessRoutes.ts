import express from "express";
const router = express.Router();
import { addB } from "./addB.js";
import { editB } from "./editB.js";
import { removeB } from "./removeB.js";

router.post("/addB", addB);
router.post("/editB", editB);
router.post("/removeB", removeB);

export default router;