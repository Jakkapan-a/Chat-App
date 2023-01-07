const jwt = require("jsonwebtoken");
const { query } = require("../db/mysql");

exports.socket = (req, res, next) => {
  if (!req.io.sockets._events.connection) {
    let ns = res.ns;
    req.io.on("connection", (socket) => {
      socket.emit("ns", { ns: "/chat" });
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.username = decoded.username;
      } else {
        socket.userId = null;
        socket.username = null;
        // Disconnect client
        socket.disconnect();
      }
    //   socket.emit("userUpdate", await listUser(socket.userId));
    });

    ns.on("connection", (socket) => {
      console.log("User connected : ", socket.id);
      // console engine client count
      console.log("Client count: ", req.io.engine.clientsCount);
      // Disconnect

      socket.on("disconnect", () => {
        console.log("disconnect: ", socket.id);
        socket.disconnect(true);
      });
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.username = decoded.username;
      } else {
        socket.userId = null;
        socket.username = null;
        // Disconnect client
        socket.disconnect();
      }
      socket.on("joinRoom", (room) => {
        let roomName = "room_" + room.toString();
        let roomNameOld = "room_" + socket.roomsChanel;
        console.log("joinRoom : ", roomName);
        socket.leave(roomNameOld);
        socket.join(roomName);
        socket.roomsChanel = room;
        // Update message
      });

      // Listen for chatMessage
      socket.on("msgToServer", (msg) => {
        console.log(msg);
        // get room name
        const roomsChanel = socket.roomsChanel;
        const userId = socket.userId;
        const username = socket.username;
        const date = new Date();
        // io.emit('message', {msg:msg.msg,user_id:userId,date:date,username});
        ns.to("room_" +socket.roomsChanel.toString()).emit("message", {
          msg: msg.msg,
          user_id: userId,
          date: date,
          username,
        });
        // Update database
        query(
          "INSERT INTO chat.messages (msg, user_id,chanel_id,created_at) VALUES (?,?,?,?)",
          [msg.msg, userId, roomsChanel, date]
        );
      });

      // Listen for typing
      socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
      });
    });
  }
  next();
};

const listUser = async (id) => {
  const data = await query(
    "SELECT id ,username, email, status FROM chat.users where not id = ? order by status and id desc limit 10",
    [id]
  );
//   console.log(data);
  return data;
};
