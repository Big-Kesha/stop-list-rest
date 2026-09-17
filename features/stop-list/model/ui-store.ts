'use client';

import { create } from 'zustand';

type PendingReason = 'stop' | 'resume';

type PendingEntry = {
  id: string;
  reason: PendingReason;
};

type ToastKind = 'ok' | 'error';

export type Toast = {
  id: number;
  kind: ToastKind;
  text: string;
};

const MAX_TOASTS = 3;

type UIState = {
  stopPanelItemId: string | null;
  openStopPanel: (id: string) => void;
  closeStopPanel: () => void;

  pending: PendingEntry[];
  markPending: (entry: PendingEntry) => void;
  clearPending: (entry: PendingEntry) => void;

  toasts: Toast[];
  showToast: (t: Omit<Toast, 'id'>) => void;
  hideToast: (id: number) => void;
};

let toastCounter = 0;

export const useStopListUI = create<UIState>((set) => ({
  stopPanelItemId: null,
  openStopPanel: (id) => set({ stopPanelItemId: id }),
  closeStopPanel: () => set({ stopPanelItemId: null }),

  pending: [],
  markPending: (entry) => set((s) => ({ pending: [...s.pending, entry] })),
  clearPending: (entry) =>
    set((s) => ({
      pending: s.pending.filter(
        (p) => !(p.id === entry.id && p.reason === entry.reason)
      ),
    })),

  toasts: [],
  showToast: (t) =>
    set((s) => {
      const next = [...s.toasts, { ...t, id: ++toastCounter }];
      // Держим только последние MAX_TOASTS — старые вытесняются
      return {
        toasts: next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next,
      };
    }),
  hideToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
