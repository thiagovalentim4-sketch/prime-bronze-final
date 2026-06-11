import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: text("id").primaryKey().default("default"),
  slotInterval: integer("slot_interval").notNull().default(30),
  maxSimultaneous: integer("max_simultaneous").notNull().default(2),
  whatsappNumber: text("whatsapp_number").notNull().default("5521965068219"),
  address: text("address").notNull().default("Rua Guaratá, 30 - Santa Terezinha, Mesquita - RJ"),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
