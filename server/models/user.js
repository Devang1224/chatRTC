const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const schema = mongoose.Schema

const UserSchema = new schema(
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
    },
    profileGradient:{
      type:String
    }
},{timestamps:true}

);

UserSchema.pre("save",async function (next){
    if (!this.isModified("password")) {
        next();
      }
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });

    UserSchema.methods.comparePassword = async function (candidatePassword, next) {
        try {
          const isMatch = await bcrypt.compare(candidatePassword, this.password); 
          return isMatch;
        } catch (error) {
          next(error);
        }
      };


module.exports = mongoose.model("User", UserSchema);