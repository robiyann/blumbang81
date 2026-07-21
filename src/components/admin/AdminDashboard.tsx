"use client";

// src/components/admin/AdminDashboard.tsx
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createAnnouncementAction, deleteAnnouncementAction, updateAnnouncementAction,
  createScheduleAction, deleteScheduleAction, updateScheduleAction,
  createCommitteeAction, deleteCommitteeAction, updateCommitteeAction,
  createFinanceAction, deleteFinanceAction, updateFinanceAction,
  createDonationAction, deleteDonationAction, updateDonationAction,
  createExpenseAction, deleteExpenseAction, updateExpenseAction,
  logoutAction,
} from "@/app/actions/admin";
import {
  Plus, Trash2, Pin, LogOut, CheckCircle, AlertCircle,
  Megaphone, Calendar, Users, Wallet, Heart, ArrowDownRight,
  UserCheck, MapPin, Clock, Pencil, X, Save, Image as GalleryIcon, CheckCircle2, Check,
  RefreshCw, AlertTriangle, ShieldAlert
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatRupiah } from "@/utils/formatCurrency";
import { approveImageAction, rejectImageAction, syncR2BucketAction } from "@/app/actions/gallery";

interface AdminDashboardProps {
  initialAnnouncements: any[];
  initialSchedules: any[];
  initialCommittee: any[];
  initialFinance: any[];
  initialDonations: any[];
  initialExpenses: any[];
  initialPendingImages: any[];
}

type TabType = "announcements" | "schedules" | "committee" | "finance" | "donations" | "expenses" | "gallery";

const TABS = [
  { type: "announcements", label: "Pengumuman", icon: Megaphone },
  { type: "schedules",     label: "Jadwal Acara",    icon: Calendar },
  { type: "committee",     label: "Nama Panitia",    icon: Users },
  { type: "finance",       label: "Anggaran RAB",    icon: Wallet },
  { type: "donations",     label: "Donatur Warga",   icon: Heart },
  { type: "expenses",      label: "Belanja/Keluar",  icon: ArrowDownRight },
  { type: "gallery",       label: "Persetujuan Foto", icon: GalleryIcon },
];

// ─── Edit Modal Component ────────────────────────────────────
function EditModal({
  tab, item, onClose, onSaved,
}: { tab: TabType; item: any; onClose: () => void; onSaved: (updated: any) => void }) {
  const [isPending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  // Local states seeded from item
  const [title, setTitle]       = useState(item.title ?? "");
  const [content, setContent]   = useState(item.content ?? "");
  const [category, setCategory] = useState(item.category ?? "Umum");
  const [pinned, setPinned]     = useState(item.pinned ?? false);

  const [date, setDate]             = useState(item.date ?? item.donatedAt ?? item.spentAt ?? "");
  const [timeStart, setTimeStart]   = useState(item.timeStart ?? "");
  const [timeEnd, setTimeEnd]       = useState(item.timeEnd ?? "");
  const [location, setLocation]     = useState(item.location ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [type, setType]             = useState(item.type ?? "umum");

  const [name, setName]       = useState(item.name ?? "");
  const [role, setRole]       = useState(item.role ?? "");
  const [division, setDivision] = useState(item.division ?? "inti");
  const [sortOrder, setSortOrder] = useState(item.sortOrder ?? 0);

  const [percentage, setPercentage] = useState(item.percentage ?? 0);
  const [amount, setAmount]         = useState(item.amount ?? 0);
  const [label, setLabel]           = useState(item.label ?? "");

  const [donorName, setDonorName] = useState(item.donorName ?? "");
  const [donatedAt, setDonatedAt] = useState(item.donatedAt ?? "");

  const [spentAt, setSpentAt] = useState(item.spentAt ?? "");

  const handleSave = async () => {
    setErr(null);
    startTransition(async () => {
      let res: any = { success: false };

      if (tab === "announcements") {
        res = await updateAnnouncementAction(item.id, title, content, category, pinned);
        if (res.success) onSaved({ ...item, title, content, category, pinned });
      } else if (tab === "schedules") {
        res = await updateScheduleAction(item.id, date, timeStart, timeEnd || null, title, description, location, type);
        if (res.success) onSaved({ ...item, date, timeStart, timeEnd, title, description, location, type });
      } else if (tab === "committee") {
        res = await updateCommitteeAction(item.id, name, role, division, Number(sortOrder));
        if (res.success) onSaved({ ...item, name, role, division, sortOrder: Number(sortOrder) });
      } else if (tab === "finance") {
        res = await updateFinanceAction(item.id, Number(percentage), Number(amount), label, description);
        if (res.success) onSaved({ ...item, percentage: Number(percentage), amount: Number(amount), label, description });
      } else if (tab === "donations") {
        res = await updateDonationAction(item.id, donorName, Number(amount), donatedAt);
        if (res.success) onSaved({ ...item, donorName, amount: Number(amount), donatedAt });
      } else if (tab === "expenses") {
        res = await updateExpenseAction(item.id, title, Number(amount), spentAt, category);
        if (res.success) onSaved({ ...item, title, amount: Number(amount), spentAt, category });
      }

      if (!res.success) setErr(res.error || "Gagal menyimpan perubahan.");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-[#e5bdb8] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebeef2] bg-[#f7fafd]">
          <h3 className="font-jakarta font-extrabold text-sm text-[#181c1f] flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[#a70009]" />
            Edit {TABS.find((t) => t.type === tab)?.label}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#ebeef2] transition-colors text-[#5c403c]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {err && (
            <div className="p-3 bg-[#ffdad5] border-l-4 border-[#a70009] rounded text-xs text-[#a70009] flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}

          {/* ── Announcements Fields ── */}
          {tab === "announcements" && (
            <>
              <Field label="Judul Pengumuman">
                <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kategori">
                  <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Umum</option><option>Pendaftaran</option><option>Kegiatan</option><option value="Urgent">Penting</option>
                  </select>
                </Field>
                <Field label="Pin?">
                  <div className="flex items-center h-[42px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-4 h-4 accent-[#a70009]" />
                      <span className="text-xs font-bold text-[#181c1f]">Sematkan</span>
                    </label>
                  </div>
                </Field>
              </div>
              <Field label="Isi Pengumuman">
                <textarea className={`${inputCls} resize-none`} rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
              </Field>
            </>
          )}

          {/* ── Schedules Fields ── */}
          {tab === "schedules" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tanggal"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
                <Field label="Tipe">
                  <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="umum">Umum</option><option value="anak">Lomba Anak</option><option value="dewasa">Lomba Dewasa</option><option value="puncak">Puncak</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Jam Mulai"><input className={inputCls} value={timeStart} onChange={(e) => setTimeStart(e.target.value)} placeholder="15:00" /></Field>
                <Field label="Jam Selesai"><input className={inputCls} value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} placeholder="18:00 (Opsional)" /></Field>
              </div>
              <Field label="Judul Kegiatan"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
              <Field label="Lokasi"><input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
              <Field label="Deskripsi"><textarea className={`${inputCls} resize-none`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            </>
          )}

          {/* ── Committee Fields ── */}
          {tab === "committee" && (
            <>
              <Field label="Nama Panitia"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="Jabatan / Peran"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Divisi">
                  <select className={inputCls} value={division} onChange={(e) => setDivision(e.target.value)}>
                    <option value="pimpinan">Pimpinan RT</option><option value="inti">Panitia Inti</option><option value="perlombaan">Seksi Perlombaan</option>
                    <option value="perlengkapan">Seksi Perlengkapan</option><option value="konsumsi">Seksi Konsumsi</option><option value="humas">Seksi Humas</option>
                    <option value="keamanan">Seksi Keamanan</option><option value="dana">Usaha Dana</option>
                  </select>
                </Field>
                <Field label="Urutan (Sort)">
                  <input type="number" className={inputCls} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
                </Field>
              </div>
            </>
          )}

          {/* ── Finance Fields ── */}
          {tab === "finance" && (
            <>
              <Field label="Nama Program Anggaran (Label)"><input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Persentase (%)"><input type="number" className={inputCls} value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} /></Field>
                <Field label="Nominal (Rp)"><input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
              </div>
              <Field label="Rincian Deskripsi"><textarea className={`${inputCls} resize-none`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            </>
          )}

          {/* ── Donations Fields ── */}
          {tab === "donations" && (
            <>
              <Field label="Nama Donatur"><input className={inputCls} value={donorName} onChange={(e) => setDonorName(e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nominal Donasi (Rp)"><input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
                <Field label="Tanggal Terima"><input type="date" className={inputCls} value={donatedAt} onChange={(e) => setDonatedAt(e.target.value)} /></Field>
              </div>
            </>
          )}

          {/* ── Expenses Fields ── */}
          {tab === "expenses" && (
            <>
              <Field label="Nama Pengeluaran"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nominal (Rp)"><input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
                <Field label="Tanggal Belanja"><input type="date" className={inputCls} value={spentAt} onChange={(e) => setSpentAt(e.target.value)} /></Field>
              </div>
              <Field label="Kategori">
                <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Umum</option><option>Konsumsi</option><option value="Hadiah">Hadiah / Piala</option>
                  <option value="Dekorasi">Dekorasi / Kebersihan</option><option value="Puncak Acara">Puncak Acara</option>
                  <option>Perlengkapan</option><option value="Lain-lain">Lain-lain</option>
                </select>
              </Field>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#ebeef2] bg-[#f7fafd]">
          <button
            onClick={onClose}
            className="flex-1 border border-[#e5bdb8] text-[#5c403c] py-2.5 rounded-lg text-xs font-bold hover:bg-[#ffdad5]/40 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 bg-[#a70009] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#930006] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple helper components
const inputCls = "w-full px-3 py-2.5 rounded-lg border border-[#e5bdb8] text-sm bg-[#f7fafd] focus:bg-white focus:border-[#a70009] outline-none transition-all";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-jakarta font-bold text-[10px] text-[#181c1f] mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

// ─── Main AdminDashboard ─────────────────────────────────────
export function AdminDashboard({
  initialAnnouncements, initialSchedules, initialCommittee,
  initialFinance, initialDonations, initialExpenses, initialPendingImages,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState<TabType>("announcements");
  const [isPending, startTransition] = useTransition();
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);

  // Collections
  const [announcements, setAnnouncements] = useState<any[]>(initialAnnouncements);
  const [schedules,     setSchedules]     = useState<any[]>(initialSchedules);
  const [committee,     setCommittee]     = useState<any[]>(initialCommittee);
  const [finance,       setFinance]       = useState<any[]>(initialFinance);
  const [donations,     setDonations]     = useState<any[]>(initialDonations);
  const [expenses,      setExpenses]      = useState<any[]>(initialExpenses);
  const [pendingImages, setPendingImages] = useState<any[]>(initialPendingImages);

  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  // 3-Step R2 Sync confirmation modal state (0 = closed, 1..3 = step)
  const [syncStep, setSyncStep] = useState<0 | 1 | 2 | 3>(0);

  const handleTriggerSyncR2 = async () => {
    setSyncStep(0);
    setError(null);
    setSuccess(null);
    notify("Sedang memindai Cloudflare R2 Bucket...");

    startTransition(async () => {
      const res = await syncR2BucketAction();
      if (res.success) {
        notify(res.message || "Sinkronisasi Cloudflare R2 berhasil!");
        router.refresh();
      } else {
        notify(res.error || "Gagal sinkronisasi R2.", false);
      }
    });
  };

  const handleApproveImage = async (id: string) => {
    setError(null); setSuccess(null);
    startTransition(async () => {
      const res = await approveImageAction(id);
      if (res.success) {
        setPendingImages((p) => p.filter((x) => x.id !== id));
        notify("Foto warga berhasil disetujui dan dipublikasikan!");
      } else {
        notify(res.error || "Gagal menyetujui foto.", false);
      }
    });
  };

  const handleRejectImage = (id: string) => {
    setConfirmModal({
      title: "Tolak & Hapus Foto?",
      message: "Foto kontribusi warga ini akan dihapus secara permanen dari server Cloudflare R2 dan database.",
      confirmText: "Ya, Tolak & Hapus",
      onConfirm: async () => {
        setError(null); setSuccess(null);
        startTransition(async () => {
          const res = await rejectImageAction(id);
          if (res.success) {
            setPendingImages((p) => p.filter((x) => x.id !== id));
            notify("Foto warga berhasil ditolak dan dihapus.");
          } else {
            notify(res.error || "Gagal menghapus foto.", false);
          }
        });
      },
    });
  };

  // Add form states
  const [annTitle, setAnnTitle]     = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annCategory, setAnnCategory] = useState("Umum");
  const [annPinned, setAnnPinned]   = useState(false);

  const [schedDate, setSchedDate]         = useState("");
  const [schedTimeStart, setSchedTimeStart] = useState("15:00");
  const [schedTimeEnd, setSchedTimeEnd]   = useState("");
  const [schedTitle, setSchedTitle]       = useState("");
  const [schedDesc, setSchedDesc]         = useState("");
  const [schedLoc, setSchedLoc]           = useState("Pekarangan Bapak Sugiyanto");
  const [schedType, setSchedType]         = useState("umum");

  const [commName, setCommName]       = useState("");
  const [commRole, setCommRole]       = useState("");
  const [commDivision, setCommDivision] = useState("inti");
  const [commSortOrder, setCommSortOrder] = useState(0);

  const [finPercentage, setFinPercentage] = useState(0);
  const [finAmount, setFinAmount]         = useState(0);
  const [finLabel, setFinLabel]           = useState("");
  const [finDesc, setFinDesc]             = useState("");

  const [donName, setDonName]   = useState("");
  const [donAmount, setDonAmount] = useState(0);
  const [donDate, setDonDate]   = useState(new Date().toISOString().split("T")[0]);

  const [expTitle, setExpTitle]     = useState("");
  const [expAmount, setExpAmount]   = useState(0);
  const [expDate, setExpDate]       = useState(new Date().toISOString().split("T")[0]);
  const [expCategory, setExpCategory] = useState("Umum");

  const notify = (msg: string, ok = true) => {
    ok ? setSuccess(msg) : setError(msg);
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
  };

  // ── Logout ──
  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  // ── Edit saved callback ──
  const handleEdited = (updated: any) => {
    if (activeTab === "announcements") setAnnouncements((p) => p.map((x) => x.id === updated.id ? updated : x));
    else if (activeTab === "schedules") setSchedules((p) => p.map((x) => x.id === updated.id ? updated : x));
    else if (activeTab === "committee") setCommittee((p) => p.map((x) => x.id === updated.id ? updated : x));
    else if (activeTab === "finance")   setFinance((p)   => p.map((x) => x.id === updated.id ? updated : x));
    else if (activeTab === "donations") setDonations((p) => p.map((x) => x.id === updated.id ? updated : x));
    else if (activeTab === "expenses")  setExpenses((p)  => p.map((x) => x.id === updated.id ? updated : x));
    setEditItem(null);
    notify("Data berhasil diperbarui!");
    router.refresh();
  };

  // ── Delete ──
  const handleDelete = (id: string) => {
    setConfirmModal({
      title: "Konfirmasi Hapus Data",
      message: "Apakah Anda yakin ingin menghapus item ini secara permanen dari database?",
      confirmText: "Ya, Hapus Data",
      onConfirm: async () => {
        setError(null); setSuccess(null);
        startTransition(async () => {
          let res: any = { success: false };
          if (activeTab === "announcements") { res = await deleteAnnouncementAction(id); if (res.success) setAnnouncements((p) => p.filter((x) => x.id !== id)); }
          else if (activeTab === "schedules") { res = await deleteScheduleAction(id); if (res.success) setSchedules((p) => p.filter((x) => x.id !== id)); }
          else if (activeTab === "committee") { res = await deleteCommitteeAction(id); if (res.success) setCommittee((p) => p.filter((x) => x.id !== id)); }
          else if (activeTab === "finance")   { res = await deleteFinanceAction(id);   if (res.success) setFinance((p)   => p.filter((x) => x.id !== id)); }
          else if (activeTab === "donations") { res = await deleteDonationAction(id);  if (res.success) setDonations((p) => p.filter((x) => x.id !== id)); }
          else if (activeTab === "expenses")  { res = await deleteExpenseAction(id);   if (res.success) setExpenses((p)  => p.filter((x) => x.id !== id)); }
          res.success ? notify("Item berhasil dihapus!") : notify(res.error || "Gagal menghapus.", false);
          if (res.success) router.refresh();
        });
      },
    });
  };

  // ── Add ──
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    startTransition(async () => {
      let res: any = { success: false };

      if (activeTab === "announcements") {
        if (!annTitle.trim() || !annContent.trim()) { notify("Judul dan isi wajib diisi!", false); return; }
        res = await createAnnouncementAction(annTitle, annContent, annCategory, annPinned);
        if (res.success) { setAnnTitle(""); setAnnContent(""); setAnnCategory("Umum"); setAnnPinned(false); }
      } else if (activeTab === "schedules") {
        if (!schedDate || !schedTitle.trim()) { notify("Tanggal dan judul wajib diisi!", false); return; }
        res = await createScheduleAction(schedDate, schedTimeStart, schedTimeEnd || null, schedTitle, schedDesc, schedLoc, schedType);
        if (res.success) { setSchedDate(""); setSchedTitle(""); setSchedDesc(""); setSchedTimeStart("15:00"); setSchedTimeEnd(""); setSchedLoc("Pekarangan Bapak Sugiyanto"); setSchedType("umum"); }
      } else if (activeTab === "committee") {
        if (!commName.trim() || !commRole.trim()) { notify("Nama dan jabatan wajib diisi!", false); return; }
        res = await createCommitteeAction(commName, commRole, commDivision, commSortOrder);
        if (res.success) { setCommName(""); setCommRole(""); setCommDivision("inti"); setCommSortOrder(0); }
      } else if (activeTab === "finance") {
        if (!finLabel.trim() || !finAmount) { notify("Label dan nominal wajib diisi!", false); return; }
        res = await createFinanceAction(Number(finPercentage), Number(finAmount), finLabel, finDesc);
        if (res.success) { setFinPercentage(0); setFinAmount(0); setFinLabel(""); setFinDesc(""); }
      } else if (activeTab === "donations") {
        if (!donName.trim() || !donAmount || !donDate) { notify("Nama, nominal, dan tanggal wajib diisi!", false); return; }
        res = await createDonationAction(donName, Number(donAmount), donDate);
        if (res.success) { setDonName(""); setDonAmount(0); setDonDate(new Date().toISOString().split("T")[0]); }
      } else if (activeTab === "expenses") {
        if (!expTitle.trim() || !expAmount || !expDate) { notify("Nama, nominal, dan tanggal wajib diisi!", false); return; }
        res = await createExpenseAction(expTitle, Number(expAmount), expDate, expCategory);
        if (res.success) { setExpTitle(""); setExpAmount(0); setExpDate(new Date().toISOString().split("T")[0]); setExpCategory("Umum"); }
      }

      if (res.success) {
        notify("Data baru berhasil disimpan!");
        setTimeout(() => window.location.reload(), 800);
      } else {
        notify(res.error || "Gagal menyimpan.", false);
      }
    });
  };

  // Row action buttons shared
  const RowActions = ({ item }: { item: any }) => (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => setEditItem(item)}
        title="Edit"
        className="p-2 text-[#a70009] hover:bg-[#ffdad5] rounded-lg transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => handleDelete(item.id)}
        title="Hapus"
        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <>
      {/* Edit Modal */}
      {editItem && (
        <EditModal
          tab={activeTab}
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={handleEdited}
        />
      )}

      <div className="min-h-screen bg-[#f7fafd] py-8 px-5 md:px-20">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#e5bdb8] border-b-4 border-b-[#a70009] shadow-sm">
            <div>
              <h1 className="font-jakarta font-extrabold text-2xl text-[#181c1f] flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#a70009]" /> Admin Panel Blumbang RT 15
              </h1>
              <p className="text-xs text-[#5c403c] mt-0.5">Kelola seluruh konten website. Setiap perubahan otomatis sync ke Google Sheets.</p>
            </div>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 border border-[#a70009] text-[#a70009] hover:bg-[#ffdad5] text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" /> Keluar Panel
            </button>
          </header>

          {/* Tab Navigation */}
          <nav className="flex flex-wrap gap-2 border-b border-[#e5bdb8] pb-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.type;
              return (
                <button
                  key={t.type}
                  onClick={() => { setActiveTab(t.type as TabType); setError(null); setSuccess(null); setEditItem(null); }}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold border border-transparent transition-all cursor-pointer",
                    isActive ? "bg-white border-[#e5bdb8] border-b-white text-[#a70009] translate-y-[1px]" : "text-[#5c403c] hover:bg-[#ffdad5]/40 hover:text-[#a70009]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-[#a70009]" : "text-[#5c403c]/60")} />
                  {t.label}
                </button>
              );
            })}
          </nav>

          {/* Alerts */}
          {error && (
            <div className="p-4 bg-[#ffdad5] border-l-4 border-l-[#a70009] rounded-lg text-sm text-[#a70009] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> <span className="font-semibold">{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 bg-[#d1e7dd] border-l-4 border-l-[#0f5132] rounded-lg text-sm text-[#0f5132] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" /> <span className="font-semibold">{success}</span>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Add Form */}
            <section className="lg:col-span-5 bg-white rounded-2xl border border-[#e5bdb8] shadow-sm p-6">
              <h2 className="font-jakarta font-extrabold text-base text-[#181c1f] pb-3 border-b border-[#ebeef2] mb-5">
                {activeTab === "gallery" ? "Sistem Moderasi Galeri" : `Tambah ${TABS.find((t) => t.type === activeTab)?.label}`}
              </h2>
              {activeTab === "gallery" ? (
                <div className="space-y-4 text-xs text-[#5c403c] leading-relaxed">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                    <p className="font-extrabold uppercase text-[10px] text-[#181c1f] tracking-wider">Moderasi Foto Kontribusi:</p>
                    <p>• Warga dapat mengunggah foto melalui halaman publik <Link href="/dokumentasi/upload" target="_blank" className="text-[#a70009] underline font-bold">/dokumentasi/upload</Link>.</p>
                    <p>• Foto yang baru dikirim warga akan masuk ke dalam daftar antrean di sebelah kanan secara real-time.</p>
                    <p>• Klik <strong>Setujui</strong> untuk menerbitkan foto ke album kegiatan secara publik.</p>
                    <p>• Klik <strong>Tolak</strong> untuk menghapus foto secara permanen dari server Cloudflare R2 dan database.</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1 text-zinc-500">
                    <p className="font-extrabold text-[10px] text-zinc-700 tracking-wider">💡 OPTIMALISASI R2:</p>
                    <p>Semua foto kontribusi warga dikonversi otomatis ke format WebP dan diresizing ke lebar/tinggi maksimal 1200px sebelum masuk R2 untuk menjamin performa website.</p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSyncStep(1)}
                      disabled={isPending}
                      className="w-full bg-[#181c1f] text-white hover:bg-black py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm border border-zinc-700 active:scale-[0.98]"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-400" />
                      Sinkronkan Cloudflare R2 (Tambah Folder Baru)
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAdd} className="space-y-4">

                {activeTab === "announcements" && (
                  <>
                    <Field label="Judul Pengumuman"><input className={inputCls} value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required placeholder="Pendaftaran Lomba..." /></Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Kategori">
                        <select className={inputCls} value={annCategory} onChange={(e) => setAnnCategory(e.target.value)}>
                          <option>Umum</option><option>Pendaftaran</option><option>Kegiatan</option><option value="Urgent">Penting</option>
                        </select>
                      </Field>
                      <Field label="Pin ke Atas?">
                        <div className="flex items-center h-[42px]">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={annPinned} onChange={(e) => setAnnPinned(e.target.checked)} className="w-4 h-4 accent-[#a70009]" />
                            <span className="text-xs font-bold text-[#181c1f] flex items-center gap-1"><Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />Pin</span>
                          </label>
                        </div>
                      </Field>
                    </div>
                    <Field label="Isi Pengumuman"><textarea className={`${inputCls} resize-none`} rows={5} value={annContent} onChange={(e) => setAnnContent(e.target.value)} required placeholder="Detail pengumuman..." /></Field>
                  </>
                )}

                {activeTab === "schedules" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Tanggal"><input type="date" className={inputCls} value={schedDate} onChange={(e) => setSchedDate(e.target.value)} required /></Field>
                      <Field label="Tipe Acara">
                        <select className={inputCls} value={schedType} onChange={(e) => setSchedType(e.target.value)}>
                          <option value="umum">Umum</option><option value="anak">Lomba Anak</option><option value="dewasa">Lomba Dewasa</option><option value="puncak">Puncak</option>
                        </select>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Jam Mulai"><input className={inputCls} value={schedTimeStart} onChange={(e) => setSchedTimeStart(e.target.value)} required placeholder="15:00" /></Field>
                      <Field label="Jam Selesai"><input className={inputCls} value={schedTimeEnd} onChange={(e) => setSchedTimeEnd(e.target.value)} placeholder="18:00 (Opsional)" /></Field>
                    </div>
                    <Field label="Judul Kegiatan"><input className={inputCls} value={schedTitle} onChange={(e) => setSchedTitle(e.target.value)} required placeholder="Jalan Sehat..." /></Field>
                    <Field label="Lokasi"><input className={inputCls} value={schedLoc} onChange={(e) => setSchedLoc(e.target.value)} required /></Field>
                    <Field label="Deskripsi"><textarea className={`${inputCls} resize-none`} rows={3} value={schedDesc} onChange={(e) => setSchedDesc(e.target.value)} placeholder="Detail acara..." /></Field>
                  </>
                )}

                {activeTab === "committee" && (
                  <>
                    <Field label="Nama Panitia"><input className={inputCls} value={commName} onChange={(e) => setCommName(e.target.value)} required placeholder="Krisna Riyadi..." /></Field>
                    <Field label="Jabatan / Peran"><input className={inputCls} value={commRole} onChange={(e) => setCommRole(e.target.value)} required placeholder="Ketua / Anggota..." /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Divisi">
                        <select className={inputCls} value={commDivision} onChange={(e) => setCommDivision(e.target.value)}>
                          <option value="pimpinan">Pimpinan RT</option><option value="inti">Panitia Inti</option><option value="perlombaan">Seksi Perlombaan</option>
                          <option value="perlengkapan">Seksi Perlengkapan</option><option value="konsumsi">Seksi Konsumsi</option><option value="humas">Seksi Humas</option>
                          <option value="keamanan">Seksi Keamanan</option><option value="dana">Usaha Dana</option>
                        </select>
                      </Field>
                      <Field label="Urutan (Sort)"><input type="number" className={inputCls} value={commSortOrder} onChange={(e) => setCommSortOrder(Number(e.target.value))} /></Field>
                    </div>
                  </>
                )}

                {activeTab === "finance" && (
                  <>
                    <Field label="Nama Program Anggaran"><input className={inputCls} value={finLabel} onChange={(e) => setFinLabel(e.target.value)} required placeholder="Doorprize Utama..." /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Persentase (%)"><input type="number" className={inputCls} value={finPercentage} onChange={(e) => setFinPercentage(Number(e.target.value))} /></Field>
                      <Field label="Nominal (Rp)"><input type="number" className={inputCls} value={finAmount} onChange={(e) => setFinAmount(Number(e.target.value))} required /></Field>
                    </div>
                    <Field label="Deskripsi"><textarea className={`${inputCls} resize-none`} rows={3} value={finDesc} onChange={(e) => setFinDesc(e.target.value)} placeholder="Rincian belanja..." /></Field>
                  </>
                )}

                {activeTab === "donations" && (
                  <>
                    <Field label="Nama Donatur"><input className={inputCls} value={donName} onChange={(e) => setDonName(e.target.value)} required placeholder="Hamba Allah..." /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nominal (Rp)"><input type="number" className={inputCls} value={donAmount} onChange={(e) => setDonAmount(Number(e.target.value))} required /></Field>
                      <Field label="Tanggal Terima"><input type="date" className={inputCls} value={donDate} onChange={(e) => setDonDate(e.target.value)} required /></Field>
                    </div>
                  </>
                )}

                {activeTab === "expenses" && (
                  <>
                    <Field label="Nama Pengeluaran"><input className={inputCls} value={expTitle} onChange={(e) => setExpTitle(e.target.value)} required placeholder="Konsumsi rapat..." /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nominal (Rp)"><input type="number" className={inputCls} value={expAmount} onChange={(e) => setExpAmount(Number(e.target.value))} required /></Field>
                      <Field label="Tanggal Belanja"><input type="date" className={inputCls} value={expDate} onChange={(e) => setExpDate(e.target.value)} required /></Field>
                    </div>
                    <Field label="Kategori">
                      <select className={inputCls} value={expCategory} onChange={(e) => setExpCategory(e.target.value)}>
                        <option>Umum</option><option>Konsumsi</option><option value="Hadiah">Hadiah / Piala</option>
                        <option value="Dekorasi">Dekorasi / Kebersihan</option><option value="Puncak Acara">Puncak Acara</option>
                        <option>Perlengkapan</option><option value="Lain-lain">Lain-lain</option>
                      </select>
                    </Field>
                  </>
                )}

                <button type="submit" disabled={isPending} className="w-full bg-[#a70009] text-white py-3 rounded-lg font-jakarta font-bold text-sm hover:bg-[#930006] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-sm cursor-pointer disabled:opacity-50">
                  <Plus className="w-4 h-4" /> {isPending ? "Menyimpan..." : "Simpan Data Baru"}
                </button>
              </form>
            )}
            </section>

            {/* List Panel */}
            <section className="lg:col-span-7 bg-white rounded-2xl border border-[#e5bdb8] shadow-sm p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#ebeef2] mb-5">
                <h2 className="font-jakarta font-extrabold text-base text-[#181c1f]">Daftar Data Aktif</h2>
                <span className="text-[10px] bg-[#f1f4f8] text-[#5c403c] font-bold px-2 py-1 rounded-full">
                  Klik ✏️ untuk Edit
                </span>
              </div>

              <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">

                {activeTab === "announcements" && (
                  announcements.length === 0 ? <Empty /> : announcements.map((a) => (
                    <div key={a.id} className="p-4 rounded-xl border border-[#ebeef2] flex justify-between items-start gap-4 hover:border-[#e5bdb8] transition-colors">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {a.pinned && <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold"><Pin className="w-2 h-2 fill-amber-500 text-amber-500" /> Pin</span>}
                          <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#f1f4f8] text-[#181c1f] font-extrabold">{a.category}</span>
                          <span className="text-[10px] text-[#5c403c] font-medium">{a.date}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#181c1f] truncate">{a.title}</h4>
                        <p className="text-xs text-[#5c403c] leading-relaxed line-clamp-2 whitespace-pre-wrap">{a.content}</p>
                      </div>
                      <RowActions item={a} />
                    </div>
                  ))
                )}

                {activeTab === "schedules" && (
                  schedules.length === 0 ? <Empty /> : schedules.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-[#ebeef2] flex justify-between items-start gap-4 hover:border-[#e5bdb8] transition-colors">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-[#5c403c] font-bold">
                          <Calendar className="w-3.5 h-3.5 text-[#a70009]" />{s.date}
                          <span className="px-1.5 py-0.5 rounded bg-[#ffdad5] text-[#a70009] uppercase tracking-wider text-[8px]">{s.type}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#181c1f] truncate mt-1">{s.title}</h4>
                        <div className="text-xs text-[#5c403c] space-y-0.5 mt-1 font-medium">
                          <p className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#5c403c]/40" /> {s.timeStart}{s.timeEnd ? ` – ${s.timeEnd}` : ""}</p>
                          <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#5c403c]/40" /> {s.location}</p>
                        </div>
                      </div>
                      <RowActions item={s} />
                    </div>
                  ))
                )}

                {activeTab === "committee" && (
                  committee.length === 0 ? <Empty /> : committee.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-[#ebeef2] flex justify-between items-center gap-4 hover:border-[#e5bdb8] transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#181c1f] truncate">{c.name}</h4>
                        <div className="flex gap-2 items-center text-xs text-[#5c403c] mt-0.5">
                          <span className="font-semibold text-[#a70009] truncate">{c.role}</span>
                          <span className="text-[10px] text-[#5c403c]/40">|</span>
                          <span className="capitalize">{c.division}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-[#5c403c]">#{c.sortOrder}</span>
                        <RowActions item={c} />
                      </div>
                    </div>
                  ))
                )}

                {activeTab === "finance" && (
                  finance.length === 0 ? <Empty /> : finance.map((f) => (
                    <div key={f.id} className="p-4 rounded-xl border border-[#ebeef2] flex justify-between items-start gap-4 hover:border-[#e5bdb8] transition-colors">
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#a70009] bg-[#ffdad5] px-2 py-0.5 rounded-md">{f.percentage}%</span>
                          <h4 className="font-bold text-sm text-[#181c1f] truncate">{f.label}</h4>
                        </div>
                        <p className="font-extrabold text-sm text-[#181c1f]">{formatRupiah(f.amount)}</p>
                        {f.description && <p className="text-xs text-[#5c403c] leading-relaxed line-clamp-1">{f.description}</p>}
                      </div>
                      <RowActions item={f} />
                    </div>
                  ))
                )}

                {activeTab === "donations" && (
                  donations.length === 0 ? <Empty /> : donations.map((d) => (
                    <div key={d.id} className="p-4 rounded-xl border border-[#ebeef2] flex justify-between items-center gap-4 hover:border-[#e5bdb8] transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#181c1f] truncate">{d.donorName}</h4>
                        <div className="flex items-center gap-2 text-xs font-extrabold mt-0.5">
                          <span className="text-emerald-600">{formatRupiah(d.amount)}</span>
                          <span className="text-[10px] text-[#5c403c]/40 font-normal">|</span>
                          <span className="text-[10px] text-[#5c403c] font-semibold">{d.donatedAt}</span>
                        </div>
                      </div>
                      <RowActions item={d} />
                    </div>
                  ))
                )}

                {activeTab === "expenses" && (
                  expenses.length === 0 ? <Empty /> : expenses.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-xl border border-[#ebeef2] flex justify-between items-start gap-4 hover:border-[#e5bdb8] transition-colors">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#f1f4f8] text-[#181c1f] font-extrabold">{exp.category}</span>
                          <span className="text-[10px] text-[#5c403c] font-semibold">{exp.spentAt}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#181c1f] truncate">{exp.title}</h4>
                        <p className="font-extrabold text-sm text-rose-600">{formatRupiah(exp.amount)}</p>
                      </div>
                      <RowActions item={exp} />
                    </div>
                  ))
                )}

                {activeTab === "gallery" && (
                  pendingImages.length === 0 ? (
                    <p className="text-xs text-center py-12 text-[#5c403c]/50">Tidak ada foto kontribusi warga yang menunggu persetujuan.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                      {pendingImages.map((img) => (
                        <div key={img.id} className="p-4 rounded-xl border border-[#ebeef2] flex flex-col gap-3 hover:border-[#e5bdb8] transition-colors bg-white shadow-sm">
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 border border-[#ebeef2]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.altText}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 bg-black/75 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full">
                              {img.albumTitle}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#181c1f] truncate">{img.altText}</p>
                            <p className="text-[10px] text-[#5c403c]/60 font-semibold mt-0.5">Unggah: {new Date(img.uploadedAt).toLocaleDateString("id-ID")}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleRejectImage(img.id)}
                              disabled={isPending}
                              className="flex-1 border border-rose-200 text-rose-600 hover:bg-rose-50 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" /> Tolak
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveImage(img.id)}
                              disabled={isPending}
                              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" /> Setujui
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modern Custom Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e5bdb8] space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 className="font-jakarta font-extrabold text-base text-[#181c1f]">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-[#5c403c] leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ebeef2]">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-xl border border-[#ebeef2] text-xs font-bold text-[#5c403c] hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(null);
                  action();
                }}
                disabled={isPending}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Confirmation Modal for R2 Sync */}
      {syncStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e5bdb8] space-y-5 animate-in zoom-in-95 duration-150">
            {syncStep === 1 && (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        TAHAP 1 DARI 3
                      </span>
                    </div>
                    <h3 className="font-jakarta font-extrabold text-base text-[#181c1f]">
                      Sinkronisasi Cloudflare R2
                    </h3>
                    <p className="text-xs text-[#5c403c] leading-relaxed">
                      Fitur ini akan memindai seluruh folder & foto yang Anda tambahkan manual di Cloudflare R2 Bucket <code className="bg-amber-50 px-1 py-0.5 rounded font-mono font-bold text-amber-900">blumbang</code> dan mengindeksnya otomatis ke database website.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ebeef2]">
                  <button
                    type="button"
                    onClick={() => setSyncStep(0)}
                    className="px-4 py-2.5 rounded-xl border border-[#ebeef2] text-xs font-bold text-[#5c403c] hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSyncStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
                  >
                    Lanjut ke Tahap 2 →
                  </button>
                </div>
              </>
            )}

            {syncStep === 2 && (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-orange-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        TAHAP 2 DARI 3
                      </span>
                    </div>
                    <h3 className="font-jakarta font-extrabold text-base text-[#181c1f]">
                      Peringatan Beban & Durasi Server
                    </h3>
                    <p className="text-xs text-[#5c403c] leading-relaxed">
                      Proses pemindaian ribuan foto di cloud dapat memakan waktu 5-15 detik. Pastikan koneksi internet Anda stabil dan <strong>jangan me-refresh atau menutup browser</strong> selama proses berlangsung.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ebeef2]">
                  <button
                    type="button"
                    onClick={() => setSyncStep(0)}
                    className="px-4 py-2.5 rounded-xl border border-[#ebeef2] text-xs font-bold text-[#5c403c] hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSyncStep(3)}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
                  >
                    Lanjut ke Tahap Akhir →
                  </button>
                </div>
              </>
            )}

            {syncStep === 3 && (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        🚨 KONFIRMASI AKHIR (TAHAP 3/3)
                      </span>
                    </div>
                    <h3 className="font-jakarta font-extrabold text-base text-rose-700">
                      Akses Khusus — Hanya Untuk Yang Paham
                    </h3>
                    <div className="text-xs text-[#181c1f] font-semibold leading-relaxed bg-rose-50 p-3.5 rounded-xl border border-rose-200 space-y-1">
                      <p>⚠️ <strong>CATATAN KHUSUS & HAK AKSES:</strong></p>
                      <p>Fitur ini memodifikasi indeks database galeri berdasarkan struktur folder Cloudflare R2 secara langsung.</p>
                      <p className="text-rose-700 font-extrabold underline pt-1">
                        HANYA PANITIA / ADMIN YANG BENAR-BENAR PAHAM STRUKTUR BUCKET R2 YANG BOLEH MENJALANKAN SINKRONISASI INI.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ebeef2]">
                  <button
                    type="button"
                    onClick={() => setSyncStep(0)}
                    className="px-4 py-2.5 rounded-xl border border-[#ebeef2] text-xs font-bold text-[#5c403c] hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    Batal / Urungkan
                  </button>
                  <button
                    type="button"
                    onClick={handleTriggerSyncR2}
                    disabled={isPending}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isPending ? "Memproses Sync..." : "Saya Paham & Eksekusi Sync R2"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Empty() {
  return <p className="text-xs text-center py-12 text-[#5c403c]/50">Belum ada data.</p>;
}
