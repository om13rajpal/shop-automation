import { Request, Response } from "express";
import adminModel, { Admin } from "../../models/admin";
import validateAdminInput from "../../utils/zod/admin";
import { comparePassword, hashPassword } from "../../utils/password";
import generateToken from "../../utils/token";

// admin signup handler
export async function AdminSignupHandler(req: Request, res: Response) {
  const payload: Admin = req.body;

  const result = validateAdminInput(payload);
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
    const admin = await new adminModel(payload).save();
    if (!admin) {
      res.status(400).json({
        status: false,
        message: "Failed to create admin account",
      });
      return;
    }

    const token = generateToken();

    res.status(201).json({
      status: true,
      message: "Admin account create successfully",
      data: {
        token,
        username: admin.username,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
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

// admin login handler
export async function AdminLoginHandler(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      status: false,
      message: "Username and password are required",
    });
    return;
  }

  try {
    const admin = await adminModel.findOne({ username });
    if (!admin) {
      res.status(404).json({
        status: false,
        message: "Admin not found",
      });
      return;
    }

    const correctPassword = await comparePassword(password, admin.password);
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
        username: admin.username,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
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