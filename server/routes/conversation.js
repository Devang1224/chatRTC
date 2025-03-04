const express = require("express")
const router = express.Router()
const Conversation = require("../models/conversation")
const message = require("../models/messages")



//create conversation
router.post("/conversation", async (req, res) => {
    const { createrId, partnerId } = req.body;
  
    try {
      // Check if the conversation already exists
      const existingConvo = await Conversation.findOne({
        $or: [
          { createrId: createrId, partnerId: partnerId },
          { createrId: partnerId, partnerId: createrId }
        ]
      });

      if (!existingConvo) {
        // Conversation does not exist, save it
        const newConversation =  await Conversation.create({createrId,partnerId});
        return res.status(200).json({
          message:"Converstion created successfully",
          data:newConversation
        });
      }
      else{
        return res.status(200).json({
          message:"Conversation already exists"
        })
      }
    } catch (err) {
      res.status(500).json({
        message:"Error while creating a new conversation",
        error:err
      });
    }
  });


//get conversations
router.get("/:userId",async(req,res)=>{
      
const {userId} = req?.params?.userId;

if (!mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({ message: "Invalid userId format" });
}

    try{
      const userConversations = await Conversation.find({
        $or: [{ createrId: userId }, { partnerId: userId }],
      }).sort({updatedAt:-1})
        .populate("createrId","username email profilePic")
        .populate("partnerId","username email profilePic");
        
         res.status(200).json({
          message:"Conversations fetched successfully",
          data:userConversations
         });
    }
    catch(err){
        res.status(500).json({
          message:"Unable to find convesations at this moment",
          error:err
        })
    }
})


// saving messages
router.post("/messages",async(req,res)=>{

const newMessage =  new message(req.body)

try{
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
}
catch(err){
    res.status(500).json(err);
}


})

// get messages

router.get("/messages/:convoId",async(req,res)=>{

    try{
        const messages = await message.aggregate([

            {
                $match:{conversationId:req.params.convoId}
            },
             {
                $sort:{createdAt:1}
             },
             {
                $project:{
                    senderId:1,
                    text:1,
                    senderImage:1
                }
            }
        ]); 

        res.status(200).json(messages);

    }
    catch(err){
      res.status(500).json(err)
    }
})


// delete message

router.post("/messages/:messageId",async (req,res)=>{

   try{
       const res = await message.findByIdAndDelete(req.params.messageId);
   }
   catch(err){
    console.log(err);
   }

  })


module.exports = router