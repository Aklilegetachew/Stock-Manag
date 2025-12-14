// src/routes/deliveryRoutes.ts
import { Router } from "express"
import { AppDataSource } from "../data-source"
import {
  DeliveryOnTransit,
  DeliveryStatus,
} from "../entities/DeliveryOnTransit"
import { notifyAdmin } from "../admin-bot/notify-admin"
import { DeliveryCart } from "../entities/DeliveryCart"

const router = Router()

router.post("/in-transit", async (req, res) => {
  try {
    const {
      userName,
      phoneNumber,
      address,
      userTelegramId,
      longitude,
      latitude,
      transactionNumber,
      totalPayment,
      carts,
    } = req.body

    const deliveryRepo = AppDataSource.getRepository(DeliveryOnTransit)

    // Create delivery
    const delivery = deliveryRepo.create({
      userName,
      phoneNumber,
      address,
      userTelegramId,
      longitude,
      latitude,
      transactionNumber,
      totalPayment,
      status: DeliveryStatus.IN_TRANSIT,
    })

    // Create cart items
    if (Array.isArray(carts) && carts.length > 0) {
      delivery.carts = carts.map((item: any) => {
        const cart = new DeliveryCart()
        cart.productName = item.productName
        cart.productType = item.productType
        cart.size = item.size
        cart.quantity = item.quantity
        cart.delivery = delivery
        return cart
      })
    }

    await deliveryRepo.save(delivery)

    // Notify admin
    await notifyAdmin(delivery)

    res.status(201).json({
      message: "Delivery created and admin notified",
      deliveryId: delivery.id,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create delivery" })
  }
})

router.get("/in-transit", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(DeliveryOnTransit)
    const deliveries = await repo.find({
      where: { status: DeliveryStatus.IN_TRANSIT },
      relations: ["carts"],
      order: { createdAt: "DESC" },
    })
    res.json(deliveries)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch deliveries in transit" })
  }
})


router.get("/in-transit/:id/cart", async (req, res) => {
  try {
    const id = Number(req.params.id)
    const repo = AppDataSource.getRepository(DeliveryOnTransit)
    const delivery = await repo.findOne({
      where: { id, status: DeliveryStatus.IN_TRANSIT },
      relations: ["carts"],
    })
    if (!delivery)
      return res.status(404).json({ message: "Delivery not found" })
    res.json(delivery)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch delivery" })
  }
})


router.get("/completed", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(DeliveryOnTransit)
    const deliveries = await repo.find({
      where: { status: DeliveryStatus.COMPLETED },
      relations: ["carts"],
      order: { completedAt: "DESC" },
    })
    res.json(deliveries)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch completed deliveries" })
  }
})


router.get("/completed/:id/cart", async (req, res) => {
  try {
    const id = Number(req.params.id)
    const repo = AppDataSource.getRepository(DeliveryOnTransit)
    const delivery = await repo.findOne({
      where: { id, status: DeliveryStatus.COMPLETED },
      relations: ["carts"],
    })
    if (!delivery)
      return res.status(404).json({ message: "Delivery not found" })
    res.json(delivery)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch delivery" })
  }
})

export default router
