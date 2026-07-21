"use client";

// src/components/layout/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Flag, Lock } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal", label: "Jadwal" },
  { href: "/keuangan", label: "Keuangan" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/dokumentasi", label: "Dokumentasi" },
  { href: "/panitia", label: "Panitia" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Navigasi utama"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-[#f7fafd]/95 backdrop-blur-sm border-b-4 border-[#a70009]",
          scrolled ? "shadow-nav" : "shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-20 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="HUT RI 81 — Beranda"
          >
            <Image
              src="/logos.webp"
              alt="Logo HUT RI 81"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
            <span className="font-jakarta font-bold text-lg text-[#a70009] leading-none tracking-tight">
              HUT RI 81
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded transition-colors duration-200",
                    isActive
                      ? "text-[#a70009]"
                      : "text-[#5c403c] hover:text-[#a70009]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a70009] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all duration-200 border cursor-pointer",
                pathname.startsWith("/admin")
                  ? "bg-[#a70009] text-white border-[#a70009] shadow-xs"
                  : "bg-white/90 text-[#5c403c] border-[#e5bdb8] hover:bg-[#ffdad5]/40 hover:text-[#a70009]"
              )}
              title="Masuk ke Panel Admin"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            <Link
              href="/keuangan#rekening-pembayaran"
              className="hidden sm:inline-flex items-center gap-2 bg-[#a70009] text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#930006] hover:shadow-md active:scale-95 transition-all duration-200 shadow-sm"
            >
              Donasi Sekarang
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-xl text-[#181c1f] hover:bg-[#ebeef2] transition-colors"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white border-b-2 border-[#e5bdb8] shadow-lg lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#ffdad5] text-[#a70009] font-bold"
                        : "text-[#181c1f] hover:bg-[#f1f4f8]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-[#e0e3e6] mt-2 flex flex-col gap-2.5">
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-zinc-100 text-[#181c1f] text-sm font-bold px-5 py-3 rounded-full hover:bg-zinc-200 transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#a70009]" />
                  Panel Admin / Login
                </Link>
                <Link
                  href="/keuangan#rekening-pembayaran"
                  onClick={() => setMobileOpen(false)}
                  className="flex justify-center bg-[#a70009] text-white text-sm font-bold px-5 py-3 rounded-full hover:bg-[#930006] transition-colors shadow-sm"
                >
                  Donasi Sekarang
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
