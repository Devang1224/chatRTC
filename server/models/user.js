const mongoose = require("mongoose")

const schema = mongoose.Schema

const users = new schema(
{
    username:{
        type:String,
        unique: true,
        required: true
    },

    email:{
         type:String,
         unique:true,
         required:true,
    },

    password:{
        type: String,
        required: true
    },
    profilePic:{
        type:String,
    }
},{timestamps:true}
)

module.exports  = mongoose.model("Users",users)