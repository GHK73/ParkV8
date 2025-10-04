//controllers/otpVerify.js

import Otp from "../models/Otp.js";

export const verifyOtp = async(req,res)=>{
    try{
        const {email, otp,purpose} = req.body;
        if(!email || !otp || !purpose){
            return res.status(400).json({message: "Email,Otp and purpose are required"});
        }
        const existingOtp = await Otp.findOne({email,purpose});
        if(!existingOtp){
            return res.status(400).json({message: "Otp not found or expired"});
        } 
        if(existingOtp.otp !== otp){
            return res.status(400).json({message: " Invalid Otp"});
        }
        await Otp.deleteOne({_id:existingOtp._id});
        return res.status(200).json({message:"Otp verified Successfully"});
    }catch(error){
        console.error("Error verrifying Otp",error);
        return res.status(500).json({message:"Seerver error"});
    }
};