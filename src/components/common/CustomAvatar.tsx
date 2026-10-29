import React from 'react';

export interface AvatarMeta {
  id: string;
  name: string;
  title: string;
  bgGradient: string;
  borderColor: string;
}

export const AVATAR_COLLECTION: AvatarMeta[] = [
  {
    id: 'avatar_panda',
    name: 'Panda Pendekar',
    title: 'Panda Pejuang Bertopi Bambu',
    bgGradient: 'from-emerald-900/40 via-teal-900/30 to-zinc-900',
    borderColor: 'border-emerald-500/50',
  },
  {
    id: 'avatar_master',
    name: 'Guru Bijak',
    title: 'Master Kaligrafi Kekaisaran',
    bgGradient: 'from-amber-900/40 via-yellow-900/30 to-zinc-900',
    borderColor: 'border-amber-500/50',
  },
  {
    id: 'avatar_swordsman',
    name: 'Pendekar Bambu',
    title: 'Pengelana Rimba Persilatan',
    bgGradient: 'from-rose-900/40 via-red-900/30 to-zinc-900',
    borderColor: 'border-rose-500/50',
  },
  {
    id: 'avatar_scholar',
    name: 'Cendekiawan',
    title: 'Pelajar Kitab Hanzi',
    bgGradient: 'from-blue-900/40 via-indigo-900/30 to-zinc-900',
    borderColor: 'border-blue-500/50',
  },
  {
    id: 'avatar_dragon',
    name: 'Naga Giok',
    title: 'Penjaga Aksara Langit',
    bgGradient: 'from-teal-900/40 via-cyan-900/30 to-zinc-900',
    borderColor: 'border-teal-500/50',
  },
  {
    id: 'avatar_fox',
    name: 'Rubah Roh',
    title: 'Penjaga Kuil Gunung Salju',
    bgGradient: 'from-orange-900/40 via-amber-900/30 to-zinc-900',
    borderColor: 'border-orange-500/50',
  },
  {
    id: 'avatar_phoenix',
    name: 'Burung Phoenix',
    title: 'Api Semangat Belajar',
    bgGradient: 'from-red-900/40 via-orange-900/30 to-zinc-900',
    borderColor: 'border-red-500/50',
  },
  {
    id: 'avatar_cat',
    name: 'Kucing Rezeki',
    title: 'Pembawa Hoki & Ketekunan',
    bgGradient: 'from-yellow-900/40 via-amber-900/30 to-zinc-900',
    borderColor: 'border-yellow-500/50',
  },
];

interface CustomAvatarProps {
  id?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({
  id,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-3xl',
  };

  const chosenId = id || 'avatar_master';

  // Render SVG Karakter Oriental Khusus
  const renderSvgCharacter = (charId: string) => {
    switch (charId) {
      case 'avatar_panda':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#064E3B" fillOpacity="0.3" />
            {/* Topi Bambu Caping */}
            <path d="M50 14 L12 44 L88 44 Z" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <path d="M50 14 L50 44" stroke="#B45309" strokeWidth="1.5" strokeDasharray="2 2" />
            <ellipse cx="50" cy="44" rx="38" ry="7" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            {/* Telinga Panda Hitam */}
            <circle cx="28" cy="44" r="10" fill="#18181B" />
            <circle cx="72" cy="44" r="10" fill="#18181B" />
            {/* Wajah Panda Putih Bulat */}
            <circle cx="50" cy="62" r="26" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Bercak Mata Hitam Miring */}
            <ellipse cx="40" cy="60" rx="7" ry="9" fill="#18181B" transform="rotate(-15 40 60)" />
            <ellipse cx="60" cy="60" rx="7" ry="9" fill="#18181B" transform="rotate(15 60 60)" />
            {/* Binar Mata Berkilau */}
            <circle cx="41" cy="59" r="2.5" fill="#FFFFFF" />
            <circle cx="59" cy="59" r="2.5" fill="#FFFFFF" />
            {/* Hidung & Senyum Panda */}
            <ellipse cx="50" cy="68" rx="4" ry="2.5" fill="#0F172A" />
            <path d="M46 72 Q50 76 54 72" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            {/* Daun Bambu Hijau di Mulut */}
            <path d="M54 72 Q64 70 70 76 Q62 76 56 73" fill="#10B981" />
          </svg>
        );

      case 'avatar_master':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#78350F" fillOpacity="0.3" />
            {/* Topi Mahkota Pejabat Dinasti (Guan) */}
            <rect x="36" y="16" width="28" height="18" rx="4" fill="#1E293B" stroke="#B45309" strokeWidth="2" />
            <circle cx="50" cy="20" r="3.5" fill="#F59E0B" />
            {/* Rambut Konde Tradisional */}
            <ellipse cx="50" cy="38" rx="26" ry="12" fill="#0F172A" />
            {/* Wajah Guru */}
            <circle cx="50" cy="54" r="22" fill="#FED7AA" />
            {/* Alis Panjang Bijak Putih */}
            <path d="M33 48 Q42 46 47 50" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M67 48 Q58 46 53 50" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
            {/* Mata Tersenyum Teduh */}
            <path d="M38 54 Q42 58 46 54" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M54 54 Q58 58 62 54" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Kumis & Janggut Putih Panjang Anggun */}
            <path d="M42 66 Q50 70 58 66 Q50 94 42 66 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
            {/* Jubah Hanfu Kerah Merah Emas */}
            <path d="M26 80 L50 68 L74 80 L78 98 L22 98 Z" fill="#991B1B" />
            <path d="M36 80 L50 68 L64 80" stroke="#F59E0B" strokeWidth="3" />
          </svg>
        );

      case 'avatar_swordsman':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#881337" fillOpacity="0.3" />
            {/* Topi Bambu Lebar Wuxia */}
            <ellipse cx="50" cy="36" rx="42" ry="14" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <path d="M20 34 Q50 16 80 34" fill="#92400E" />
            {/* Kain Penutup / Cadar Hitam */}
            <path d="M32 50 L68 50 L64 78 Q50 86 36 78 Z" fill="#18181B" />
            {/* Mata Tajam Pendekar */}
            <ellipse cx="42" cy="46" rx="5" ry="2.5" fill="#F8FAFC" />
            <circle cx="43" cy="46" r="2" fill="#0F172A" />
            <ellipse cx="58" cy="46" rx="5" ry="2.5" fill="#F8FAFC" />
            <circle cx="57" cy="46" r="2" fill="#0F172A" />
            {/* Selendang Merah Menyala di Leher */}
            <path d="M30 76 Q50 84 70 76 Q60 96 30 76 Z" fill="#DC2626" />
            {/* Gagang Pedang Tersandang di Punggung */}
            <line x1="72" y1="20" x2="86" y2="44" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="72" cy="20" r="3" fill="#F59E0B" />
          </svg>
        );

      case 'avatar_scholar':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#1E3A8A" fillOpacity="0.3" />
            {/* Topi Sarjana Biru (Scholar Hat) */}
            <path d="M30 32 L50 20 L70 32 L50 38 Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2" />
            <path d="M50 20 L50 10" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="50" cy="8" r="3" fill="#EF4444" />
            {/* Wajah Pemuda Sarjana */}
            <circle cx="50" cy="54" r="22" fill="#FFEDD5" />
            {/* Rambut Berikat Rapi */}
            <ellipse cx="50" cy="40" rx="22" ry="10" fill="#0F172A" />
            {/* Alis Rapi & Mata Semangat */}
            <path d="M38 48 Q44 46 48 49" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M62 48 Q56 46 52 49" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="43" cy="54" r="3" fill="#0F172A" />
            <circle cx="57" cy="54" r="3" fill="#0F172A" />
            <circle cx="44" cy="53" r="1" fill="#FFFFFF" />
            <circle cx="58" cy="53" r="1" fill="#FFFFFF" />
            {/* Senyum Ramah */}
            <path d="M46 64 Q50 68 54 64" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            {/* Jubah Cendekiawan Biru Langit */}
            <path d="M26 80 L50 70 L74 80 L76 98 L24 98 Z" fill="#2563EB" />
            <path d="M38 80 L50 70 L62 80" stroke="#F8FAFC" strokeWidth="2.5" />
          </svg>
        );

      case 'avatar_dragon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#134E4A" fillOpacity="0.3" />
            {/* Tanduk Naga Emas Bercabang */}
            <path d="M34 32 Q26 18 18 16 Q26 26 34 26" fill="#F59E0B" />
            <path d="M66 32 Q74 18 82 16 Q74 26 66 26" fill="#F59E0B" />
            {/* Kepala Naga Giok Hijau Keemasan */}
            <path d="M32 40 Q50 30 68 40 Q76 60 66 76 Q50 86 34 76 Q24 60 32 40 Z" fill="#0D9488" stroke="#115E59" strokeWidth="2" />
            {/* Sisik Mutiara Giok */}
            <circle cx="50" cy="46" r="3.5" fill="#2DD4BF" />
            {/* Mata Naga Bercahaya Emas */}
            <ellipse cx="40" cy="52" rx="6" ry="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="40" cy="52" r="3" fill="#713F12" />
            <ellipse cx="60" cy="52" rx="6" ry="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="60" cy="52" r="3" fill="#713F12" />
            {/* Moncong & Sungut Panjang */}
            <ellipse cx="50" cy="68" rx="14" ry="10" fill="#14B8A6" />
            <path d="M44 68 Q24 76 18 88" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M56 68 Q76 76 82 88" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Mutiara Kebijakan */}
            <circle cx="50" cy="74" r="3" fill="#F8FAFC" />
          </svg>
        );

      case 'avatar_fox':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#7C2D12" fillOpacity="0.3" />
            {/* Telinga Rubah Oranye Runcing Besar */}
            <path d="M26 44 L16 16 L42 32 Z" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
            <path d="M24 38 L20 22 L36 32 Z" fill="#FFEDD5" />
            <path d="M74 44 L84 16 L58 32 Z" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
            <path d="M76 38 L80 22 L64 32 Z" fill="#FFEDD5" />
            {/* Wajah Rubah Runcing */}
            <path d="M30 42 Q50 36 70 42 Q78 64 50 82 Q22 64 30 42 Z" fill="#F97316" />
            {/* Pipis Putih Elegan */}
            <path d="M30 54 Q38 68 50 78 Q62 68 70 54 Q64 74 50 82 Q36 74 30 54 Z" fill="#FFF7ED" />
            {/* Mata Sipit Menawan Khas Spirit Fox */}
            <path d="M34 50 Q42 46 46 54" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M66 50 Q58 46 54 54" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="40" cy="52" r="1.5" fill="#7C2D12" />
            <circle cx="60" cy="52" r="1.5" fill="#7C2D12" />
            {/* Hidung Kecil Hitam */}
            <circle cx="50" cy="74" r="3" fill="#18181B" />
            {/* Tanda Stempel Merah di Dahi */}
            <path d="M50 42 L52 46 L50 48 L48 46 Z" fill="#DC2626" />
          </svg>
        );

      case 'avatar_phoenix':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#7F1D1D" fillOpacity="0.3" />
            {/* Mahkota Bulu Api Merah */}
            <path d="M50 12 Q58 24 50 34 Q42 24 50 12 Z" fill="#EF4444" />
            <path d="M38 18 Q46 28 42 38 Q32 30 38 18 Z" fill="#F97316" />
            <path d="M62 18 Q54 28 58 38 Q68 30 62 18 Z" fill="#F97316" />
            {/* Kepala Burung Phoenix Merah Anggun */}
            <circle cx="50" cy="50" r="22" fill="#DC2626" />
            {/* Mata Emas Membara */}
            <ellipse cx="42" cy="48" rx="4" ry="5" fill="#FEF08A" />
            <circle cx="43" cy="48" r="2" fill="#B91C1C" />
            <ellipse cx="58" cy="48" rx="4" ry="5" fill="#FEF08A" />
            <circle cx="57" cy="48" r="2" fill="#B91C1C" />
            {/* Paruh Emas Runcing */}
            <path d="M46 56 L54 56 L50 68 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            {/* Hiasan Dada Berbulu Api */}
            <path d="M32 72 Q50 64 68 72 Q50 94 32 72 Z" fill="#F59E0B" />
          </svg>
        );

      case 'avatar_cat':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Background Halo */}
            <circle cx="50" cy="50" r="48" fill="#713F12" fillOpacity="0.3" />
            {/* Telinga Kucing Putih Bercak Merah */}
            <polygon points="24,42 16,18 42,30" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            <polygon points="26,38 22,24 38,30" fill="#F87171" />
            <polygon points="76,42 84,18 58,30" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
            <polygon points="74,38 78,24 62,30" fill="#FCA5A5" />
            {/* Wajah Bulat Putih Bersih */}
            <circle cx="50" cy="56" r="26" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Mata Kucing Tersenyum Bahagia */}
            <path d="M36 50 Q42 44 46 50" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M64 50 Q58 44 54 50" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Pipi Merona Merah Muda */}
            <ellipse cx="34" cy="58" rx="4" ry="2.5" fill="#FDA4AF" />
            <ellipse cx="66" cy="58" rx="4" ry="2.5" fill="#FDA4AF" />
            {/* Hidung & Kumis Kucing */}
            <polygon points="48,58 52,58 50,61" fill="#F43F5E" />
            <path d="M46 62 Q50 66 54 62" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
            <line x1="28" y1="58" x2="16" y2="56" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="28" y1="62" x2="16" y2="64" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="72" y1="58" x2="84" y2="56" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="72" y1="62" x2="84" y2="64" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Kalung Merah & Lonceng Emas */}
            <rect x="36" y="78" width="28" height="6" rx="3" fill="#DC2626" />
            <circle cx="50" cy="84" r="5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
          </svg>
        );

      default:
        // Fallback untuk id lama atau emoji
        return (
          <div className="w-full h-full flex items-center justify-center font-serif font-black text-2xl text-amber-500">
            {charId.length <= 4 ? charId : '汉'}
          </div>
        );
    }
  };

  const isPreset = AVATAR_COLLECTION.some((a) => a.id === chosenId);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl p-1 bg-zinc-900 border border-zinc-700/80 shrink-0 select-none overflow-hidden transition-transform hover:scale-105 ${sizeMap[size]} ${className}`}
      style={{
        boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      {isPreset ? (
        renderSvgCharacter(chosenId)
      ) : (
        <span className="leading-none text-center flex items-center justify-center w-full h-full">
          {chosenId}
        </span>
      )}
    </div>
  );
};

