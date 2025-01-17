import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"




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


export const login = async (req,res) =>{

    //get the email and password
    const{email, password} = req.body;

    try {

        const user = await User.findOne({email}) //finding user 

        if(!user){ //if email is incorrect
            return res.status(400).json({message:"Invalid Credential"});
        }

        //for matching password 
        // user.password is saved in db
       const isPasswordCorrect =  await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        //else we will genreate token 

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
        
    } catch (error) {
        console.log("Error in signup controller ", error.message);
        res.status(500).json({message: "INTERNAL SERVICE ERROR"});
    }
};


export const logout =  (req,res) =>{ //just clear the cookies it will logout 
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logout Succesfully"});

    } catch (error) {
        console.log("Error in logout controller ", error.message);
        res.status(500).json({message: "INTERNAL SERVICE ERROR"});
    }
};


export const updateProfile = async (req,res) =>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // possible beacause of protect route

        if(!profilePic){
            return res.status(400).json({message: "Profile Picture is required"}); 
        }


       const uploadResponse =  await cloudinary.uploader.upload(profilePic); //uploads to cloudinary

       const updatedUser = await User.findByIdAndUpdate(
        userId, 
        {profilePic: uploadResponse.secure_url}, 
        {new:true}
        );

       res.status(200).json(updatedUser); 
        
    } catch (error) {
        console.log("error in profile pic", error);
        res.status(500).json({message: "INTERNAL SERVICE ERROR"});
    }
};

export const checkAuth =  (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in check auth", error.message);
        res.status(500).json({message: "INTERNAL SERVICE ERROR"});
    }
}

