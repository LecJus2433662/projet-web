// app/api/auth/connexion/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { nomUtilisateur, motDePasse } = await req.json();

  const res = await fetch(`http://localhost:3001/utilisateurs?username=${nomUtilisateur}`);
  const users = await res.json();

  const user = users.find((u: any) => u.password === motDePasse);
  if (!user) return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });

  return NextResponse.json({ token: 'fake-token-' + user.id, role: user.role });
}