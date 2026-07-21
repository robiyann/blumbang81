"use client";

// src/components/committee/CommitteeTree.tsx
import { motion } from "framer-motion";
import {
  Trophy,
  Hammer,
  Utensils,
  Wallet,
  Shield,
  Megaphone,
  Camera,
  Crown,
  User,
  Star,
  Users,
} from "lucide-react";
import type { CommitteeMember } from "@/types/committee";
import { cn } from "@/utils/cn";

const configMap: Record<
  string,
  { label: string; icon: React.ComponentType<any>; color: string; borderClass: string; bgClass: string }
> = {
  perlombaan: {
    label: "Seksi Lomba",
    icon: Trophy,
    color: "text-blue-600",
    borderClass: "border-t-blue-500",
    bgClass: "bg-blue-50/50",
  },
  perlengkapan: {
    label: "Seksi Perlengkapan",
    icon: Hammer,
    color: "text-amber-600",
    borderClass: "border-t-amber-500",
    bgClass: "bg-amber-50/50",
  },
  konsumsi: {
    label: "Seksi Konsumsi",
    icon: Utensils,
    color: "text-rose-600",
    borderClass: "border-t-rose-500",
    bgClass: "bg-rose-50/50",
  },
  dana: {
    label: "Seksi Dana",
    icon: Wallet,
    color: "text-emerald-600",
    borderClass: "border-t-emerald-500",
    bgClass: "bg-emerald-50/50",
  },
  keamanan: {
    label: "Seksi Keamanan",
    icon: Shield,
    color: "text-indigo-600",
    borderClass: "border-t-indigo-500",
    bgClass: "bg-indigo-50/50",
  },
  humas: {
    label: "Seksi Humas",
    icon: Megaphone,
    color: "text-violet-600",
    borderClass: "border-t-violet-500",
    bgClass: "bg-violet-50/50",
  },
  dokumentasi: {
    label: "Seksi Dokumentasi",
    icon: Camera,
    color: "text-teal-600",
    borderClass: "border-t-teal-500",
    bgClass: "bg-teal-50/50",
  },
};

interface CommitteeTreeProps {
  members: CommitteeMember[];
}

export function CommitteeTree({ members }: CommitteeTreeProps) {
  // 1. Get ALL Pimpinan members (not just the first one)
  const pimpinanMembers = members.filter((m) => m.division === "pimpinan");
  
  // 2. Get ALL Core members
  const coreMembers = members.filter((m) => m.division === "inti");
  
  // 3. Get ALL Division members
  const divisionMembers = members.filter(
    (m) => m.division !== "pimpinan" && m.division !== "inti"
  );

  // Group core members dynamically by their exact role (so no one is filtered out)
  const coreGroups = coreMembers.reduce<Record<string, CommitteeMember[]>>(
    (acc, member) => {
      const key = member.role;
      if (!acc[key]) acc[key] = [];
      acc[key].push(member);
      return acc;
    },
    {}
  );

  // Group division members by division key
  const divisions = divisionMembers.reduce<Record<string, CommitteeMember[]>>(
    (acc, member) => {
      const key = member.division;
      if (!acc[key]) acc[key] = [];
      acc[key].push(member);
      return acc;
    },
    {}
  );

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-6xl">
      {/* 1. PELINDUNG / KETUA RT (Pimpinan) */}
      {pimpinanMembers.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
          {pimpinanMembers.map((leader, i) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white border-2 border-[#a70009] rounded-2xl p-6 shadow-md flex-1 min-w-[280px] max-w-md text-center overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#a70009]" />
              <div className="w-12 h-12 bg-[#ffdad5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#a70009]">
                <Crown className="w-6 h-6" />
              </div>
              <p className="font-jetbrains text-xs font-bold text-[#a70009] uppercase tracking-widest mb-1">
                {leader.role}
              </p>
              <h3 className="font-jakarta font-extrabold text-2xl text-[#181c1f]">
                {leader.name}
              </h3>
              <p className="text-xs text-[#5c403c] mt-2 font-medium">
                Penanggung Jawab & Pelindung Kegiatan RT 15
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vertical Line Connector */}
      <div className="w-0.5 h-10 bg-[#e5bdb8]" aria-hidden="true" />

      {/* 2. CORE COMMITTEE ROW (Ketua, Sekretaris, Bendahara) */}
      {Object.keys(coreGroups).length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative"
        >
          {/* Connection Background lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-[#e5bdb8] z-0 -translate-y-1/2" aria-hidden="true" />

          {Object.entries(coreGroups).map(([roleName, roleMembers]) => {
            let IconComponent = User;
            let iconColor = "text-[#181c1f]";

            if (roleName.toLowerCase().includes("ketua")) {
              IconComponent = Star;
              iconColor = "text-amber-500 fill-amber-500";
            } else if (roleName.toLowerCase().includes("bendahara")) {
              IconComponent = Wallet;
              iconColor = "text-emerald-600";
            }

            return (
              <motion.div
                key={roleName}
                variants={itemVariants}
                className="bg-white border border-[#e5bdb8] rounded-xl p-5 shadow-sm relative z-10 hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <div className="w-10 h-10 bg-[#ebeef2] rounded-full flex items-center justify-center mb-3">
                  <IconComponent className={cn("w-5 h-5", iconColor)} />
                </div>
                <h4 className="font-jetbrains text-xs font-bold text-[#5c403c] uppercase tracking-wider mb-3">
                  {roleName}
                </h4>
                <ul className="text-center space-y-1">
                  {roleMembers.map((m) => (
                    <li key={m.id} className="font-jakarta font-extrabold text-base text-[#181c1f]">
                      {m.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Horizontal Bridge Line to Divisions Section */}
      <div className="w-full flex flex-col items-center my-4" aria-hidden="true">
        <div className="w-0.5 h-10 bg-[#e5bdb8]" />
        <div className="w-full h-px bg-[#e5bdb8] max-w-5xl" />
        <div className="w-0.5 h-8 bg-[#e5bdb8]" />
      </div>

      {/* 3. DIVISION SECTION GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 w-full"
        role="list"
        aria-label="Divisi panitia"
      >
        {Object.entries(divisions).map(([divKey, divMembers]) => {
          const config = configMap[divKey] ?? {
            label: divKey.toUpperCase(),
            icon: Users,
            color: "text-[#181c1f]",
            borderClass: "border-t-[#e5bdb8]",
            bgClass: "bg-[#f7fafd]",
          };
          const Icon = config.icon;

          return (
            <motion.div
              key={divKey}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={cn(
                "bg-white rounded-2xl p-5 border border-[#e5bdb8] border-t-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center",
                config.borderClass,
                config.bgClass
              )}
              role="listitem"
            >
              {/* Icon Bubble */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 border border-[#e5bdb8]">
                <Icon className={cn("w-5 h-5", config.color)} />
              </div>

              {/* Title */}
              <h5 className="font-jakarta font-extrabold text-xs text-[#181c1f] uppercase tracking-wide leading-tight mb-4 min-h-[32px] flex items-center">
                {config.label}
              </h5>

              {/* Name List */}
              <ul className="space-y-1.5 w-full border-t border-[#ebeef2] pt-4">
                {divMembers.map((m) => (
                  <li key={m.id} className="text-xs font-semibold text-[#5c403c]">
                    {m.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
