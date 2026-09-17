import { StopListScreen } from '@/features/stop-list/ui/StopListScreen';

// app/page.tsx
export default function App({
  searchParams,
}: {
  searchParams: { shop?: string; status?: string };
}) {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Стоп-лист</h1>
      <StopListScreen filters={{ shop: 'all', status: 'all' }} />
    </main>
  );
}
