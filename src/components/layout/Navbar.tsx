import Link from "next/link";
import { Play, User } from "lucide-react";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import SearchBar from "@/components/layout/SearchBar";

/* =============================================
   NAVBAR COMPONENT
   Fixed top navbar with logo, desktop nav,
   search bar, login button and mobile menu
   ============================================= */
export default function Navbar() {
  return (
    <header className="flex fixed top-0 left-0 right-0 h-20 z-50 px-6 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
      {/* Inner container */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-2xl text-accent font-light tracking-widest"
        >
          <Play size={36} className="text-accent mr-2" />
          <span className="hidden md:inline">Movie</span>
          <span className="hidden md:inline text-text-primary">App</span>
        </Link>

        {/* Desktop nav — hidden on mobile and tablet */}
        <div className="hidden lg:flex items-center gap-8">
          <NavDesktop />
          <SearchBar />
          <Link
            href="/login"
            className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
          >
            <User size={15} />
            Accedi
          </Link>
        </div>

        {/* Mobile and tablet — search + login + menu button */}
        <div className="flex lg:hidden items-center gap-8">
          <SearchBar />
          <Link
            href="/login"
            className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
          >
            <User size={15} />
            Accedi
          </Link>
          <NavMobile />
        </div>
      </div>
    </header>
  );
}

// import Link from "next/link";
// import { Play, User } from "lucide-react";
// import NavDesktop from "./NavDesktop";
// import NavMobile from "./NavMobile";
// import SearchBar from "@/components/layout/SearchBar";
// import { getTrending, getGenres } from "@/lib/tmdb";
// import { toMovie } from "@/lib/utils";

// /* =============================================
//    NAVBAR COMPONENT
//    Fixed top navbar with logo, desktop nav,
//    search bar, login button and mobile menu
//    ============================================= */
// export default async function Navbar() {
//   /* ── Fetch search data server-side ── */
//   const [trending, genres] = await Promise.all([getTrending(), getGenres()]);
//   const movies = trending.map((m) => toMovie(m, genres));

//   return (
//     <header className="flex fixed top-0 left-0 right-0 h-20 z-50 px-6 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
//       {/* Inner container */}
//       <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="flex items-center text-2xl text-accent font-light tracking-widest"
//         >
//           <Play size={36} className="text-accent mr-2" />
//           <span className="hidden md:inline">Movie</span>
//           <span className="hidden md:inline text-text-primary">App</span>
//         </Link>

//         {/* Desktop nav — hidden on mobile and tablet */}
//         <div className="hidden lg:flex items-center gap-8">
//           <NavDesktop />
//           <SearchBar movies={movies} />
//           <Link
//             href="/login"
//             className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
//           >
//             <User size={15} />
//             Accedi
//           </Link>
//         </div>

//         {/* Mobile and tablet — search + login + menu button */}
//         <div className="flex lg:hidden items-center gap-8">
//           <SearchBar movies={movies} />
//           <Link
//             href="/login"
//             className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent text-bg-primary hover:scale-105 transition-all duration-300"
//           >
//             <User size={15} />
//             Accedi
//           </Link>
//           <NavMobile />
//         </div>
//       </div>
//     </header>
//   );
// }
