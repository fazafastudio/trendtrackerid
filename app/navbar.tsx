"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

// Module-level singleton so supabase is a stable reference
// (avoids react-hooks/exhaustive-deps warning on the auth effect below)
const supabase = createClient();

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLanding = !pathname.startsWith("/dashboard") && !pathname.startsWith("/products");

  // ── Ambil session awal + subscribe realtime ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Tutup dropdown kalau klik di luar ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // ── Helper: ambil inisial ──
  const initial = user?.email
    ? user.email.charAt(0).toUpperCase()
    : user?.user_metadata?.full_name?.charAt(0).toUpperCase() ?? "?";

  const displayName =
    user?.user_metadata?.full_name ?? user?.email ?? "User";

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
            T
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            TrendTracker
            <span className="text-emerald-400"> ID</span>
          </span>
        </Link>

        {user ? (
          /* ──── SUDAH LOGIN ──── */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              {initial}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
                {/* Info user */}
                <div className="px-4 py-3">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {user.email}
                  </p>
                </div>

                <div className="h-px bg-zinc-800" />

                {/* Link Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Dashboard
                </Link>

                <div className="h-px bg-zinc-800" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-zinc-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ──── BELUM LOGIN ──── */
          <div className="flex items-center gap-1 sm:gap-4">
            {isLanding && (
              <>
                <Link
                  href="/#fitur"
                  className="hidden rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-400 transition hover:text-zinc-200 sm:inline-block"
                >
                  Fitur
                </Link>
                <Link
                  href="/#harga"
                  className="hidden rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-400 transition hover:text-zinc-200 sm:inline-block"
                >
                  Harga
                </Link>
              </>
            )}
            <Link
              href="/login"
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-300 transition hover:text-zinc-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-400 sm:px-4"
            >
              Daftar Gratis
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}