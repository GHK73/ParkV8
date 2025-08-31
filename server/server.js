//server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { DBConnection } from './database/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
DBConnection();

app.listen(PORT,()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
});