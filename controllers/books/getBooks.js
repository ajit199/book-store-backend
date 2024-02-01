const Book = require("../../models/Book");

async function getBooks(req, res, next) {
  try {
    const books = await Book.find();
    res.json({
      data: books,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getBooks;
