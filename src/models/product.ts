import { Schema, Document, model } from "mongoose";

// product schema
export interface Product extends Document {
  name: string;
  costPrice: number;
  sellingPrice: number;
  image: string;
  qr: string;
  stock: number;
  stockSold: number;
  sku: string;
  description: Description;
}

export interface Description {
  fabric: string;
  dimension: string;
  shortDescription: string;
}

// description schema
export const descriptionSchema = new Schema<Description>(
  {
    fabric: {
      type: String,
      trim: true,
      default: "",
    },
    dimension: {
      type: String,
      trim: true,
      default: "",
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    trim: true,
    default: "",
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  stockSold: {
    type: Number,
    default: 0,
    min: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  qr: {
    type: String,
    trim: true,
    default: "",
  },
  description: descriptionSchema,
});

const productModel = model<Product>("Product", productSchema);
export default productModel;
