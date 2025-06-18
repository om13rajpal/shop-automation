import cron from "node-cron";
import { createTransport, SendMailOptions } from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../config/config";
import { generatePDF } from "../utils/pdf";

cron.schedule("0 23 * * *", async () => {
  const path = await generatePDF();
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions: SendMailOptions = {
    from: EMAIL,
    to: "in.skumar13@gmail.com, in.poonam@gmail.com",
    subject: "Daily Report",
    text: "This is your daily report. Everything is running smoothly!",
    attachments: [
      {
        filename: "report.pdf",
        path,
      },
    ],
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
