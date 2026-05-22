import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { sessionId, items } = await req.json();

  const res = await fetch('http://localhost:5190/api/Checkout/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, items }),
  });

  const text = await res.text();
  if (!res.ok) return NextResponse.json({ error: text }, { status: res.status });
  return NextResponse.json({ success: true });
}