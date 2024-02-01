const Book = require("../../models/Book");
async function addBook(req, res, next) {
  try {
    const { title, price, authors, description } = req.body;

    if (!title || !price || !authors) {
      return res.status(400).json({ message: "Please enter required fields." });
    }

    const bookExists = await Book.findOne({ title });
    if (bookExists?.title) {
      return res
        .status(400)
        .json({ message: "Title of the book should be unique." });
    }
    if (price < 100 || price > 1000) {
      return res
        .status(400)
        .json({ message: "The book price should be between 100 and 1000." });
    }
    const book = new Book({
      title,
      price,
      authors,
      description,
    });
    await book.save();
    res.json({
      data: book,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = addBook;
