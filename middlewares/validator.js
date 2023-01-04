const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
// Register Validator
exports.registerValidator = [check('username', 'Username is required').not().isEmpty(),
check('email', 'Please include a valid email').isEmail(),
check('password', 'Please enter a password with 6 or more characters').isLength({min: 6}),
check('confirm_password', 'Passwords do not match').custom((value, {req}) => value === req.body.password)];
// Login Validator
exports.signinValidator = [
check('username', 'Please include a valid email').not().isEmpty(),
check('password', 'Password is required').exists()];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

exports.isTokenValid = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
    try {
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }
};