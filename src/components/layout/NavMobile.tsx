"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import NavButton from "./NavButton";
import { menuContainer, navLinkVariants } from "@/lib/animations";

/* =============================================
   NAVIGATION LINKS DATA
   ============================================= */
const navLinks = [
  { title: "Home", href: "/" },
  { title: "Preferiti", href: "/favorites" },
  { title: "Watchlist", href: "/watchlist" },
  { title: "Registi", href: "/directors" },
  { title: "Attori", href: "/actors" },
];

/* =============================================
   CONSTANTS
   ============================================= */
const perspectiveStyle = {
  perspective: "120px",
  perspectiveOrigin: "bottom",
} as const;

/* =============================================
   NAV MOBILE COMPONENT
   Awwwards-style expanding menu for mobile
   ============================================= */
export default function NavMobile() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /* ── Handlers ── */
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* Expanding menu container — centered in viewport */}
      <motion.div
        className="fixed bg-accent rounded-2xl overflow-hidden z-40"
        style={{
          top: "50svh",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={menuContainer}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
      >
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col justify-center items-center h-full px-8 text-center">
              {/* Main links */}
              <div className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <div key={link.href} style={perspectiveStyle}>
                    <motion.div
                      custom={i}
                      variants={navLinkVariants}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="text-3xl font-light text-bg-primary hover:opacity-60 transition-opacity duration-300 block py-1"
                      >
                        {link.title}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Menu button */}
      <NavButton isOpen={isOpen} onClick={toggleMenu} />
    </>
  );
}

// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import Link from "next/link";
// import NavButton from "./NavButton";
// import { menuContainer, navLinkVariants } from "@/lib/animations";

// /* =============================================
//    NAVIGATION LINKS DATA
//    ============================================= */
// const navLinks = [
//   { title: "Home", href: "/" },
//   { title: "Preferiti", href: "/favorites" },
//   { title: "Watchlist", href: "/watchlist" },
//   { title: "Registi", href: "/directors" },
//   { title: "Attori", href: "/actors" },
// ];

// /* =============================================
//    NAV MOBILE COMPONENT
//    Awwwards-style expanding menu for mobile
//    ============================================= */
// export default function NavMobile() {
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   return (
//     <>
//       {/* Expanding menu container — centered in viewport */}
//       <motion.div
//         className="fixed bg-accent rounded-3xl overflow-hidden z-40"
//         style={{
//           top: "50svh",
//           left: "50%",
//           translateX: "-50%",
//           translateY: "-50%",
//         }}
//         variants={menuContainer}
//         animate={isOpen ? "open" : "closed"}
//         initial="closed"
//       >
//         <AnimatePresence>
//           {isOpen && (
//             <div className="flex flex-col justify-center items-center h-full px-8 text-center">
//               {/* Main links */}
//               <div className="flex flex-col gap-4">
//                 {navLinks.map((link, i) => (
//                   <div
//                     key={link.href}
//                     style={{
//                       perspective: "120px",
//                       perspectiveOrigin: "bottom",
//                     }}
//                   >
//                     <motion.div
//                       custom={i}
//                       variants={navLinkVariants}
//                       initial="initial"
//                       animate="enter"
//                       exit="exit"
//                     >
//                       <Link
//                         href={link.href}
//                         onClick={() => setIsOpen(false)}
//                         className="text-3xl font-light text-bg-primary hover:opacity-60 transition-opacity duration-300 block py-1"
//                       >
//                         {link.title}
//                       </Link>
//                     </motion.div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       {/* Menu button — always fixed top right, independent from menu */}
//       <NavButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
//     </>
//   );
// }
