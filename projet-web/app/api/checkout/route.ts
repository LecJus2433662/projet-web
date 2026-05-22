import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const mappedItems = body.items.map((i: any) => ({
      ProduitId: i.id,        // ✅ item.id = l'id du produit en BD
      Nom:       i.nom,
      Prix:      i.prix,
      Quantite:  i.quantite,
    }));

    const res = await fetch('http://localhost:5190/api/Checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items:         mappedItems,
        utilisateurId: body.utilisateurId ?? '',
      }),
    });

    const text = await res.text();
    if (!text) return NextResponse.json({ error: 'Réponse vide du backend' }, { status: 500 });
    if (!res.ok) return NextResponse.json({ error: text }, { status: res.status });

    return NextResponse.json(JSON.parse(text));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}