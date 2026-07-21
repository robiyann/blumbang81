// src/app/(public)/kontak/page.tsx
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Hubungi Panitia — HUT RI 81",
  description: "Kontak sekretariat panitia HUT RI ke-81 Blumbang RT 15, Desa Saren, Kalijambe, Sragen.",
};

const WA_NUMBER = "6281542072264";
const PHONE_DISPLAY = "0815 4207 2264";
const CONTACT_NAME = "Sdr. Triyanto";

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full py-12 space-y-16">
      {/* Header */}
      <section className="px-5 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Hubungi Panitia"
            subtitle="Punya pertanyaan seputar perlombaan, pendaftaran, sponsorship, atau sponsorship? Hubungi panitia pelaksana."
            eyebrow="Kontak"
            accentBar
          />
        </div>
      </section>

      {/* Grid container */}
      <section className="px-5 md:px-20 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Channels */}
          <div className="space-y-8">
            <h3 className="font-jakarta font-bold text-xl text-[#181c1f] pb-4 border-b border-[#e5bdb8]">
              Saluran Komunikasi
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ffdad5] rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#a70009]" />
                </div>
                <div>
                  <h4 className="font-jakarta font-bold text-base text-[#181c1f] mb-1">
                    Sekretariat Panitia
                  </h4>
                  <p className="text-sm text-[#5c403c] leading-relaxed">
                    Blumbang RT 15, Desa Saren, Kecamatan Kalijambe, Kabupaten Sragen, Jawa Tengah.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ffdad5] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#a70009]" />
                </div>
                <div>
                  <h4 className="font-jakarta font-bold text-base text-[#181c1f] mb-1">
                    Telepon & SMS
                  </h4>
                  <p className="text-sm text-[#5c403c] mb-1">
                    {PHONE_DISPLAY} ({CONTACT_NAME})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ffdad5] rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#a70009]" />
                </div>
                <div>
                  <h4 className="font-jakarta font-bold text-base text-[#181c1f] mb-1">
                    WhatsApp Chat
                  </h4>
                  <p className="text-sm text-[#5c403c] mb-4">
                    Hubungi panitia langsung secara cepat via WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/${WA_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#a70009] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#930006] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Kirim Pesan WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Maps Embed */}
          <div className="space-y-6">
            <h3 className="font-jakarta font-bold text-xl text-[#181c1f] pb-4 border-b border-[#e5bdb8]">
              Lokasi Google Maps
            </h3>
            <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#e5bdb8] relative bg-zinc-200 shadow-sm">
              <iframe
                title="Peta Lokasi Blumbang RT 15"
                src="https://maps.google.com/maps?q=-7.424475,110.799222&hl=id&z=18&t=k&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
            <div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=-7.424475,110.799222"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#a70009] text-[#a70009] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-[#ffdad5]/40 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Buka di Aplikasi Google Maps &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
