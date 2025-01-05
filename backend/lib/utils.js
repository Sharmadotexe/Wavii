import jwt from "jsonwebtoken"


//need payload as parameter
// Payload can include user data like id, email, etc.
export const generateToken = (userId, res)=>{

    //add secrest key in env
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    //sending it to user in cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 60 * 24 * 60 * 1000, // milliseconds
        httpOnly: true, //prevent XSS cross-site attack
        sameSite: "strict", //CSRF attack
        secure: process.env.NODE_ENV !== "development"
    })

    return token;
}