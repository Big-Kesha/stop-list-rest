import { Badge } from '@/shared/ui/Badge';
import { SHOP_LABELS, type Shop } from '@/types/menu';

const toneByShop: Record<Shop, 'neutral' | 'accent' | 'warning'> = {
  kitchen: 'accent',
  bar: 'warning',
  pastry: 'neutral',
};

export function ShopBadge({ shop }: { shop: Shop }) {
  return <Badge tone={toneByShop[shop]}>{SHOP_LABELS[shop]}</Badge>;
}
