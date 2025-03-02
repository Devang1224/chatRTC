const express = require("express")
const router = express.Router()
const user = require("../models/user")
const { authorisedUser } = require("../middleware/auth");




router.use(authorisedUser);

// find users
router.post("/find", async (req, res) => {
    const {username} = req.body;
     const limit = req.body.limit || 20;
     const page = req.body.page || 1;

    try {
      const users = await user.find({ username: { $regex: username, $options: "i" } }).select("-password")
                              .limit(limit) 
                              .skip(limit*(page-1))
                              .sort({createdAt:-1});


       return res.status(200).json({
         message:"Users fetched successfully",
         data:users
      });
    } catch (err) {
      res.status(404).json(err);
    }
  });


 router.put("/updateProfilePic",async(req,res)=>{
  try{
      const {
        userId,
        profilePic
      } = req.body;

      // getting the profilepic link via firebase
      const updatedUserDetails = await user.findByIdAndUpdate({profilePic:profilePic}).select("-password");
      return res.status(200).json({
        message:"Profile picture updated successfully",
        data:{
          profilePic:updatedUserDetails?.profilePic
        }
      })


  }catch(err){
    return res.status(500).json({
      message:"Error while updating the profile picture"
    })
  }
 })


module.exports = router