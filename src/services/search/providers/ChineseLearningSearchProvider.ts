import { SearchProvider, SearchResult } from '../searchTypes';
import { fetchVocabularies, fetchHanziCharacters, fetchChineseNotes, fetchSystemWords } from '@/services/chineseLearningService';
import { pinyinSyllablesMatch } from '@/services/chinese/pinyinEngine';
import { course } from '@/data/course';
import { meaningOf } from '@/data/course.types';

/** Query latin murni → cocokkan per suku kata pinyin (abaikan nada), bukan substring mentah. */
const LATIN_QUERY = /^[a-zA-Z]+$/;
function matchesLatinPinyin(pinyin: string, q: string): boolean {
  if (!LATIN_QUERY.test(q)) return false;
  return pinyin
    .split(/\s+/)
    .filter(Boolean)
    .some((s) => pinyinSyllablesMatch(s, q));
}

export class ChineseLearningSearchProvider implements SearchProvider {
  public category: 'document' = 'document';

  public async search(query: string): Promise<SearchResult[]> {
    const qLower = query.toLowerCase().trim();
    if (!qLower) return [];

    try {
      const results: SearchResult[] = [];

      // 1. Search in course words with relevance scoring
      const candidates: { cw: typeof course.words[0]; score: number }[] = [];
      const stripTone = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const qToneFree = stripTone(qLower);

      for (const cw of course.words) {
        let score = 0;
        const pinyinFree = stripTone(cw.pinyin);

        if (cw.hanzi === qLower) score = 100;
        else if (cw.hanzi.includes(qLower)) score = 85;
        else if (pinyinFree === qToneFree) score = 95;
        else if (matchesLatinPinyin(cw.pinyin, qToneFree)) score = 88;
        else if (pinyinFree.startsWith(qToneFree)) score = 80;
        else if (cw.meanId && new RegExp('(?:\\b|^|\\s)' + qLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\b|$|\\s)', 'i').test(cw.meanId)) score = 75;
        else if (cw.meanId?.toLowerCase().includes(qLower)) score = 65;
        else if (qLower.length > 3 && cw.meanEn?.some((m) => m.toLowerCase().includes(qLower))) score = 50;

        if (score > 0) {
          candidates.push({ cw, score });
        }
      }

      candidates.sort((a, b) => b.score - a.score || (a.cw.freq || 999999) - (b.cw.freq || 999999));

      for (const { cw, score } of candidates.slice(0, 20)) {
        const meaning = meaningOf(cw);
        results.push({
          id: `cw_${cw.id}`,
          category: 'document',
          title: `${cw.hanzi} [${cw.pinyin}]`,
          subtitle: `Arti: ${meaning || 'Kosakata HSK'} · HSK ${cw.level}`,
          targetTab: 'vocab',
          entityId: cw.id,
          relevanceScore: score,
        });
      }

      if ('chinese'.includes(qLower) || 'mandarin'.includes(qLower) || 'hanzi'.includes(qLower) || 'pinyin'.includes(qLower) || '中文'.includes(qLower)) {
        results.push({
          id: 'cl_overview',
          category: 'document',
          title: '[CHINESE LEARNING] 中文学习 Hub',
          subtitle: 'Mandarin Education, Vocabulary, Hanzi & Practice Hub',
          targetTab: 'chinese_learning',
          relevanceScore: 100,
        });
      }

      const systemWords = await fetchSystemWords();
      systemWords.forEach((sw) => {
        if (
          sw.hanzi.toLowerCase().includes(qLower) ||
          sw.pinyin.toLowerCase().includes(qLower) ||
          matchesLatinPinyin(sw.pinyin, qLower) ||
          sw.pinyinNormalized.includes(qLower) ||
          sw.meanings.some((m) => m.toLowerCase().includes(qLower))
        ) {
          results.push({
            id: `cl_sys_${sw.id}`,
            category: 'document',
            title: `[SYSTEM VOCAB] ${sw.hanzi} (${sw.pinyin})`,
            subtitle: `Meanings: ${sw.meanings.join(', ')} | HSK ${sw.hskLevel}`,
            targetTab: 'chinese_learning',
            entityId: sw.id,
            relevanceScore: 95,
          });
        }
      });

      const vocabs = await fetchVocabularies();
      vocabs.forEach((v) => {
        if (
          v.hanzi.toLowerCase().includes(qLower) ||
          v.pinyin.toLowerCase().includes(qLower) ||
          matchesLatinPinyin(v.pinyin, qLower) ||
          v.meaning.toLowerCase().includes(qLower)
        ) {
          results.push({
            id: `cl_vocab_${v.id}`,
            category: 'document',
            title: `[VOCABULARY] ${v.hanzi} (${v.pinyin})`,
            subtitle: `Meaning: ${v.meaning} | HSK ${v.hskLevel || 1}`,
            targetTab: 'chinese_learning',
            entityId: v.id,
            relevanceScore: 90,
          });
        }
      });

      const hanziList = await fetchHanziCharacters();
      hanziList.forEach((h) => {
        if (
          h.character.toLowerCase().includes(qLower) ||
          h.pinyin.toLowerCase().includes(qLower) ||
          matchesLatinPinyin(h.pinyin, qLower) ||
          h.meaning.toLowerCase().includes(qLower)
        ) {
          results.push({
            id: `cl_hanzi_${h.id}`,
            category: 'document',
            title: `[HANZI] ${h.character} (${h.pinyin})`,
            subtitle: `Meaning: ${h.meaning}`,
            targetTab: 'chinese_learning',
            entityId: h.id,
            relevanceScore: 85,
          });
        }
      });

      const notes = await fetchChineseNotes();
      notes.forEach((n) => {
        if (n.title.toLowerCase().includes(qLower) || n.content.toLowerCase().includes(qLower)) {
          results.push({
            id: `cl_note_${n.id}`,
            category: 'document',
            title: `[MANDARIN NOTE] ${n.title}`,
            subtitle: `Category: ${n.category}`,
            targetTab: 'chinese_learning',
            entityId: n.id,
            relevanceScore: 80,
          });
        }
      });

      return results;
    } catch (err) {
      console.error('ChineseLearningSearchProvider error:', err);
      return [];
    }
  }
}
