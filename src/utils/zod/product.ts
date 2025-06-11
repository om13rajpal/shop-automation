import zod from "zod";
import { Product } from "../../models/product";

const productSchema = zod.object({
  name: zod.string({
    message: "Username is required",
  }),
  costPrice: zod
    .number({
      message: "Cost price is required",
    })
    .min(0, {
      message: "Cost price must be at least 0",
    }),
  sellingPrice: zod
    .number({
      message: "Selling price is required",
    })
    .min(0, {
      message: "Selling price must be at least 0",
    }),
  sku: zod.string({
    message: "SKU is required",
  }),
});

export default function validateProductInput(payload: Product) {
  const result = productSchema.safeParse(payload);
  return result;
}
