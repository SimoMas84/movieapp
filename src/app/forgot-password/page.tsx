"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home } from "lucide-react";
import Link from "next/link";
import { forgotPassword, type ActionState } from "@/app/auth/actions";
import FloatingInput from "@/components/ui/FloatingInput";

/* ============================================================
   FORGOT PASSWORD PAGE
   User enters their email — Supabase sends the reset link.
   ============================================================ */

const initialState: ActionState = { error: null };

const emailRules = [
  {
    test: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: "Inserisci un indirizzo email valido",
  },
];

function mapError(error: string): string {
  if (error.includes("Too many requests"))
    return "Troppi tentativi, riprova tra qualche minuto";
  if (error.includes("Unable to validate email"))
    return "Indirizzo email non valido";
  return "Si è verificato un errore, riprova";
}

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPassword,
    initialState,
  );
  const [email, setEmail] = useState("");

  const isFormValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />

      <motion.div
        className="w-full max-w-sm relative"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <Link href="/" className="no-underline">
            <span className="text-3xl text-accent tracking-tight">
              Movie<span className="text-text-primary">App</span>
            </span>
          </Link>
          <p className="text-text-secondary text-sm mt-2">
            Reimposta la tua password
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <p className="text-text-secondary text-sm mb-6 text-center leading-relaxed">
            Inserisci la tua email e ti invieremo un link per reimpostare la
            password.
          </p>

          <form action={formAction} className="flex flex-col gap-3" noValidate>
            <FloatingInput
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              rules={emailRules}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !isFormValid}
              className="w-full h-11 bg-accent hover:bg-accent-hover disabled:opacity-40 text-bg-primary text-sm font-semibold rounded-xl mt-1 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                  Invio in corso...
                </>
              ) : (
                "Invia link di reset"
              )}
            </button>

            {/* Error */}
            <div className="h-10 flex items-center justify-center">
              <AnimatePresence>
                {state.error && (
                  <motion.p
                    className="w-full bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-4 text-red-400 text-sm text-center"
                    style={{ textShadow: "0 0 12px rgba(239,68,68,0.6)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mapError(state.error)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Back to login */}
        <p className="text-center text-text-secondary text-sm mt-4">
          Ricordi la password?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
          >
            Accedi
          </Link>
        </p>

        {/* Home link */}
        <div className="flex justify-center mt-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-text-secondary text-xs hover:text-accent transition-colors duration-200"
          >
            <Home size={13} />
            Torna alla home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
