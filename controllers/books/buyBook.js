const { Book, PurchaseHistory, Revenue } = require("../../models");
const sendMail = require("../../utils/sendMail");
async function buyBook(req, res, next) {
  try {
    const { _id } = req.user;
    const { bookId, quantity } = req.body;

    const book = await Book.findOne({ _id: bookId });

    const purchaseId = await generateNextPurchaseId();

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

    sendMailToAuthors(book);

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

async function sendMailToAuthors(book) {
  try {
    const aggregatePipeline = [
      {
        $match: {
          userId: {
            $in: book?.authors,
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalRevenue: {
            $sum: "$revenue",
          },
          currentYearRevenue: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $year: "$createdAt",
                    },
                    {
                      $year: new Date(),
                    },
                  ],
                },
                then: "$revenue",
                else: 0,
              },
            },
          },
          currentMonthRevenue: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [
                        {
                          $year: "$createdAt",
                        },
                        {
                          $year: new Date(),
                        },
                      ],
                    },
                    {
                      $eq: [
                        {
                          $month: "$createdAt",
                        },
                        {
                          $month: new Date(),
                        },
                      ],
                    },
                  ],
                },
                then: "$revenue",
                else: 0,
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          currentYearRevenue: 1,
          currentMonthRevenue: 1,
          userEmail: {
            $first: "$user.email",
          },
        },
      },
    ];

    const authorsReveue = await Revenue.aggregate(aggregatePipeline);

    if (authorsReveue.length) {
      for (const revenue of authorsReveue) {
        let body = `
        Dear Author, Your book ${book?.title} has been purchased. <br><br>
        
        Below is your current revenue stauts: <br>
        
        <p><b>Current Month Revenue :</b> ${revenue.currentMonthRevenue}</p>
        <p><b>Current Year Revenue :</b> ${revenue.currentYearRevenue}</p>
        <p><b>Total Revenue :</b> ${revenue.totalRevenue}</p>
        `;
        sendMail(revenue.userEmail, body, "Book Purchase Notification");
      }
    }
  } catch (error) {
    console.log(error);
  }
}
