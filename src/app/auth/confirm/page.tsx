/* ============================================================
   CONFIRM PAGE
   Shown after successful registration.
   Instructs the user to check their email for confirmation.
   ============================================================ */

import Link from "next/link";
import { Mail } from "lucide-react";

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Background accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="no-underline">
            <span className="text-3xl text-accent tracking-tight">
              Movie<span className="text-text-primary">App</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-accent" />
          </div>

          <h1 className="text-text-primary text-xl font-semibold mb-3">
            Controlla la tua email
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Abbiamo inviato un link di conferma al tuo indirizzo email. Clicca
            sul link per attivare il tuo account.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-11 bg-accent hover:bg-accent-hover text-bg-primary text-sm font-semibold rounded-xl transition-colors duration-200"
          >
            Vai al login
          </Link>
        </div>

        <p className="text-center text-text-secondary text-xs mt-6">
          Non hai ricevuto l'email? Controlla la cartella spam o{" "}
          <Link
            href="/register"
            className="text-accent hover:text-accent-hover transition-colors duration-200"
          >
            riprova la registrazione
          </Link>
        </p>
      </div>
    </div>
  );
}
