import { NextResponse } from 'next/server';
import { getAllItems } from '@/server/menu-store';

export async function GET() {
  try {
    const items = await getAllItems();
    return NextResponse.json(items);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
