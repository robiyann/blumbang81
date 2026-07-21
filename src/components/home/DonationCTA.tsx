"use client";

// src/components/home/DonationCTA.tsx
import { MessageCircle, CreditCard, Copy } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const WA_NUMBER = "6281542072264";
const BANK_ACCOUNT = "6882 0102 1390 539";
const CONTACT_NAME = "Sdr. Triyanto";
const PHONE_DISPLAY = "0815 4207 2264";

export function DonationCTA() {
  return (
    <section
      className="py-24 px-5 md:px-20 bg-[#f1f4f8]"
      id="rekening-pembayaran"
      aria-label="Donasi dan dukungan"
    >
      <div className="max-w-6xl mx-auto">
        {/* Icon + Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ffdad5] rounded-full mb-6">
            <svg
              className="w-10 h-10 text-[#a70009]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <SectionHeader
            title="Mari Wujudkan Bersama"
            subtitle="Mengingat besarnya skala kegiatan ini, keberhasilannya sangat bergantung pada sinergi dan gotong royong kita semua. Kami memohon dukungan Bapak/Ibu/Saudara/i, baik berupa bantuan dana maupun dukungan moril."
            accentBar
          />
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WhatsApp */}
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center text-center relative overflow-hidden border border-[#e5bdb8] shadow-card group hover:shadow-card-hover transition-shadow">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#a70009]" aria-hidden="true" />
            <div className="w-16 h-16 bg-[#ebeef2] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 text-[#181c1f]" aria-hidden="true" />
            </div>
            <p className="text-sm text-[#5c403c] mb-2">Narahubung Panitia:</p>
            <p
              className="font-jakarta font-extrabold text-3xl text-[#a70009] mb-1 tabular-nums"
              aria-label={`Nomor WhatsApp: ${PHONE_DISPLAY}`}
            >
              {PHONE_DISPLAY}
            </p>
            <p className="text-base text-[#181c1f] mb-6">({CONTACT_NAME})</p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo%20Panitia%20HUT%20RI%20ke-81%2C%20saya%20ingin%20memberikan%20dukungan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#a70009] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#930006] active:scale-95 transition-all duration-200 text-sm"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Bank Transfer */}
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center text-center relative overflow-hidden border border-[#e5bdb8] shadow-card group hover:shadow-card-hover transition-shadow">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#a70009]" aria-hidden="true" />
            <div className="w-16 h-16 bg-[#ebeef2] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CreditCard className="w-8 h-8 text-[#181c1f]" aria-hidden="true" />
            </div>
            <p className="text-sm text-[#5c403c] mb-2">
              Rekening Pembayaran (BRI):
            </p>
            <p
              className="font-jetbrains font-bold text-2xl md:text-3xl text-[#a70009] mb-1 tracking-widest"
              aria-label={`Nomor rekening: ${BANK_ACCOUNT}`}
            >
              {BANK_ACCOUNT}
            </p>
            <p className="text-base text-[#181c1f] mb-6">a.n {CONTACT_NAME}</p>
            <button
              onClick={() => navigator.clipboard.writeText(BANK_ACCOUNT.replace(/\s/g, ""))}
              className="inline-flex items-center gap-2 border-2 border-[#a70009] text-[#a70009] font-semibold px-6 py-3 rounded-lg hover:bg-[#ffdad5] active:scale-95 transition-all duration-200 text-sm"
              aria-label="Salin nomor rekening"
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
              Salin Nomor Rekening
            </button>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="mt-12 max-w-4xl mx-auto bg-[#181c1f] text-white py-8 px-8 rounded-xl text-center">
          <p className="font-jetbrains text-xs text-[#ffb4aa] uppercase tracking-widest mb-3">
            Total Anggaran Kegiatan
          </p>
          <p className="font-jakarta font-extrabold text-3xl md:text-4xl text-[#a70009]">
            Rp 30.800.000
          </p>
          <p className="text-sm text-[#d7dade] mt-3 leading-relaxed">
            70% dialokasikan untuk Puncak Acara (Doorprize Rp 15 juta,
            Konsumsi & Perlengkapan) · 18% untuk Hadiah Lomba
          </p>
        </div>

        {/* Closing message */}
        <p className="text-center text-base text-[#5c403c] mt-8 italic">
          Teriring doa dan rasa terima kasih atas waktu, perhatian, serta
          partisipasi Anda. <strong className="text-[#a70009]">MERDEKA!</strong>
        </p>
      </div>
    </section>
  );
}
