const express = require('express');
const app = express();
const chat = require('./routes/chat');
const user = require('./routes/user');
const bodyParser = require('body-parser');
const cors = require('cors');
// require('express-async-errors');

require('dotenv').config();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', chat);
app.use('/api',user)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});