// src/app/(public)/panitia/page.tsx
import { CommitteeTree } from "@/components/committee/CommitteeTree";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getCommitteeMembers, fallbackCommitteeMembers } from "@/repositories/committeeRepository";

import type { CommitteeMember } from "@/types/committee";

export const revalidate = 3600; // ISR every 1 hour

export default async function CommitteePage() {
  let members: CommitteeMember[] = [];
  try {
    members = await getCommitteeMembers();
  } catch (error) {
    console.error("Failed to load committee members:", error);
    members = fallbackCommitteeMembers;
  }

  if (members.length === 0) {
    members = fallbackCommitteeMembers;
  }

  return (
    <div className="flex flex-col w-full py-12 space-y-16">
      {/* Header */}
      <section className="px-5 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Susunan Panitia HUT RI ke-81"
            subtitle="Struktur organisasi kepanitiaan warga Blumbang RT 15 untuk menyelenggarakan rangkaian perayaan kemerdekaan."
            eyebrow="Panitia"
            accentBar
          />
        </div>
      </section>

      {/* Tree Visualization */}
      <section className="px-5 md:px-20 w-full flex justify-center">
        <CommitteeTree members={members} />
      </section>
    </div>
  );
}
