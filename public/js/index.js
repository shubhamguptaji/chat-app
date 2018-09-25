var socket = io();
socket.on("connect", function() {
  console.log("Connected to Server!");

  //   socket.emit("createMessage", {
  //     to: "shubham@gmail.com",
  //     text: "hello guptaji"
  //   });
});
socket.on("disconnect", function() {
  console.log("Disconnected from Server!");
});
socket.on("newMessage", function(message) {
  console.log("message: ", message);
  var li = jQuery("<li></li>");
  li.text(`${message.from}: ${message.text}`);
  jQuery("#messages").append(li);
});

// socket.on("newEmail", function(email) {
//   console.log("New Email");
//   console.log(email);
// });

// socket.emit(
//   "createMessage",
//   {
//     from: "shubham",
//     text: "hi"
//   },
//   function() {
//     console.log("Got it");
//   }
// );

jQuery("#message-form").on("submit", function(e) {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: jQuery("[name=message]").val()
    },
    function() {}
  );
});
