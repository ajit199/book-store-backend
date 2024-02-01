const bookRouter = require("express").Router();
const { getBooks, addBook, buyBook } = require("../controllers/books");

bookRouter.post("/addbook", addBook);
bookRouter.post("/buybook", buyBook);
bookRouter.get("/getbooks", getBooks);
module.exports = bookRouter;
