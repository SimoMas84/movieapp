/* ============================================================
   DELETE ACCOUNT API ROUTE
   Uses the service role key (admin) to permanently delete
   the user from Supabase Auth. The anon key cannot delete
   users — only the service role key has this permission.
   Favorites and watchlist are deleted automatically via
   the ON DELETE CASCADE foreign key constraint.
   ============================================================ */

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function DELETE() {
  /* ── Verify the user is authenticated ── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── Create admin client with service role key ── */
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /* ── Delete user — CASCADE removes favorites and watchlist ── */
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}