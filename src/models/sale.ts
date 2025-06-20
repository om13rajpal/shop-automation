import { Schema, Document, model } from "mongoose";

export interface Sale extends Document {
  sku: string;
  quantity: number;
  saleDate: Date;
  workerId: Schema.Types.ObjectId;
  productPrice: number;
  margin?: number;
}

const saleSchema = new Schema<Sale>({
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  saleDate: {
    type: Date,
    default: Date.now,
  },
  workerId: {
    type: Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  margin: {
    type: Number,
  },
});

const saleModel = model<Sale>("Sale", saleSchema);
export default saleModel;
