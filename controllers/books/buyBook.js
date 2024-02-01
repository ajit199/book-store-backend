const { Book, PurchaseHistory, Revenue } = require("../../models");
const mongoose = require("mongoose");

async function buyBook(req, res, next) {
  try {
    const { _id } = req.user;
    const { bookId, quantity } = req.body;

    const book = await Book.findOne({ _id: bookId });

    const purchaseId = await generateNextPurchaseId();

    const transactionOptions = {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    };

    const history = new PurchaseHistory({
      bookId,
      price: book?.price,
      quantity,
      userId: _id,
      purchaseId,
    });

    await history.save();

    // update sell count of book
    await book.updateOne({ $inc: { sellCount: history?.quantity } });

    // revenue for each author
    const revenue = (book?.price * history?.quantity) / book?.authors?.length;

    // add revenue of authors
    const authorsReveue = book?.authors?.map((authorId) => ({
      userId: authorId,
      revenue: revenue,
    }));

    await Revenue.insertMany(authorsReveue);

    res.json({
      data: book,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = buyBook;

async function generateNextPurchaseId() {
  try {
    // get the current highest id from the collection
    const highest = await PurchaseHistory.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );

    // get next number
    const nextNumber = highest?._id
      ? Number(highest.purchaseId.split("-").at(-1)) + 1
      : 1;

    const currentDate = new Date();
    const purchaseId = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${nextNumber}`;

    return purchaseId;
  } catch (error) {
    console.log("error", error);
  }
}
