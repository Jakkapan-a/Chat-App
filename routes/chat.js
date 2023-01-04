const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Send the index.html file in the public folder
    res.sendFile('index.html', { root: __dirname + '/../public' });
});
// Login Page
router.get('/room', (req, res) => {
    res.sendFile('room.html', { root: __dirname + '/../public' });
});
// Register Page
router.get('/register', (req, res) => {
    // Send the register.html file in the public folder
    res.sendFile('register.html', { root: __dirname + '/../public' });
});

module.exports = router;