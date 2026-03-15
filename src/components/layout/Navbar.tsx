import Link from "next/link";
import { Play, User, LogOut } from "lucide-react";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import SearchBar from "@/components/layout/SearchBar";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

/* ============================================================
   NAVBAR COMPONENT
   Fixed top navbar with logo, desktop nav, search bar,
   and dynamic auth button (login or user menu).
   Session is read server-side via Supabase SSR client.
   ============================================================ */

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex fixed top-0 left-0 right-0 h-20 z-50 px-6 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
      {/* Inner container */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-2xl text-accent font-light tracking-widest"
        >
          <span className="hidden md:inline">Movie</span>
          <span className="hidden md:inline text-text-primary">App</span>
          <Play size={36} className="text-accent mr-2" />
        </Link>

        {/* Desktop nav — hidden on mobile and tablet */}
        <div className="hidden lg:flex items-center gap-8">
          <NavDesktop />
          <SearchBar />
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent hover:bg-accent-hover text-bg-primary transition-all duration-300"
              >
                <User size={15} />
                {user.user_metadata?.full_name?.split(" ")[0] ?? "Profilo"}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl text-text-secondary hover:text-red-400 border border-white/[0.08] hover:border-red-400/50 transition-all duration-300 cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
            >
              <User size={15} />
              Accedi
            </Link>
          )}
        </div>

        {/* Mobile and tablet — search + auth + menu button */}
        <div className="flex lg:hidden items-center gap-3">
          <SearchBar />
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-2 border border-white/[0.08] hover:border-accent transition-all duration-300"
              >
                <User size={16} className="text-text-primary" />
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/[0.08] text-text-secondary hover:text-red-400 hover:border-red-400/50 transition-all duration-300"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
            >
              <User size={15} />
              Accedi
            </Link>
          )}
          <NavMobile />
        </div>
      </div>
    </header>
  );
}

// import Link from "next/link";
// import { Play, User, LogOut } from "lucide-react";
// import NavDesktop from "./NavDesktop";
// import NavMobile from "./NavMobile";
// import SearchBar from "@/components/layout/SearchBar";
// import { createClient } from "@/lib/supabase/server";
// import { logout } from "@/app/auth/actions";

// /* ============================================================
//    NAVBAR COMPONENT
//    Fixed top navbar with logo, desktop nav, search bar,
//    and dynamic auth button (login or user menu).
//    Session is read server-side via Supabase SSR client.
//    ============================================================ */

// export default async function Navbar() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   return (
//     <header className="flex fixed top-0 left-0 right-0 h-20 z-50 px-6 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
//       {/* Inner container */}
//       <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="flex items-center text-2xl text-accent font-light tracking-widest"
//         >
//           <span className="hidden md:inline">Movie</span>
//           <span className="hidden md:inline text-text-primary">App</span>
//           <Play size={36} className="text-accent mr-2" />
//         </Link>

//         {/* Desktop nav — hidden on mobile and tablet */}
//         <div className="hidden lg:flex items-center gap-8">
//           <NavDesktop />
//           <SearchBar />
//           {user ? (
//             <div className="flex items-center gap-3">
//               <Link
//                 href="/profile"
//                 className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-surface-2 text-text-primary hover:bg-surface-1 border border-white/[0.08] hover:border-accent transition-all duration-300"
//               >
//                 <User size={15} />
//                 {user.user_metadata?.full_name?.split(" ")[0] ?? "Profilo"}
//               </Link>
//               <form action={logout}>
//                 <button
//                   type="submit"
//                   className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl text-text-secondary hover:text-red-400 border border-white/[0.08] hover:border-red-400/50 transition-all duration-300 cursor-pointer"
//                 >
//                   <LogOut size={15} />
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <Link
//               href="/login"
//               className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
//             >
//               <User size={15} />
//               Accedi
//             </Link>
//           )}
//         </div>

//         {/* Mobile and tablet — search + auth + menu button */}
//         <div className="flex lg:hidden items-center gap-3">
//           <SearchBar />
//           {user ? (
//             <div className="flex items-center gap-2">
//               <Link
//                 href="/profile"
//                 className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-2 border border-white/[0.08] hover:border-accent transition-all duration-300"
//               >
//                 <User size={16} className="text-text-primary" />
//               </Link>
//               <form action={logout}>
//                 <button
//                   type="submit"
//                   className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/[0.08] text-text-secondary hover:text-red-400 hover:border-red-400/50 transition-all duration-300"
//                 >
//                   <LogOut size={16} />
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <Link
//               href="/login"
//               className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
//             >
//               <User size={15} />
//               Accedi
//             </Link>
//           )}
//           <NavMobile />
//         </div>
//       </div>
//     </header>
//   );
// }

// // import Link from "next/link";
// // import { Play, User } from "lucide-react";
// // import NavDesktop from "./NavDesktop";
// // import NavMobile from "./NavMobile";
// // import SearchBar from "@/components/layout/SearchBar";

// // /* =============================================
// //    NAVBAR COMPONENT
// //    Fixed top navbar with logo, desktop nav,
// //    search bar, login button and mobile menu
// //    ============================================= */
// // export default function Navbar() {
// //   return (
// //     <header className="flex fixed top-0 left-0 right-0 h-20 z-50 px-6 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
// //       {/* Inner container */}
// //       <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
// //         {/* Logo */}
// //         <Link
// //           href="/"
// //           className="flex items-center text-2xl text-accent font-light tracking-widest"
// //         >
// //           <span className="hidden md:inline">Movie</span>
// //           <span className="hidden md:inline text-text-primary">App</span>
// //           <Play size={36} className="text-accent mr-2" />
// //         </Link>

// //         {/* Desktop nav — hidden on mobile and tablet */}
// //         <div className="hidden lg:flex items-center gap-8">
// //           <NavDesktop />
// //           <SearchBar />
// //           <Link
// //             href="/login"
// //             className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
// //           >
// //             <User size={15} />
// //             Accedi
// //           </Link>
// //         </div>

// //         {/* Mobile and tablet — search + login + menu button */}
// //         <div className="flex lg:hidden items-center gap-8">
// //           <SearchBar />
// //           <Link
// //             href="/login"
// //             className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
// //           >
// //             <User size={15} />
// //             Accedi
// //           </Link>
// //           <NavMobile />
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }
