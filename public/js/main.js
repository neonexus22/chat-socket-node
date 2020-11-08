const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const userList = document.getElementById("users-ul");
const roomName = document.getElementById("roomName");

// Get query params from the url for chat.html
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, room });

// Get room info and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  displayMessage(message);

  // Scroll to the latest message down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// On submit
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = event.target.elements.msg.value;

  // Send a message to server
  socket.emit("chatMessage", message);

  // Reset/Clear form input
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});

// Display message to chat window
function displayMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
      ${msg.message}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Display room in chat window
function outputRoomName(room) {
  roomName.innerText = room;
}

// Display user in chat window
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
