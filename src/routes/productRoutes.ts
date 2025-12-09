import { Router } from "express"
import { ProductController } from "../controllers/productController"

const router = Router()

router.get("/", ProductController.getProducts)
router.get("/:id", ProductController.getProduct)
router.post("/", ProductController.createProduct) // Create a new product
router.put("/:id", ProductController.updateProduct) // Update product
router.delete("/:id", ProductController.deleteProduct) // Delete product

export default router
