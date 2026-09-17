import type { MenuItem, StopItemPayload } from '@/types/menu';
import { SEED } from './seed';

// TODO дописать статусы ошибок
export class StoreError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'StoreError';
  }
}

const store = new Map<string, MenuItem>(SEED.map((item) => [item.id, item]));

async function withDelayAndChaos<T>(fn: () => T): Promise<T> {
  const LATENCY_MS = 600;
  const ERROR_RATE = 0.2;

  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  if (Math.random() < ERROR_RATE) {
    throw new StoreError('Сервис временно недоступен', 503);
  }

  return fn();
}

// Публичное API стора — роуты работают только через него
export async function getAllItems(): Promise<MenuItem[]> {
  return withDelayAndChaos(() => Array.from(store.values()));
}

export async function stopItem(
  id: string,
  payload: StopItemPayload
): Promise<MenuItem> {
  return withDelayAndChaos(() => {
    const item = store.get(id);
    if (!item) throw new StoreError('Позиция не найдена', 404);

    // TODO
    // повторную постановку в стоп нельзя, добавить форму открытия стопа в режиме редактирования
    if (item.status.kind === 'stopped') return item;

    const updated: MenuItem = {
      ...item,
      status: { kind: 'stopped', reason: payload.reason, until: payload.until },
      updatedAt: new Date().toISOString(),
    };
    store.set(id, updated);
    return updated;
  });
}

export async function resumeItem(id: string): Promise<MenuItem> {
  return withDelayAndChaos(() => {
    const item = store.get(id);
    console.log('log id', id);

    if (!item) throw new StoreError('Позиция не найдена', 404);

    const updated: MenuItem = {
      ...item,
      status: { kind: 'available' },
    };
    store.set(id, updated);
    return updated;
  });
}
