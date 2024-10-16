import mongoose, { mongo } from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, //one who is subscribing
        ref: 'User',
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId, //one who is subscribing
        ref: 'User',
    }

},{timestamps:true})

export const subscriber = new mongoose.model("Subscriber",subscriptionSchema)

//export {subscriber}