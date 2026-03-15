"use client";

/* ============================================================
   COOKIE BANNER COMPONENT
   GDPR-compliant cookie consent banner.
   - Necessary: always active (Supabase Auth session)
   - Analytics: optional (Vercel Analytics)
   Consent stored in localStorage under STORAGE_KEY.
   All styles are inline — required for createPortal to
   avoid Tailwind class resolution issues outside React tree.
   ============================================================ */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const STORAGE_KEY = "movieapp_cookie_consent";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  decided: boolean;
};

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
        return;
      }
      const parsed: ConsentState = JSON.parse(stored);
      if (!parsed.decided) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [mounted]);

  const saveConsent = (analytics: boolean) => {
    const consent: ConsentState = { necessary: true, analytics, decided: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setVisible(false);
    (
      window as Window & { __VERCEL_ANALYTICS_ENABLED__?: boolean }
    ).__VERCEL_ANALYTICS_ENABLED__ = analytics;
  };

  const handleAcceptAll = () => saveConsent(true);
  const handleNecessaryOnly = () => saveConsent(false);
  const handleSavePreferences = () => saveConsent(analyticsEnabled);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop — mobile only */}
          {isMobile && (
            <motion.div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(7, 10, 16, 0.7)",
                backdropFilter: "blur(4px)",
                zIndex: 300,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}

          {/* Banner */}
          <motion.div
            style={{
              position: "fixed",
              bottom: isMobile ? "16px" : "24px",
              left: isMobile ? "16px" : "auto",
              right: isMobile ? "16px" : "24px",
              width: isMobile ? "auto" : "100%",
              maxWidth: "384px",
              zIndex: 301,
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#0D1520",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#F0F4FF",
                  fontWeight: 500,
                  fontSize: "14px",
                  margin: "0 0 8px",
                }}
              >
                Preferenze cookie
              </h3>
              <p
                style={{
                  color: "#8A9AB5",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Utilizziamo cookie tecnici necessari al funzionamento del sito
                e, con il tuo consenso, cookie analitici anonimi per migliorare
                l'esperienza.{" "}
                <Link href="/privacy" style={{ color: "#BBFF00" }}>
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Details (expandable) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {/* Necessary — always on */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "#F0F4FF",
                            fontSize: "12px",
                            fontWeight: 500,
                            margin: "0 0 2px",
                          }}
                        >
                          Cookie necessari
                        </p>
                        <p
                          style={{
                            color: "#8A9AB5",
                            fontSize: "11px",
                            margin: 0,
                          }}
                        >
                          Sessione di autenticazione (Supabase). Sempre attivi.
                        </p>
                      </div>
                      <div style={{ flexShrink: 0, marginTop: "2px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "20px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(187,255,0,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            padding: "2px",
                            cursor: "not-allowed",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "#BBFF00",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Analytics — optional */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "#F0F4FF",
                            fontSize: "12px",
                            fontWeight: 500,
                            margin: "0 0 2px",
                          }}
                        >
                          Cookie analitici
                        </p>
                        <p
                          style={{
                            color: "#8A9AB5",
                            fontSize: "11px",
                            margin: 0,
                          }}
                        >
                          Dati anonimi sull'utilizzo (Vercel Analytics).
                          Opzionali.
                        </p>
                      </div>
                      <button
                        onClick={() => setAnalyticsEnabled((prev) => !prev)}
                        style={{
                          flexShrink: 0,
                          marginTop: "2px",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                        aria-label="Toggle analytics"
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "20px",
                            borderRadius: "10px",
                            backgroundColor: analyticsEnabled
                              ? "#BBFF00"
                              : "#1A2535",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: analyticsEnabled
                              ? "flex-end"
                              : "flex-start",
                            padding: "2px",
                            transition: "all 0.2s",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: "white",
                            }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <button
                onClick={handleAcceptAll}
                style={{
                  width: "100%",
                  height: "36px",
                  borderRadius: "12px",
                  backgroundColor: "#BBFF00",
                  color: "#070A10",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#A8E000")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#BBFF00")
                }
              >
                Accetta tutti
              </button>

              {showDetails ? (
                <button
                  onClick={handleSavePreferences}
                  style={{
                    width: "100%",
                    height: "36px",
                    borderRadius: "12px",
                    backgroundColor: "transparent",
                    color: "#8A9AB5",
                    fontSize: "12px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#BBFF00";
                    e.currentTarget.style.color = "#BBFF00";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#8A9AB5";
                  }}
                >
                  Salva preferenze
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleNecessaryOnly}
                    style={{
                      flex: 1,
                      height: "36px",
                      borderRadius: "12px",
                      backgroundColor: "transparent",
                      color: "#8A9AB5",
                      fontSize: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#BBFF00";
                      e.currentTarget.style.color = "#BBFF00";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#8A9AB5";
                    }}
                  >
                    Solo necessari
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    style={{
                      flex: 1,
                      height: "36px",
                      borderRadius: "12px",
                      backgroundColor: "transparent",
                      color: "#8A9AB5",
                      fontSize: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#BBFF00";
                      e.currentTarget.style.color = "#BBFF00";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#8A9AB5";
                    }}
                  >
                    Personalizza
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
