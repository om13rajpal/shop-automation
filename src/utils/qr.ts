import fs from "fs";
import path from "path";
import qrcode from "qrcode";
import { Product } from "../models/product";

export async function CreateQRCode(payload: Product): Promise<boolean> {
  const qrFolder = path.resolve("qr");

  if (!fs.existsSync(qrFolder)) {
    fs.mkdirSync(qrFolder, { recursive: true });
  }

  return qrcode
    .toFile(`${qrFolder}/${payload.sku}.png`, JSON.stringify(payload), {
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.error("Error creating QR Code:", err);
      return false;
    });
}
