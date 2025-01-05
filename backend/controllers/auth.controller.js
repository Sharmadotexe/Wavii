import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";




export const signup = async (req,res) =>{
    try {
        //fetches the data that user sends, need to write app.use(express.json()); in index file for using it
        const {email,password,fullName} = req.body;

        if(!email || !fullName || !password){
            return res.status(400).json({message: "Fill all the fields"}); // Sends a JSON response with an object containing a message property.
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"}); // Sends a JSON response with an object containing a message property.
        }

        //create a user
        const user = await User.findOne({email})

        if(user) return res.status(400).json({message: "Email already exists"});
        

        //hashing
        const salt = await  bcrypt.genSalt(10); //adds randomness to password but also increases computational time

        const hashedPassword = await bcrypt.hash(password,salt)


        const newUser = new User({
            fullName, // dont need to write fullName: fullName as its the same
            email,
            password: hashedPassword
        })

        if(newUser){
            //generate jwt token
            //create func in lib folder

            generateToken(newUser._id, res) //func call present in ./lib/utils.js 
            await newUser.save(); //save to db

            //sending success message
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        }

        else{
            return res.status(400).json({message: "Invalid User"});
        }



        

    } catch (error) {
        console.log("Error in signup controller ", error.message);
        res.status(500).json({message: "INTERNAL SERVICE ERROR"});
    }
};


export const login =  (req,res) =>{
    res.send("login route")
};


export const logout =  (req,res) =>{
    res.send("logout route")
};

