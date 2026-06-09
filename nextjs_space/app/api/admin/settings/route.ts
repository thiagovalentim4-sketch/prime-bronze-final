export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'default' } });
    const hours = await prisma.businessHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
    return NextResponse.json({ settings, hours });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const { settings, hours } = body ?? {};

    // Update settings
    if (settings) {
      await prisma.settings.upsert({
        where: { id: 'default' },
        update: {
          slotInterval: settings.slotInterval,
          maxSimultaneous: settings.maxSimultaneous,
          whatsappNumber: settings.whatsappNumber,
          address: settings.address,
        },
        create: {
          id: 'default',
          slotInterval: settings.slotInterval ?? 30,
          maxSimultaneous: settings.maxSimultaneous ?? 2,
          whatsappNumber: settings.whatsappNumber ?? '',
          address: settings.address ?? '',
        },
      });
    }

    // Update business hours
    if (hours && Array.isArray(hours)) {
      for (const h of hours) {
        if (h?.id) {
          await prisma.businessHours.update({
            where: { id: h.id },
            data: { openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}
