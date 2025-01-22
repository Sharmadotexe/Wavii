import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.routes.js";
import messageRoutes from "../routes/message.routes.js";
import {connectDB} from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from "../lib/socket.js"



dotenv.config();


// const app  = express();// will delete after creating app in socket io file

const PORT = process.env.PORT;


//allows you to use json data and allow grabbing the json data
app.use(express.json());

//allows you to parse the cookie
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
})
);


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);




server.listen(PORT, ()=>{
console.log("server is running on port :" +PORT);
connectDB()
});

