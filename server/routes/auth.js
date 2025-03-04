const {Router} =  require("express");
const { registerSchema, loginSchema } = require("../common/schema");
const user = require("../models/user");
const jwt = require('jsonwebtoken')

const router = Router();

router.post('/register',async(req,res)=>{
    try{
     
         const body = req.body;
         const data = await registerSchema.safeParse(body);
         if(!data.success){
            return res.send(400).json({
                message:data.error.format()
            })
         }
        
         const existingUserEmail = await user.findOne({email:body.email});
         if(existingUser){
            return res.send(401).json({
                message:"Email already registered"
            })
         }
         
         const existingUsername = await user.findOne({username:body.username});
         if(existingUsername){
            return res.send(401).json({
                message:"Please select a unique username"
            })
         }

              const newUser = await user.create({
                username: body.username,
                email: body.email,
                password: body.password,
                profilePic: body.profilePic || "",
              });

              res.status(200).json({
                message: "User registered successfully",
              });

    }catch(err){
        res.status(500).json({
            messsage:"Error occurred while registering! Try again later",
            error:err
        })
    }
})

router.post('/login',async (req,res)=>{
    try{
      const body = await loginSchema.safeParse(req.body);
      console.log(body)
      if(!body.success){
            return res.status(400).json({
                message:body.error.format()
            })
      }
    
      const userData = await user.findOne({
        $or:[{email:body.data.email},{username:body.data.username}]
      })
      
      if(!userData){
       return res.status(404).json({
            message:"User not found"
        })
      }

      if(userData.password !== body.data.password){
       return res.status(400).json({
            message:"Incorrect password"
        })
      }
       
      const userToken = jwt.sign({
        email:userData.email,
        username:userData.username,
        password:userData.password
      },process.env.JWT_SECKEY,{expiresIn:'7d'});


    res.status(200).json({
        message:"User has been logged in successfully",
        data:{
            userData:userData,
            token:userToken
        }
    });

    }catch(err){
        res.status(500).json({
            message:"Unable to login at this moment",
            error:err
        })
    }
})

module.exports = router;