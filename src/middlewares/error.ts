import { NextFunction, Request, Response } from "express";

export function InternalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    message: "Internal Server Error",
    error: err.message,
  });
  next();
}

export function NotFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).json({
    status: false,
    message: "Not Found",
    error: "The requested resource could not be found.",
  });
  next();
}
