import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../../utils/password";
import generateToken from "../../utils/token";
import workerModel, { Worker } from "../../models/worker";
import validateWorkerInput from "../../utils/zod/worker";

// worker signup handler
export async function WorkerSignupHandler(req: Request, res: Response) {
  const payload: Worker = req.body;

  const result = validateWorkerInput(payload);
  if (!result.success) {
    res.status(400).json({
      status: false,
      message: "Invalid input data",
      errors: result.error.errors.map((error) => ({
        message: error.message,
      })),
    });
    return;
  }

  payload.password = await hashPassword(payload.password);

  try {
    const worker = await new workerModel(payload).save();
    if (!worker) {
      res.status(400).json({
        status: false,
        message: "Failed to create worker account",
      });
      return;
    }

    const token = generateToken();

    res.status(201).json({
      status: true,
      message: "Worker account create successfully",
      data: {
        token,
        name: worker.name,
        phoneNumber: worker.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}

// worker login handler
export async function WorkerLoginHandler(req: Request, res: Response) {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    res.status(400).json({
      status: false,
      message: "Phone Number and password are required",
    });
    return;
  }

  try {
    const worker = await workerModel.findOne({ phoneNumber });
    if (!worker) {
      res.status(404).json({
        status: false,
        message: "Worker not found",
      });
      return;
    }

    const correctPassword = await comparePassword(password, worker.password);
    if (!correctPassword) {
      res.status(401).json({
        status: false,
        message: "Incorrect password",
      });
      return;
    }

    const token = generateToken();

    res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        token,
        name: worker.name,
        phoneNumber: worker.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}