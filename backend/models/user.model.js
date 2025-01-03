import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email : String,
        requried: true,
        unique: true
    },
    {
        password : String,
        requried: true,
        minlength: 6,
    },
    {
        fullName : String,
        requried: true,
    },
    {
        profilePic : String,
        requried: true,
        default: ""
    },
    {
        timestamps:true
    }
);




const User = mongoose.model("User", userSchema);


export default User;