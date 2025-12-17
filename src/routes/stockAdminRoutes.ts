import { Router } from "express"
import { StockAdminController } from "../controllers/stockAdminController"
import { authenticateStockAdmin } from "../middleware/authMiddleware"

const router = Router()

// Public routes
router.post("/login", StockAdminController.login)
// Only for dev/testing setup - typically you remove/protect this
router.post("/register", StockAdminController.register)

// Protected route example / validation
router.get("/me", authenticateStockAdmin, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.stockAdmin,
  })
})

export default router
