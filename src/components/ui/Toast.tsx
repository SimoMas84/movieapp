"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastContext, type ToastVariant } from "@/context/ToastContext";
import { useState, useEffect } from "react";

/* ============================================================
   TOAST COMPONENT
   Renders toast notifications via createPortal to document.body.
   Uses inline styles — required for portal-rendered components
   as Tailwind classes are not reliable outside the React tree.
   Positioned at center of viewport.
   ============================================================ */

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ReactNode; iconColor: string }
> = {
  success: {
    icon: <CheckCircle size={16} />,
    iconColor: "#2D7A00",
  },
  error: {
    icon: <AlertCircle size={16} />,
    iconColor: "#CC0000",
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    iconColor: "#070A10",
  },
  info: {
    icon: <Info size={16} />,
    iconColor: "#1A2535",
  },
};

export default function Toast() {
  const { toasts, dismissToast } = useToastContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
        pointerEvents: "none",
        width: "100%",
        maxWidth: "360px",
        padding: "0 16px",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const config = VARIANT_CONFIG[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                width: "100%",
                pointerEvents: "auto",
                backgroundColor: "#BBFF00",
                border: "none",
                borderRadius: "12px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 32px rgba(187, 255, 0, 0.25)",
              }}
            >
              {/* Icon */}
              <span style={{ color: config.iconColor, flexShrink: 0 }}>
                {config.icon}
              </span>

              {/* Message */}
              <p
                style={{
                  color: "#070A10",
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  flex: 1,
                  margin: 0,
                }}
              >
                {t.message}
              </p>

              {/* Dismiss button */}
              <button
                onClick={() => dismissToast(t.id)}
                style={{
                  color: "#1A2535",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

// "use client";

// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "motion/react";
// import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
// import { useToastContext, type ToastVariant } from "@/context/ToastContext";
// import { useState, useEffect } from "react";

// /* ============================================================
//    TOAST COMPONENT
//    Renders toast notifications via createPortal.
//    Positioned bottom-center on mobile, bottom-right on desktop.
//    All styles are inline to avoid Tailwind portal issues.
//    ============================================================ */

// /* ── Variant config ── */
// const VARIANT_CONFIG: Record<
//   ToastVariant,
//   { icon: React.ReactNode; color: string; bg: string; border: string }
// > = {
//   success: {
//     icon: <CheckCircle size={16} />,
//     color: "#BBFF00",
//     bg: "rgba(187, 255, 0, 0.08)",
//     border: "rgba(187, 255, 0, 0.2)",
//   },
//   error: {
//     icon: <AlertCircle size={16} />,
//     color: "#FF6B6B",
//     bg: "rgba(255, 107, 107, 0.08)",
//     border: "rgba(255, 107, 107, 0.2)",
//   },
//   warning: {
//     icon: <AlertTriangle size={16} />,
//     color: "#BBFF00",
//     bg: "rgba(255, 179, 71, 0.08)",
//     border: "rgba(255, 179, 71, 0.2)",
//   },
//   info: {
//     icon: <Info size={16} />,
//     color: "#8A9AB5",
//     bg: "rgba(138, 154, 181, 0.08)",
//     border: "rgba(138, 154, 181, 0.2)",
//   },
// };

// export default function Toast() {
//   const { toasts, dismissToast } = useToastContext();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return createPortal(
//     <div
//       style={{
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         zIndex: 500,
//         display: "flex",
//         flexDirection: "column",
//         gap: "8px",
//         alignItems: "center",
//         pointerEvents: "none",
//         width: "100%",
//         maxWidth: "360px",
//         padding: "0 16px",
//       }}
//     >
//       <AnimatePresence mode="popLayout">
//         {toasts.map((t) => {
//           const config = VARIANT_CONFIG[t.variant];
//           return (
//             <motion.div
//               key={t.id}
//               layout
//               initial={{ opacity: 0, y: 16, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 8, scale: 0.95 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               style={{
//                 width: "100%",
//                 pointerEvents: "auto",
//                 backgroundColor: "#0D1520",
//                 border: `1px solid ${config.border}`,
//                 borderRadius: "12px",
//                 padding: "12px 14px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
//               }}
//             >
//               {/* Icon */}
//               <span style={{ color: config.color, flexShrink: 0 }}>
//                 {config.icon}
//               </span>

//               {/* Message */}
//               <p
//                 style={{
//                   color: "#F0F4FF",
//                   fontSize: "13px",
//                   lineHeight: 1.4,
//                   flex: 1,
//                   margin: 0,
//                 }}
//               >
//                 {t.message}
//               </p>

//               {/* Dismiss button */}
//               <button
//                 onClick={() => dismissToast(t.id)}
//                 style={{
//                   color: "#8A9AB5",
//                   background: "none",
//                   border: "none",
//                   padding: 0,
//                   cursor: "pointer",
//                   flexShrink: 0,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <X size={14} />
//               </button>
//             </motion.div>
//           );
//         })}
//       </AnimatePresence>
//     </div>,
//     document.body,
//   );
// }
