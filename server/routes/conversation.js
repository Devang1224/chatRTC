const express = require("express")
const router = express.Router()
const convo = require("../models/conversation")
const message = require("../models/messages")



//saving convo
router.post("/conversation", async (req, res) => {
    const { userData, receiverData,senderData } = req.body;
  
    try {
      // Check if the conversation already exists
      const existingConvo = await convo.findOne({
        $or: [
          {
            "userData.userId": userData.userId,
            "receiverData.receiverId": receiverData.receiverId
          },
          {
            "userData.userId": receiverData.receiverId,
            "receiverData.receiverId": userData.userId
          }
        ]
      });

      if (existingConvo) {
        // Conversation already exists, return it without saving
        res.status(200).json("already exists");
      } else {
        // Conversation does not exist, save it
        const newConvo = new convo(req.body);
        const savedConvo = await newConvo.save();
        res.status(200).json(savedConvo);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });


//get convos
router.get("/:userId",async(req,res)=>{
      
    try{
        const convos = await convo.find(
            {
                $or: [
                  { "userData.userId": req.params.userId },
                  { "receiverData.receiverId": req.params.userId }
                ]
              }
        );
         res.status(200).json(convos);
    }
    catch(err){
        res.status(500).json(err)
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