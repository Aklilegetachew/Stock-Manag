import { AppDataSource } from "../data-source"
import { DeliveryStock } from "../entities/deliveryStock"
import { StockMovemnt, MovementType } from "../entities/stockMovemnt"
import { Deliveryproducts } from "../entities/Deliveryproducts"
import { Branches } from "../entities/branches"
import { LessThan, LessThanOrEqual } from "typeorm"

export class StockService {
  static async addStock(
    branchId: number,
    productId: number,
    quantity: number,
    remark?: string
  ) {
    const stockRepo = AppDataSource.getRepository(DeliveryStock)
    let stock = await stockRepo.findOne({
      where: { branch: { id: branchId }, product: { id: productId } },
      relations: ["branch", "product"],
    })

    if (!stock) {
      const branch = await AppDataSource.getRepository(Branches).findOneBy({
        id: branchId,
      })
      const product = await AppDataSource.getRepository(
        Deliveryproducts
      ).findOneBy({ id: productId })
      if (!branch || !product) throw new Error("Branch or Product not found")
      stock = stockRepo.create({ branch, product, quantity: 0 })
    }

    stock.quantity += quantity
    await stockRepo.save(stock)

    // Record movement
    const movementRepo = AppDataSource.getRepository(StockMovemnt)
    const movement = movementRepo.create({
      deliveryStock: stock,
      quantity,
      type: MovementType.ADD,
      remark,
    })
    await movementRepo.save(movement)

    return stock
  }

  static async deductStock(
    branchId: number,
    productId: number,
    quantity: number,
    remark?: string
  ) {
    const stockRepo = AppDataSource.getRepository(DeliveryStock)
    const stock = await stockRepo.findOne({
      where: { branch: { id: branchId }, product: { id: productId } },
      relations: ["branch", "product"],
    })
    if (!stock) throw new Error("Stock not found")
    if (stock.quantity < quantity) throw new Error("Insufficient stock")

    stock.quantity -= quantity
    await stockRepo.save(stock)

    // Record movement
    const movementRepo = AppDataSource.getRepository(StockMovemnt)
    const movement = movementRepo.create({
      deliveryStock: stock,
      quantity,
      type: MovementType.DEDUCT,
      remark,
    })
    await movementRepo.save(movement)

    return stock
  }

  static async getStock(branchId: number) {
    const stockRepo = AppDataSource.getRepository(DeliveryStock)
    return stockRepo.find({
      where: { branch: { id: branchId } },
      relations: ["branch", "product", "movements"],
    })
  }

  static async getAllStock() {
    const stockRepo = AppDataSource.getRepository(DeliveryStock)
    return stockRepo.find({
      relations: ["branch", "product", "movements"],
    })
  }

  static async sellStock(
    branchId: number,
    productId: number,
    quantity: number,
    remark?: string,
    TransactionNumber?: string
  ) {
    const stockRepo = AppDataSource.getRepository(DeliveryStock)
    const stock = await stockRepo.findOne({
      where: { branch: { id: branchId }, product: { id: productId } },
      relations: ["branch", "product"],
    })
    if (!stock) throw new Error("Stock not found")
    if (stock.quantity < quantity) throw new Error("Insufficient stock")

    stock.quantity -= quantity
    await stockRepo.save(stock)

    // Record movement
    const movementRepo = AppDataSource.getRepository(StockMovemnt)
    const movement = movementRepo.create({
      deliveryStock: stock,
      quantity,
      type: MovementType.DEDUCT,
      remark,
      TransactionNumber,
    })
    await movementRepo.save(movement)

    return stock
  }

  static async getStockMovements(branchId: number, productId: number) {
    const movementRepo = AppDataSource.getRepository(StockMovemnt)
    return movementRepo.find({
      where: {
        deliveryStock: { branch: { id: branchId }, product: { id: productId } },
      },
      relations: [
        "deliveryStock",
        "deliveryStock.branch",
        "deliveryStock.product",
      ],
    })
  }

  static async getStockAlert() {
    const stockRepo = AppDataSource.getRepository(DeliveryStock)

    try {
      return stockRepo.find({
        where: {
          quantity: LessThanOrEqual(40),
        },
        relations: ["branch", "product"],
      })
    } catch (err) {
      console.log(err)
      throw new Error("Error fetching stock alert")
    }
  }
}
