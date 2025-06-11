import jwt from "jsonwebtoken";
import { ISSUER, JWT_SECRET } from "../config/config";

// payload definition
const payload = {
  iss: ISSUER,
  sub: "admin",
};

// token generating function
export default function generateToken() {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: "24h",
  });
}
