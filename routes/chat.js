const express = require('express');
const { socket } = require('../socket/socket');
const router = express.Router();

router.get('/', (req, res) => {
    // Send the index.html file in the public folder
    res.sendFile('index.html', { root: __dirname + '/../views' });
});
// Login Page
router.get('/room', (req, res) => {
    res.sendFile('room.html', { root: __dirname + '/../views' });
});
// Register Page
router.get('/register', (req, res) => {
    // Send the register.html file in the public folder
    res.sendFile('register.html', { root: __dirname + '/../views' });
});
// Chat Page
router.get('/chat',socket, (req, res) => {
    // Send the chat.html file in the public folder
    res.sendFile('chat.html', { root: __dirname + '/../views' });
});
module.exports = router;