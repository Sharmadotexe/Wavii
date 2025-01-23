import axios from "axios";
import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5005" :"/";


export const useAuthStore = create((set,get) =>({
    authUser:null, //we dont know if user is authenticated
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers: [],
    isCheckingAuth:true,
    socket:null,

    checkAuth: async()=>{ //trying to req the endpoint in backend /check route
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data});

            get().connectSocket()

        } catch (error) {
            console.log("error in checkAuth", error);
            set({authUser:null});
            
        } finally{
            set({isCheckingAuth:false});
            
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try {
           const res = await axiosInstance.post("/auth/signup", data);
           set({authUser:res.data});
           toast.success("Account created Successfully");

           get().connectSocket()


        } catch (error) {
           toast.error(error.response.data.message);
        }
        finally{
           set({isSigningUp:false}); 
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logout Successfully");

            get().disconnectSocket()
        } catch (error) {
            //will print message comming from backend
           toast.error(error.response.data.message); 
        }
    },

    login: async(data)=>{
        try {
            set({ isLoggingIn: true });
          const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("LogIn Successfully");

            //after login immediatly connect to socket
            get().connectSocket()

        } catch (error) {
           toast.error(error.response.data.message); 
        }
        finally{
            set({isLoggingIn:false});
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },


      connectSocket: ()=>{
        const {authUser} = get();

        if(!authUser|| get().socket?.connected) return;

        const socket = io(BASE_URL,{
          query:{
            userId:authUser._id,
          },
        });
        socket.connect();
        
        set({socket:socket});

        //for listining //getting user id as data and updating online users with it
        socket.on("getOnlineUsers", (userIds)=>{
          set({onlineUsers:userIds});
        })
      },


      disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();
      },



   

}));