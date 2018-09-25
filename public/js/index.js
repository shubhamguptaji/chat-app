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

socket.on("newLocationMessage", function(message) {
  var li = jQuery("<li></li>");
  var a = jQuery("<a target=\"_blank\">My Current Location</a>");
  li.text(`${message.from}: `);
  a.attr("href", message.url);
  li.append(a);
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

var locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      alert("Unable to fetch location");
    }
  );
});
