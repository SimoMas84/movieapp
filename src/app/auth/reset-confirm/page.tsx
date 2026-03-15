import Link from "next/link";
import { ShieldCheck } from "lucide-react";

/* ============================================================
   RESET PASSWORD CONFIRM PAGE
   Shown after password has been successfully updated.
   ============================================================ */

export default function ResetConfirmPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <Link href="/" className="no-underline">
          <span className="text-3xl text-accent tracking-tight">
            Movie<span className="text-text-primary">App</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-8 shadow-2xl mt-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <ShieldCheck size={24} className="text-accent" />
            </div>
          </div>

          <h2 className="text-text-primary text-xl font-light mb-3">
            Password aggiornata!
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            La tua password è stata reimpostata con successo. Ora puoi accedere
            al tuo account con la nuova password.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full h-11 bg-accent hover:bg-accent-hover text-bg-primary text-sm font-semibold rounded-xl mt-6 transition-colors duration-200"
        >
          Vai al login
        </Link>
      </div>
    </div>
  );
}
