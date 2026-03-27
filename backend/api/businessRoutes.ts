import express from "express";
import { addBusiness, editBusiness, removeBusiness, getBusinesses, getBusinessById } from "./businessController.js";
const router = express.Router();

router.post("/addBusiness", addBusiness);
router.put("/editBusiness/:id", editBusiness);
router.delete("/removeBusiness/:id", removeBusiness);
router.get("/getBusinesses", getBusinesses);
router.get("/getBusiness/:id", getBusinessById);

export default router;
