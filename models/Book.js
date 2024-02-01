const mongoose = require("mongoose");

// Define book schema
const bookSchema = new mongoose.Schema(
  {
    bookId: { type: Number, unique: true },
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
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
