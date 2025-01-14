import mongoose, { mongo } from "mongoose";


const messageSchema = new mongoose.Schema({
    senderId: {
        type:mongoose.Schema.Types.ObjectId, //tells mongo db that this will be reference to user model 
        ref: "User",
        required: true,
    },
    recieverId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type:String,
    },
    image: {
        type:String,
    },
},
{timestamps:true}
);


const Message = mongoose.model("Message", messageSchema);


export default Message;