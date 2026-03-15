/* ============================================================
   AUTH CALLBACK ROUTE
   Handles the token exchange after email confirmation.
   Supabase sends the user here after clicking the email link.
   Exchanges the code for a session, then redirects to the
   email confirmed page.
   ============================================================ */

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/auth/email-confirmed`);
}