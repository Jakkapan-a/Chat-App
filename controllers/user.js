const { query } = require("../db/mysql");

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
    const {name,email,password} = req.body;
    const created_at = new Date();
    const updated_at = new Date();
    let result = await query('INSERT INTO users (name,email,password,created_at,updated_at) VALUES (?,?,?,?,?)', [name,email,password,created_at,updated_at]);
    res.json({
        data: result
    });
}