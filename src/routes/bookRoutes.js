const bookController = require('../controllers/bookController');
const { logger } = require('../logger');
const express = require('express');
const router = express.Router();

router.post('/', bookController.registerBook);

router.get('/', bookController.getBooks);

router.get('/:id', bookController.getBookById);

router.put('/:id', bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

module.exports = router;
