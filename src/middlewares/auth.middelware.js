import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import express from "express"
const app = express();
app.use(cookieParser)

//this middelware checks if the user is logged in or not by extracting the accessToken 
//from either the cookies of the 
//req.cookie as passed earlier during "LoginUser" controller or from the req.header

export const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        //console.log(req.cookies)
        const token = req.cookies.accessToken || req.header('Authorization')?.replace("Bearer ","");
    
        if(!token){
            throw new ApiError(401,"Unauthorised Request")
        }
    
        const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})