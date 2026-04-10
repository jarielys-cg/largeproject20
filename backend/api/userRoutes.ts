import express from "express";
const router = express.Router();
import { signUp } from "./signUp.js";
import { login } from "./login.js";
import { passwordReset } from "./passwordReset.js";

router.post("/signUp", signUp);
router.post("/login", login);
router.patch("/passwordReset", passwordReset);

export default router;