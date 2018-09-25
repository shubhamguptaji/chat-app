const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
var server = http.createServer(app);

var io = socketIO(server);

io.on("connection", (socket, err) => {
  console.log("new user connected");

  socket.emit("newEmail", {
    message: "hello"
  });

  socket.emit("newMessage", {
    message: "hello",
    to: "guptaji"
  });

  socket.on("createMessage", (Message, err) => {
    console.log("Create Message: ", Message);
  });

  socket.on("disconnect", err => {
    console.log("User was disconnected");
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
