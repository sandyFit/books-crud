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

async function getBookById(req, res) {
    const { id } = req.params;
    if (!id) {
        logger.warn('Book ID is required');
        return res.status(400).json({ message: 'Book ID is required' });
    }

    try {
        const book = await bookService.getBookById(id);

        if (!book) {
            return res.status(404).json({ message: `Book with ID ${id} not found` });
        }

        res.status(200).json({
            message: 'Book fetched successfully',
            data: book
        });
    } catch (error) {
        logger.error(error, 'Failed to fetch book');
        res.status(500).json({ message: 'Server error' });
    }
}

async function updateBook(req, res) {
    const { id } = req.params;
    if (!id) {
        logger.warn('Book ID is required');
        return res.status(400).json({ message: 'Book ID is required' });
    }

    try {
        const updatedBook = await bookService.updateBook(id, req.body);

        if (!updatedBook) {
            return res.status(404).json({ message: `Book with ID ${id} not found` });
        }

        res.status(200).json({
            message: 'Book updated successfully',
            data: updatedBook
        });

    } catch (error) {
        logger.error(error, 'Failed to update book');
        res.status(500).json({ message: 'Server error' });
    }
}



module.exports = {
    getBooks,
    getBookById,
    updateBook
}
