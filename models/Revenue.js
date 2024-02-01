const mongoose = require("mongoose");

// Define revenue schema
const revenueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    revenue: {
      type: mongoose.Types.Decimal128,
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Revenue", revenueSchema);
