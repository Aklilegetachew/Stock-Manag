// src/admin-bot/notify-admin.ts
import { adminBot } from "./bot"
import { DeliveryOnTransit } from "../entities/DeliveryOnTransit"

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!

export async function notifyAdmin(delivery: DeliveryOnTransit) {
  const googleMapLink = `https://www.google.com/maps?q=${delivery.latitude},${delivery.longitude}`

  // Prepare cart details as text
  const cartText = delivery.carts
    ?.map(
      (item) =>
        `• ${item.productName} (${item.productType}) - ${item.size} x${item.quantity}`
    )
    .join("\n")

  await adminBot.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `
🚚 *DELIVERY IN TRANSIT*

👤 *Customer:* ${delivery.userName}
📞 *Phone:* ${delivery.phoneNumber}
💳 *Transaction:* ${delivery.transactionNumber}
💰 *Total Payment:* ${delivery.totalPayment}

📍 *Delivery Address:*
${delivery.address}

🗺️ *Map:*
${googleMapLink}

🛒 *Cart Items:*
${cartText || "No items"}

Confirm delivery completion:
`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Delivered", callback_data: `COMPLETE_${delivery.id}` },
            { text: "❌ Not Yet", callback_data: `PENDING_${delivery.id}` },
          ],
        ],
      },
    }
  )
}
