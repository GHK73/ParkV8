// routes/otp.js

import express from "express";
import { generateOtp } from "../controllers/otpGenerate.js";
import { verifyOtp } from "../controllers/otpVerify.js";

const router = express.Router();

router.post("/generate", generateOtp);
router.post("/verify", verifyOtp);

export default router;
