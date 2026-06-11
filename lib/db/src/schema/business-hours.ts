import { pgTable, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const businessHoursTable = pgTable("business_hours", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  dayOfWeek: integer("day_of_week").notNull(),
  openTime: text("open_time").notNull().default("09:00"),
  closeTime: text("close_time").notNull().default("20:00"),
  isOpen: boolean("is_open").notNull().default(true),
});

export const insertBusinessHoursSchema = createInsertSchema(businessHoursTable).omit({ id: true });
export type InsertBusinessHours = z.infer<typeof insertBusinessHoursSchema>;
export type BusinessHours = typeof businessHoursTable.$inferSelect;
