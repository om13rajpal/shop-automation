import { Request, Response } from "express";
import productModel, { Product } from "../../models/product";
import validateProductInput from "../../utils/zod/product";

export async function CreateProductHandler(req: Request, res: Response) {
  const payload: Product = req.body;

  const validPayload = validateProductInput(payload);
  if (!validPayload.success) {
    res.status(400).json({
      status: false,
      message: "Invalid product data",
      errors: validPayload.error.errors.map((error) => {
        return {
          message: error.message,
        };
      }),
    });
    return;
  }

  try {
    const product = await new productModel(payload).save();
    if (!product) {
      res.status(500).json({
        status: false,
        message: "Failed to create product",
      });
      return;
    }
    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function GetProductHandler(req: Request, res: Response) {
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
    res.status(200).json({
      status: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function GetAllProductsHandler(req: Request, res: Response) {
  try {
    const products = await productModel.find({});
    res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function UpdateInventoryHandler(req: Request, res: Response) {
  const sku = req.params.sku;
  const { quantity } = req.body;

  try {
    const product = await productModel.findOneAndUpdate(
      { sku },
      {
        $inc: {
          stock: quantity,
        },
      },
      { new: true }
    );

    if (!product) {
      res.status(404).json({
        status: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Inventory updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function UpdateProductSaleQuantity(req: Request, res: Response) {
  const sku = req.params.sku;
  const { quantity } = req.body;

  try {
    const product = await productModel.findOneAndUpdate(
      { sku },
      {
        $inc: {
          stockSold: quantity,
          stock: -quantity,
        },
      },
      { new: true }
    );

    if (!product) {
      res.status(404).json({
        status: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Product stock quantity updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product stock quantity:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function DeleteProductHandler(req: Request, res: Response) {
  const sku = req.params.sku;

  try {
    const product = await productModel.findOneAndDelete({ sku });
    if (!product) {
      res.status(404).json({
        status: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}
