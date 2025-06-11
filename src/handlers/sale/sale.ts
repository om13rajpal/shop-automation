import { Request, Response } from "express";
import saleModel from "../../models/sale";
import { wss } from "../../server";

export async function SaveSaleHandler(req: Request, res: Response) {
  const { sku, quantity, workerId } = req.body;
  if (!sku || !quantity || !workerId) {
    res.status(400).json({ status: false, error: "Missing required fields" });
    return;
  }

  try {
    const sale = await new saleModel({
      sku,
      quantity,
      workerId,
    }).save();

    if (!sale) {
      res.status(500).json({ status: false, error: "Failed to save sale" });
      return;
    }

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(
          JSON.stringify({
            type: "newSale",
            data: sale,
          })
        );
      }
    });
    res.status(201).json({ status: true, sale });
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ status: false, error: "Internal server error" });
    return;
  }
}

export async function GetCurrentDateSaleHandler(req: Request, res: Response) {
  const today = new Date();

  const sale = await saleModel.find({
    saleDate: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
  });

  if (!sale || sale.length === 0) {
    res.status(404).json({ status: false, error: "No sales found for today" });
    return;
  }
  res.status(200).json({ status: true, sale });
}

export async function GetFilteredSaleHandler(req: Request, res: Response) {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    res.status(400).json({ status: false, error: "Missing required fields" });
    return;
  }

  try {
    const sales = await saleModel.find({
      saleDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    if (!sales || sales.length === 0) {
      res.status(404).json({
        status: false,
        error: "No sales found for the specified date range",
      });
      return;
    }
  } catch (error) {
    console.error("Error fetching filtered sales:", error);
    res.status(500).json({ status: false, error: "Internal server error" });
    return;
  }
}

export async function DeleteSaleHandler(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const sale = await saleModel.findByIdAndDelete(id);
    if (!sale) {
      res.status(404).json({ status: false, error: "Sale not found" });
      return;
    }
    res
      .status(200)
      .json({ status: true, message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ status: false, error: "Internal server error" });
    return;
  }
}
