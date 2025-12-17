import { Request, Response } from "express"
import { StockAdminService } from "../services/stockAdminService"

export class StockAdminController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" })
        return
      }

      const admin = await StockAdminService.findByEmail(email)

      if (!admin) {
        res.status(401).json({ message: "Invalid email or password" })
        return
      }

      const isPasswordValid = await admin.validatePassword(password)

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" })
        return
      }

      if (!admin.is_active) {
        res.status(403).json({ message: "Account is inactive" })
        return
      }

      const token = StockAdminService.generateToken(admin)
      await StockAdminService.updateLastLogin(admin.id)

      // Remove password_hash from response
      const { password_hash, ...adminProfile } = admin

      res.json({
        accessToken: token,
        stockAdmin: adminProfile,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  // Temporary endpoint to create an admin for testing purposes
  static async register(req: Request, res: Response) {
    try {
      const { email, password, full_name } = req.body

      const existing = await StockAdminService.findByEmail(email)
      if (existing) {
        res.status(400).json({ message: "Email already exists" })
        return
      }

      const newAdmin = await StockAdminService.createAdmin({
        email,
        password, // Setter will hash it
        full_name,
      })

      // @ts-ignore
      const { password_hash, ...adminProfile } = newAdmin

      res.status(201).json(adminProfile)
    } catch (error) {
      console.error("Register error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
