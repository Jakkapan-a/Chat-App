const jwt = require('jsonwebtoken');
exports.socket = (req, res,next) => {
    const io = res.io;
    io.on('connection', (socket) => {  
        // Authenticate user
        const token = socket.handshake.auth.token;
        console.log("Token :",token);
        // Disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('joinRoom',(room)=>{
            console.log("Join Room :",room);

            const roomToLeave = Object.keys(socket.rooms).find(item => item !== socket.id);

            console.log("Room to leave :",roomToLeave);
        })
    });
    next();
}