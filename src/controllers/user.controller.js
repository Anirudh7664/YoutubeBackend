import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
//import {User} from "../models/user.models"




const registerUser = asyncHandler( async (req,res)=>{

    //take the data from user name email and everything  from req.body
    //validation - no feild empty
    //check if user already exists - username and email
    //check if images and avatar is there
    //if user exists send error message : User already exists
    //if not create new user
    //check if created
    //remove encrypted password and refresh token from the response
    const {fullName, email, username, password} = req.body;
    console.log(email)
    if(
        [fullName,email,username,password].some((file)=>
            file?.trim() === "") //After trimming, this checks if the resulting string is 
                                 //empty (""). If a variable is empty or contains only spaces, 
                                 //this condition will evaluate to true.
    ){
        throw new ApiError(400,"All feilds are required");
        //custom error that we created to return
    }
    const existedUser = User.findOne({
        $or:[{ username },{ email }]
        //this checks if any of username or email is available in the database
    })
    //return res.status(202).send(existedUser)

    if(existedUser){
        throw new ApiError(409,"Username or Email already exists");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    } 
    const avatar = await uploadImage(avatarLocalPath);
    const coverImage = await uploadImage(coverImagePath);

    if(!avatar){
        throw new ApiError(400,"Avatar upload failed");
    }
    //create new user
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createUser){
        throw new ApiError(500, "Something went wrong registering the user");
    }
    return res.status(201).json(
        new ApiResponse(200,createUser,"User registered Successfully")
    )

})


export {registerUser}