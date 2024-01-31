const mongoose = require("mongoose");
const express = require("express");
const bookRouter = require("./routes/bookRouter");
const purchaseHistoryRouter = require("./routes/purchaseHistoryRouter");
const { login, register } = require("./controllers/auth");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Error Handler Middleware
app.use((err, req, res, next) => {
  // Check if the error is a custom error with a status code
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  } else {
    // If it's not a custom error, treat it as a 500 Internal Server Error
    console.error("Internal Server Error:", err);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
        statusCode: 500,
      },
    });
  }
});

// connect to mongoDB
mongoose
  .connect(process.env.DBURL)
  .catch((error) => console.log("db error", error));

app.post("/login", login);
app.post("/register", register);
// app.use("/books", "", bookRouter);
// app.use("/purchaseHistory", "", purchaseHistoryRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
