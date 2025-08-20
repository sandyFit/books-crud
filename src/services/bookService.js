const fs = require('fs').promises;
const { logger } = require('../logger');

const BOOKS_FILE = './src/data/books.json';

async function openFile() {
    try {
        const data = await fs.readFile(BOOKS_FILE, 'utf8');
        return JSON.parse(data); // return instead of just logging
    } catch (err) {
        console.error('Error reading file:', err);
        return []; // return empty array as fallback
    }
}

async function getBooks() {
    try {
        const books = await openFile(); // await the promise
        console.log("Books List:", JSON.stringify(books, null, 2));
 
        return books;
    } catch (err) {
        logger.error('Error getting books:', err);
    }
}

module.exports = {
    openFile,
    getBooks
};

