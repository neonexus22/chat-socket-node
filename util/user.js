let users = [];

// Join user to room
function joinUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);

  return user;
}

// Get current user;
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves the chat
function userLeave(id) {
  const user = getCurrentUser(id);
  users = users.filter((user) => user.id !== id);
  return user;
}

// Get users of a room
function getRoomUsers(room) {
  console.log("my room", room);
  const u = users.filter((user) => user.room === room);
  console.log("the users", u);
  return u;
}

module.exports = {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
