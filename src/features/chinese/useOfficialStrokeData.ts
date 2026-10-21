import { useEffect, useState } from 'react';
import { getOfficialStrokeData } from '@/services/chinese/hanziAssets';
import { HanziStrokeData } from '@/services/chinese/hanziStrokeData';

/**
 * useOfficialStrokeData — muat data urutan goresan resmi (Makemeahanzi)
 * untuk satu karakter. Hasil di-cache di hanziAssets, jadi beberapa
 * komponen yang memuat karakter sama tidak mengunduh ulang.
 */
export function useOfficialStrokeData(
  character: string,
  meta?: { pinyin?: string; meaning?: string; radical?: string }
): { strokeData: HanziStrokeData | null; loading: boolean } {
  const [strokeData, setStrokeData] = useState<HanziStrokeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setStrokeData(null);
    getOfficialStrokeData(character, meta).then((data) => {
      if (!alive) return;
      setStrokeData(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
    // meta is caller-stable; reload on character change only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  return { strokeData, loading };
}
