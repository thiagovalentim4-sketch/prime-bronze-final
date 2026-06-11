import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blockedSlotsTable = pgTable("blocked_slots", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: timestamp("date", { withTimezone: true }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBlockedSlotSchema = createInsertSchema(blockedSlotsTable).omit({ id: true, createdAt: true });
export type InsertBlockedSlot = z.infer<typeof insertBlockedSlotSchema>;
export type BlockedSlot = typeof blockedSlotsTable.$inferSelect;
