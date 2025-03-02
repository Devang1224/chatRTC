const jwt = require('jsonwebtoken');
const user = require('../models/user');

 async function authorisedUser(req,res,next){
    try{
         const tokenHeader = req.headers?.authorization || "";
         let token;
         if(tokenHeader && tokenHeader.startsWith("Bearer")){
            token = tokenHeader.split(" ")[1];
         }
         if(!token){
          return res.status(401).json({message:"Unauthorized access, token is missing",error:err})
         }
    
         let decodedData;
         try{
            decodedData = await jwt.verify(token,process.env.JWT_SECKEY);
         }catch(err){
                return res.status(401).json({
                    message:"Invalid or expired token",
                    error:err
                })
          }
          
          const userData = await user.findOne({
            $or:[{email:decodedData.email},{username:decodedData.username}]
          }).select("-password");
          if(!userData){
            return res.status(404).json({
                message:"User not found"
            })
          }

           req.user = user;
           next();

    }catch(err){
        res.status(500).json({message:"Authorization failed",error:err})
    }
}

module.exports = {
    authorisedUser
}