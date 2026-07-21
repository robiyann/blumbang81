import { SectionHeader } from "@/components/shared/SectionHeader";
import { formatRupiah, formatCompactRupiah } from "@/utils/formatCurrency";
import { MessageCircle, CreditCard, Heart, TrendingUp, Users, Wallet, Calendar, ArrowUpRight, ArrowDownRight, BadgeAlert } from "lucide-react";
import { cn } from "@/utils/cn";
import { getFinanceItems } from "@/repositories/financeRepository";
import { getDonations } from "@/repositories/donationRepository";
import { getExpenses } from "@/repositories/expenseRepository";
import { CopyButton } from "@/components/finance/CopyButton";
import { DonorTicker } from "@/components/finance/DonorTicker";
import { formatDate } from "@/utils/formatDate";
import { RabBreakdown } from "@/components/finance/RabBreakdown";

const WA_NUMBER = "6281542072264";
const BANK_ACCOUNT = "6882 0102 1390 539";
const CONTACT_NAME = "Sdr. Triyanto";
const PHONE_DISPLAY = "0815 4207 2264";

export const revalidate = 3600; // ISR every 1 hour

export default async function FinancePage() {
  const budgetAllocations = await getFinanceItems();
  const donorList = await getDonations();
  const expenseList = await getExpenses();
  
  // Calculations
  const targetBudget = budgetAllocations.reduce((sum, item) => sum + item.amount, 0) || 30800000;
  const totalCollected = donorList.reduce((sum, d) => sum + d.amount, 0);
  const totalSpent = expenseList.reduce((sum, e) => sum + e.amount, 0);
  const remainingFunds = Math.max(0, targetBudget - totalCollected);
  const balance = totalCollected - totalSpent;
  const progressPercentage = Math.min(100, Math.round((totalCollected / targetBudget) * 100));

  return (
    <div className="flex flex-col w-full py-12 space-y-16">
      {/* Header */}
      <section className="px-5 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Laporan & Saluran Donasi Keuangan"
            subtitle="Transparansi anggaran HUT RI ke-81 lingkungan Blumbang RT 15. Memantau donasi masuk, realisasi pengeluaran, dan Rencana Anggaran Biaya."
            eyebrow="Keuangan"
            accentBar
          />
        </div>
      </section>

      {/* ─── CROWDFUNDING PROGRESS BAR PANEL ─── */}
      <section className="px-5 md:px-20 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-[#e5bdb8] p-8 shadow-card relative overflow-hidden">
          {/* Header Progress */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
            <div>
              <h3 className="font-jakarta font-extrabold text-xl text-[#181c1f] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#a70009]" />
                Progress Pengumpulan Dana Warga
              </h3>
              <p className="text-xs text-[#5c403c] mt-0.5">
                Target pengumpulan dana gotong royong dari warga dan donatur eksternal.
              </p>
            </div>
            <div className="font-jakarta font-extrabold text-2xl text-[#a70009] bg-[#ffdad5] px-4 py-1.5 rounded-xl border border-[#e5bdb8]">
              {progressPercentage}% Terkumpul
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-5 bg-[#ebeef2] rounded-full overflow-hidden mb-8 border border-[#e0e3e6] p-1">
            <div
              className="h-full bg-gradient-to-r from-[#ce201c] to-[#a70009] rounded-full shadow-inner transition-all duration-500 relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]" />
            </div>
          </div>

          {/* 2x2 Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Target */}
            <div className="bg-[#f7fafd] rounded-xl p-4 sm:p-5 border border-[#e5bdb8] flex flex-col items-start gap-3 justify-between">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-[#e5bdb8] rounded-full flex items-center justify-center text-[#5c403c] shrink-0 shadow-sm">
                <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="w-full">
                <p className="font-jetbrains text-[8px] uppercase tracking-wider text-[#5c403c] font-bold">
                  Target RAB
                </p>
                <p className="font-jakarta font-extrabold text-sm sm:text-base text-[#181c1f] mt-1 leading-tight break-words">
                  {formatCompactRupiah(targetBudget)}
                </p>
              </div>
            </div>

            {/* Collected (Donations) */}
            <div className="bg-[#f7fafd] rounded-xl p-4 sm:p-5 border border-[#e5bdb8] flex flex-col items-start gap-3 justify-between">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-[#e5bdb8] rounded-full flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                <ArrowUpRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <p className="font-jetbrains text-[8px] uppercase tracking-wider text-[#5c403c] font-bold">
                  Total Donasi Masuk
                </p>
                <p className="font-jakarta font-extrabold text-sm sm:text-base text-emerald-600 mt-1 leading-tight break-words">
                  {formatCompactRupiah(totalCollected)}
                </p>
              </div>
            </div>

            {/* Spent */}
            <div className="bg-[#f7fafd] rounded-xl p-4 sm:p-5 border border-[#e5bdb8] flex flex-col items-start gap-3 justify-between">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-[#e5bdb8] rounded-full flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
                <ArrowDownRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <p className="font-jetbrains text-[8px] uppercase tracking-wider text-[#5c403c] font-bold">
                  Realisasi Belanja
                </p>
                <p className="font-jakarta font-extrabold text-sm sm:text-base text-rose-600 mt-1 leading-tight break-words">
                  {formatCompactRupiah(totalSpent)}
                </p>
              </div>
            </div>

            {/* Sisa Saldo Kas */}
            <div className="bg-[#f7fafd] rounded-xl p-4 sm:p-5 border border-[#e5bdb8] flex flex-col items-start gap-3 justify-between">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-[#e5bdb8] rounded-full flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="w-full">
                <p className="font-jetbrains text-[8px] uppercase tracking-wider text-[#5c403c] font-bold">
                  Sisa Saldo Kas
                </p>
                <p className={cn("font-jakarta font-extrabold text-sm sm:text-base mt-1 leading-tight break-words", balance >= 0 ? "text-blue-600" : "text-rose-600")}>
                  {formatCompactRupiah(balance)}
                </p>
              </div>
            </div>
          </div>

          {remainingFunds > 0 && (
            <div className="mt-5 p-3.5 bg-[#fff5f5] border border-[#ffdad5] rounded-xl flex items-center gap-3">
              <BadgeAlert className="w-5 h-5 text-[#a70009] shrink-0" />
              <p className="text-xs text-[#a70009] leading-normal font-semibold">
                Kekurangan dana pengumpulan saat ini adalah sebesar <span className="font-extrabold">{formatRupiah(remainingFunds)}</span>. Saluran donasi masih terbuka lebar bagi warga yang ingin berpartisipasi.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RAB Breakdown Card */}
      <section className="px-5 md:px-20 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-[#e5bdb8] border-t-4 border-t-[#a70009] shadow-card p-8 md:p-12 relative overflow-hidden">
          <RabBreakdown budgetAllocations={budgetAllocations} targetBudget={targetBudget} />

          <div className="mt-8 pt-6 border-t border-[#ebeef2] text-center">
            <p className="text-xs md:text-sm text-[#5c403c] italic leading-relaxed">
              *Sebagian besar alokasi dana dirancang untuk dikembalikan kembali kepada warga dalam bentuk apresiasi (hadiah lomba & doorprize jalan sehat) untuk memaksimalkan kebersamaan.*
            </p>
          </div>
        </div>
      </section>

      {/* ─── TABLES CONTAINER (DONORS & EXPENSES SIDE-BY-SIDE / STACKED) ─── */}
      <section className="px-5 md:px-20 max-w-5xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left: Donations animated ticker */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-[#e5bdb8] p-6 shadow-card">
            <h3 className="font-jakarta font-extrabold text-base text-[#181c1f] mb-5 flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-[#a70009] fill-[#a70009]" />
              Dukungan Donatur Warga
            </h3>
            <DonorTicker donors={donorList} totalCollected={totalCollected} />
          </div>

          {/* Right Table: Expenses */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-[#e5bdb8] p-6 shadow-card">
            <h3 className="font-jakarta font-extrabold text-base text-[#181c1f] mb-5 flex items-center gap-2">
              <ArrowDownRight className="w-4.5 h-4.5 text-[#a70009]" />
              Laporan Realisasi Belanja
            </h3>

            {expenseList.length === 0 ? (
              <div className="text-center py-10 text-[#5c403c] border border-dashed border-[#ebeef2] rounded-xl">
                <BadgeAlert className="w-7 h-7 text-[#ebeef2] mx-auto mb-2" />
                <p className="text-xs font-semibold">Belum ada pengeluaran tercatat.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5bdb8] text-[10px] font-jakarta font-bold text-[#181c1f] bg-[#f7fafd]">
                      <th className="py-2.5 px-3 rounded-l-lg">No</th>
                      <th className="py-2.5 px-3">Nama Belanja</th>
                      <th className="py-2.5 px-3">Jumlah</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebeef2] text-xs text-[#181c1f]">
                    {expenseList.map((exp, idx) => (
                      <tr key={exp.id} className="hover:bg-[#f7fafd]/40 transition-colors">
                        <td className="py-3 px-3 font-jetbrains text-[10px] text-[#5c403c]">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold">
                          <div>{exp.title}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-[#f7fafd] text-[9px] border border-[#e5bdb8] text-[#5c403c] rounded font-semibold">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-extrabold text-rose-600">
                          {formatRupiah(exp.amount)}
                        </td>
                        <td className="py-3 px-3 text-[10px] text-[#5c403c] font-semibold whitespace-nowrap">
                          {formatDate(exp.spentAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Donation Channels */}
      <section id="rekening-pembayaran" className="px-5 md:px-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WhatsApp Contact */}
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-[#e5bdb8] shadow-card group hover:shadow-card-hover transition-shadow">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#a70009]" aria-hidden="true" />
            <MessageCircle className="w-12 h-12 text-[#181c1f] mb-4" />
            <p className="text-xs text-[#5c403c] uppercase tracking-wider mb-1">
              Narahubung Panitia:
            </p>
            <p className="font-jakarta font-extrabold text-2xl text-[#a70009] mb-1">
              {PHONE_DISPLAY}
            </p>
            <p className="text-sm text-[#181c1f] mb-6">({CONTACT_NAME})</p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo%20Panitia%20HUT%20RI%20ke-81%2C%20saya%20ingin%20berpartisipasi%20memberikan%20donasi.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#a70009] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#930006] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Triyanto
            </a>
          </div>

          {/* Bank Transfer */}
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-[#e5bdb8] shadow-card group hover:shadow-card-hover transition-shadow">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#a70009]" aria-hidden="true" />
            <CreditCard className="w-12 h-12 text-[#181c1f] mb-4" />
            <p className="text-xs text-[#5c403c] uppercase tracking-wider mb-1">
              Rekening Pembayaran (BRI):
            </p>
            <p className="font-jetbrains font-bold text-xl text-[#a70009] mb-1 tracking-wider">
              {BANK_ACCOUNT}
            </p>
            <p className="text-sm text-[#181c1f] mb-6">a.n {CONTACT_NAME}</p>
            <CopyButton textToCopy={BANK_ACCOUNT} />
          </div>
        </div>

        <div className="mt-8 bg-[#181c1f] text-white py-4 px-6 rounded-lg text-center shadow-sm">
          <p className="text-sm">Teriring doa dan rasa terima kasih atas waktu, perhatian, serta partisipasi Anda.</p>
        </div>
      </section>
    </div>
  );
}
