import { Router } from "express"
import { DashboardController } from "../controllers/dashboardController"

import { authenticateStockAdmin } from "../middleware/authMiddleware"

const router = Router()

router.get("/stats", authenticateStockAdmin, DashboardController.getStats)

export default router
