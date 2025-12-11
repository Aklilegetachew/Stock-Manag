import { AppDataSource } from "../data-source"
import { Branches } from "../entities/branches"
import { Deliveryproducts } from "../entities/Deliveryproducts"
import { DeliveryStock } from "../entities/deliveryStock"
import { StockMovemnt } from "../entities/stockMovemnt"
import { LessThanOrEqual } from "typeorm"

export class DashboardService {
  static async getDashboardStats() {
    const branchRepo = AppDataSource.getRepository(Branches)
    const productRepo = AppDataSource.getRepository(Deliveryproducts)
    const stockRepo = AppDataSource.getRepository(DeliveryStock)
    const movementRepo = AppDataSource.getRepository(StockMovemnt)

    // 1. Total number of branches
    const totalBranches = await branchRepo.count()

    // 2. Total number of products
    const totalProducts = await productRepo.count()

    // 3. Total stock quantity
    const totalStockResult = await stockRepo
      .createQueryBuilder("stock")
      .select("SUM(stock.quantity)", "sum")
      .getRawOne()
    const totalStock = totalStockResult.sum ? parseInt(totalStockResult.sum) : 0

    // 4. Number of low-stock items (quantity <= 10)
    const lowStockCount = await stockRepo.count({
      where: { quantity: LessThanOrEqual(10) },
    })

    // 5. Count of low-stock products grouped by product (returning details)
    const lowStockItemsRaw = await stockRepo.find({
      where: { quantity: LessThanOrEqual(10) },
      relations: ["product", "branch"],
      select: {
        id: true,
        quantity: true,
        product: {
          id: true,
          name: true,
        },
        branch: {
          id: true,
          name: true,
        },
      },
    })

    const lowStockItems = lowStockItemsRaw.map((item) => ({
      stockId: item.id,
      productId: item.product?.id,
      productName: item.product?.name,
      branchId: item.branch?.id,
      branchName: item.branch?.name,
      quantity: item.quantity,
    }))

    // 6. Total stock movement count
    const totalMovements = await movementRepo.count()

    // 7. Recent 5 stock movements
    const recentMovements = await movementRepo.find({
      order: { createdAt: "DESC" },
      take: 5,
      relations: [
        "deliveryStock",
        "deliveryStock.product",
        "deliveryStock.branch",
      ],
    })

    // Process recent movements to be cleaner for frontend
    const recentMovementsFormatted = recentMovements.map((m) => ({
      id: m.id,
      type: m.type,
      quantity: m.quantity,
      remark: m.remark,
      date: m.createdAt,
      product: m.deliveryStock?.product?.name,
      branch: m.deliveryStock?.branch?.name,
    }))

    return {
      totalBranches,
      totalProducts,
      totalStock,
      lowStockCount,
      lowStockItems,
      totalMovements,
      recentMovements: recentMovementsFormatted,
    }
  }
}

export default DashboardService
