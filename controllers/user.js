const { query } = require("../db/mysql");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.findById = async (req, res) => {
  const id = req.params.id;
  let [result] = await query("SELECT * FROM users WHERE id = ?", [id]);
  if (!result) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.json({
    data: result,
  });
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const created_at = new Date();
  const updated_at = new Date();

  const passwordHash = await bcrypt.hashSync(password, 10);
  const result = await query(
    "INSERT INTO users (username,email,password,created_at,updated_at) VALUES (?,?,?,?,?)",
    [username, email, passwordHash, created_at, updated_at]
  );

  if (!result)
    return res.status(500).json({ message: "Internal Server Error" });

  const { insertId } = result;
  const jwtToken = jwt.sign(
    { userId: insertId, username: username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : "1h",
    }
  );
  return res.json({
    user: {
      id: result.insertId,
      username: username,
      email: email,
      token: jwtToken,
    },
  });
};

// login user
exports.signinUser = async (req, res) => {
  const { username, password } = req.body;
  let [result] = await query("SELECT * FROM users WHERE username = ? ", [
    username,
  ]);
  if (!result) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (await !bcrypt.compareSync(password, result.password)) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }

  const jwtToken = jwt.sign(
    { userId: result.id, username: username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : "4h",
    }
  );

  return res.status(200).json({
    user: {
      id: result.id,
      username: result.username,
      email: result.email,
      token: jwtToken,
    },
  });
};

// User Is already in db
exports.isUser = async (req, res, next) => {
  const { username, email } = req.body;
  let [result] = await query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email]
  );
  if (result) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  next();
};

exports.isAuth = async (req, res) => {
  const username = req.username;
  let [result] = await query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  if (!result) {
    return res.status(200).json({
      message: "User not found",
      data: false,
    });
  }
  res.json({
    data: true,
  });
};

exports.listUser = async (req, res) => {
  // if start and end is not defined, then return all users
  let data = [];
  const { start, end, total } = req.query;
  if (total !== undefined && !start && !end) {
    data= await query("SELECT count(*) as total FROM chat.users where not id = ?",[req.userId]);
    return res.status(200).json({ total: data ? data[0].total : 0 });
  }
 // if start and end is defined, then return users between start and end
  if (start && end) {
    data = await query(
      "SELECT  id ,username, email, status FROM chat.users where not id = ? order by status and id desc limit ?,?",
      [req.userId,start, end]
    );
    if (!data) {
      return res.status(200).json({
        message: "User not found",
        data: false,
      });
    }
  } else {
    data = await query(
        "SELECT id ,username, email, status FROM chat.users where not id = ? order by status and id desc limit 10",[req.userId]
      );
      if (!data) {
        return res.status(200).json({
          message: "User not found",
          data: false,
        });
      }
  }
  res.json({
    data: data,
  });
};
