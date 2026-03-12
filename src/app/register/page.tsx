"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { register, type ActionState } from "@/app/auth/actions";

/* ============================================================
   REGISTER PAGE
   Handles new user registration via Supabase email/password.
   Uses React 19 useActionState for form state management
   and Next.js Server Actions for secure form submission.
   ============================================================ */

const initialState: ActionState = { error: null };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Background accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />

      {/* Back to home */}
      <div className="w-full max-w-sm mb-6 relative">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Torna alla home
        </Link>
      </div>

      <motion.div
        className="w-full max-w-sm relative"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
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
          {/* Error message */}
          {state.error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {state.error === "User already registered"
                ? "Esiste già un account con questa email"
                : state.error}
            </motion.div>
          )}

          <form action={formAction} className="flex flex-col gap-4">
            {/* Name field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-text-secondary text-xs font-medium"
              >
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Il tuo nome"
                className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-base outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
              />
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-text-secondary text-xs font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nome@esempio.com"
                className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-base outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-text-secondary text-xs font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Minimo 6 caratteri"
                minLength={6}
                className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-base outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-accent hover:bg-accent-hover disabled:opacity-60 text-bg-primary text-sm font-semibold rounded-xl mt-2 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
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
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-text-secondary text-sm mt-6">
          Hai già un account?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
          >
            Accedi
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// "use client";

// import { useActionState } from "react";
// import { motion } from "motion/react";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { register, type ActionState } from "@/app/auth/actions";

// /* ============================================================
//    REGISTER PAGE
//    Handles new user registration via Supabase email/password.
//    Uses React 19 useActionState for form state management
//    and Next.js Server Actions for secure form submission.
//    ============================================================ */

// const initialState: ActionState = { error: null };

// export default function RegisterPage() {
//   const [state, formAction, isPending] = useActionState(register, initialState);

//   return (
//     <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
//       {/* Background accent glow */}
//       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />

//       {/* Back to home */}
//       <div className="w-full max-w-sm mb-6 relative">
//         <Link
//           href="/"
//           className="inline-flex items-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors duration-200"
//         >
//           <ArrowLeft size={16} />
//           Torna alla home
//         </Link>
//       </div>

//       <motion.div
//         className="w-full max-w-sm relative"
//         initial={{ opacity: 0, y: 24 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//       >
//         {/* Logo */}
//         <div className="text-center mb-10">
//           <Link href="/" className="no-underline">
//             <span className="text-3xl text-accent tracking-tight">
//               Movie<span className="text-text-primary">App</span>
//             </span>
//           </Link>
//           <p className="text-text-secondary text-sm mt-2">
//             Crea il tuo account
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
//           {/* Error message */}
//           {state.error && (
//             <motion.div
//               className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm"
//               initial={{ opacity: 0, y: -8 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               {state.error === "User already registered"
//                 ? "Esiste già un account con questa email"
//                 : state.error}
//             </motion.div>
//           )}

//           <form action={formAction} className="flex flex-col gap-4">
//             {/* Name field */}
//             <div className="flex flex-col gap-2">
//               <label
//                 htmlFor="name"
//                 className="text-text-secondary text-xs font-medium"
//               >
//                 Nome
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 required
//                 autoComplete="name"
//                 placeholder="Il tuo nome"
//                 className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-sm outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
//               />
//             </div>

//             {/* Email field */}
//             <div className="flex flex-col gap-2">
//               <label
//                 htmlFor="email"
//                 className="text-text-secondary text-xs font-medium"
//               >
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 autoComplete="email"
//                 placeholder="nome@esempio.com"
//                 className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-sm outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
//               />
//             </div>

//             {/* Password field */}
//             <div className="flex flex-col gap-2">
//               <label
//                 htmlFor="password"
//                 className="text-text-secondary text-xs font-medium"
//               >
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 autoComplete="new-password"
//                 placeholder="Minimo 6 caratteri"
//                 minLength={6}
//                 className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-sm outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
//               />
//             </div>

//             {/* Submit button */}
//             <button
//               type="submit"
//               disabled={isPending}
//               className="w-full h-11 bg-accent hover:bg-accent-hover disabled:opacity-60 text-bg-primary text-sm font-semibold rounded-xl mt-2 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
//             >
//               {isPending ? (
//                 <>
//                   <span className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
//                   Registrazione in corso...
//                 </>
//               ) : (
//                 "Registrati"
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Login link */}
//         <p className="text-center text-text-secondary text-sm mt-6">
//           Hai già un account?{" "}
//           <Link
//             href="/login"
//             className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
//           >
//             Accedi
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// }

// // "use client";

// // import { useState } from "react";
// // import { motion } from "motion/react";
// // import Link from "next/link";
// // import { ArrowLeft } from "lucide-react";
// // import { register } from "@/app/auth/actions";

// // /* ============================================================
// //    REGISTER PAGE
// //    Handles new user registration via Supabase email/password.
// //    Uses Next.js Server Actions for secure form submission.
// //    ============================================================ */

// // export default function RegisterPage() {
// //   const [error, setError] = useState<string | null>(null);
// //   const [loading, setLoading] = useState<boolean>(false);

// //   async function handleSubmit(formData: FormData): Promise<void> {
// //     setLoading(true);
// //     setError(null);
// //     const result = await register(formData);
// //     if (result?.error) {
// //       setError(result.error);
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
// //       {/* Background accent glow */}
// //       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-3xl pointer-events-none" />

// //       {/* Back to home */}
// //       <div className="w-full max-w-sm mb-6 relative">
// //         <Link
// //           href="/"
// //           className="inline-flex items-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors duration-200"
// //         >
// //           <ArrowLeft size={16} />
// //           Torna alla home
// //         </Link>
// //       </div>

// //       <motion.div
// //         className="w-full max-w-sm relative"
// //         initial={{ opacity: 0, y: 24 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5, ease: "easeOut" }}
// //       >
// //         {/* Logo */}
// //         <div className="text-center mb-10">
// //           <Link href="/" className="no-underline">
// //             <span className="text-3xl text-accent tracking-tight">
// //               Movie<span className="text-text-primary">App</span>
// //             </span>
// //           </Link>
// //           <p className="text-text-secondary text-sm mt-2">
// //             Crea il tuo account
// //           </p>
// //         </div>

// //         {/* Card */}
// //         <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
// //           {/* Error message */}
// //           {error && (
// //             <motion.div
// //               className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm"
// //               initial={{ opacity: 0, y: -8 }}
// //               animate={{ opacity: 1, y: 0 }}
// //             >
// //               {error === "User already registered"
// //                 ? "Esiste già un account con questa email"
// //                 : error}
// //             </motion.div>
// //           )}

// //           <form action={handleSubmit} className="flex flex-col gap-4">
// //             {/* Name field */}
// //             <div className="flex flex-col gap-2">
// //               <label
// //                 htmlFor="name"
// //                 className="text-text-secondary text-xs font-medium"
// //               >
// //                 Nome
// //               </label>
// //               <input
// //                 id="name"
// //                 name="name"
// //                 type="text"
// //                 required
// //                 autoComplete="name"
// //                 placeholder="Il tuo nome"
// //                 className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-sm outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
// //               />
// //             </div>

// //             {/* Email field */}
// //             <div className="flex flex-col gap-2">
// //               <label
// //                 htmlFor="email"
// //                 className="text-text-secondary text-xs font-medium"
// //               >
// //                 Email
// //               </label>
// //               <input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 required
// //                 autoComplete="email"
// //                 placeholder="nome@esempio.com"
// //                 className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-sm outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
// //               />
// //             </div>

// //             {/* Password field */}
// //             <div className="flex flex-col gap-2">
// //               <label
// //                 htmlFor="password"
// //                 className="text-text-secondary text-xs font-medium"
// //               >
// //                 Password
// //               </label>
// //               <input
// //                 id="password"
// //                 name="password"
// //                 type="password"
// //                 required
// //                 autoComplete="new-password"
// //                 placeholder="Minimo 6 caratteri"
// //                 minLength={6}
// //                 className="h-11 bg-surface-2 border border-white/[0.08] rounded-xl px-4 text-text-primary text-sm outline-none focus:border-accent transition-colors duration-200 placeholder:text-text-secondary/50"
// //               />
// //             </div>

// //             {/* Submit button */}
// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="w-full h-11 bg-accent hover:bg-accent-hover disabled:opacity-60 text-bg-primary text-sm font-semibold rounded-xl mt-2 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
// //             >
// //               {loading ? (
// //                 <>
// //                   <span className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
// //                   Registrazione in corso...
// //                 </>
// //               ) : (
// //                 "Registrati"
// //               )}
// //             </button>
// //           </form>
// //         </div>

// //         {/* Login link */}
// //         <p className="text-center text-text-secondary text-sm mt-6">
// //           Hai già un account?{" "}
// //           <Link
// //             href="/login"
// //             className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
// //           >
// //             Accedi
// //           </Link>
// //         </p>
// //       </motion.div>
// //     </div>
// //   );
// // }
