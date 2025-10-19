//models/parkingSpot.js
import mongoose from 'mongoose';

const parkingSpotSchema = new mongoose.schema({
    name:{
        type:string,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    location:{
        type:{
            type:String,
            enum:["Point"],
            requird: true,
            default: "Point",
        },
        coordinates:{
            type:[Number],
            requird: true,
        },
    },
    size:{
        type: String,
    },
    available:{
        type:Boolean,
        default: true,
    },
},{timestamps:true});

parkingSpotSchema.index({location:"2dsphere"});

export default mongoose.model("ParikingSpot",parkingSpotSchema);