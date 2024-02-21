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
         required:true
    },

    password:{
        type: String,
        required: true
    },
    url:{
        type:String,
    }
},{timestamps:true}
)

module.exports  = mongoose.model("Users",users)