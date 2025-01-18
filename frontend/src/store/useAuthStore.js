import axios from "axios";
import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set) =>({
    authUser:null, //we dont know if user is authenticated
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

    checkAuth: async()=>{ //trying to req the endpoint in backend /check route
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data});
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



   

}));