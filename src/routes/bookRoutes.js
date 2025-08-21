const bookController = require('../controllers/bookController');
const { logger } = require('../logger');
const express = require('express');
const router = express.Router();

router.get('/', bookController.getBooks);

router.get('/:id', bookController.getBookById);

router.put('/:id', bookController.updateBook);

module.exports = router;
