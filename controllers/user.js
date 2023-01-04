const { query } = require("../db/mysql");
require('dotenv').config();
const jwt = require('jsonwebtoken');
exports.findById = async (req,res) => {
    const id = req.params.id;
    let [result] = await query('SELECT * FROM users WHERE id = ?', [id]);
    if(!result){
        return res.status(404).json({
            message: 'User not found'
        });
    }
    res.json({
        data: result
    });
}

// Create a new user 
exports.createUser = async (req,res) => {
    const {username,email,password} = req.body;
    const created_at = new Date();
    const updated_at = new Date();
    const result = await query('INSERT INTO users (username,email,password,created_at,updated_at) VALUES (?,?,?,?,?)', [username,email,password,created_at,updated_at]);
    
    if(!result) return res.status(500).json({ message: 'Internal Server Error' });

    const {insertId} = result;
    const jwtToken = jwt.sign({userId: insertId}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN? process.env.JWT_EXPIRES_IN : '1h' });
    res.json({
        user: {
            id: result.insertId,
            username: result.username,
            email: result.email,
            token: jwtToken
        }
    });
}

// login user
exports.loginUser = async (req,res) => {
    const {username,password} = req.body;

    let [result] = await query('SELECT * FROM users WHERE username = ? ', [username]);
    if(!result){
        return res.status(404).json({
            message: 'User not found'
        });
    }


    res.json({
        data: result
    });
}