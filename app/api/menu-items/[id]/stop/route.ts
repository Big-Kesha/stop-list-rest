// app/api/menu-items/[id]/stop/route.ts
// TODO добавить валидацию по правилам

// import { NextRequest, NextResponse } from 'next/server';
// import { stopItem, StoreError } from '@/server/menu-store';
// import type { StopItemPayload } from '@/types/menu';

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const body = (await req.json()) as StopItemPayload;

//   try {
//     const updated = await stopItem(params.id, body);
//     return NextResponse.json(updated);
//   } catch (error) {
//     if (error instanceof StoreError) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: error.status }
//       );
//     }
//     console.error('[POST /api/menu-items/:id/stop]', error);
//     return NextResponse.json({ error: 'Internal error' }, { status: 500 });
//   }
// }

// app/api/menu-items/[id]/stop/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stopItem, StoreError } from '@/server/menu-store';
import type { StopItemPayload, StopReason } from '@/types/menu';

const VALID_REASONS: readonly StopReason[] = [
  'out_of_stock',
  'equipment',
  'quality',
  'menu_change',
];

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MS = 15 * 60 * 1000;

export function validateUntil(
  value: string | null,
  now = Date.now()
): string | null {
  if (value === null) return null; // до конца смены — всегда валидно
  if (typeof value !== 'string') return 'Некорректное время';
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return 'Некорректное время';
  if (ts <= now) return 'Время должно быть в будущем';
  if (ts - now > MAX_AHEAD_MS) return 'Не больше чем на 24 часа вперёд';
  if (ts % STEP_MS !== 0) return 'Шаг — 15 минут';
  return null;
}

type ParseResult =
  { ok: true; value: StopItemPayload } | { ok: false; error: string };

export function parseStopPayload(body: unknown): ParseResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, error: 'Тело запроса должно быть объектом' };
  }

  const { reason, until } = body as Record<string, unknown>;

  // Причина стопа — обязательна и только из списка
  if (typeof reason !== 'string' || reason.length === 0) {
    return { ok: false, error: 'Укажите причину стопа' };
  }
  if (!VALID_REASONS.includes(reason as StopReason)) {
    return { ok: false, error: 'Недопустимая причина стопа' };
  }

  // Срок стопа — null либо валидное будущее время
  let normalizedUntil: string | null = null;
  if (until !== null && until !== undefined) {
    if (typeof until !== 'string') {
      return { ok: false, error: 'Некорректное время' };
    }
    const untilError = validateUntil(until);
    if (untilError) return { ok: false, error: untilError };
    normalizedUntil = until;
  }

  return {
    ok: true,
    value: {
      reason: reason as StopReason,
      until: normalizedUntil,
    },
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = parseStopPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const { id } = await params;
    const updated = await stopItem(id, parsed.value);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof StoreError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error('[POST /api/menu-items/:id/stop]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
