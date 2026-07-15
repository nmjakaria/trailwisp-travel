import React from "react";
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import ProfileView from "@/components/shared/ProfileView";


export const metadata = {
  title: "Admin Settings - Profile",
};

export default async function AdminProfilePage() {
  const user = await getUserSession();

  // Redirect if user session doesn't exist
  if (!user) {
    redirect("/login");
  }

  // Typecast user cleanly to match our layout parameters
  const structuredUser = {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    image: user.image || null,
  };

  return <ProfileView role="admin" initialUser={structuredUser} />;
}