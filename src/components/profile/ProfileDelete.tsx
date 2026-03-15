"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

/* ============================================================
   PROFILE DELETE COMPONENT
   Calls /api/delete-account directly from the client so
   cookies are sent automatically by the browser.
   ============================================================ */

export default function ProfileDelete() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const res = await fetch("/api/delete-account", { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-surface-1 border border-red-500/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={15} className="text-red-400" />
        <h2 className="text-red-400 text-sm font-medium">Elimina Account</h2>
      </div>
      <p className="text-text-secondary text-xs mb-4 leading-relaxed">
        Eliminando l'account perderai tutti i tuoi preferiti e la watchlist.
        Questa azione è irreversibile.
      </p>

      <AnimatePresence mode="wait">
        {!showConfirm ? (
          <motion.button
            key="delete-btn"
            onClick={() => setShowConfirm(true)}
            className="w-full h-10 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Trash2 size={15} />
            Elimina account
          </motion.button>
        ) : (
          <motion.div
            key="confirm"
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-text-primary text-xs text-center font-medium mb-1">
              Sei sicuro? Questa azione non può essere annullata.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-10 border border-white/[0.08] text-text-secondary text-sm rounded-xl hover:border-accent hover:text-accent transition-all duration-200 cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 h-10 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-60"
              >
                {isPending ? (
                  <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sì, elimina"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
