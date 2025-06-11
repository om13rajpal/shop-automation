import { connect } from "mongoose";
import { MONGO_URI } from "../config/config";

// connection to the database
export default function connectMongoDB() {
  if (MONGO_URI === undefined) {
    console.error("MONGO_URI is not defined in the environment variables.");
    return;
  }
  connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}