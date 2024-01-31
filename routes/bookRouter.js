const bookRouter = require("express").Router();
const { getBooks } = require("../controllers/books");

bookRouter.get("/getbooks", getBooks);
module.exports = bookRouter;
