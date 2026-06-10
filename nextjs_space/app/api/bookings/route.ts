import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    const query: any = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const bookings = await prisma.booking.findMany({
      where: query,
      include: { service: true },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar agendamentos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, clientEmail, serviceId, date, startTime, notes } = body;

    if (!clientName || !clientPhone || !serviceId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    const [startHour, startMin] = startTime.split(':').map(Number);
    const endDate = new Date(date);
    endDate.setHours(startHour, startMin + service.duration, 0, 0);

    const endHour = Math.floor((startMin + service.duration) / 60) + startHour;
    const endMin = (startMin + service.duration) % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientPhone,
        clientEmail: clientEmail || undefined,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        notes: notes || undefined,
      },
      include: { service: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
      { status: 500 }
    );
  }
}