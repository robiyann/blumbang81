// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Flag, MapPin, Phone, MessageCircle } from "lucide-react";

const footerLinks = [
  { href: "/jadwal", label: "Jadwal Kegiatan" },
  { href: "/keuangan", label: "Laporan Keuangan" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/dokumentasi", label: "Dokumentasi" },
  { href: "/panitia", label: "Susunan Panitia" },
  { href: "/kontak", label: "Kontak" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2d3134] text-[#eef1f5]" role="contentinfo">
      {/* Umbul-Umbul accent */}
      <div
        className="h-5 w-full"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 20' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='0,0 10,20 20,0 30,20 40,0 50,20 60,0 70,20 80,0 90,20 100,0' fill='%23ce201c'/%3E%3C/svg%3E\")",
          backgroundSize: "100% 100%",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logos.webp"
                alt="Logo HUT RI 81"
                width={38}
                height={38}
                className="object-contain brightness-95"
              />
              <span className="font-jakarta font-bold text-lg text-[#ffb4aa] tracking-tight">
                HUT RI 81
              </span>
            </div>
            <p className="text-sm text-[#d7dade] leading-relaxed mb-4">
              Peringatan HUT Kemerdekaan Republik Indonesia ke-81 Tahun 2026.
            </p>
            <p className="font-jetbrains text-xs text-[#916f6b] uppercase tracking-wider">
              "Semangat Gotong Royong Lintas Generasi"
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-jakarta font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#d7dade] hover:text-[#ffb4aa] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-jakarta font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-[#d7dade]">
                <MapPin className="w-4 h-4 mt-0.5 text-[#a70009] shrink-0" aria-hidden="true" />
                <span>Blumbang RT 15, Desa Saren, Kec. Kalijambe, Kab. Sragen</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#d7dade]">
                <Phone className="w-4 h-4 text-[#a70009] shrink-0" aria-hidden="true" />
                <a
                  href="tel:+6281542072264"
                  className="hover:text-[#ffb4aa] transition-colors"
                >
                  0815 4207 2264 (Sdr. Triyanto)
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MessageCircle className="w-4 h-4 text-[#a70009] shrink-0" aria-hidden="true" />
                <a
                  href="https://wa.me/6281542072264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d7dade] hover:text-[#ffb4aa] transition-colors"
                >
                  WhatsApp Panitia
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#505252] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#916f6b]">
          <p>© 2026 Panitia HUT RI ke-81 Blumbang RT 15. Semangat Gotong Royong.</p>
          <div className="flex gap-6">
            <Link href="/kontak" className="hover:text-[#d7dade] transition-colors">
              Kontak Panitia
            </Link>
            <Link href="/dokumentasi" className="hover:text-[#d7dade] transition-colors">
              Dokumentasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
