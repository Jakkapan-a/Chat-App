const express = require('express');
const { createUser, isUser, signinUser, isAuth } = require('../controllers/user');
const { registerValidator, validate, signinValidator, isTokenValid } = require('../middlewares/validator');

const router = express.Router();


router.post('/register',registerValidator, validate,isUser,createUser); // This is the route that will be called when the user submits the form
router.post('/signin',signinValidator, validate,signinUser); // This is the route that will be called when the user submits the form
router.post('/is-user',isTokenValid,isAuth); // This is the route that will be called when the user submits the form

module.exports = router;