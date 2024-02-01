const mongoose = require("mongoose");

// Define purchase history schema
const purchaseHistorySchema = new mongoose.Schema(
  {
    purchaseId: { type: String, unique: true, required: true },
    bookId: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    purchaseDate: {
      type: Date,
      default: Date.now(),
    },
    price: Number,
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: { createdAt: true },
  }
);

const PurchaseHistory = mongoose.model(
  "PurchaseHistory",
  purchaseHistorySchema
);

module.exports = PurchaseHistory;
