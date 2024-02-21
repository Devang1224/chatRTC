const express = require("express");
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const conversationRoute = require("./routes/conversation")
const cors = require('cors')
const connectDB = require('./Db/db');
const socketio = require('socket.io');
const http = require('http');

const app = express();

app.use(cors({
     origin: "https://chatrtc.netlify.app" // https://chatrtc.netlify.app  //http://localhost:3001
  }));
app.use(express.json());

require('dotenv').config()
connectDB(); //establishing mongodb connection

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: "https://chatrtc.netlify.app",
      methods: ["GET", "POST"]
    }
  });;



app.use("/user",userRoute);
app.use("/chat",conversationRoute)

const userToSocket = new Map();
const socketToUser = new Map();


//sender -> receiver

io.on("connection", (socket) => {


socket.on("userJoinedTheChat",(data)=>{  
  const {User} = data;
  userToSocket.set(User,socket.id);
  socketToUser.set(socket.id,User);
})

   //chat room + video calling room
    socket.on("privateChat",(data)=>{  
      const{convoid:roomId,username:User} = data;          // roomId is convoId  ( destructring of objects)
        userToSocket.set(User,socket.id);
        socketToUser.set(socket.id,User);
        socket.join(roomId);
    })
      
   // when a user press the videocall button 
    socket.on("roomJoined",(data)=>{
      const{convoId:roomId,User,Receiver} = data;   

    const receiverid = userToSocket.get(Receiver)
    io.to(receiverid).emit("user-joined",{User,id:socket.id});

    const UserId = userToSocket.get(User)
    io.to(UserId).emit("setremoteidfor-user",{Receiver,receiverid}); // sending the receiver's socket id back to the user

    const user = socketToUser.get(socket.id)
    })


socket.on("modalaccepted",({to})=>{
io.to(to).emit("youcancallusernow");

})


// calling the user
socket.on("user:call", ({to, offer }) => {
   if(to){
    io.to(to).emit("incomming:call", { from: socket.id, offer });
   }
    const user = socketToUser.get(socket.id)
});


// on call accepted
socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });  

});


//handling negotiation
socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });   

});

socket.on("peer:nego:done", ({ to, ans }) => {

    io.to(to).emit("peer:nego:final", { from: socket.id, ans });   

});



// on call rejected
socket.on("callRejected",({to})=>{
  io.to(to).emit("RejectedCall")
})





    //sending messages
    socket.on("newMessage",(message)=>{
       io.to(message.conversationId).emit('Message', message);
    })


  });


  server.listen(process.env.PORT || 6010 , () => console.log(`Server has started.`));


