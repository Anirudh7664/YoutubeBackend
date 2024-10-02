import mongoose from "mongoose";
import express from 'express'
import { DB_NAME } from "./constants.js";
import dotenv from 'dotenv'
const URL = "mongodb+srv://randevanirudh:AnirudhMongo@cluster0.dif22ba.mongodb.net/youtuebackend?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
dotenv.config();
import connectDB from "./db/index.js";




connectDB();

// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("Error",(error)=>{
//             console.log("Error",error)
//             throw error
//         }) // This is used to handle the erros that occur after connecting to database is done
//         app.listen(process.env.PORT,()=>{
//             console.log(`Server started at ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.error("ERROR",error)
//         throw error
//     }
// })()



