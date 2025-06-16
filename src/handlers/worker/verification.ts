import { Request, Response } from "express";
import workerModel from "../../models/worker";

export async function GetUnverifiedWorkerHandler(req: Request, res: Response) {
  try {
    const workers = await workerModel.find({
      isApproved: false,
    });

    if (!workers || workers.length === 0) {
      res.status(404).json({
        status: false,
        message: "No unverified workers found",
      });
      return;
    }

    res.status(200).json({
      status: true,
      workers: workers.map((worker) => {
        return { name: worker.name, id: worker._id };
      }),
    });
  } catch (error) {
    console.error("Error fetching unverified workers:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}

export async function VerifyWorkerHandler(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const worker = await workerModel.findByIdAndUpdate(
      id,
      {
        isApproved: true,
      },
      { new: true }
    );

    if (!worker) {
      res.status(404).json({
        status: false,
        message: "Worker not found",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Worker verified successfully",
      worker: {
        id: worker._id,
        phoneNumber: worker.phoneNumber,
        name: worker.name,
      },
    });
  } catch (error) {
    console.error("Error verifying worker:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
    return;
  }
}
