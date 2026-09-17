import type { Shop } from '@/types/menu';

export type ShopFilter = Shop | 'all';
export type StatusFilter = 'all' | 'available' | 'stopped';

export type MenuFilters = {
  shop: ShopFilter;
  status: StatusFilter;
};

export const DEFAULT_FILTERS: MenuFilters = {
  shop: 'all',
  status: 'all',
};

const SHOPS: readonly Shop[] = ['kitchen', 'bar', 'pastry'];
const STATUSES: readonly Exclude<StatusFilter, 'all'>[] = [
  'available',
  'stopped',
];

function isShop(v: unknown): v is Shop {
  return typeof v === 'string' && (SHOPS as readonly string[]).includes(v);
}

function isStatus(v: unknown): v is Exclude<StatusFilter, 'all'> {
  return typeof v === 'string' && (STATUSES as readonly string[]).includes(v);
}

export function parseFilters(raw: {
  shop?: string | string[];
  status?: string | string[];
}): MenuFilters {
  const shopRaw = Array.isArray(raw.shop) ? raw.shop[0] : raw.shop;
  const statusRaw = Array.isArray(raw.status) ? raw.status[0] : raw.status;

  return {
    shop: isShop(shopRaw) ? shopRaw : DEFAULT_FILTERS.shop,
    status: isStatus(statusRaw) ? statusRaw : DEFAULT_FILTERS.status,
  };
}

export function filtersToQuery(filters: MenuFilters): string {
  const sp = new URLSearchParams();
  if (filters.shop !== 'all') sp.set('shop', filters.shop);
  if (filters.status !== 'all') sp.set('status', filters.status);
  return sp.toString();
}

export function isSameFilters(a: MenuFilters, b: MenuFilters): boolean {
  return a.shop === b.shop && a.status === b.status;
}
