import { Request, Response } from "express"
import { StockService } from "../services/stockService"
import { StockReportService } from "../services/stockReportService"

export class StockController {
  static async addStock(req: Request, res: Response) {
    try {
      const { branchId, productId, quantity, remark } = req.body
      const stock = await StockService.addStock(
        branchId,
        productId,
        quantity,
        remark
      )
      res.json(stock)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error adding stock", error: err.message })
    }
  }

  static async deductStock(req: Request, res: Response) {
    try {
      const { branchId, productId, quantity, remark } = req.body
      const stock = await StockService.deductStock(
        branchId,
        productId,
        quantity,
        remark
      )
      res.json(stock)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error deducting stock", error: err.message })
    }
  }

  static async sellStock(req: Request, res: Response) {
    try {
      const { branchId, productId, quantity, TransactionNumber } = req.body
      const remark = "SELL"
      const stock = await StockService.sellStock(
        branchId,
        productId,
        quantity,
        remark,
        TransactionNumber
      )
      res.json(stock)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error selling stock", error: err.message })
    }
  }

  static async getStock(req: Request, res: Response) {
    try {
      const { branchId } = req.params
      const stock = await StockService.getStock(Number(branchId))
      res.json(stock)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error fetching stock", error: err.message })
    }
  }

  static async getAllStock(req: Request, res: Response) {
    try {
      const stock = await StockService.getAllStock()
      res.json(stock)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error fetching stock", error: err.message })
    }
  }

  static async getReport(req: Request, res: Response) {
    try {
      const { startDate, endDate, productId, branchId } = req.query as any
      const report = await StockReportService.getMovementReport({
        startDate, // "2024-01-01"
        endDate, // "2024-01-01"
        productId: productId ? Number(productId) : undefined,
        branchId: branchId ? Number(branchId) : undefined,
      })
      res.json(report)
    } catch (error) {
      console.error("Report error:", error)
      res.status(500).json({ message: "Failed to generate report" })
    }
  }

  static async getStockMovements(req: Request, res: Response) {
    try {
      const { branchId, productId } = req.params
      const stock = await StockService.getStockMovements(
        Number(branchId),
        Number(productId)
      )
      res.json(stock)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error fetching stock movements", error: err.message })
    }
  }

  static async getStockAlert(req: Request, res: Response) {
    try {
      const stock = await StockService.getStockAlert()
      res.json(stock)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error fetching stock alert", error: err.message })
    }
  }
}
