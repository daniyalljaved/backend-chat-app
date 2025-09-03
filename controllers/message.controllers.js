
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.models.js"
export const sendMessage=async(req,res)=>{
    try {
       
        const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;



       let conversation=await Conversation.findOne(
        {
            participants:{$all:[senderId,receiverId]}
        }
       );
       if(!conversation)
       {
        conversation=await Conversation.create({
              participants:[senderId,receiverId]
        })
       }
       const newMessage= new Message({
        senderId: senderId,
        receiverId :receiverId,
        message:message}
       )
       if(newMessage){
        conversation.messages.push(newMessage._id)
       }
       await newMessage.save();
    await conversation.save();
	   
       return res.status(201).json({newMessage})
       
       


    } catch (error) {
        console.log(error.message)
        res.status(500).json({error:"internalerror"});
    }

}
export const getMessage=async(req,res)=>
{
    try {
        const {id:userToChat}=req.params;
        const senderId=req.user._id;



        const conversation= await Conversation.findOne({
            participants:{$all:[senderId,userToChat]}
        }).populate("messages");
        res.status(200).json(conversation.messages)
        if(!conversation){
            return res.staus(200).json([]);
        }
        
    } catch (error) {
         console.log(error.message)
        res.status(500).json({error:"internalgeterror"});
        
    }
}