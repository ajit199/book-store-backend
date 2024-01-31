const mongoose = require("mongoose");

// Define user schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["Author", "Admin", "Retail User"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
