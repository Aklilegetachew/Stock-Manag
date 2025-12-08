import { Request, Response } from "express"
import { StockService } from "../services/stockService"

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
}
