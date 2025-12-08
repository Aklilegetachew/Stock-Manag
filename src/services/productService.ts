import { AppDataSource } from "../data-source"
import { Deliveryproducts } from "../entities/Deliveryproducts"

export class ProductService {
  static async getAllProducts() {
    const repo = AppDataSource.getRepository(Deliveryproducts)
    return repo.find()
  }

  static async getProductById(id: number) {
    const repo = AppDataSource.getRepository(Deliveryproducts)
    return repo.findOneBy({ id })
  }

  static async createProduct(name: string, type: string, size: string) {
    const repo = AppDataSource.getRepository(Deliveryproducts)
    const product = repo.create({ name, type, size })
    return repo.save(product)
  }

  static async updateProduct(id: number, data: Partial<Deliveryproducts>) {
    const repo = AppDataSource.getRepository(Deliveryproducts)
    await repo.update(id, data)
    return repo.findOneBy({ id })
  }

  static async deleteProduct(id: number) {
    const repo = AppDataSource.getRepository(Deliveryproducts)
    return repo.delete(id)
  }
}
