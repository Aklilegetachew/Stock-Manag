import { Request, Response } from "express"
import { ProductService } from "../services/productService"

export class ProductController {
  static async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts()
      res.json(products)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error fetching products", error: err.message })
    }
  }

  static async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const product = await ProductService.getProductById(Number(id))
      res.json(product)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error fetching product", error: err.message })
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const { name, type, size } = req.body
      const product = await ProductService.createProduct(name, type, size)
      res.status(201).json(product)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error creating product", error: err.message })
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = req.body
      const product = await ProductService.updateProduct(Number(id), data)
      res.json(product)
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error updating product", error: err.message })
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      await ProductService.deleteProduct(Number(id))
      res.json({ message: "Product deleted successfully" })
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error deleting product", error: err.message })
    }
  }
}
