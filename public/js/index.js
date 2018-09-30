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
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
  // console.log("message: ", message);
  // var li = jQuery("<li></li>");
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  // var li = jQuery("<li></li>");
  // var a = jQuery('<a target="_blank">My Current Location</a>');
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr("href", message.url);
  // li.append(a);
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
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
  var messageBox = jQuery("[name=message]");
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageBox.val()
    },
    function() {
      messageBox.val("");
    }
  );
});

var locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }

  locationButton.attr("disabled", "disabled").text("Sending location...");
  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr("disabled").text("Send location");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr("disabled").text("Send location");
      alert("Unable to fetch location");
    }
  );
});
