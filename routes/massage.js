const express = require('express');
const { getChanel, getHistory } = require('../controllers/massage');
const { isTokenValid } = require('../middlewares/validator');
const router = express.Router();

router.post('/',isTokenValid,getChanel);
router.post('/history',isTokenValid,getHistory);
module.exports = router;