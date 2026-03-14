"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home } from "lucide-react";
import Link from "next/link";
import { register, type ActionState } from "@/app/auth/actions";
import FloatingInput from "@/components/ui/FloatingInput";

/* ============================================================
   REGISTER PAGE
   ============================================================ */

const initialState: ActionState = { error: null };

/* ── Validation rules ── */
const nameRules = [
  {
    test: (v: string) => v.trim().length >= 2,
    message: "Il nome deve avere almeno 2 caratteri",
  },
];

const emailRules = [
  {
    test: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: "Inserisci un indirizzo email valido",
  },
];

const passwordRules = [
  {
    test: (v: string) => v.length >= 8,
    message: "Almeno 8 caratteri",
  },
  {
    test: (v: string) => /[A-Z]/.test(v),
    message: "Almeno una lettera maiuscola",
  },
  {
    test: (v: string) => /[0-9]/.test(v),
    message: "Almeno un numero",
  },
  {
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
    message: "Almeno un simbolo (es. !@#$)",
  },
];

/* ── Error mapping ── */
function mapError(error: string): string {
  if (error.includes("User already registered"))
    return "Esiste già un account con questa email";
  if (error.includes("Password should be"))
    return "La password non rispetta i requisiti minimi";
  if (error.includes("Unable to validate email"))
    return "Indirizzo email non valido";
  if (error.includes("Too many requests"))
    return "Troppi tentativi, riprova tra qualche minuto";
  return "Si è verificato un errore, riprova";
}

/* ── Client-side password check ── */
function isPasswordValid(v: string): boolean {
  return passwordRules.every((r) => r.test(v));
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    isPasswordValid(password);

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
            Crea il tuo account
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <form action={formAction} className="flex flex-col gap-5" noValidate>
            <FloatingInput
              name="name"
              label="Nome"
              type="text"
              autoComplete="name"
              value={name}
              onChange={setName}
              rules={nameRules}
            />

            <FloatingInput
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              rules={emailRules}
            />

            <FloatingInput
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={setPassword}
              rules={passwordRules}
              showStrength
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
                  Registrazione in corso...
                </>
              ) : (
                "Registrati"
              )}
            </button>

            {/* Error — fixed height slot, no layout shift */}
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

        {/* Login link */}
        <p className="text-center text-text-secondary text-sm mt-4">
          Hai già un account?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
          >
            Accedi
          </Link>
        </p>

        {/* Home link — bottom centered */}
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
