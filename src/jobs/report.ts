import cron from "node-cron";
import { createTransport } from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../config/config";

cron.schedule("0 17 * * *", () => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: "rajpalom13274@gmail.com",
    subject: "Daily Report",
    text: "This is your daily report. Everything is running smoothly!",
  };

  transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("Daily report sent successfully!");
    })
    .catch((err) => {
      console.error("Error sending daily report:", err);
    });
});
