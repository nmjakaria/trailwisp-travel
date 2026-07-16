/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, toast } from "@heroui/react";
import { ThemeSwitcher } from "./theme-switcher";
import { useSession, signOut } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Image from "next/image";
import { IUser } from "@/types";

interface NavLinkItem {
  label: string;
  href: string;
}

export default function Navbar(): React.JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const user = session?.user;

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    toast.success("Signed out successfully", {
      description: "You have been logged out of your account.",
      timeout: 2000,
    });
    redirect('/');
  };

  const navLinks: NavLinkItem[] = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Stories", href: "/stories" },
  ];

  // Defined strictly using standard dictionary mapping roles to string paths
  const dashboardLink: Record<string, string> = {
    user: "/dashboard/user",
    admin: "/dashboard/admin",
  };

  if (user?.email) {
    const userRole = user?.role || "user";
    navLinks.push({
      label: "Dashboard",
      href: dashboardLink[userRole] || "/dashboard/user",
    });
  }

  if (user?.email && user?.role === 'user') {
    navLinks.push({
      label: "Wishlist",
      href: "/dashboard/user/wishlist"
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-default-100 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex md:grid md:grid-cols-3 h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* BRAND LOGO AREA */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <Image
                alt="Trailwisp Logo"
                src="/trailwisp-logo.png"
                // src="https://fastly.4sqi.net/img/general/600x600/170077684_WurW-saVWWTofqkCCrMb8YKNOocyqgaB34fc9AQrI4Q.png"
                width={35}
                height={35}
                className="object-contain"
              />
            </div>
            <div className="hidden leading-none sm:block">
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Trail<span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">wisp</span>
              </span>
            </div>
          </Link>
        </div>

        {/* DESKTOP NAVIGATION MENU */}
        <div className="hidden md:flex items-center justify-center">
          <ul className="flex items-center gap-1 rounded-full border border-default-200 bg-default-50/50 text-nowrap py-1.5 px-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-default-100 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTROLS & AUTH AREA */}
        <div className="flex items-center justify-end gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <ThemeSwitcher />

            <div className="h-6 w-px bg-default-200" />

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link href={`/dashboard/${user?.role || "user"}/my-profile`} aria-label="Profile" className="hover:opacity-85 transition-opacity">
                    <div className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-teal-500/30 dark:ring-teal-400/30">
                      {user.image ? (
                        <img className="aspect-square h-full w-full object-cover" src={user.image} alt={user.name || "User"} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-default-200 text-sm font-semibold text-default-700">
                          {user.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* <Button
                    onClick={handleSignOut}
                    color="danger"
                    size="sm"
                    className="rounded-full font-medium"
                  >
                    Sign Out
                  </Button> */}
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-sm font-medium p-2.5 bg-orange-600 text-white shadow-sm rounded-full px-5 hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE BAR */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-xl p-2 text-foreground transition hover:bg-default-100"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isMenuOpen && (
        <div className="border-t border-default-100 bg-background/95 backdrop-blur-md md:hidden animate-in fade-in-50 slide-in-from-top-5 duration-200">
          <div className="space-y-4 px-4 py-6">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition hover:bg-default-100 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-default-100 pt-4 space-y-3 flex flex-col">
              {user ? (
                <div className="flex flex-col gap-4 px-4">
                  <Link
                    href={`/dashboard/${user?.role || "user"}/my-profile`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-teal-500/20">
                      {user?.image ? (
                        <img className="aspect-square h-full w-full object-cover" src={user?.image} alt={user?.name || "User"} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-default-200 text-sm font-semibold text-default-700">
                          {user?.name ? user?.name.slice(0, 1).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground group-hover:text-teal-500 transition-colors">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">View profile</span>
                    </div>
                  </Link>

                  {/* <Button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    color="danger"
                    className="w-full rounded-xl font-medium"
                  >
                    Sign Out
                  </Button> */}
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link
                    href="/auth/signin"
                    className="w-full text-center rounded-xl p-2.5 text-base font-medium text-teal-600 dark:text-teal-400 hover:bg-default-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="w-full font-semibold shadow-md rounded-xl text-center p-2.5 bg-orange-600 text-white hover:opacity-90 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}