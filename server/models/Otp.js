//models/Otp.js

import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {type:String,
        required: true,
    },
    otp:{
        type: String,
        required:true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 600,
    },
    purpose:{
        type: String,
        enum : ["signup","password-reset"],
        required: true,
    }
});

export default mongoose.model("Otp",otpSchema);