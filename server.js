const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const formatMessage = require("./util/messages");
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./util/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "Chat Bot";

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  const id = uuidv4();
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(id, username, room);
    // join the user to a room
    socket.join(user.room);

    // To welcome a new user
    socket.emit(
      "message",
      formatMessage(botName, `Hi ${username}, Welcome to ${room}`)
    );

    //Boradcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined ${user.room}`)
      );

    // Send users and room into
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat message sent
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(id);
    if (user) {
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    }
  });

  // Send a disconnection message when client leaves
  socket.on("disconnect", () => {
    const user = userLeave(id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} left the chat`)
      );
      // Send user and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port " + PORT));
