import { Request, Response } from "express";
import productModel from "../../models/product";
import { CreateQRCode } from "../../utils/qr";

export async function GenerateProductQr(req: Request, res: Response) {
  const sku = req.params.sku;

  try {
    const product = await productModel.findOne({ sku });
    if (!product) {
      res.status(404).json({
        status: false,
        message: "Product not found",
      });
      return;
    }
    const qr = CreateQRCode(product);
    if (!qr) {
      res.status(500).json({
        status: false,
        message: "Failed to generate QR code",
      });
      return;
    }
    res.status(200).json({
      status: true,
      message: "QR code generated successfully",
      data: {
        qr: product.qr,
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}
