import express from "express";
const router = express.Router();
import { signUp } from "./signUp.js";
router.post("/", signUp);
export default router;
//# sourceMappingURL=userRoutes.js.map