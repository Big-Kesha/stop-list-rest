import { StopListDebug } from '@/features/stop-list/ui/StopListDebug';

// app/page.tsx
export default function Page({
  searchParams,
}: {
  searchParams: { shop?: string; status?: string };
}) {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Стоп-лист — отладка</h1>
      <StopListDebug />
    </main>

    // <StopListScreen
    //   initialFilters={{ shop: searchParams.shop, status: searchParams.status }}
    // />
  );
}
