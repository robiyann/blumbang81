// src/app/(public)/jadwal/page.tsx
import { TimelineView } from "@/components/schedule/TimelineView";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { UmbulUmbulDivider } from "@/components/shared/UmbulUmbulDivider";
import { getScheduleItems, fallbackScheduleItems } from "@/repositories/scheduleRepository";
import { Gift } from "lucide-react";

import type { ScheduleItem } from "@/types/schedule";

export const revalidate = 3600; // ISR every 1 hour

export default async function SchedulePage() {
  let scheduleItems: ScheduleItem[] = [];
  try {
    scheduleItems = await getScheduleItems();
  } catch (error) {
    console.error("Failed to load schedule:", error);
    scheduleItems = fallbackScheduleItems;
  }

  if (scheduleItems.length === 0) {
    scheduleItems = fallbackScheduleItems;
  }

  return (
    <div className="flex flex-col w-full py-12 space-y-20">
      {/* Header */}
      <section className="px-5 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Linimasa Perayaan HUT RI ke-81"
            subtitle="Rangkaian kegiatan semarak kemerdekaan yang disusun untuk mempererat tali persaudaraan dan gotong royong."
            eyebrow="Jadwal Acara"
            accentBar
          />
        </div>
      </section>

      {/* Central Location Card */}
      <section className="px-5 md:px-20">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#e5bdb8] p-6 text-center shadow-sm">
          <p className="font-jetbrains text-xs text-[#a70009] uppercase tracking-wider mb-2">
            Lokasi Sentral Kegiatan:
          </p>
          <p className="font-jakarta font-bold text-lg text-[#181c1f]">
            Pekarangan Bapak Sugiyanto, Blumbang RT 15
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-5 md:px-20 max-w-5xl mx-auto w-full">
        <TimelineView items={scheduleItems} />
      </section>

      {/* Peak Event Doorprize Highlights */}
      <section className="px-5 md:px-20">
        <div className="max-w-4xl mx-auto bg-white border border-[#e5bdb8] rounded-xl overflow-hidden shadow-md relative">
          <UmbulUmbulDivider color="red" />
          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="font-jakarta font-bold text-2xl text-[#181c1f] leading-tight">
                Puncak Keriaan Kemerdekaan:<br />
                <span className="text-[#a70009]">Jalan Sehat Bersama</span>
              </h3>
              <p className="text-sm text-[#5c403c] leading-relaxed">
                Menyusuri rute lingkungan desa, menyatukan seluruh generasi Blumbang RT 15 dalam satu barisan kemerdekaan yang rukun dan sehat.
              </p>
              <div className="bg-[#ffdad5] p-4 rounded-lg border-l-4 border-[#a70009]">
                <ul className="text-xs text-[#5c403c] space-y-2">
                  <li><strong>Hari, Tanggal:</strong> Minggu, 16 Agustus 2026</li>
                  <li><strong>Waktu:</strong> 06.00 WIB - Selesai</li>
                  <li><strong>Tempat:</strong> Pekarangan Bapak Sugiyanto</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#a70009] text-white p-8 rounded-xl text-center shadow-lg transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
              <Gift className="w-12 h-12 mx-auto mb-4" />
              <h4 className="font-jakarta font-extrabold text-2xl uppercase tracking-tight mb-2">
                DOORPRIZE MENARIK!
              </h4>
              <p className="text-xs text-white/80 italic">
                (Diundi di akhir acara untuk seluruh warga masyarakat Blumbang RT 15 yang berpartisipasi).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
