const express = require('express');
const { createUser } = require('../controllers/user');
const { registerValidator, validate } = require('../middlewares/validator');
const router = express.Router();


router.post('/register',registerValidator, validate,createUser); // This is the route that will be called when the user submits the form
// router.post('/login',loginValidator, validate,loginUser); // This is the route that will be called when the user submits the form

module.exports = router;