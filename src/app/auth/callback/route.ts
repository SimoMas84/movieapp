import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/* ============================================================
   AUTH CALLBACK ROUTE
   Handles the token exchange after email confirmation.
   Supabase sends the user here after clicking the email link.
   Exchanges the code for a session, then redirects to the
   email confirmed page.
   ============================================================ */

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/auth/email-confirmed`);
}