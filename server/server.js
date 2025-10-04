//server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { DBConnection } from './database/db.js';
import { connectReddis } from './database/redis.js';
import authRouter from './routes/auth.js'; 
import otpRouter from './routes/otp.js';
import passwordRestRoutes from './routes/passwordReset.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
DBConnection();
connectReddis();

app.use('/api/auth', authRouter);
app.use('/api/otp', otpRouter);
app.use('/api/password-reset',passwordRestRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
});