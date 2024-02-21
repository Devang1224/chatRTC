const mongoose = require("mongoose")

const conversation = new mongoose.Schema(
    {
       userData:{

            userId:{
                type:String
            },
            userName:{
                type:String
             },
            userImage:{
                type:String
            }
        },

        receiverData:{
               
            receiverId:{
                type:String
            },
            receiverName:{
                type:String
            },
            receiverImage:{
                type:String
            }
        },

        senderData:{
               
            senderId:{
                type:String
            },
            senderName:{
                type:String
            },
            senderImage:{
                type:String
            }
        }


    },{timestamps:true}
);

module.exports = mongoose.model("conversations",conversation)