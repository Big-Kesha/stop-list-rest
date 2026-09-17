'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium ' +
  'transition-colors ' +
  'cursor-pointer ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent-500 text-accent shadow-sm ' +
    'hover:bg-accent-600 hover:shadow ' +
    'active:bg-accent-800 active:shadow-none',
  secondary:
    'border border-line bg-white text-ink shadow-sm ' +
    'hover:bg-bg-subtle hover:border-line-strong ' +
    'active:bg-bg-muted active:shadow-none',
  ghost: 'text-ink ' + 'hover:bg-bg-subtle active:bg-bg-muted',
  danger:
    'bg-red-700 text-white shadow-sm ' +
    'hover:bg-red-600 hover:shadow ' +
    'active:bg-red-800 active:shadow-none',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    isLoading,
    loadingText,
    leftIcon,
    children,
    disabled,
    className = '',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || isLoading;
  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
        </>
      )}
    </button>
  );
});
