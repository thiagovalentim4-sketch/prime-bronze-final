import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      const defaultSettings = await prisma.settings.create({
        data: { id: 'default' },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotInterval, maxSimultaneous, whatsappNumber, address } = body;

    const settings = await prisma.settings.update({
      where: { id: 'default' },
      data: {
        ...(slotInterval && { slotInterval: parseInt(slotInterval) }),
        ...(maxSimultaneous && { maxSimultaneous: parseInt(maxSimultaneous) }),
        ...(whatsappNumber && { whatsappNumber }),
        ...(address && { address }),
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    );
  }
}