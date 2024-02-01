const { PurchaseHistory } = require("../../models");

async function getHistory(req, res, next) {
  try {
    const { _id } = req.user;
    const history = await PurchaseHistory.find({ userId: _id })
      .sort({ createdAt: -1 })
      .exec();

    res.json({
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getHistory;
