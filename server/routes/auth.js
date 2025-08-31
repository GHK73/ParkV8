//routes/auth.js

import express from 'express';
import { signup, verifyEmail} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/verify-email",verifyEmail);

export default router;