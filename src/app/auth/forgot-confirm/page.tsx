import Link from "next/link";
import { Mail } from "lucide-react";

/* ============================================================
   FORGOT PASSWORD CONFIRM PAGE
   Shown after the reset email has been sent.
   ============================================================ */

export default function ForgotConfirmPage() {
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
              <Mail size={24} className="text-accent" />
            </div>
          </div>

          <h2 className="text-text-primary text-xl font-light mb-3">
            Controlla la tua email
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Ti abbiamo inviato un link per reimpostare la password. Controlla
            anche la cartella spam se non lo trovi.
          </p>
        </div>

        <p className="text-center text-text-secondary text-sm mt-6">
          Non hai ricevuto nulla?{" "}
          <Link
            href="/forgot-password"
            className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
          >
            Riprova
          </Link>
        </p>
      </div>
    </div>
  );
}
