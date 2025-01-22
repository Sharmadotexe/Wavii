import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io} from "../lib/socket.js";
 

//for viewing all users except us
export const getUsersForSideBar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };


//for entering chat and viewing messages
export const getMessages =  async (req,res) =>{
    try {
        const {id:userToChatId} = req.params; //params for dynamic values in routes
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[{ //mongodb or operator where this condition will be true array of document will be returned
                senderId:myId, recieverId:userToChatId
            },
        {
            senderId:userToChatId, recieverId:myId

        }]
        })

        res.status(200).json(messages)

    } catch (error) {
         console.log("Error in getMessages", error.message);
         res.status(500).json({error: "INTERNAL SERVICE ERROR"});
    }
};




export const sendMessage =  async (req,res) =>{
try {
    const {text, image} = req.body;

    const {id: recieverId } = req.params;

    const senderId = req.user._id;

    //for image

    let imageUrl;

    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
        senderId,
        recieverId,
        text,
        image:imageUrl
    });

    await newMessage.save();


    //for socket io 
    const receiverSocketId = getReceiverSocketId(recieverId);

    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage); 
    }
 

    res.status(201).json(newMessage);


} catch (error) {
    console.log("Error in sendMessages", error.message);
    res.status(500).json({message: "INTERNAL SERVICE ERROR"});
}
};

