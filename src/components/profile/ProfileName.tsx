"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { updateName, type ProfileActionState } from "@/app/profile/actions";
import FloatingInput from "@/components/ui/FloatingInput";

const initialState: ProfileActionState = { error: null, success: null };

const nameRules = [
  {
    test: (v: string) => v.trim().length >= 2,
    message: "Il nome deve avere almeno 2 caratteri",
  },
];

interface ProfileNameProps {
  currentName: string;
}

export default function ProfileName({ currentName }: ProfileNameProps) {
  const [state, formAction, isPending] = useActionState(
    updateName,
    initialState,
  );
  const [name, setName] = useState(currentName);

  const isFormValid = name.trim().length >= 2 && name !== currentName;

  return (
    <div className="bg-surface-1 border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
      <h2 className="text-text-primary text-sm font-medium mb-4">Nome</h2>
      <form action={formAction} className="flex flex-col gap-3" noValidate>
        <FloatingInput
          name="name"
          label="Nome"
          type="text"
          autoComplete="name"
          value={name}
          onChange={setName}
          rules={nameRules}
        />

        <button
          type="submit"
          disabled={isPending || !isFormValid}
          className="w-full h-10 bg-accent hover:bg-accent-hover disabled:opacity-40 text-bg-primary text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            "Salva"
          )}
        </button>

        {/* Feedback */}
        <div className="h-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {state.error && (
              <motion.p
                key="error"
                className="text-red-400 text-xs text-center"
                style={{ textShadow: "0 0 12px rgba(239,68,68,0.6)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {state.error}
              </motion.p>
            )}
            {state.success && (
              <motion.p
                key="success"
                className="text-green-400 text-xs text-center"
                style={{ textShadow: "0 0 12px rgba(34,197,94,0.6)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {state.success}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
