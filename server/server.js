//server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { DBConnection } from './database/db.js';
import { connectReddis } from './database/redis.js';
import authRouter from './routes/auth.js'; 
import otpRouter from './routes/otp.js';
import passwordRestRoutes from './routes/passwordReset.js';
import parkingSpotsRoutes from './routes/parkingSpots.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
DBConnection();
connectReddis();

app.use('/auth', authRouter);
app.use('/otp', otpRouter);
app.use('/password-reset',passwordRestRoutes);
app.use('/parkingSpots',parkingSpotsRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
});