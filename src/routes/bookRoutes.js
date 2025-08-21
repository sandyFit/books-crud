const bookController = require('../controllers/bookController');
const { logger } = require('../logger');
const express = require('express');
const router = express.Router();

router.get('/', bookController.getBooks);

router.get('/:id', bookController.getBookById);

module.exports = router;
