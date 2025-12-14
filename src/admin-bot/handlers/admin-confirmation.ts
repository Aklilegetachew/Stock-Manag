// src/admin-bot/handlers/admin-confirmation.ts
import { adminBot } from "../bot"
import { AppDataSource } from "../../data-source"
import {
  DeliveryOnTransit,
  DeliveryStatus,
} from "../../entities/DeliveryOnTransit"

adminBot.on("callback_query", async (ctx) => {
  const action = (ctx.callbackQuery as { data?: string }).data
  if (!action) return

  const repo = AppDataSource.getRepository(DeliveryOnTransit)

  try {
    if (action.startsWith("COMPLETE_")) {
      const id = Number(action.split("_")[1])

      const delivery = await repo.findOneBy({ id })
      if (!delivery) {
        await ctx.answerCbQuery("Delivery not found")
        return
      }

      // Prevent double completion
      if (delivery.status === DeliveryStatus.COMPLETED) {
        await ctx.answerCbQuery("Already marked as completed")
        return
      }

      delivery.status = DeliveryStatus.COMPLETED
      delivery.completedAt = new Date()
      await repo.save(delivery)

      // Notify customer
    //   await adminBot.telegram.sendMessage(
    //     delivery.userTelegramId,
    //     "✅ Your delivery has been completed. Enjoy your coffee ☕"
    //   )

      await ctx.editMessageText("✅ Delivery marked as COMPLETED.")
      await ctx.answerCbQuery("Delivery completed")
    }

    if (action.startsWith("PENDING_")) {
      await ctx.answerCbQuery("Delivery still in progress.")
    }
  } catch (error) {
    console.error("Admin confirmation error:", error)
    await ctx.answerCbQuery("Something went wrong")
  }
})
