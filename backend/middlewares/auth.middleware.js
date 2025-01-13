import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';



export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;   //grabbing jwt token to check if we have it or not for validating, we need cookie parser package for grabbing so import it in index.js file

        if(!token){
            return res.status(401).json({message: "Unauthorized - No Token Provided"}); // Sends a JSON response with an object containing a message property.
        }

        //if valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized - No Token Provided"}); 
        }

        //try to find user in database now
        const user = await User.findById(decoded.userId).select("-password"); //deselect the password and selected only user id


        if(!user){
            return res.status(404).json({message: "User not found"}); 
        }




        //successfull
        req.user = user;
        next();


        
    } catch (error) {
        console.log("Error in ProtectedRoute Middleware: ", error.message);
        return res.status(500).json({message: "Internal Service Error"}); 

    }
}