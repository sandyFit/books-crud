const bookService = require('../services/bookService');
const { logger } = require('../logger');

async function getBooks(req, res) {
    try {
        const books = await bookService.getBooks();

        res.status(200).json({
            message: "List of books retrieved successfully",
            data: books
        }) 
    } catch (error) {
        logger.error(error, "Failed to read books");
        res.status(500).json({ message: "Server error" });
    }
    
}

module.exports = {
    getBooks
}
