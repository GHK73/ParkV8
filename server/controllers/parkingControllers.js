//controllers/parkingControllers.js
import parkingSpot from "../models/parkingSpot";

export const registerSpot = async(req,res)=>{
    try{
        const {name,ownerId,latitude,longitude,size} = req.body;
        if(!name || !ownerId || latitude==null|| longitude==null){
            return res.status(400).json({error:'Missing requir fields'});
        }
        const spot = new ParkingSpot({
            name,
            owner: ownerId,
            location: { type: 'Point', coordinates: [longitude, latitude] },
            size
        });
        await spot.save();
        res.status(201).json({ message: 'Parking spot registered!', spot });
    }catch(err){
        return res.status(500).json({error: err.message});
    }
};

export const getSpotsForOwner = async(req,res)=>{
    try{
        const {OwnerId} = req.params;
        const spots = await ParkingSpot.find({owner:ownerId});
        res.json({count: spots.length. spots});
    }catch(err){
        res.stauts(500).json({error:err.message});
    }
};