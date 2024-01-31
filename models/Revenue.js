const mongoose = require("mongoose");

// Define revenue schema
const revenueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    revenue: Number,
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Revenue", revenueSchema);
