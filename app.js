const express = require('express');
const app = express();
const chat = require('./routes/chat');
const user = require('./routes/user');
const massage = require('./routes/massage');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Socket.io
const server =app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const socket = require('socket.io');
const io = socket(server,{

    serveClient: true,
    cors: {
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use((req, res, next) => {    
    // io engine is added to the request object
    req.io = io;
    
    res.ns = io.of('/chat');
    next();
});

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api',user);
app.use('/msg', massage);
app.use('/', chat);
// If no route is matched by now, it must be a default 
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});



