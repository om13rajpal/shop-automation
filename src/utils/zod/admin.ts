import zod from "zod";
import { Admin } from "../../models/admin";

const adminSchema = zod.object({
  username: zod
    .string({
      message: "Username is required",
    })
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(20, {
      message: "Username must not exceed 20 characters",
    }),
  password: zod
    .string({
      message: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(30, {
      message: "Password must not exceed 30 characters",
    }),
  email: zod
    .string({
      message: "Email is required",
    })
    .email({
      message: "Invalid email format",
    }),
  phoneNumber: zod
    .string({
      message: "Phone number is required",
    })
    .min(10, {
      message: "Phone number must be at least 10 characters long",
    })
    .max(10, {
      message: "Phone number must not exceed 10 characters",
    }),
});

export default function validateAdminInput(payload: Admin) {
  const result = adminSchema.safeParse(payload);
  return result;
}