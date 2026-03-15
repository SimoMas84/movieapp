/* ============================================================
   PROFILE PAGE — Server Component
   Reads user data server-side and passes to client sections.
   ============================================================ */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import ProfileName from "@/components/profile/ProfileName";
import ProfileEmail from "@/components/profile/ProfileEmail";
import ProfilePassword from "@/components/profile/ProfilePassword";
import ProfileDelete from "@/components/profile/ProfileDelete";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = user.user_metadata?.full_name ?? "";
  const email = user.email ?? "";
  const initials = fullName
    ? getInitials(fullName)
    : (email[0]?.toUpperCase() ?? "U");

  return (
    <div className="min-h-svh pt-28 pb-16 px-4 max-w-lg mx-auto">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <span className="text-accent text-2xl font-medium">{initials}</span>
        </div>
        <h1 className="text-text-primary text-xl font-light">
          {fullName || email}
        </h1>
        <p className="text-text-secondary text-sm">{email}</p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        <ProfileName currentName={fullName} />
        <ProfileEmail currentEmail={email} />
        <ProfilePassword />
        <ProfileDelete />
      </div>
    </div>
  );
}
