// controllers/authController.js

import User from "../models/user.js";
import Otp from "../models/Otp.js"
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {generateOtp} from "./otpGenerate.js";

dotenv.config();
const JWT_SECRET = process.env.SECRET_KEY;

export const signup = async(req, res)=>{
    try{
        const {name,email,phone,password,role,parkingLotGovId} = req.body;
        if(!name || !email || !phone || !password || !role){
            return res.status(400).json({message: "All required fields must be filled"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }

        if(role =="owner" ){
            if(!parkingLotGovId){
                return res.status(400).json({message: " Parking lot government Id is required for owners"});
            }
            const existingGovId = await User.findOne({parkingLotGovId});
            if(existingGovId){
                return res.status(400).json({message: "Parking Lot Government ID already in use"});
            }
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name, email,phone, password: hashedPassword,role,
            parkingLotGovId:role=="owner"?parkingLotGovId:null,
        });
        await newUser.save();   
        return res.status(201).json({message: "User registered successfully"});
    }catch(error){
        console.error("Error during signup completion",error);
        return res.status(500).json({message:"Server error"});
    }
};

export const signin = async (req, res) => {
    try {
        console.log("Received signin request:", req.body); 

        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Signin error: missing email or password");
            return res.status(400).json({ message: "Enter both Email and Password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Signin error: no user found or invalid password for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log(`Signin error: no user found or invalid password for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        );
        console.log(`Signin success for email: ${email}`);
        return res.status(200).json({
            message: "Login Successfull",
            token,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const passwordResetOtp = async(req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.body.purpose = "password-reset";
        // generateOtp will send its own response
        return await generateOtp(req, res);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async(req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }
        // Find OTP by email, purpose, and otp value for stricter matching
        const existingOtp = await Otp.findOne({ email, otp, purpose: "password-reset" });
        if (!existingOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });
        await Otp.deleteOne({ _id: existingOtp._id });
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};