import { Document, model, Schema } from "mongoose";

// admin schema
export interface Admin extends Document {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

const adminSchema = new Schema<Admin>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20,
    minlength: 3,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 10,
    minlength: 10,
  },
});

const adminModel = model<Admin>("Admin", adminSchema);
export default adminModel;
