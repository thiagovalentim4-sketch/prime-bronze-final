import { Router, Request, Response, NextFunction } from "express";
import { db, usersTable, servicesTable, bookingsTable, settingsTable, businessHoursTable } from "@workspace/db";
import { eq, and, gte, lte, ne, inArray, asc, desc, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "prime-bronze-secret-key-2024";

// Middleware to check JWT auth
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "") || req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// POST /api/admin/auth/login
router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios" });
      return;
    }
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
    const user = users[0];
    if (!user) {
      res.status(401).json({ error: "Email ou senha inválidos" });
      return;
    }
    const valid = await bcrypt.compare(password, user.hashedPassword);
    if (!valid) {
      res.status(401).json({ error: "Email ou senha inválidos" });
      return;
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// POST /api/admin/auth/signup
router.post("/auth/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      res.status(400).json({ error: "Email já cadastrado" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({ email, hashedPassword, name: name ?? "Admin", role: "ADMIN" }).returning();
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

// GET /api/admin/auth/me
router.get("/auth/me", requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ id: user.id, email: user.email, role: user.role });
});

// GET /api/admin/stats
router.get("/stats", requireAuth, async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59);

    const [todayBookings, weekBookings, pendingBookings, todayDetail, weekDetail] = await Promise.all([
      db.select({ count: count() }).from(bookingsTable).where(and(gte(bookingsTable.date, todayStart), lte(bookingsTable.date, todayEnd), ne(bookingsTable.status, "CANCELADO"))),
      db.select({ count: count() }).from(bookingsTable).where(and(gte(bookingsTable.date, weekStart), lte(bookingsTable.date, weekEnd), ne(bookingsTable.status, "CANCELADO"))),
      db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "PENDENTE")),
      db.select({ serviceId: bookingsTable.serviceId }).from(bookingsTable).where(and(gte(bookingsTable.date, todayStart), lte(bookingsTable.date, todayEnd), ne(bookingsTable.status, "CANCELADO"))),
      db.select({ serviceId: bookingsTable.serviceId }).from(bookingsTable).where(and(gte(bookingsTable.date, weekStart), lte(bookingsTable.date, weekEnd), ne(bookingsTable.status, "CANCELADO"))),
    ]);

    const allServiceIds = [...new Set([...todayDetail.map(b => b.serviceId), ...weekDetail.map(b => b.serviceId)])];
    let serviceMap: Record<string, number> = {};
    if (allServiceIds.length > 0) {
      const services = await db.select({ id: servicesTable.id, price: servicesTable.price }).from(servicesTable).where(inArray(servicesTable.id, allServiceIds));
      serviceMap = Object.fromEntries(services.map(s => [s.id, s.price]));
    }

    const todayRevenue = todayDetail.reduce((sum, b) => sum + (serviceMap[b.serviceId] ?? 0), 0);
    const weekRevenue = weekDetail.reduce((sum, b) => sum + (serviceMap[b.serviceId] ?? 0), 0);

    res.json({
      todayBookings: todayBookings[0]?.count ?? 0,
      weekBookings: weekBookings[0]?.count ?? 0,
      pendingBookings: pendingBookings[0]?.count ?? 0,
      todayRevenue,
      weekRevenue,
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro" });
  }
});

// GET /api/admin/bookings
router.get("/bookings", requireAuth, async (req: Request, res: Response) => {
  try {
    const { filter = "all", status = "", date: dateStr = "" } = req.query as Record<string, string>;
    const now = new Date();

    let conditions: any[] = [];
    if (filter === "today") {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const e = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      conditions.push(gte(bookingsTable.date, s), lte(bookingsTable.date, e));
    } else if (filter === "week") {
      const s = new Date(now);
      s.setDate(s.getDate() - s.getDay());
      s.setHours(0, 0, 0, 0);
      const e = new Date(s);
      e.setDate(e.getDate() + 6);
      e.setHours(23, 59, 59);
      conditions.push(gte(bookingsTable.date, s), lte(bookingsTable.date, e));
    } else if (dateStr) {
      conditions.push(gte(bookingsTable.date, new Date(dateStr + "T00:00:00")), lte(bookingsTable.date, new Date(dateStr + "T23:59:59")));
    }

    if (status && status !== "all") {
      conditions.push(eq(bookingsTable.status, status));
    }

    const bookings = await db
      .select({
        id: bookingsTable.id,
        clientName: bookingsTable.clientName,
        clientPhone: bookingsTable.clientPhone,
        clientEmail: bookingsTable.clientEmail,
        date: bookingsTable.date,
        startTime: bookingsTable.startTime,
        endTime: bookingsTable.endTime,
        status: bookingsTable.status,
        notes: bookingsTable.notes,
        serviceId: bookingsTable.serviceId,
        serviceName: servicesTable.name,
        servicePrice: servicesTable.price,
      })
      .from(bookingsTable)
      .leftJoin(servicesTable, eq(bookingsTable.serviceId, servicesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(bookingsTable.date), asc(bookingsTable.startTime));

    const result = bookings.map(b => ({
      ...b,
      service: { id: b.serviceId, name: b.serviceName, price: b.servicePrice },
    }));

    res.json(result);
  } catch (e) {
    req.log.error(e);
    res.json([]);
  }
});

// PATCH /api/admin/bookings
router.patch("/bookings", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id, status, notes } = req.body ?? {};
    if (!id) {
      res.status(400).json({ error: "ID obrigatório" });
      return;
    }
    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const [booking] = await db.update(bookingsTable).set(data).where(eq(bookingsTable.id, id)).returning();
    res.json(booking);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao atualizar" });
  }
});

// GET /api/admin/services
router.get("/services", requireAuth, async (req: Request, res: Response) => {
  try {
    const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
    res.json(services);
  } catch (e) {
    req.log.error(e);
    res.json([]);
  }
});

// POST /api/admin/services
router.post("/services", requireAuth, async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    const [service] = await db.insert(servicesTable).values({
      name: body.name,
      description: body.description || null,
      duration: body.duration,
      price: body.price,
      category: body.category || "BRONZEAMENTO",
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? 0,
    }).returning();
    res.status(201).json(service);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao criar serviço" });
  }
});

// PATCH /api/admin/services
router.patch("/services", requireAuth, async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    if (!body.id) {
      res.status(400).json({ error: "ID obrigatório" });
      return;
    }
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.duration !== undefined) data.duration = body.duration;
    if (body.price !== undefined) data.price = body.price;
    if (body.category !== undefined) data.category = body.category;
    if (body.active !== undefined) data.active = body.active;
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;

    const [service] = await db.update(servicesTable).set(data).where(eq(servicesTable.id, body.id)).returning();
    res.json(service);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao atualizar" });
  }
});

// GET /api/admin/settings
router.get("/settings", requireAuth, async (req: Request, res: Response) => {
  try {
    const settings = await db.select().from(settingsTable).where(eq(settingsTable.id, "default"));
    const hours = await db.select().from(businessHoursTable).orderBy(asc(businessHoursTable.dayOfWeek));
    res.json({ settings: settings[0] ?? null, hours });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro" });
  }
});

// PUT /api/admin/settings
router.put("/settings", requireAuth, async (req: Request, res: Response) => {
  try {
    const { settings, hours } = req.body ?? {};
    if (settings) {
      const existing = await db.select().from(settingsTable).where(eq(settingsTable.id, "default"));
      if (existing.length > 0) {
        await db.update(settingsTable).set({
          slotInterval: settings.slotInterval,
          maxSimultaneous: settings.maxSimultaneous,
          whatsappNumber: settings.whatsappNumber,
          address: settings.address,
        }).where(eq(settingsTable.id, "default"));
      } else {
        await db.insert(settingsTable).values({
          id: "default",
          slotInterval: settings.slotInterval ?? 30,
          maxSimultaneous: settings.maxSimultaneous ?? 2,
          whatsappNumber: settings.whatsappNumber ?? "",
          address: settings.address ?? "",
        });
      }
    }
    if (hours && Array.isArray(hours)) {
      for (const h of hours) {
        if (h?.id) {
          await db.update(businessHoursTable).set({ openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen }).where(eq(businessHoursTable.id, h.id));
        }
      }
    }
    res.json({ success: true });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao salvar" });
  }
});

// GET /api/admin/reports
router.get("/reports", requireAuth, async (req: Request, res: Response) => {
  try {
    const { period = "daily" } = req.query as { period: string };
    const now = new Date();
    let startDate: Date, endDate: Date;

    if (period === "daily") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else if (period === "weekly") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const allBookings = await db
      .select({
        id: bookingsTable.id,
        status: bookingsTable.status,
        serviceId: bookingsTable.serviceId,
        serviceName: servicesTable.name,
        servicePrice: servicesTable.price,
      })
      .from(bookingsTable)
      .leftJoin(servicesTable, eq(bookingsTable.serviceId, servicesTable.id))
      .where(and(gte(bookingsTable.date, startDate), lte(bookingsTable.date, endDate)));

    const totalBookings = allBookings.length;
    const completed = allBookings.filter((b) => b.status === "CONCLUIDO").length;
    const pending = allBookings.filter((b) => b.status === "PENDENTE").length;
    const cancelled = allBookings.filter((b) => b.status === "CANCELADO").length;
    const totalRevenue = allBookings
      .filter((b) => b.status !== "CANCELADO")
      .reduce((sum, b) => sum + (b.servicePrice ?? 0), 0);

    const serviceCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const b of allBookings) {
      if (b.status === "CANCELADO") continue;
      const name = b.serviceName ?? "Desconhecido";
      if (!serviceCounts[name]) serviceCounts[name] = { name, count: 0, revenue: 0 };
      serviceCounts[name].count++;
      serviceCounts[name].revenue += b.servicePrice ?? 0;
    }

    const topServices = Object.values(serviceCounts).sort((a, b) => b.count - a.count).slice(0, 5);

    res.json({
      period,
      totalBookings,
      totalRevenue,
      completed,
      pending,
      cancelled,
      topServices,
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
});

export default router;
