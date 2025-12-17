import { AppDataSource } from "../data-source"
import { StockAdmin } from "../entities/StockAdmin"
import jwt from "jsonwebtoken"

export class StockAdminService {
  private static stockAdminRepository = AppDataSource.getRepository(StockAdmin)

  static async findByEmail(email: string) {
    return this.stockAdminRepository
      .createQueryBuilder("admin")
      .addSelect("admin.password_hash") // explicitly select password_hash for validation
      .where("admin.email = :email", { email })
      .getOne()
  }

  static async findById(id: string) {
    return this.stockAdminRepository.findOneBy({ id })
  }

  static async createAdmin(data: Partial<StockAdmin> & { password?: string }) {
    const admin = this.stockAdminRepository.create(data)
    if (data.password) {
      admin.password = data.password
    }
    return this.stockAdminRepository.save(admin)
  }

  static async updateLastLogin(id: string) {
    await this.stockAdminRepository.update(id, { last_login_at: new Date() })
  }

  static generateToken(admin: StockAdmin) {
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    }

    // Fallback to a default secret if env is not set (though implementation plan said it's required)
    const secret = process.env.JWT_SECRET || "default_secret_key_change_me"
    const expiresIn = process.env.JWT_EXPIRATION || "1d"

    return jwt.sign(payload, secret, { expiresIn } as any)
  }
}
