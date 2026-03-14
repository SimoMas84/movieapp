"use client";

import { useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Check, X } from "lucide-react";

/* ============================================================
   FLOATING INPUT COMPONENT
   Input field with animated floating label, real-time
   validation feedback and optional password toggle.
   - Label floats to top-left on focus or when filled
   - Focus: soft accent inner glow (no hard border)
   - Valid: soft green inner glow + check icon
   - Error: soft red inner glow + x icon
   - Password with showStrength: always shows strength bar +
     requirements line below — no overlap, no layout shift
   - Eye icon left of check/x
   - No HTML5 native validation popups (noValidate on form)
   ============================================================ */

type InputType = "text" | "email" | "password";

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface FloatingInputProps {
  name: string;
  label: string;
  type?: InputType;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  rules?: ValidationRule[];
  showStrength?: boolean;
}

/* ── Password strength ── */
function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Troppo debole", color: "#ef4444" };
  if (score === 2) return { score, label: "Debole", color: "#f97316" };
  if (score === 3) return { score, label: "Discreta", color: "#eab308" };
  if (score === 4) return { score, label: "Buona", color: "#84cc16" };
  return { score, label: "Ottima", color: "#22c55e" };
}

export default function FloatingInput({
  name,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  rules = [],
  showStrength = false,
}: FloatingInputProps) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isFloating = isFocused || value.length > 0;
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  /* ── Validate — only after first blur, not for showStrength fields ── */
  const errors =
    hasBlurred && !showStrength
      ? rules.filter((r) => !r.test(value)).map((r) => r.message)
      : [];
  const isValid = hasBlurred && errors.length === 0 && value.length > 0;
  const hasError = errors.length > 0;

  /* ── Strength — always computed when showStrength ── */
  const strength =
    showStrength && isPassword && value.length > 0 ? getStrength(value) : null;

  /* ── Soft inner glow — no hard border ── */
  const getShadow = () => {
    if (hasError) return "inset 0 2px 12px rgba(239,68,68,0.25)";
    if (isValid) return "inset 0 2px 12px rgba(34,197,94,0.2)";
    if (isFocused)
      return "inset 0 0 20px rgba(187,255,0,0.08), inset 0 0 6px rgba(187,255,0,0.04)";
    return "inset 0 2px 8px rgba(0,0,0,0.3)";
  };

  /* ── Strength shadow when showStrength ── */
  const getStrengthShadow = () => {
    if (!strength) return getShadow();
    const s = strength;
    if (s.score <= 1) return "inset 0 2px 12px rgba(239,68,68,0.2)";
    if (s.score === 2) return "inset 0 2px 12px rgba(249,115,22,0.2)";
    if (s.score === 3) return "inset 0 2px 12px rgba(234,179,8,0.15)";
    if (s.score === 4) return "inset 0 2px 12px rgba(132,204,22,0.15)";
    return "inset 0 2px 12px rgba(34,197,94,0.2)";
  };

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setHasBlurred(true);
  }, []);

  /* ── Reserve space below:
     - showStrength fields: always reserve 2 lines (bar + requirements)
     - other fields: reserve 1 line for error message
  ── */
  const bottomPadding = showStrength ? "pb-14" : "pb-5";

  return (
    <div className={`relative ${bottomPadding}`}>
      {/* ── Input wrapper ── */}
      <div className="relative">
        {/* Floating label */}
        <motion.label
          htmlFor={id}
          animate={{
            top: isFloating ? "0px" : "50%",
            y: isFloating ? "-50%" : "-50%",
            fontSize: isFloating ? "10px" : "14px",
            left: isFloating ? "12px" : "16px",
            color:
              showStrength && strength
                ? strength.color
                : hasError
                  ? "#ef4444"
                  : isValid
                    ? "#22c55e"
                    : isFocused
                      ? "#BBFF00"
                      : "#8A9AB5",
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute z-10 pointer-events-none font-medium leading-none"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {label}
        </motion.label>

        {/* Input */}
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className="w-full h-12 bg-surface-2 rounded-xl px-4 text-text-primary text-base outline-none transition-shadow duration-200 placeholder-transparent"
          style={{
            boxShadow: showStrength ? getStrengthShadow() : getShadow(),
          }}
          placeholder={label}
        />

        {/* Right icons — eye first (left), then check/x (right) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
              aria-label={
                showPassword ? "Nascondi password" : "Mostra password"
              }
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}

          <AnimatePresence mode="wait">
            {isValid && (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Check size={14} className="text-green-500" />
              </motion.span>
            )}
            {hasError && (
              <motion.span
                key="x"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <X size={14} className="text-red-500" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Error message — absolute, no layout shift ── */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            className="absolute left-1 text-red-400 text-xs"
            style={{ top: "calc(100% - 18px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {errors[0]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Strength: bar + label + requirements — 3 rows, always visible ── */}
      {showStrength && isPassword && (
        <div
          className="absolute left-0 right-0 flex flex-col gap-0.5 px-1"
          style={{ top: "calc(100% - 46px)" }}
        >
          {/* Row 1 — bar */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="h-1 flex-1 rounded-full"
                animate={{
                  backgroundColor:
                    strength && i <= strength.score
                      ? strength.color
                      : "rgba(255,255,255,0.08)",
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>

          {/* Row 2 — strength label */}
          <p
            className="text-xs font-medium"
            style={{ color: strength ? strength.color : "#8A9AB5" }}
          >
            {strength ? strength.label : "-"}
          </p>

          {/* Row 3 — requirements */}
          <p className="text-xs text-text-secondary opacity-50">
            Minimo 8 caratteri, lettera grande, numero, simbolo
          </p>
        </div>
      )}
    </div>
  );
}
