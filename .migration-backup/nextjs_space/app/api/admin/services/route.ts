export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const services = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description || null,
        duration: body.duration,
        price: body.price,
        category: body.category || 'BRONZEAMENTO',
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.duration !== undefined) data.duration = body.duration;
    if (body.price !== undefined) data.price = body.price;
    if (body.category !== undefined) data.category = body.category;
    if (body.active !== undefined) data.active = body.active;
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;

    const service = await prisma.service.update({ where: { id: body.id }, data });
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}
