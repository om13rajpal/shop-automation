import { Router } from "express";
import { AdminLoginHandler, AdminSignupHandler } from "./admin/auth";
import { WorkerLoginHandler, WorkerSignupHandler } from "./worker/auth";
import {
  CreateProductHandler,
  DeleteProductHandler,
  GetAllProductsHandler,
  GetProductHandler,
  UpdateInventoryHandler,
  UpdateProductSaleQuantity,
} from "./product/product";
import { GenerateProductQr } from "./product/qr";
import {
  DeleteSaleHandler,
  GetCurrentDateSaleHandler,
  GetFilteredSaleHandler,
  SaveSaleHandler,
} from "./sale/sale";
import {
  GetUnverifiedWorkerHandler,
  VerifyWorkerHandler,
} from "./worker/verification";

export const router = Router();

const adminRouter = Router();
const workerRouter = Router();
const productRouter = Router();
const saleRouter = Router();

adminRouter.post("/signup", AdminSignupHandler);
adminRouter.post("/login", AdminLoginHandler);

workerRouter.post("/signup", WorkerSignupHandler);
workerRouter.post("/login", WorkerLoginHandler);
workerRouter.get("/unverified", GetUnverifiedWorkerHandler);
workerRouter.put("/verify/:id", VerifyWorkerHandler);

productRouter.get("/", GetAllProductsHandler);
productRouter.get("/:sku", GetProductHandler);
productRouter.post("/", CreateProductHandler);
productRouter.post("/qr/:sku", GenerateProductQr);
productRouter.put("/:sku", UpdateInventoryHandler);
productRouter.put("/sale/:sku", UpdateProductSaleQuantity);
productRouter.delete("/:sku", DeleteProductHandler);

saleRouter.post("/", SaveSaleHandler);
saleRouter.get("/today", GetCurrentDateSaleHandler);
saleRouter.get("/", GetFilteredSaleHandler);
saleRouter.delete("/:id", DeleteSaleHandler);

router.use("/admin", adminRouter);
router.use("/worker", workerRouter);
router.use("/product", productRouter);
router.use("/sale", saleRouter);