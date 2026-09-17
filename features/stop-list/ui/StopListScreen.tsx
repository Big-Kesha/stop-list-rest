'use client';
export function StopListScreen({ initialFilters }) {
  const filters = useFilters(initialFilters); // URL как источник правды
  const { data, isLoading, isError, refetch } = useQuery(
    menuItemsQueryOptions(filters)
  );
  const stop = useStopItem();
  const resume = useResumeItem();

  return (
    <>
      <Filters value={filters} onChange={filters.set} />
      <StopListTable
        items={data ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onStop={(id) => setPanelItem(id)} // открыть панель
        onResume={(id) => resume.mutate(id)} // сразу мутация
      />
      {panelItem && (
        <StopReasonPanel
          onSubmit={(payload) => stop.mutate({ id: panelItem, ...payload })}
        />
      )}
    </>
  );
}
