import { NextFunction, Request, Response } from "express";

export function Logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const date = new Date().toDateString();

    const message = `${date} #${req.method} ${req.originalUrl} ${res.statusCode} | ${duration}ms`;
    console.log(message);
  });
  next();
}
