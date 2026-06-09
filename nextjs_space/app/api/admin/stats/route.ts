export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59);

    const [todayBookings, weekBookings, pendingBookings, todayBookingsWithService, weekBookingsWithService] = await Promise.all([
      prisma.booking.count({ where: { date: { gte: todayStart, lte: todayEnd }, status: { not: 'CANCELADO' } } }),
      prisma.booking.count({ where: { date: { gte: weekStart, lte: weekEnd }, status: { not: 'CANCELADO' } } }),
      prisma.booking.count({ where: { status: 'PENDENTE' } }),
      prisma.booking.findMany({ where: { date: { gte: todayStart, lte: todayEnd }, status: { not: 'CANCELADO' } }, include: { service: true } }),
      prisma.booking.findMany({ where: { date: { gte: weekStart, lte: weekEnd }, status: { not: 'CANCELADO' } }, include: { service: true } }),
    ]);

    const todayRevenue = (todayBookingsWithService ?? []).reduce((sum: number, b: any) => sum + (b?.service?.price ?? 0), 0);
    const weekRevenue = (weekBookingsWithService ?? []).reduce((sum: number, b: any) => sum + (b?.service?.price ?? 0), 0);

    return NextResponse.json({ todayBookings, weekBookings, pendingBookings, todayRevenue, weekRevenue });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
