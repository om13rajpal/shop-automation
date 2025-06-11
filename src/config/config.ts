import dotenv from "dotenv";
import path from "path";

const envPath = path.join(__dirname, "../.env");
dotenv.config({
  path: envPath,
});

// loading the environment variables
export const PORT = process.env.PORT || 8080;
export const MONGO_URI = process.env.MONGO_URI
export const ISSUER = process.env.ISSUER
export const JWT_SECRET = process.env.JWT_SECRET
export const EMAIL = process.env.EMAIL
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
