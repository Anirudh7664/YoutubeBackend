import mongoose from "mongoose";
import express from 'express'
import { DB_NAME } from "./constants.js";
import dotenv from 'dotenv'
dotenv.config();
import connectDB from "./db/index.js";




connectDB()
.then(()=>{
    console.log(`Server started at ${process.env.PORT}`)
})
.catch((err)=>{
    console.log(`Error in starting Server: ${err}`)
})

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



