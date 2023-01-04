const express = require('express');
const app = express();
const chat = require('./routes/chat');
// env variables
require('dotenv').config();

// public folder
app.use(express.static('public'));
app.use('/', chat);

const {User,findById} = require('./controllers/user');
// Find user by id
app.get('/user/:id',findById);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});