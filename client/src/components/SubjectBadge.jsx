import React from 'react';



const DYNAMIC_PALETTE = [
  'bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20',
  'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20',
  'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
  'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20',
  'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20',
  'bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20',
  'bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20',
  'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20',
  'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20',
  'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20',
  'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20',
  'bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20',
];

function getDynamicColor(name) {
  if (!name) return 'bg-[#26282C] text-[#A1A1AA] border border-[#1F2023]';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DYNAMIC_PALETTE.length;
  return DYNAMIC_PALETTE[index];
}

export default function SubjectBadge({ subject }) {
  const colorClass = getDynamicColor(subject);
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold inline-flex items-center ${colorClass}`}>
      {subject}
    </span>
  );
}