import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import branchRoutes from "./routes/branchRoutes"
import stockRoutes from "./routes/stockRoutes"
import productRoutes from "./routes/productRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
import deliveryRoutes from "./routes/deliveryRoutes"
import { adminBot } from "./admin-bot/bot"
import "./admin-bot/handlers/admin-confirmation";


dotenv.config()

const app = express()
app.use(
  cors({
    origin: "*", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  })
)
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!")
})

app.use("/branches", branchRoutes)
app.use("/stock", stockRoutes)
app.use("/products", productRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/delivery", deliveryRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✔️")
    adminBot
      .launch()
      .then(() => console.log("🤖 Admin bot running"))
      .catch((err: any) => console.error("Bot launch error:", err))
  })
  .catch((err) => {
    console.error("Database connection error:", err)
  })
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
