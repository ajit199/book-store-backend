const mongoose = require("mongoose");

// Define book schema
const bookSchema = new mongoose.Schema(
  {
    bookId: { type: Number, unique: true, required: true },
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: String,
    price: { type: Number, min: 100, max: 1000, required: true },
    sellCount: {
      type: Number,
      default: 0,
    },
    authors: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    _id: false,
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

// Middleware to increment the bookId before saving a new book.
bookSchema.pre("save", async function (next) {
  const doc = this;
  // get the current highest bookId from the collection
  const highest = await Book.findOne({}, {}, { sort: { bookId: -1 } });
  doc.bookId = highest ? highest.bookId + 1 : 1;

  next();
});

module.exports = Book;
