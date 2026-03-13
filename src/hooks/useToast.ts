"use client";

import { useToastContext, type ToastVariant } from "@/context/ToastContext";

/* ============================================================
   useToast HOOK
   Public API for triggering toast notifications.
   Must be used inside ToastProvider.

   Usage:
     const { toast } = useToast();
     toast.success("Aggiunto ai preferiti!");
     toast.error("Qualcosa è andato storto");
     toast.warning("Accedi per aggiungere ai preferiti");
     toast.info("Informazione generica");
   ============================================================ */

interface ToastHelpers {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  show: (message: string, variant?: ToastVariant, duration?: number) => void;
}

export function useToast(): { toast: ToastHelpers } {
  const { showToast } = useToastContext();

  const toast: ToastHelpers = {
    success: (message, duration) => showToast(message, "success", duration),
    error: (message, duration) => showToast(message, "error", duration),
    warning: (message, duration) => showToast(message, "warning", duration),
    info: (message, duration) => showToast(message, "info", duration),
    show: (message, variant, duration) => showToast(message, variant, duration),
  };

  return { toast };
}