// src/admin-bot/notify-admin.ts
import { adminBot } from "./bot";
import { DeliveryOnTransit } from "../entities/DeliveryOnTransit";

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!;

export async function notifyAdmin(delivery: DeliveryOnTransit) {
    await adminBot.telegram.sendMessage(
        ADMIN_CHAT_ID,
        `
🚚 DELIVERY IN TRANSIT

👤 Customer: ${delivery.userName}
📦 Cart ID: ${delivery.cartId}

📍 Location:
Lat: ${delivery.latitude}
Lng: ${delivery.longitude}

Confirm delivery completion:
`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ Delivered", callback_data: `COMPLETE_${delivery.id}` },
                        { text: "❌ Not Yet", callback_data: `PENDING_${delivery.id}` },
                    ],
                ],
            },
        }
    );
}
