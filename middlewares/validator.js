const {check, validationResult} = require('express-validator');

// Register Validator
exports.registerValidator = [check('username', 'Username is required').not().isEmpty(),
check('email', 'Please include a valid email').isEmail(),
check('password', 'Please enter a password with 6 or more characters').isLength({min: 6}),
check('confirm_password', 'Passwords do not match').custom((value, {req}) => value === req.body.password)];

// Login Validator
exports.loginValidator = [
check('email', 'Please include a valid email').isEmail(),
check('password', 'Password is required').exists()];


exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};