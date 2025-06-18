import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import saleModel from "../models/sale";
import productModel from "../models/product";

export async function generatePDF() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = await generateHTML();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const date = new Date().toDateString();
    const reportFolder = path.resolve(__dirname, "../../report");

    if (!fs.existsSync(reportFolder)) {
      fs.mkdirSync(reportFolder, { recursive: true });
    }

    const pdfPath = path.join(reportFolder, `${date}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();

    console.log("PDF generated successfully:", pdfPath);
    return pdfPath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

async function generateHTML() {
  const date = new Date();
  const sale = await saleModel.find({
    saleDate: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
    },
  });

  if (!sale || sale.length === 0) {
    throw new Error("No sales data found for today.");
  }

  let rowPromises = sale.map(async (s) => {
    const sku = s.sku;
    const productDetails = await productModel.findOne({ sku });

    if (!productDetails) {
      throw new Error(`Product not found for SKU: ${sku}`);
    }

    return `<tr>
              <td>${productDetails.name}</td>
              <td>${s.productPrice}</td>
              <td>${s.quantity}</td>
              <td>${s.margin}</td>
            </tr>`;
  });

  const rowArray = await Promise.all(rowPromises);
  const rows = rowArray.join(" ");

  return `
    <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  border: 1px solid #ccc;
                  padding: 8px;
                  text-align: left;
              }
              th {
                  background-color: #f2f2f2;
              }
          </style>
      </head>
      <body>
          <h2>Daily Sales Report - ${date.toDateString()}</h2>
          <table>
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Sold at</th>
                      <th>Quantity</th>
                      <th>Margin</th>
                  </tr>
              </thead>
              <tbody>
                  ${rows}
              </tbody>
          </table>
      </body>
    </html>`;
}