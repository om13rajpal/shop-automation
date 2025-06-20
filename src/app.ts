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
app.use("/api/v1/qrcode", express.static("qr"));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

setInterval(async () => {
  await axios.get("http://localhost:3000/");
}, 180000);

app.use(NotFoundHandler);
app.use(InternalErrorHandler);

export default app;
