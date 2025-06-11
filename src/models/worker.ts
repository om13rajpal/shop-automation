import { Schema, Document, model } from "mongoose";

// worker schema
export interface Worker extends Document {
  phoneNumber: string;
  password: string;
  isApproved: boolean;
  name: string;
}

const workerSchema = new Schema<Worker>({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 10,
    minlength: 10,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    minlength: 3,
  },
});

const workerModel = model<Worker>("Worker", workerSchema);
export default workerModel;
