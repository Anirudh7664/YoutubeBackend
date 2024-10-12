import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"
import { send } from "../MailSender/sendmail.js";
import jwt from "jsonwebtoken"
//import { User } from "../models/user.model.js";


const generateAccessandRefreshTokens = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;  //store the users refresh token in the user object

    await user.save({ validateBeforeSave: false }) //save this object in the database

    return { accessToken, refreshToken } //return accessToken and refreshToken
}


const registerUser = asyncHandler(async (req, res) => {

    //take the data from user name email and everything  from req.body
    //validation - no feild empty
    //check if user already exists - username and email
    //check if images and avatar is there
    //if user exists send error message : User already exists
    //if not create new user
    //check if created
    //remove encrypted password and refresh token from the response
    //res.status(200).json({ "message": "hello" });

    const { fullName, email, username, password } = req.body;
    //console.log(email)
    if (
        [fullName, email, username, password].some((file) =>
            file?.trim() === "") //After trimming, this checks if the resulting string is 
        //empty (""). If a variable is empty or contains only spaces, 
        //this condition will evaluate to true.
    ) {
        throw new ApiError(400, "All feilds are required");
        //custom error that we created to return
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
        //this checks if any of username or email is available in the database
    })
    //return res.status(202).send(existedUser)

    if (existedUser) {
        throw new ApiError(409, "Username or Email already exists");
    }
    //console.log(req.file)
    //return;
    const avatarLocalPath = req.files?.avatar[0]?.path

    //const coverImagePath = req.files?.coverImage[0]?.path;
    //console.log(coverImagePath)
    let coverImagePath;
    console.log(req.files)
    if (req.files && Array.isArray(req.files.coverImage)
        && req.files.coverImage.length > 0) {
        coverImagePath = req.files?.coverImage[0].path

    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadImage(avatarLocalPath);
    const coverImage = await uploadImage(coverImagePath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }
    //create new user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createUser) {
        throw new ApiError(500, "Something went wrong registering the user");
    }
    //send(email);
    return res.status(201).json(
        new ApiResponse(200, createUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    //take username and email from body
    //check if username and email exists
    //if yes compare the passwords, if yes login the user and give him an acess and refresh token 
    //store the token in local storage and send the user info
    //
    const { username, email, password } = req.body
    // console.log(username)
    // console.log(email)
    // console.log(password)
    if (!username || !email) {
        throw new ApiError(400, "Username and Email are required")
    }
    //check if user exists
    const user = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    })
    if (!user) {
        throw new ApiError(400, "User not Found")
    }

    //compare the password
    const check = bcrypt.compare(password, user.password);
    if (!check) {
        throw new ApiError(400, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)
    console.log("Access Token", accessToken)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //set the cookies
    const options = {
        httpOnly: true, //ensures the cookie is inaccessible to frontend
        secure: true //ensures the cookie is only sent over secure, encrypted HTTPS connections,
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }


    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body.refreshToken
    try {
        if (!incomingToken) {
            throw new ApiError(401, "Unauthorised User")
        }
    
        const checkedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
        if (!checkedToken) {
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
    
        const user = await User.findById(check._id).select("-password")
        if(!user){
            throw new ApiError(401,"Invalid Token")
        }
    
        if(incomingToken !== user?.refreshToken){
            throw new ApiError(401,"Token used or expired")
        }
        const options = {
            httpOnly: true,
            secure: true
    
        }
        const {accessToken,newrefreshToken} = await generateAccessandRefreshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken:newrefreshToken},
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Server Error")
    }


    // check if the refreshToken is valid or not if not , say invalid token
    //if yes, then just find the user from the refreshtoken
    //check if it is valid and still running if no, say invalid token
    //if yes then find the user from this refershToken and ge



})

export { registerUser, loginUser, logoutUser , refreshAccessToken}