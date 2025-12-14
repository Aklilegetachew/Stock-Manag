
import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

export const adminBot = new Telegraf(process.env.ADMIN_BOT_TOKEN!);
