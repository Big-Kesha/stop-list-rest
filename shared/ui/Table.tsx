import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({
  className = '',
  ...rest
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={`w-full border-collapse text-sm ${className}`}
      {...rest}
    />
  );
}

export function THead({
  className = '',
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`text-left text-xs uppercase tracking-wide text-ink-subtle ${className}`}
      {...rest}
    />
  );
}

export function TBody({
  className = '',
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...rest} />;
}

export function TR({
  className = '',
  ...rest
}: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-b border-line ${className}`} {...rest} />;
}

export function TH({
  className = '',
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-3 py-2 font-medium ${className}`} {...rest} />;
}

export function TD({
  className = '',
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-2 py-2 align-middle ${className}`} {...rest} />;
}
