import express from "express";
import connectMongoDB from "./db/db";
import { router } from "./handlers/route";
import { InternalErrorHandler, NotFoundHandler } from "./middlewares/error";
import { Logger } from "./middlewares/logger";

connectMongoDB();

const app = express();
app.use(express.json());
app.use(Logger);
app.use("/api/v1", router);
app.use('/api/v1/qrcode', express.static('qr'))
app.use(NotFoundHandler);
app.use(InternalErrorHandler);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
