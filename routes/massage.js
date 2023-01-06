const express = require('express');
const { getChanel } = require('../controllers/massage');
const { isTokenValid } = require('../middlewares/validator');
const router = express.Router();

router.post('/',isTokenValid,getChanel);
module.exports = router;