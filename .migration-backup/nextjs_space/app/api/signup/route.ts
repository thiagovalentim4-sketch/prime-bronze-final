export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, hashedPassword, name: name ?? 'Admin', role: 'ADMIN' },
    });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }
}
