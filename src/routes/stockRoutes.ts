import { Router } from "express"
import { StockController } from "../controllers/stockController"

const router = Router()

router.post("/add", StockController.addStock)
router.post("/deduct", StockController.deductStock)
router.get("/:branchId", StockController.getStock)
router.get("/", StockController.getAllStock)

export default router
