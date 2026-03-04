"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";

/* =============================================
   SPLASH SCREEN COMPONENT
   Shown only on first visit per session.
   Logo animation with cinematic panel exit.
   ============================================= */

const SESSION_KEY = "movieapp_splash_shown";

const letters_movie = ["M", "o", "v", "i", "e"];
const letters_app = ["A", "p", "p"];

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [exit, setExit] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const already = sessionStorage.getItem(SESSION_KEY);
    if (already) {
      /* ── Already seen — hide immediately ── */
      setShow(false);
    } else {
      sessionStorage.setItem(SESSION_KEY, "true");

      const exitTimer = setTimeout(() => setExit(true), 2400);
      const doneTimer = setTimeout(() => setDone(true), 3200);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(doneTimer);
      };
    }
  }, []);

  if (!show || done) return null;

  return (
    <AnimatePresence>
      {!exit && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-primary">
          {/* ── Logo ── */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <Play size={48} className="text-accent" />
            </motion.div>

            {/* "Movie" letters */}
            <div className="flex">
              {letters_movie.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.07,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="text-5xl md:text-7xl font-light text-accent tracking-widest"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* "App" letters */}
            <div className="flex">
              {letters_app.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.65 + i * 0.07,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="text-5xl md:text-7xl font-light text-text-primary tracking-widest"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Exit — cinematic panels ── */}
      {exit && !done && (
        <>
          {/* Top panel */}
          <motion.div
            key="panel-top"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 right-0 h-1/2 z-[9999] bg-bg-primary"
          />
          {/* Bottom panel */}
          <motion.div
            key="panel-bottom"
            initial={{ y: 0 }}
            animate={{ y: "100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed bottom-0 left-0 right-0 h-1/2 z-[9999] bg-bg-primary"
          />
        </>
      )}
    </AnimatePresence>
  );
}
