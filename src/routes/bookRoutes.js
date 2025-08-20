const bookController = require('../controllers/bookController');
const { logger } = require('../logger');
const express = require('express');
const router = express.Router();

router.get('/', bookController.getBooks);

module.exports = router;
