export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientPhone, clientEmail, serviceId, date, startTime } = body ?? {};

    if (!clientName || !clientPhone || !serviceId || !date || !startTime) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
    }

    // Get service
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
    }

    // Calculate end time
    const [h, m] = startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + service.duration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    // Check availability
    const settings = await prisma.settings.findUnique({ where: { id: 'default' } });
    const maxSimultaneous = settings?.maxSimultaneous ?? 2;

    const bookingDate = new Date(date + 'T00:00:00');
    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    const overlapping = await prisma.booking.count({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDENTE', 'CONFIRMADO'] },
        OR: [
          { AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }] },
          { AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }] },
          { AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }] },
        ],
      },
    });

    if (overlapping >= maxSimultaneous) {
      return NextResponse.json({ error: 'Horário indisponível. Tente outro horário.' }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        serviceId,
        date: bookingDate,
        startTime,
        endTime,
        status: 'PENDENTE',
      },
      include: { service: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 });
  }
}
