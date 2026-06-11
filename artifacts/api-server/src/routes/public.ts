import { Router, Request, Response } from "express";
import { db, servicesTable, bookingsTable, settingsTable, businessHoursTable, blockedSlotsTable } from "@workspace/db";
import { eq, and, gte, lte, inArray, count } from "drizzle-orm";

const router = Router();

// GET /api/public/services
router.get("/services", async (req: Request, res: Response) => {
  try {
    const services = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.active, true))
      .orderBy(servicesTable.sortOrder);
    res.json(services);
  } catch {
    res.json([]);
  }
});

// GET /api/public/slots?date=&serviceId=
router.get("/slots", async (req: Request, res: Response) => {
  try {
    const { date: dateStr, serviceId } = req.query as { date?: string; serviceId?: string };
    if (!dateStr || !serviceId) {
      res.status(400).json({ error: "Parâmetros obrigatórios" });
      return;
    }

    const date = new Date(dateStr + "T00:00:00");
    const dayOfWeek = date.getDay();

    const hoursRows = await db
      .select()
      .from(businessHoursTable)
      .where(eq(businessHoursTable.dayOfWeek, dayOfWeek));
    const hours = hoursRows[0];
    if (!hours || !hours.isOpen) {
      res.json({ slots: [], message: "Fechado neste dia" });
      return;
    }

    const serviceRows = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, serviceId));
    const service = serviceRows[0];
    if (!service) {
      res.status(404).json({ error: "Serviço não encontrado" });
      return;
    }

    const settingsRows = await db.select().from(settingsTable).where(eq(settingsTable.id, "default"));
    const settings = settingsRows[0];
    const slotInterval = settings?.slotInterval ?? 30;
    const maxSimultaneous = settings?.maxSimultaneous ?? 2;

    const startOfDay = new Date(dateStr + "T00:00:00");
    const endOfDay = new Date(dateStr + "T23:59:59");

    const bookings = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          gte(bookingsTable.date, startOfDay),
          lte(bookingsTable.date, endOfDay),
          inArray(bookingsTable.status, ["PENDENTE", "CONFIRMADO"])
        )
      );

    const blocked = await db
      .select()
      .from(blockedSlotsTable)
      .where(and(gte(blockedSlotsTable.date, startOfDay), lte(blockedSlotsTable.date, endOfDay)));

    const [openH, openM] = (hours.openTime ?? "09:00").split(":").map(Number);
    const [closeH, closeM] = (hours.closeTime ?? "20:00").split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const slots: { time: string; available: boolean }[] = [];

    function timeToMinutes(t: string): number {
      const [h, m] = (t ?? "00:00").split(":").map(Number);
      return (h ?? 0) * 60 + (m ?? 0);
    }

    for (let m = openMinutes; m + service.duration <= closeMinutes; m += slotInterval) {
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      const slotStart = `${hh}:${mm}`;
      const slotEndMinutes = m + service.duration;
      const slotEndHH = String(Math.floor(slotEndMinutes / 60)).padStart(2, "0");
      const slotEndMM = String(slotEndMinutes % 60).padStart(2, "0");
      const slotEnd = `${slotEndHH}:${slotEndMM}`;

      const overlapping = bookings.filter((b) => {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return m < bEnd && slotEndMinutes > bStart;
      });

      const isBlocked = blocked.some((bl) => {
        const blStart = timeToMinutes(bl.startTime);
        const blEnd = timeToMinutes(bl.endTime);
        return m < blEnd && slotEndMinutes > blStart;
      });

      slots.push({ time: slotStart, available: !isBlocked && overlapping.length < maxSimultaneous });
    }

    res.json({ slots, openTime: hours.openTime, closeTime: hours.closeTime });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao buscar horários" });
  }
});

// POST /api/public/bookings
router.post("/bookings", async (req: Request, res: Response) => {
  try {
    const { clientName, clientPhone, clientEmail, serviceId, date, startTime } = req.body ?? {};

    if (!clientName || !clientPhone || !serviceId || !date || !startTime) {
      res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
      return;
    }

    const serviceRows = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
    const service = serviceRows[0];
    if (!service) {
      res.status(404).json({ error: "Serviço não encontrado" });
      return;
    }

    const [h, m] = startTime.split(":").map(Number);
    const endMinutes = h * 60 + m + service.duration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

    const settingsRows = await db.select().from(settingsTable).where(eq(settingsTable.id, "default"));
    const settings = settingsRows[0];
    const maxSimultaneous = settings?.maxSimultaneous ?? 2;

    const startOfDay = new Date(date + "T00:00:00");
    const endOfDay = new Date(date + "T23:59:59");

    function timeToMinutes(t: string): number {
      const [hh, mm] = (t ?? "00:00").split(":").map(Number);
      return (hh ?? 0) * 60 + (mm ?? 0);
    }

    const bookings = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          gte(bookingsTable.date, startOfDay),
          lte(bookingsTable.date, endOfDay),
          inArray(bookingsTable.status, ["PENDENTE", "CONFIRMADO"])
        )
      );

    const slotStartMins = timeToMinutes(startTime);
    const slotEndMins = timeToMinutes(endTime);
    const overlapping = bookings.filter((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return slotStartMins < bEnd && slotEndMins > bStart;
    });

    if (overlapping.length >= maxSimultaneous) {
      res.status(409).json({ error: "Horário indisponível. Tente outro horário." });
      return;
    }

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        serviceId,
        date: new Date(date + "T00:00:00"),
        startTime,
        endTime,
        status: "PENDENTE",
      })
      .returning();

    res.status(201).json({ ...booking, service });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

export default router;
