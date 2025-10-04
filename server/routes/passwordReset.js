//routes/passwordReset.js
import express from "express";
import { passwordResetOtp,resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/request-otp",passwordResetOtp);
router.post("/reset",resetPassword);

export default router;