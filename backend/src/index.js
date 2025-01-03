import express from "express";
import dotenv from "dotenv";


import authRoutes from "../routes/auth.routes.js"

dotenv.config();
const app  = express();



app.use("/api/auth", authRoutes);


const PORT = process.env.PORT;


app.listen(PORT, ()=>{
console.log("server is running on port :" +PORT);
});