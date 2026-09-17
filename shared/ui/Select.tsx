'use client';

import type { ChangeEvent } from 'react';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: Props<T>) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-sm text-ink-muted">{label}</span>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="h-10 rounded-md border border-line bg-white px-3 text-sm text-ink focus:border-accent focus:outline-none disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
