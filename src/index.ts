import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import branchRoutes from "./routes/branchRoutes"
import stockRoutes from "./routes/stockRoutes"
import productRoutes from "./routes/productRoutes"
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

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✔️")
  })
  .catch((err) => {
    console.error("Database connection error:", err)
  })
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
