const { getHistory } = require("../controllers/purchaseHistory");
const purchaseHistoryRouter = require("express").Router();

purchaseHistoryRouter.get("/gethistory", getHistory);

module.exports = purchaseHistoryRouter;
