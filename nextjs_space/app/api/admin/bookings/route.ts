export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') ?? 'all';
    const status = searchParams.get('status') ?? '';
    const dateStr = searchParams.get('date') ?? '';

    const now = new Date();
    let where: any = {};

    if (filter === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      where.date = { gte: todayStart, lte: todayEnd };
    } else if (filter === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59);
      where.date = { gte: weekStart, lte: weekEnd };
    } else if (dateStr) {
      const start = new Date(dateStr + 'T00:00:00');
      const end = new Date(dateStr + 'T23:59:59');
      where.date = { gte: start, lte: end };
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { id, status, notes } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const booking = await prisma.booking.update({
      where: { id },
      data,
      include: { service: true },
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}
