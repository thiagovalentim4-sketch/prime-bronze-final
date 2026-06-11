export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!dateStr || !serviceId) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios' }, { status: 400 });
    }

    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = date.getDay();

    // Get business hours for the day
    const hours = await prisma.businessHours.findFirst({ where: { dayOfWeek } });
    if (!hours || !hours.isOpen) {
      return NextResponse.json({ slots: [], message: 'Fechado neste dia' });
    }

    // Get service duration
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
    }

    // Get settings
    const settings = await prisma.settings.findUnique({ where: { id: 'default' } });
    const slotInterval = settings?.slotInterval ?? 30;
    const maxSimultaneous = settings?.maxSimultaneous ?? 2;

    // Get existing bookings for the date
    const startOfDay = new Date(dateStr + 'T00:00:00');
    const endOfDay = new Date(dateStr + 'T23:59:59');
    const bookings = await prisma.booking.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDENTE', 'CONFIRMADO'] },
      },
    });

    // Get blocked slots
    const blocked = await prisma.blockedSlot.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay } },
    });

    // Generate available slots
    const [openH, openM] = (hours?.openTime ?? '09:00').split(':').map(Number);
    const [closeH, closeM] = (hours?.closeTime ?? '20:00').split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const slots: { time: string; available: boolean }[] = [];

    for (let m = openMinutes; m + service.duration <= closeMinutes; m += slotInterval) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      const slotStart = `${hh}:${mm}`;
      const slotEndMinutes = m + service.duration;
      const slotEndHH = String(Math.floor(slotEndMinutes / 60)).padStart(2, '0');
      const slotEndMM = String(slotEndMinutes % 60).padStart(2, '0');
      const slotEnd = `${slotEndHH}:${slotEndMM}`;

      // Check overlap with existing bookings
      const overlapping = (bookings ?? []).filter((b: any) => {
        const bStart = timeToMinutes(b?.startTime ?? '00:00');
        const bEnd = timeToMinutes(b?.endTime ?? '00:00');
        return m < bEnd && slotEndMinutes > bStart;
      });

      // Check blocked slots
      const isBlocked = (blocked ?? []).some((bl: any) => {
        const blStart = timeToMinutes(bl?.startTime ?? '00:00');
        const blEnd = timeToMinutes(bl?.endTime ?? '00:00');
        return m < blEnd && slotEndMinutes > blStart;
      });

      const available = !isBlocked && (overlapping?.length ?? 0) < maxSimultaneous;
      slots.push({ time: slotStart, available });
    }

    return NextResponse.json({ slots, openTime: hours.openTime, closeTime: hours.closeTime });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar horários' }, { status: 500 });
  }
}

function timeToMinutes(time: string): number {
  const [h, m] = (time ?? '00:00').split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}
