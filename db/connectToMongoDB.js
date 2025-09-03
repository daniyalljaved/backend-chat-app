import mongoose from "mongoose";
const connecttoMongoDB= async ()=>
{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("conect to db")
    } catch (error) {
        console.log("eror db",error.message)
    }
} 
export default connecttoMongoDB;
