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

type UIState = {
  stopPanelItemId: string | null;
  openStopPanel: (id: string) => void;
  closeStopPanel: () => void;

  pending: PendingEntry[];
  markPending: (entry: PendingEntry) => void;
  clearPending: (entry: PendingEntry) => void;

  toast: Toast | null;
  showToast: (t: Omit<Toast, 'id'>) => void;
  hideToast: () => void;
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

  toast: null,
  showToast: (t) => set({ toast: { ...t, id: ++toastCounter } }),
  hideToast: () => set({ toast: null }),
}));
