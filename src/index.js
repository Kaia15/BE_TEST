const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const {app,config} = require("./app");
const socketIo = require("socket.io");
const roomHandlers = require("./controllers/Room/room.controller");


//const userModel = require("./models/user.model");
//const taskModel = require("./models/task.model");
app.use(cors);

let server;
//Connect to MongoDB
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log("Connected to MongoDB");
  server = http.createServer({}, app);
  // init socket
  let io = socketIo(server);
  io.on("connection", (socket) => {
    console.log("connected");
    
    // register socket name
    // each sockets represents an user 
    const username = socket.handshake.auth.username;
    socket.username = username;
    t
    socket.on("send-message", (receiver, room_id, message) => {
      roomHandlers.sendMessage(socket.username, room_id, message).then((room) => {
        for (let [id, userSocket] of io.of("/").sockets) {
          console.log(userSocket.username);
          if(userSocket.username == receiver){
            socket.to(userSocket.id).emit("message-received",message)
          }
        }
      });
    });
  });
  server.listen(config.port, () => {
    console.info(`--- Server Started --- http://localhost:${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  // exitHandler();
};

process.on("unhandledRejection", unexpectedErrorHandler);
process.on("uncaughtException", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  // if (server) {
  //   server.close();
  // }
});

// history chat list
// real time
