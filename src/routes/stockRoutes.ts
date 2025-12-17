import { Router } from "express"
import { StockController } from "../controllers/stockController"
import { authenticateStockAdmin } from "../middleware/authMiddleware"

const router = Router()
router.get("/lowstockalerts", StockController.getStockAlert)
router.post("/add", authenticateStockAdmin, StockController.addStock)
router.post("/deduct", authenticateStockAdmin, StockController.deductStock)
router.get("/:branchId", StockController.getStock)

router.post("/sell", authenticateStockAdmin, StockController.sellStock)
router.get("/:branchId/:productId/movements", StockController.getStockMovements)

router.get("/", StockController.getAllStock)
export default router
