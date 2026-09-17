'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-xl font-semibold text-ink">Что-то пошло не так</h1>
      <p className="max-w-md text-center text-sm text-ink-muted">
        {error.message ||
          'Произошла непредвиденная ошибка. Попробуйте обновить страницу.'}
      </p>
      <div className="flex gap-2">
        <Button variant="primary" onClick={reset}>
          Попробовать снова
        </Button>
        <Button variant="secondary" onClick={() => location.reload()}>
          Обновить страницу
        </Button>
      </div>
    </div>
  );
}
