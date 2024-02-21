const express = require("express")
const router = express.Router()
const user = require("../models/user")


// register
router.post("/register",async (req,res)=>{
   const name = (req.body.username).trim();
    const newUser = new user({
        username: name,
        email: req.body.email,
        password: req.body.password,
        url:req.body.url
    })

   try{
        const savedUser = await newUser.save();
        res.status(200).json({savedUser,id:savedUser._id});
    }

    catch(err){
      res.status(400).json("Username already exists")
    }

})

router.post("/login", async (req, res) => {
    try {
        const userData = await user.findOne({ username: req.body.username });

        if(!userData)
        {
            res.status(400).json("User not found")
        }

        else if(userData?.password == req.body.password){
         const data = {
                      id: userData.id,
                      username: userData.username,
                      url:userData.url
                     };
         res.status(200).json(data);
       }
       else{
        res.status(401).json("Incorrect password");

       }

    } catch (err) {
        res.status(500).json(err.message);
    }
});

// find user
router.post("/find", async (req, res) => {
    const query = req.body.username;
  
    try {
      const users = await user.find({ username: { $regex: query, $options: "i" } });
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json(err);
    }
  });



module.exports = router