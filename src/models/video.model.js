import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    videoFile:{
        type: String, //cloudinary
        required: true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:number,
        required:true
    },
    views:{
        type:number,
        required:true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
    
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)