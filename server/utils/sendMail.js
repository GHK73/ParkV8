//utils/sendMail.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    },
});

export const sendMail = async(to,subject,text,html= null)=>{
    try {
    const mailOptions = {
      from: `"Parking System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text, 
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};