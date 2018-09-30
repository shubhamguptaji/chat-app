var socket = io();

function scrollToBottom() {
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function() {
  console.log("Connected to Server!");
  //   socket.emit("createMessage", {
  //     to: "shubham@gmail.com",
  //     text: "hello guptaji"
  //   });
  var params = jQuery.deparam(window.location.search);
  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "./";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from Server!");
});

socket.on("updateUserList", function(users) {
  console.log(users);
  var ol = jQuery("<ol></ol>");
  users.forEach(function(user) {
    ol.append(jQuery("<li></li>").text(user));
  });

  jQuery("#users").html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
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
