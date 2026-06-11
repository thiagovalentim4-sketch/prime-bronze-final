import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { usersTable, servicesTable, settingsTable, businessHoursTable } from './schema/index.js';
import { eq } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  // Admin user
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, 'admin@primebronze.com'));
  if (existing.length === 0) {
    const hash = await bcrypt.hash('primebronze2026', 10);
    await db.insert(usersTable).values({
      id: randomUUID(), email: 'admin@primebronze.com', name: 'Admin',
      hashedPassword: hash, role: 'admin',
    });
    console.log('✓ Admin user created: admin@primebronze.com / primebronze2026');
  } else {
    console.log('✓ Admin user already exists');
  }

  // Services
  const svcs = await db.select().from(servicesTable);
  if (svcs.length === 0) {
    await db.insert(servicesTable).values([
      { id: randomUUID(), name: 'Bronzeamento Simples (1 lado)', description: 'Sessão de bronzeamento de um lado do corpo.', duration: 30, price: 3500, category: 'simples', active: true, sortOrder: 0 },
      { id: randomUUID(), name: 'Bronzeamento Simples (2 lados)', description: 'Sessão completa de bronzeamento dos dois lados do corpo.', duration: 60, price: 6000, category: 'simples', active: true, sortOrder: 1 },
      { id: randomUUID(), name: 'Paredão Duplo (1 lado)', description: 'Bronzeamento com paredão duplo de um lado para resultado mais intenso.', duration: 30, price: 4500, category: 'duplo', active: true, sortOrder: 2 },
      { id: randomUUID(), name: 'Paredão Duplo (2 lados)', description: 'Bronzeamento completo com paredão duplo dos dois lados.', duration: 60, price: 8000, category: 'duplo', active: true, sortOrder: 3 },
      { id: randomUUID(), name: 'Banho de Lua', description: 'Tratamento exclusivo para clarear e realçar a pele com efeito luminoso.', duration: 45, price: 5000, category: 'especial', active: true, sortOrder: 4 },
      { id: randomUUID(), name: 'Aluguel de Toalhas', description: 'Toalha limpa e higienizada para uso durante a sessão.', duration: 0, price: 500, category: 'extra', active: true, sortOrder: 5 },
    ]);
    console.log('✓ 6 services seeded');
  } else {
    // Check if towel service exists, add if missing
    const towelExists = svcs.find(s => s.name === 'Aluguel de Toalhas');
    if (!towelExists) {
      await db.insert(servicesTable).values({
        id: randomUUID(), name: 'Aluguel de Toalhas', description: 'Toalha limpa e higienizada para uso durante a sessão.', duration: 0, price: 500, category: 'extra', active: true, sortOrder: 5,
      });
      console.log('✓ Aluguel de Toalhas service added');
    } else {
      console.log('✓ Services already exist');
    }
  }

  // Settings
  const stg = await db.select().from(settingsTable);
  if (stg.length === 0) {
    await db.insert(settingsTable).values({
      id: 'default', slotInterval: 30, maxSimultaneous: 2,
      whatsappNumber: '5521965068219', address: 'Rua Guaratá, 30 - Santa Terezinha, Mesquita - RJ',
    });
    console.log('✓ Settings seeded');
  }

  // Business hours
  const hrs = await db.select().from(businessHoursTable);
  if (hrs.length === 0) {
    const rows = [];
    for (let day = 0; day <= 6; day++) {
      rows.push({
        id: randomUUID(), dayOfWeek: day,
        openTime: day === 0 ? '08:00' : '09:00',
        closeTime: day === 0 ? '12:00' : day === 6 ? '18:00' : '20:00',
        isOpen: day >= 0 && day <= 6,
      });
    }
    await db.insert(businessHoursTable).values(rows);
    console.log('✓ Business hours seeded (Mon-Fri 9-20h, Sat 9-18h, Sun closed)');
  }

  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
