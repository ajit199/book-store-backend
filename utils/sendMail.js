const nodemailer = require("nodemailer");

async function sendMail(email, body, subject) {
  try {
    // Send email notifications to authors
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Password,
      },
    });

    await transporter.sendMail({
      from: process.env.Email,
      to: email,
      subject: subject,
      html: body,
    });
  } catch (error) {
    console.log("mail error", error);
  }
}

module.exports = sendMail;
