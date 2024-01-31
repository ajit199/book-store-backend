const Book = require("../../models/Book");

async function getBooks(req, res, next) {
  try {
    console.log("req.user", req.user);
    const books = await Book.find();
    res.json({
      data: books,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getBooks;
