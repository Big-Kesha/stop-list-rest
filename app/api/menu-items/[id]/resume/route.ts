// app/api/menu-items/[id]/resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resumeItem, StoreError } from '@/server/menu-store';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await resumeItem(id);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof StoreError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error('[POST /api/menu-items/:id/resume]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
