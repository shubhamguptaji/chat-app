var socket = io();
socket.on("connect", function() {
  console.log("Connected to Server!");

  socket.emit("createMessage", {
    to: "shubham@gmail.com",
    message: "hello guptaji"
  });
});
socket.on("disconnect", function() {
  console.log("Disconnected from Server!");
});
socket.on("newMessage", function(message) {
  console.log("message: ", message);
});

socket.on("newEmail", function(email) {
  console.log("New Email");
  console.log(email);
});
