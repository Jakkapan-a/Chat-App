const jwt = require('jsonwebtoken');
exports.socket = async (req, res,next) => {
    const io = res.io;
    io.on('connection', (socket) => {  
        // Authenticate user
        socket.on('authenticate', (data) => {
        const {token} = data;
            if(!token){
                socket.emit('unauthorized', {message: 'No token provided', data: true});
            }
            try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.emit('message', {user: decoded});
            } catch (err) {
                res.status(401).json({msg: 'Token is not valid'});
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    next();
}