const {Router} =  require("express");
const { registerSchema, loginSchema } = require("../common/schema");
const user = require("../models/user");
const jwt = require('jsonwebtoken');
const { getRandomGradient } = require("../utils/getRandomBackgroundColor");

const router = Router();

router.post('/register',async(req,res)=>{
    try{
     
         const body = req.body;
         const data = await registerSchema.safeParse(body);
         console.log("data",data)
         if(!data.success){
            return res.status(400).json({
                message:data.error.format()
            })
         }
        
         const existingUserEmail = await user.findOne({email:body.email});
         if(existingUserEmail){
            return res.status(401).json({
                message:"Email already registered"
            })
         }
         
         const existingUsername = await user.findOne({username:body.username});
         if(existingUsername){
            return res.status(401).json({
                message:"Please select a unique username"
            })
         }
           let randomGradient = getRandomGradient();

              const newUser = await user.create({
                username: body.username.trim(),
                email: body.email.trim(),
                password: body.password.trim(),
                profilePic: body.profilePic || "",
                profileGradient:randomGradient,
              });

            return res.status(200).json({
                message: "User registered successfully",
                success:true 
              });

    }catch(err){
        console.log("err",err)
        res.status(500).json({
            messsage:"Error occurred while registering! Try again later",
            error:err
        })
    }
})

router.post('/login',async (req,res)=>{
    try{
      const body = await loginSchema.safeParse(req.body);

      if(!body.success){
            return res.status(400).json({
                message:body.error.format()
            })
      }
    
      const userData = await user.findOne({
        $or:[
            {email:{ $regex: new RegExp(body.data.userDetail, "i")}},
            {username:{ $regex: new RegExp(body.data.userDetail, "i")}}
          ]
      })
      
      if(!userData){
       return res.status(404).json({
            message:"User not found"
        })
      }

      if(!userData.comparePassword(body.data.password)){
       return res.status(400).json({
            message:"Incorrect password"
        })
      }
       
      const userToken = jwt.sign({
        email:userData.email,
        username:userData.username,
      },process.env.JWT_SECKEY,{expiresIn:'7d'});

     userData.password = undefined;

    res.status(200).json({
        message:"User has logged in successfully",
        data:{
            userData:userData,
            token:userToken
        },
        success:true
    });

    }catch(err){
        res.status(500).json({
            message:"Unable to login at this moment",
            error:err
        })
    }
})

module.exports = router;