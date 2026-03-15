"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ============================================================
   AUTH SERVER ACTIONS
   Compatible with React 19 useActionState hook.
   Each action returns an ActionState object on error,
   or redirects on success.
   ============================================================ */

export type ActionState = {
  error: string | null;
};

/* ── Login ── */
export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/* ── Register ── */
export async function register(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

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

/* ── Forgot password ── */
/* Sends a password reset email via Supabase.
   On success redirects to confirm page.
   On error returns the error message. */
export async function forgotPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/forgot-confirm");
}

/* ── Reset password ── */
/* Updates the user password after they arrive from
   the reset email link. Supabase handles the token
   via the URL hash — the SSR client picks it up
   automatically from the session cookie. */
export async function resetPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/reset-confirm");
}

// "use server";

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";

// /* ============================================================
//    AUTH SERVER ACTIONS
//    Compatible with React 19 useActionState hook.
//    Each action returns an ActionState object on error,
//    or redirects on success.
//    ============================================================ */

// export type ActionState = {
//   error: string | null;
// };

// /* ── Login ── */
// export async function login(
//   _prevState: ActionState,
//   formData: FormData
// ): Promise<ActionState> {
//   const supabase = await createClient();

//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   const { error } = await supabase.auth.signInWithPassword({ email, password });

//   if (error) {
//     return { error: error.message };
//   }

//   revalidatePath("/", "layout");
//   redirect("/");
// }

// /* ── Register ── */
// export async function register(
//   _prevState: ActionState,
//   formData: FormData
// ): Promise<ActionState> {
//   const supabase = await createClient();

//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const name = formData.get("name") as string;

//   const { error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: { full_name: name },
//     },
//   });

//   if (error) {
//     return { error: error.message };
//   }

//   revalidatePath("/", "layout");
//   redirect("/auth/confirm");
// }

// /* ── Logout ── */
// export async function logout(): Promise<void> {
//   const supabase = await createClient();
//   await supabase.auth.signOut();
//   revalidatePath("/", "layout");
//   redirect("/");
// }

// /* ── Forgot password ── */
// /* Sends a password reset email via Supabase.
//    On success redirects to confirm page.
//    On error returns the error message. */
// export async function forgotPassword(
//   _prevState: ActionState,
//   formData: FormData
// ): Promise<ActionState> {
//   const supabase = await createClient();

//   const email = formData.get("email") as string;

//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
//   });

//   if (error) {
//     return { error: error.message };
//   }

//   redirect("/auth/forgot-confirm");
// }

// /* ── Reset password ── */
// /* Updates the user password after they arrive from
//    the reset email link. Supabase handles the token
//    via the URL hash — the SSR client picks it up
//    automatically from the session cookie. */
// export async function resetPassword(
//   _prevState: ActionState,
//   formData: FormData
// ): Promise<ActionState> {
//   const supabase = await createClient();

//   const password = formData.get("password") as string;

//   const { error } = await supabase.auth.updateUser({ password });

//   if (error) {
//     return { error: error.message };
//   }

//   revalidatePath("/", "layout");
//   redirect("/auth/reset-confirm");
// }
