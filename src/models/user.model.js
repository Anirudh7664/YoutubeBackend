import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    fullName:{
        type:String,
        required:true,
        //unique:true,
        trim:true,
        //lowercase:true
    },
    avatar:{
        type:String, // cloudinary
        required:true,

    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
    password:{
        type:String,
        required:[true, "Password is required"]
    },
    refreshToken:{
        type:String,
    }

},{timestamps:true})

userSchema.pre("save",async function(next){
    this.password = bcrypt.hash(this.password, 10);
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(this.password,password);
   
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName

    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    });
    //An access token grants a user permission to access a resource, 
    //while a refresh token allows a user to stay logged in without re-authenticating. 
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,

    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:REFRESH_TOKEN_EXPIRY
    });
    //Access tokens are usually short-lived, often lasting only a few hours, 
    //while refresh tokens are longer-lasting. For example, Microsoft's identity platform 
    //sets the default access token lifespan to 30–90 minutes, and the default refresh token 
    //lifespan to 24 hours for single-page apps and 90 days for other scenarios. 
}
const User = new mongoose.model('User', userSchema)