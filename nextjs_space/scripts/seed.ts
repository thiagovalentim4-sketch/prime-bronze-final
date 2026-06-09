import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'Admin',
      hashedPassword,
      role: 'ADMIN',
    },
  });

  // Seed services
  const services = [
    { id: 'svc-paredao-1h', name: 'Paredão Duplo - 1 Hora', description: 'Bronzeamento artificial em paredão duplo por 1 hora. Resultado intenso e uniforme.', duration: 60, price: 39.99, category: 'BRONZEAMENTO', sortOrder: 1 },
    { id: 'svc-paredao-1h30', name: 'Paredão Duplo - 1h30', description: 'Bronzeamento artificial em paredão duplo por 1 hora e 30 minutos. Bronze mais intenso.', duration: 90, price: 49.99, category: 'BRONZEAMENTO', sortOrder: 2 },
    { id: 'svc-paredao-2h', name: 'Paredão Duplo - 2 Horas', description: 'Bronzeamento artificial em paredão duplo por 2 horas. Máxima intensidade.', duration: 120, price: 59.99, category: 'BRONZEAMENTO', sortOrder: 3 },
    { id: 'svc-banho-lua', name: 'Banho de Lua', description: 'Tratamento de clareamento corporal para uniformizar o tom da pele.', duration: 30, price: 9.99, category: 'TRATAMENTO', sortOrder: 4 },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { id: svc.id },
      update: { name: svc.name, description: svc.description, duration: svc.duration, price: svc.price, category: svc.category, sortOrder: svc.sortOrder },
      create: svc,
    });
  }

  // Seed business hours
  const hours = [
    { dayOfWeek: 0, openTime: '09:00', closeTime: '18:00', isOpen: false }, // Domingo
    { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true },  // Segunda
    { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isOpen: true },  // Terça
    { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00', isOpen: true },  // Quarta
    { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', isOpen: true },  // Quinta
    { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00', isOpen: true },  // Sexta
    { dayOfWeek: 6, openTime: '09:00', closeTime: '18:00', isOpen: true },  // Sábado
  ];

  for (const h of hours) {
    const existing = await prisma.businessHours.findFirst({ where: { dayOfWeek: h.dayOfWeek } });
    if (!existing) {
      await prisma.businessHours.create({ data: h });
    }
  }

  // Seed settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      slotInterval: 30,
      maxSimultaneous: 2,
      whatsappNumber: '5521965068219',
      address: 'Rua Guaratá, 30 - Santa Terezinha, Mesquita - RJ',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
