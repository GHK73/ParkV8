import {createClient} from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

export const connectReddis = async()=>{
    try{
        await redisClient.connect();
        console.log("Connected to Redis");
    }catch(error){
        console.error("Error while connecting to Redis",error.message);
    }
};

process.on('SIGNIN',async()=>{
    try{
        await redisClient.quit();
        console.log("Redis Connection is closed");
        process.exit(0);
    }catch(error){
        process.exit(1);
    }
});