import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { StockAdminService } from "../services/stockAdminService"

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      stockAdmin?: any
    }
  }
}

export const authenticateStockAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" })
      return
    }

    const token = authHeader.split(" ")[1]
    const secret = process.env.JWT_SECRET || "default_secret_key_change_me"

    const decoded: any = jwt.verify(token, secret)

    const admin = await StockAdminService.findById(decoded.sub)

    if (!admin || !admin.is_active) {
      res
        .status(401)
        .json({ message: "Unauthorized: Invalid token or inactive user" })
      return
    }

    req.stockAdmin = admin
    next()
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" })
  }
}
