// app/page.tsx
import { StopListScreen } from '@/features/stop-list/ui/StopListScreen';
import { parseFilters } from '@/features/stop-list/model/filters';

type Props = {
  searchParams: Promise<{
    shop?: string | string[];
    status?: string | string[];
  }>;
};

export default async function Page({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parseFilters(raw);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Стоп-лист</h1>
      <StopListScreen initialFilters={filters} />
    </main>
  );
}
