const fs = require('fs').promises;
const { logger } = require('../logger');

const BOOKS_FILE = './src/data/books.json';

/**
 * Reads the books data file and parses its JSON content.
 *
 * This function:
 *  - Reads the contents of the JSON file defined in `BOOKS_FILE`.
 *  - Parses the JSON string into a JavaScript array of book objects.
 *  - Returns an empty array if the file cannot be read or parsed.
 *
 * @async
 * @function openFile
 * @returns {Promise<Object[]>} Resolves with an array of book objects,
 * or an empty array if an error occurs.
 *
 * @example
 * const books = await openFile();
 * console.log(books.length); // total number of books
 */
async function openFile() {
    try {
        const data = await fs.readFile(BOOKS_FILE, 'utf8');
        return JSON.parse(data); // return instead of just logging
    } catch (err) {
        console.error('Error reading file:', err);
        return []; // return empty array as fallback
    }
}

/**
 * Retrieves the full list of books.
 *
 * This function:
 *  - Calls `openFile()` to read and parse the books JSON file.
 *  - Logs the book list for debugging.
 *  - Returns the array of all books.
 *
 * @async
 * @function getBooks
 * @returns {Promise<Object[]>} Resolves with an array of all book objects,
 * or an empty array if an error occurs.
 *
 * @example
 * const books = await getBooks();
 * console.log(books.map(b => b.Title));
 */
async function getBooks() {
    try {
        const books = await openFile(); // await the promise
        console.log("Books List:", JSON.stringify(books, null, 2));
 
        return books;
    } catch (err) {
        logger.error('Error getting books:', err);
    }
}

/**
 * Retrieves a single book by its ID.
 *
 * This function:
 *  - Reads the list of books from the JSON file.
 *  - Searches for a book with the matching `Id`.
 *  - Returns the book object if found, or `null` if not found.
 *
 * @async
 * @function getBookById
 * @param {number|string} bookId - The ID of the book to retrieve.
 *
 * @returns {Promise<Object|null>} Resolves with the book object if found,
 * or `null` if no book matches the given ID or if an error occurs.
 *
 * @example
 * // Fetch book with ID 3
 * const book = await getBookById(3);
 * console.log(book.Title); // "1984"
 */
async function getBookById(bookId) {
    try {
        const books = await openFile();
        const book = books.find(b => b.Id === Number(bookId));

        if (!book) {
            logger.warn(`Book with Id ${bookId} not found`);
            return null;
        }

        logger.info(`Book with Id ${bookId} fetched successfully`);
        return book;
    } catch (error) {
        logger.error(error, 'Failed to fetch book');
        return null;
    }
}

/**
 * Updates an existing book in the books collection by its ID.
 *
 * This function:
 *  - Reads the books data from the JSON file.
 *  - Searches for the book with the given ID.
 *  - Validates and applies only the allowed fields from the update payload.
 *  - Prevents overwriting immutable fields such as `Id` (and `ISBN` if excluded from allowed fields).
 *  - Persists the updated data back to the JSON file.
 *
 * @async
 * @function updateBook
 * @param {number|string} bookId - The ID of the book to update.
 * @param {Object} updateData - The fields to update, coming from the request body.
 * @param {string} [updateData.Title] - New title of the book.
 * @param {string} [updateData.Author] - New author of the book.
 * @param {string} [updateData.Description] - Updated description of the book.
 * @param {number} [updateData.PrintLength] - Updated page count of the book.
 * @param {string} [updateData.Publisher] - Updated publisher of the book.
 *
 * @returns {Promise<Object|null>} Returns the updated book object if successful,
 * or `null` if the book was not found or no valid fields were provided.
 *
 * @example
 * // Update book with ID 2
 * const updatedBook = await updateBook(2, {
 *   Title: "To Kill a Mockingbird (Updated)",
 *   Description: "A timeless story of justice and morality."
 * });
 *
 * @throws Will log and return `null` if file read/write operations fail.
 */
async function updateBook(bookId, updateData) {
    try {
        const books = await openFile();
        const bookIndex = books.findIndex(b => b.Id === Number(bookId));

        if (bookIndex === -1) {
            logger.warn(`Book with Id ${bookId} not found`);
            return null;
        }

        // Define allowed fields for update
        const allowedFields = ["Title", "Author", "Description", "PrintLength", "Publisher"];

        // Filter updateData to only include allowed fields
        const safeData = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        if (Object.keys(safeData).length === 0) {
            logger.warn(`No valid fields provided for update on book ${bookId}`);
            return null;
        }

        // Merge existing with validated updates
        books[bookIndex] = {
            ...books[bookIndex],
            ...safeData
        };

        await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));

        logger.info(`Book with Id ${bookId} updated successfully`);
        return books[bookIndex];
    } catch (error) {
        logger.error(error, 'Failed to update book');
        return null;
    }
}




module.exports = {
    openFile,
    getBooks,
    getBookById, 
    updateBook
};

