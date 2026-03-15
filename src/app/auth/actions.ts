"use server";

/* ============================================================
   AUTH SERVER ACTIONS
   Compatible with React 19 useActionState hook.
   Each action returns ActionState on error or redirects
   on success.
   ============================================================ */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error: string | null;
};

/* ── Login ── */
export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}

/* ── Register ── */
export async function register(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase  = await createClient();
  const email     = formData.get("email") as string;
  const password  = formData.get("password") as string;
  const name      = formData.get("name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/auth/confirm");
}

/* ── Logout ── */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/* ── Forgot password ──
   Sends a reset email via Supabase. Redirects to confirm page on success. */
export async function forgotPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const email    = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
  if (error) return { error: error.message };

  redirect("/auth/forgot-confirm");
}

/* ── Reset password ──
   Updates the password after the user arrives from the reset email link.
   Supabase SSR picks up the token automatically from the session cookie. */
export async function resetPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/auth/reset-confirm");
}