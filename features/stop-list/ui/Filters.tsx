'use client';

import { SHOP_LABELS } from '@/types/menu';
import type { MenuFilters } from '../model/filters';
import { Select } from '@/shared/ui/Select';

type Props = {
  shop: MenuFilters['shop'];
  status: MenuFilters['status'];
  onShopChange: (shop: MenuFilters['shop']) => void;
  onStatusChange: (status: MenuFilters['status']) => void;
};

const SHOP_OPTIONS: { value: MenuFilters['shop']; label: string }[] = [
  { value: 'all', label: 'Все цеха' },
  { value: 'kitchen', label: SHOP_LABELS.kitchen },
  { value: 'bar', label: SHOP_LABELS.bar },
  { value: 'pastry', label: SHOP_LABELS.pastry },
];

const STATUS_OPTIONS: { value: MenuFilters['status']; label: string }[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'available', label: 'В продаже' },
  { value: 'stopped', label: 'В стоп-листе' },
];

export function Filters({ shop, status, onShopChange, onStatusChange }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <Select
        label="Цех"
        value={shop}
        options={SHOP_OPTIONS}
        onChange={onShopChange}
      />
      <Select
        label="Статус"
        value={status}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
      />
    </div>
  );
}
