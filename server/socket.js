const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");


const userToSocket = new Map();
const socketToUser = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
       origin: "http://localhost:3001",     // https://chatrtc.netlify.app  // http://localhost:3001
       methods: ["GET", "POST"],
    },
  });


   function verifyToken(token,next,socket){ 
    if (!token) {
      console.log("No token provided, disconnecting socket");
      return next(new Error("Authentication error"));
    }
    
    try {
      const decoded =  jwt.verify(token, process.env.JWT_SECKEY);
      console.log("decoded",decoded);
      socket.user = decoded; 
      next();
    } catch (error) {
      console.log("Invalid token, disconnecting socket",error);
      return next(new Error("Authentication error"));
    }
  }


  io.use((socket, next) => {
 
    const token = socket.handshake.auth?.token; 
    verifyToken(token,next,socket);
  });

  io.on("connection", (socket) => {

    console.log(`User connected: ${socket.user.username}`);

   
    socket.on("userJoinedTheChat", (data) => {
      console.log('userData',data)
      const { User } = data;
      userToSocket.set(User, socket.id);
      socketToUser.set(socket.id, User);

         // socket.emit("is_online", true);
     console.log("online users",userToSocket);
     // Send online users to all connected clients
    //  io.emit("getOnlinUsers", Array.from(userToSocket.keys()));
 

    });
   //chat room + video calling room
    socket.on("privateChat", (data) => {
      const { convoid: roomId, username: User } = data;
      console.log("roomData",data) ;
      userToSocket.set(User, socket.id);
      socketToUser.set(socket.id, User);
      socket.join(roomId);
    });

  
  // when a user press the videocall button 
    socket.on("roomJoined", (data) => {
      const { convoId: roomId, User, Receiver } = data;
      const receiverid = userToSocket.get(Receiver);

      io.to(receiverid).emit("user-joined", { User, id: socket.id });
      io.to(userToSocket.get(User)).emit("setremoteidfor-user", {
        Receiver,
        receiverid,
      });
    });

    socket.on("modalaccepted", ({ to }) => {
      io.to(to).emit("youcancallusernow");
    });

    socket.on("user:call", ({ to, offer }) => {
      if (to) io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("callRejected", ({ to }) => {
      io.to(to).emit("RejectedCall");
    });

    socket.on("newMessage", (message) => {
      io.to(message.conversationId).emit("Message", message);
    });

    socket.on("disconnect", () => {
      const user = socketToUser.get(socket.id);
      socketToUser.delete(socket.id);
      userToSocket.delete(user);
      console.log(`User disconnected: ${user}`);
    });
  });
}

module.exports = { setupSocket };
