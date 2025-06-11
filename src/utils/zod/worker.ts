import zod from "zod";
import { Worker } from "../../models/worker";

const workerSchema = zod.object({
  name: zod
    .string({
      message: "Name is required",
    })
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .max(20, {
      message: "Name must not exceed 30 characters",
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

export default function validateWorkerInput(payload: Worker) {
  const result = workerSchema.safeParse(payload);
  return result;
}
