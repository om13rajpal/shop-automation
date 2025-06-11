import puppeteer from "puppeteer";
import path from "path";
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
    const pdfPath = path.join(__dirname, `../../report/${date}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4" });
    await browser.close();
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

  let rowPromises = sale
    .map(async (s) => {
      const sku = s.sku;
      const productDetails = await productModel.findOne({
        sku,
      });
      if (!productDetails) {
        throw new Error("product not found");
      }
      return `<tr>
                <td>${productDetails.name}</td>
                <td>${s.productPrice}</td>
                <td>${s.quantity}</td>
                <td>${s.margin}</td>
            </tr>`;
    });

  const rowArray = await Promise.all(rowPromises)
  const rows = rowArray.join(' ')

  return `
  <html>
    <head>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td{
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;

            }
        </style>
    </head>
    <body>
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