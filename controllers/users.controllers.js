import User from "../models/user.model.js"

export const getUsersFromSidebar=async(req,res)=>
{
try {
    const loginUser=req.user._id
    const filteredUser= await User.find({_id:{$ne:loginUser}}).select("password")
    res.status(200).json(filteredUser)
    
} catch (error) {
    res.status(500).json({error:"internal error"})
    
}
}