import { AppDataSource } from "../data-source"
import { StockMovemnt, MovementType } from "../entities/stockMovemnt"
import { DeliveryStock } from "../entities/deliveryStock"

interface ReportFilter {
  startDate?: string
  endDate?: string
  productId?: number
  branchId?: number
}

interface ReportRow {
  date: string
  transactionNumber: string
  productName: string
  productType: string
  productSize: string
  branchName: string
  movementType: string
  quantity: number
  remark: string
  currentStockAfterMovement: number
}

export class StockReportService {
  private static movementRepo = AppDataSource.getRepository(StockMovemnt)
  private static stockRepo = AppDataSource.getRepository(DeliveryStock)

  static async getMovementReport(filters: ReportFilter): Promise<ReportRow[]> {
    const { startDate, endDate, productId, branchId } = filters

    // 1. Find relevant DeliveryStocks to establish the "Anchor" for calculation
    const stockQuery = this.stockRepo
      .createQueryBuilder("ds")
      .leftJoinAndSelect("ds.product", "product")
      .leftJoinAndSelect("ds.branch", "branch")

    if (productId)
      stockQuery.andWhere("ds.productId = :productId", { productId })
    if (branchId) stockQuery.andWhere("ds.branchId = :branchId", { branchId })

    const relevantStocks = await stockQuery.getMany()
    const reportRows: ReportRow[] = []

    // 2. Process each stock item independently to calculate history correctly
    for (const stock of relevantStocks) {
      let runningBalance = stock.quantity

      // 2a. Calculate "Future Delta" - movements that happened AFTER the report window
      // Only needed if there is an endDate. If no endDate, runningBalance is current.
      if (endDate) {
        const futureMovements = await this.movementRepo
          .createQueryBuilder("m")
          .where("m.deliveryStockId = :stockId", { stockId: stock.id })
          .andWhere("m.createdAt > :endDate", { endDate: new Date(endDate) }) // assuming inclusive or exclusive? typically exclusive of end of day
          .getMany()

        for (const m of futureMovements) {
          // If we are rewinding FROM current state:
          // ADD in future means we SUBTRACT from current to go back
          // DEDUCT in future means we ADD to current to go back
          if (m.type === MovementType.ADD) runningBalance -= m.quantity
          else if (m.type === MovementType.DEDUCT) runningBalance += m.quantity
        }
      }

      // 2b. Fetch Report Movements (Ordered DESC is crucial for walking backwards)
      const reportQuery = this.movementRepo
        .createQueryBuilder("m")
        .leftJoinAndSelect("m.deliveryStock", "ds")
        .leftJoinAndSelect("ds.product", "p")
        .leftJoinAndSelect("ds.branch", "b")
        .where("m.deliveryStockId = :stockId", { stockId: stock.id })
        .orderBy("m.createdAt", "DESC") // We walk backwards

      if (startDate)
        reportQuery.andWhere("m.createdAt >= :startDate", {
          startDate: new Date(startDate),
        })
      if (endDate)
        reportQuery.andWhere("m.createdAt <= :endDate", {
          endDate: new Date(endDate),
        })

      const movements = await reportQuery.getMany()

      // 2c. Walk through movements to generate rows and update running balance
      for (const m of movements) {
        const rowBalance = runningBalance

        reportRows.push({
          date: m.createdAt.toISOString().split("T")[0], // YYYY-MM-DD
          transactionNumber: m.TransactionNumber || "N/A",
          productName: stock.product.name,
          productType: stock.product.type,
          productSize: stock.product.size,
          branchName: stock.branch.name,
          movementType: m.type,
          quantity: m.quantity,
          remark: m.remark || "",
          currentStockAfterMovement: rowBalance,
        })

        // Update balance for the *next* iteration (which is the *previous* movement in time)
        // If current movement was ADD, previous balance was (Current - Quantity)
        // If current movement was DEDUCT, previous balance was (Current + Quantity)
        if (m.type === MovementType.ADD) runningBalance -= m.quantity
        else if (m.type === MovementType.DEDUCT) runningBalance += m.quantity
      }
    }

    // 3. Flatten and Sort Final Result
    // Since we processed stocks individually, the global list is mixed.
    // Re-sort by date DESC to interleave brands/products correctly.
    return reportRows.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }
}
