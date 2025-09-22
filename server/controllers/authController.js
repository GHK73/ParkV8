// controllers/authController.js

import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

export const signin = async(req, res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Enter both Email and Password"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Email not found"});
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message: "Wrong Passwrod"});
        }
        const token = jwt.sign({
            name : user.name,
            email : user.email,
            role : user.role,
        },JWT_SECRET,
        { expiresIn: '2h' }
        );
        return res.status(200).json({message:"Login Successfull",
            token,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }catch(error){
        console.error('Error during signin:', error);
        return res.status(500).json({message: "Server error"});
    }
};