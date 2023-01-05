

exports.socket = (req, res,next) => {
    const io = res.io;
    io.on('connection', (socket) => {  
        console.log('New user connected');
        socket.on('authenticate', (data) => {
            console.log(data);
            io.emit('message', 'Welcome to the chat');
        });
    });
    next();
}