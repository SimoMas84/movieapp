import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

/* ============================================================
   EMAIL CONFIRMED PAGE
   Shown after the user clicks the confirmation link.
   Shows "Vai alla home" if already logged in,
   "Accedi" if not.
   ============================================================ */

export default async function EmailConfirmedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="no-underline">
            <span className="text-3xl text-accent tracking-tight">
              Movie<span className="text-text-primary">App</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-8 shadow-2xl text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={28} className="text-accent" />
          </div>

          <h1 className="text-text-primary text-xl font-light mb-3">
            Email confermata!
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Il tuo account è stato attivato con successo.{" "}
            {user
              ? "Benvenuto su MovieApp!"
              : "Ora puoi accedere al tuo account."}
          </p>

          {user ? (
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full h-11 bg-accent hover:bg-accent-hover text-bg-primary text-sm font-semibold rounded-xl transition-colors duration-200"
            >
              Vai alla home
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full h-11 bg-accent hover:bg-accent-hover text-bg-primary text-sm font-semibold rounded-xl transition-colors duration-200"
            >
              Accedi
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
