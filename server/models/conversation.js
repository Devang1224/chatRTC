const mongoose = require("mongoose")

const conversation = new mongoose.Schema(
    {
       userData:{

            userId:{
                type:String,
                required:true
            },
            userName:{
                type:String,
                required:true

             },
            userImage:{
                type:String
            }
        },

        receiverData:{
               
            receiverId:{
                type:String,
                required:true

            },
            receiverName:{
                type:String,
                required:true

            },
            receiverImage:{
                type:String
            }
        },

        senderData:{
               
            senderId:{
                type:String,
                required:true
            },
            senderName:{
                type:String,
                required:true
            },
            senderImage:{
                type:String
            }
        },

        messages:[
            {
                senderId: {
                  type: String,
                },
                text: {
                  type: String,
                },
                files:{
                  type:String
                },
                createdAt:{
                    type:Date,
                    default:Date.now()
                }
            
              },
        ]

 
    },{timestamps:true}
);

module.exports = mongoose.model("conversations",conversation)