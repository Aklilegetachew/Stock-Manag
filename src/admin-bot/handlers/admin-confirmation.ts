// src/admin-bot/handlers/admin-confirmation.ts
import { adminBot } from "../bot";
import { AppDataSource } from "../../data-source";
import { DeliveryOnTransit, DeliveryStatus } from "../../entities/DeliveryOnTransit";

adminBot.on("callback_query", async (ctx) => {
    const action = (ctx.callbackQuery as { data?: string }).data;
    if (!action) return;
    const repo = AppDataSource.getRepository(DeliveryOnTransit);

    if (action.startsWith("COMPLETE_")) {
        const id = Number(action.split("_")[1]);

        const delivery = await repo.findOneBy({ id });
        if (!delivery) return;

        delivery.status = DeliveryStatus.COMPLETED;
        delivery.completedAt = new Date();
        await repo.save(delivery);

        // Notify customer
        await adminBot.telegram.sendMessage(
            delivery.userTelegramId,
            "✅ Your delivery has been completed. Enjoy your coffee ☕"
        );

        await ctx.editMessageText("✅ Delivery marked as COMPLETED.");
    }

    if (action.startsWith("PENDING_")) {
        await ctx.answerCbQuery("Delivery still in progress.");
    }
});
