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
    _id: false,
    timestamps: { createdAt: true },
  }
);

const PurchaseHistory = mongoose.model(
  "PurchaseHistory",
  purchaseHistorySchema
);

// Middleware to increment the history id before saving a new entry.
purchaseHistorySchema.pre("save", async function (next) {
  const doc = this;
  // get the current highest id from the collection
  const highest = await PurchaseHistory.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );

  // get next number
  const nextNumber = highest
    ? Number(highest.purchaseId.split("-").at(-1)) + 1
    : 1;
  const currentDate = new Date();

  doc.purchaseId = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${nextNumber}`;
  next();
});

module.exports = PurchaseHistory;
