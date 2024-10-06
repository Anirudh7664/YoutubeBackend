import mongoose from "mongoose";
import express, { urlencoded } from 'express'
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN, //this is used to set the origins from which the backend will accept the requests
    credentials:true              //this is used to allow the cookies sent by the frontend along with Cross Origin Info
                                  //in frontend we need to add the "credentials:  include" to make it full workable
}))

app.use(express.json());
app.use(urlencoded());


//routes import
import userRouter from "./routes/user.routes.js"


//routes declare
//userRouter will contain all the user realted routes and APP.js will act as main path 
//to lead to all the different routes.

app.use("/api/v1/users",userRouter)
export {app}