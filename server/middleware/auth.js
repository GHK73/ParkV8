//middlewate/auth.js

import jwt from 'jsonwebtoken';

export const authenticationToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized: Token Missing"});
    }

    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err) return res.status(403).json({message:"Forbidden: Invalid Tokken"});
        req.user = user;
        next();
    });
};

export const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        const userRole = req.user?.role;
        if(!userRole || !allowedRoles.includes(userRole)){
            return res.status(403).json({message:"Forbidden: You do not have permission to acess this resource"});
        }
        next();
    };
};