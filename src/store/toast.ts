/* eslint @typescript-eslint/no-explicit-any:off */
import { create } from 'zustand';

export type Toast = {
  id?: number;
  content?: any;
  duration?: number;
  type?: 'success' | 'warning' | 'error' | 'default';
};

type ToastState = {
  addToast: (toast: Toast) => void;
  removeToast: (toastId: number) => void;
  toasts: Toast[];
  id: number;
};

const useToastStore = create<ToastState>((set) => ({
  id: 0,
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: state.id }],
      id: state.id + 1,
    })),
  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
}));

export default useToastStore;
