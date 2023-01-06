const jwt = require('jsonwebtoken');
const { query } = require('../db/mysql');
exports.socket = (req, res,next) => {
    let io = res.ns;
    io.on('connection', (socket) => {  
        console.log('User connected : ', socket.id);
        // console engine client count
        console.log('Client count: ', req.io.engine.clientsCount);
        // Disconnect
        socket.on('disconnect', () => {
            console.log("disconnect: ", socket.id);
            socket.disconnect(true);
        });

        const token = socket.handshake.auth.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            socket.username = decoded.username;
        } else{
            socket.userId = null;
            socket.username = null;
            // Disconnect client
            socket.disconnect();
        }
        socket.on('joinRoom',(room)=>{        
            console.log('joinRoom',String(room));
            socket.leave(socket.roomsChanel);
            socket.join(String(room));
            socket.roomsChanel = String(room);
        })

        // Listen for chatMessage
        socket.on('msgToServer', (msg) => {
            console.log(msg);
            // get room name
            const roomsChanel = socket.roomsChanel;
            const userId = socket.userId;
            const username = socket.username;
            const date = new Date();
            // io.emit('message', {msg:msg.msg,user_id:userId,date:date,username});
            io.to(roomsChanel).emit('message', {msg:msg.msg,user_id:userId,date:date,username});
            // Update database       
            query("INSERT INTO chat.messages (msg, user_id,chanel_id,created_at) VALUES (?,?,?,?)", [msg.msg, userId,roomsChanel,date]);
        });

        // Listen for typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', data);
        });

        
    });
    next();
}