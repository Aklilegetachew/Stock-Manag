import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"

// Import all entities
import { Branches } from "./entities/branches"
import { Deliveryproducts } from "./entities/Deliveryproducts"
import { DeliveryStock } from "./entities/deliveryStock"
import { StockMovemnt } from "./entities/stockMovemnt"

dotenv.config()

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tomocabot",
  synchronize: true, // only for dev; auto creates tables
  logging: false,
  entities: [Branches, Deliveryproducts, DeliveryStock, StockMovemnt],
  migrations: [],
  subscribers: [],
})
