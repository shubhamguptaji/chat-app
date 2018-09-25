const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
var server = http.createServer(app);

var io = socketIO(server);

io.on("connection", (socket, err) => {
  console.log("new user connected");

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app!")
  );

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "new user joined!")
  );
  socket.on("createMessage", (Message, callback, err) => {
    console.log("Create Message: ", Message);

    io.emit("newMessage", generateMessage(Message.from, Message.text));
    callback();
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", err => {
    console.log("User was disconnected");
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
