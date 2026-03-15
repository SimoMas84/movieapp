"use server";

/* ============================================================
   PROFILE SERVER ACTIONS
   ============================================================ */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  error: string | null;
  success: string | null;
};

/* ── Update name ── */
export async function updateName(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const name = formData.get("name") as string;

  const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
  if (error) return { error: "Errore durante l'aggiornamento del nome", success: null };

  revalidatePath("/profile");
  return { error: null, success: "Nome aggiornato con successo" };
}

/* ── Update email ── */
export async function updateEmail(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.updateUser({ email });
  if (error) {
    if (error.message.includes("already registered"))
      return { error: "Questa email è già in uso", success: null };
    return { error: "Errore durante l'aggiornamento dell'email", success: null };
  }

  return { error: null, success: "Controlla la tua nuova email per confermare il cambio" };
}

/* ── Update password ──
   Verifies the current password before updating to the new one. */
export async function updatePassword(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const currentPassword = formData.get("currentPassword") as string;
  const password        = formData.get("password") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Utente non trovato", success: null };

  /* Verify current password by attempting a sign-in */
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) return { error: "La password attuale non è corretta", success: null };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.message.includes("New password should be different"))
      return { error: "La nuova password deve essere diversa da quella attuale", success: null };
    return { error: "Errore durante l'aggiornamento della password", success: null };
  }

  revalidatePath("/profile");
  return { error: null, success: "Password aggiornata con successo" };
}

/* ── Delete account ──
   Calls /api/delete-account which uses the service role key
   to permanently delete the user. The anon key cannot do this. */
export async function deleteAccount(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/delete-account`,
    { method: "DELETE" }
  );
  if (!response.ok) return;

  await supabase.auth.signOut();
  redirect("/");
}