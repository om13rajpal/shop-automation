import qrcode from "qrcode";
import { Product } from "../models/product";

export async function CreateQRCode(payload: Product) {
  const qr = qrcode
    .toFile(`qr/${payload.sku}.png`, JSON.stringify(payload), {
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
      return false
    });
}