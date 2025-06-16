import productModel from "../models/product";
import saleModel from "../models/sale";

export async function CalculateMargin(id: any) {
  const sale = await saleModel.findById(id);
  if (!sale) {
    throw new Error("Sale not found");
  }

  const sku = sale.sku;
  const product = await productModel.findOne({
    sku,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const totalCostPrice = sale.quantity * product.costPrice;
  const totalSalePrice = sale.quantity * sale.productPrice;

  const margin = totalSalePrice - totalCostPrice;
  sale.margin = margin;
  await sale.save();
}
