export type Shop = 'kitchen' | 'bar' | 'pastry';

// TODO нет логики учета причин стопа
// добавить сброс количества, если причина out_of_stock
export type StopReason =
  'out_of_stock' | 'equipment' | 'quality' | 'menu_change';

export type MenuItemStatus =
  | { kind: 'available' }
  | {
      kind: 'stopped';
      reason: StopReason;
      until: string | null; // ISO-время или null = до конца смены
    };

export interface MenuItem {
  id: string;
  title: string;
  shop: Shop;
  stock: number; // остаток в штуках, 0..99
  status: MenuItemStatus;
  updatedAt: string; // ISO
}

export interface StopItemPayload {
  reason: StopReason;
  until: string | null;
}

// TODO вынести типы фронта отдельно?

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
};

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Сломалось оборудование',
  quality: 'Вопросы к качеству партии',
  menu_change: 'Позиция выведена из меню смены',
};

export const ALL_REASONS: readonly StopReason[] = [
  'out_of_stock',
  'equipment',
  'quality',
  'menu_change',
];
