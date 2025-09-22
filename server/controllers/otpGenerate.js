//controllers/otpGenerate.js

import Otp from "../models/Otp.js";
import {sendMail} from "../utils/sendMail.js";
import crypto from "crypto";

export const generateOtp = async(req,res)=>{
    try{
        const {email,purpose} = req.body;

        if(!email || !purpose){
            return res.status(400).json({message:"Email and purpose are required"});
        }
        await Otp.deleteMany({email, purpose});
        const otp = crypto.randomInt(100000, 999999).toString();
        const newOtp = new Otp({
            email,
            otp,
            purpose
        });
        await newOtp.save();
        await sendMail({
      to: email,
      subject:
        purpose === "signup"
          ? "Verify your email - Signup"
          : "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });
    return res.status(200).json({message:"OTP sent successfully"});
    }catch(error){
        console.error("Error generating OTP:",error);
        return res.status(500).json({message: "Server error"});
    }
};