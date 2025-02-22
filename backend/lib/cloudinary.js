import {v2 as cloudinary} from "cloudinary";
import {config} from "dotenv"

config(); // for accessing env variables

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


export default cloudinary; //exporting cloudinary instance so we can use it later on