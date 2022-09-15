import { socket } from "../utils/serverConfig";

function OnlineUser(userInfo) {
  socket.emit("onlineUsers", userInfo, (error) => {
    if (error) {
      alert(error);
    }
  });
}

function outRoom(data) {
  socket.emit("outRoom", data, (error) => {
    if (error) {
      alert(error);
    }
  });
}

function joinRoomIO(data) {
  socket.emit("joinRoom", data, (error) => {
    if (error) {
      alert(error);
    }
  });
}

// function getUsersInRoom(data) {
//   socket.on("roomData", (players) => {
//     dispatch(addPlayers(players.users));
//   });
// }

export { OnlineUser, outRoom, joinRoomIO };
