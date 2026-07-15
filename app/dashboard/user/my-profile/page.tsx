import React from "react";
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import ProfileView from "@/components/shared/ProfileView";

export const metadata = {
  title: "User Settings - Profile",
};

export default async function UserProfilePage() {
  const user = await getUserSession();

  // Redirect if user session doesn't exist
  if (!user) {
    redirect("/login");
  }

  const structuredUser = {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    image: user.image || null,
  };

  return <ProfileView role="user" initialUser={structuredUser} />;
}