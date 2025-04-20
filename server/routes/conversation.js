const express = require("express")
const router = express.Router()
const Conversation = require("../models/conversation")
const Message = require("../models/messages");
const { authorisedUser } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");




router.use(authorisedUser);

//create conversation
router.post("/conversation", async (req, res) => {
    const { createrId, partnerId } = req.body;
  
    try {
      
       if(partnerId === createrId){
        return res.status(400).json({ message: "Invalid IDs" });
       }

      if (!createrId || !partnerId ) {
        return res.status(400).json({ message: "Both user IDs are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(createrId) || !mongoose.Types.ObjectId.isValid(partnerId)) {
        return res.status(400).json({ message: "Invalid createrId or partnerId format" });
      }

      const existingConvo = await Conversation.findOne({
        participants:{
          $all:[createrId,partnerId]
        }
      });
      console.log(existingConvo)
      if(existingConvo){
        return res.status(409).json({
          data:existingConvo,
          message:"Conversation already exists"
        })
      }

      let newConversation = await Conversation.create({
        participants: [createrId, partnerId],
      });

      newConversation = await newConversation.populate("participants", "username profilePic");

        return res.status(200).json({
          message:"Converstion created successfully",
          data:newConversation
        });


    } catch (err) {
  console.log(err)
      res.status(500).json({
        message:"Error while creating a new conversation",
        error:err
      });
    }
  });


//get conversations
router.get("/:userId",async (req,res)=>{
      
const {userId} = req?.params;

if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({ message: "Invalid userId format" });
}

    try{
      
      let userConversations = await Conversation.find({ participants: userId })
                                      .populate("participants","username profilePic")
                                      .sort({updatedAt:-1});

        return res.status(200).json({
          message:"Conversations fetched successfully",
          data:userConversations
         });
    }
    catch(err){
      console.log(err)
        res.status(500).json({
          message:"Unable to find convesations at this moment",
          error:err
        })
    }
})


// saving messages
router.post("/message/send",async(req,res)=>{

const {
  sender,
  conversationId,
  text,
  files,
} = req.body;

try{

    if(!conversationId || !sender ){
      return res.status(400).json({
        message:`Sender Id and Conversation Id are required`
      })
    }
    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid senderId or conversationId format" });
    }

   const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if(!conversation.participants.includes(sender)){
      return res.status(403).json({ message: "You are not authorized to send messages to this conversation" });
    }

    const newMessage = await Message.create({
       conversation:conversationId,
       sender:sender,
       text:text,
       files:files
    });

    conversation.lastMessage = newMessage.text;
    await conversation.save();

      return res.status(200).json({
        message:"message saved successfully",
        data:newMessage
      });
}
catch(err){

   return res.status(500).json({
      messages:"Unable to save message at this moment",
      error:err
    });
}


})

// get messages

router.get("/message/get",async(req,res)=>{

const {userId,convoId} = req.query;
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 20;

if (!userId || !convoId) {
  return res.status(400).json({ message: "userId and conversationId are required" });
}

const conversation = await Conversation.findById(convoId);
if (!conversation) {
  return res.status(404).json({ message: "Conversation not found" });
}

if (!conversation.participants?.includes(userId)) {
  return res.status(403).json({ message: "You are not authorized to view this conversation" });
}


  try{
    const totalMessages = await Message.countDocuments({ conversation: convoId });
    const messages = await Message.find({ conversation: convoId })
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit);
    
      
    return res.status(200).json({
      message: "Messages fetched successfully",
      page,
      limit,
      totalMessages: messages.length,
      data: messages,
    });
  }
    catch(err){
      console.log(err)
      return res.status(500).json({
        message: "Unable to fetch messages at this moment",
        error: err.message,
      });
    }
})


// delete message

router.post("/messages/:messageId",async (req,res)=>{

   try{
       const res = await Message.findByIdAndDelete(req.params.messageId);
   }
   catch(err){
    console.log(err);
   }

  })


module.exports = router