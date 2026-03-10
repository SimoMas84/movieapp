"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";

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
      setShow(false);
    } else {
      sessionStorage.setItem(SESSION_KEY, "true");
      const exitTimer = setTimeout(() => setExit(true), 2800);
      const doneTimer = setTimeout(() => setDone(true), 3600);
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
          {/* ── Play icon + testo sovrapposto ── */}
          <div className="relative flex items-center justify-center">
            {/* Icona Play che compare e si ingrandisce */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <Play size={340} className="text-accent" strokeWidth={0.8} />
            </motion.div>

            {/* Testo centrato dentro l'icona */}
            <div className="absolute flex items-baseline gap-0.5 translate-x-2">
              {letters_movie.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.3, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + i * 0.08,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="text-4xl font-light text-accent tracking-wider"
                >
                  {letter}
                </motion.span>
              ))}
              {letters_app.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.3, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 1.0 + i * 0.08,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="text-4xl font-light text-text-primary tracking-wider"
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
          <motion.div
            key="panel-top"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 right-0 h-1/2 z-[9999] bg-bg-primary"
          />
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
