import { userService } from '@/services/user.service';
import { signUpSchema } from '@/schemas/auth';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = signUpSchema.parse(body);
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userService.getUserByEmail(normalizedEmail);
    if (existingUser) return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });

    const user = await userService.createUser(normalizedEmail, password, name.trim());
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Dados inválidos', details: error.flatten() }, { status: 400 });
    console.error('Sign up error:', error);
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}
