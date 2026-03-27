import express from "express";
const router = express.Router();
import { signUp } from "./signUp.js";
import { login } from "./login.js";

router.post("/signUp", signUp);
router.post("/login", login);

export default router;