const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validators");
const { Users } = require("./utils/users");

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
var server = http.createServer(app);
var users = new Users();

var io = socketIO(server);

io.on("connection", (socket, err) => {
  console.log("new user connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required!");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app!")
    );
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined!`)
      );
    callback();
  });

  socket.on("createMessage", (Message, callback, err) => {
    console.log("Create Message: ", Message);
    var user = users.getUser(socket.id);
    if (user && isRealString(Message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, Message.text)
      );
    }
    callback();
  });

  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on("disconnect", err => {
    console.log("User was disconnected");
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left`)
      );
    }
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
