import { Request, Response } from "express"
import DashboardService from "../services/dashboardService"

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await DashboardService.getDashboardStats()
      res.json(stats)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
