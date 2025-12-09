import { Router } from "express"
import { StockController } from "../controllers/stockController"

const router = Router()
router.get("/lowstockalerts", StockController.getStockAlert)
router.post("/add", StockController.addStock)
router.post("/deduct", StockController.deductStock)
router.get("/:branchId", StockController.getStock)

router.get("/sell", StockController.sellStock)
router.get("/:branchId/:productId/movements", StockController.getStockMovements)

router.get("/", StockController.getAllStock)
export default router
