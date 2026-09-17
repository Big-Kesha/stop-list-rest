import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'danger' | 'warning' | 'accent' | 'muted';

const tones: Record<Tone, string> = {
  neutral: 'bg-bg text-ink border-line',
  success: 'bg-green-50 text-green-800 border-green-200',
  danger: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  accent: 'bg-accent-100 text-accent border-accent/20',
  muted: 'bg-bg text-ink-subtle border-line',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xl border px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
