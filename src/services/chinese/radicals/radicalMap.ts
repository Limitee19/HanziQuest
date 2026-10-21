import { FULL_HSK_DATASET, ChineseWord } from '../chineseDataset';
import { RADICAL_BY_ID, KANGXI_RADICALS, RadicalEntry } from './radicalTable';

/**
 * Peta Hanzi → Radikal (terkurasi)
 * ────────────────────────────────
 * Mapping statis untuk seluruh karakter unik dataset HSK 1–3.
 * Nilai = daftar nomor radikal Kangxi yang MEMBENTUK karakter (bukan hanya
 * radikal kamus utamanya), termasuk bentuk varian seperti 氵 (85 air),
 * 扌 (64 tangan), 忄 (61 hati), 艹 (140 rumput), 讠 (149 ucapan), dst.
 *
 * Konsekuensinya: karakter yang tersusun dari 2+ radikal terdeteksi oleh
 * SEMUA radikal pembentuknya — mis. 想 muncul di 木(75), 目(109), dan 心(61).
 * Entri yang tidak ada di dataset akan difilter otomatis saat build index.
 */
const RADICALS_FOR_HANZI: Record<string, number[]> = {
  爱: [87, 94, 14, 61], 八: [13], 爸: [88, 49], 杯: [75, 16], 子: [39],
  北: [25, 21], 京: [8, 30, 42], 本: [75, 1], 不: [75], 客: [40, 34, 30],
  气: [84], 菜: [140, 165], 茶: [140, 9, 75], 吃: [30, 5], 出: [46, 17],
  租: [115, 109], 车: [159], 打: [64, 1], 电: [73, 5], 话: [149, 135, 30],
  大: [37], 的: [106, 20], 脑: [74, 8, 17], 视: [113, 147], 点: [86, 25, 30],
  都: [125, 170], 多: [36], 少: [42], 儿: [10], 二: [7],
  饭: [184, 27], 房: [63, 70], 间: [169, 72], 飞: [183], 机: [75, 16],
  分: [13, 18], 钟: [167, 2], 高: [189], 兴: [13], 个: [9, 2],
  工: [48], 作: [9, 4], 狗: [94, 20, 30], 汉: [85, 29], 语: [149, 7, 30],
  好: [38, 39], 号: [30, 1], 喝: [30, 72, 20], 和: [115, 30], 很: [60, 138],
  后: [27, 30], 面: [176], 回: [31, 30], 会: [9, 7], 几: [16],
  家: [40, 152], 叫: [30, 2], 今: [9], 天: [37, 1], 九: [5],
  开: [55, 1], 看: [64, 109], 见: [147], 课: [149, 75], 块: [32, 37],
  来: [75, 9], 老: [125], 师: [50], 了: [5], 冷: [15, 9],
  里: [166], 六: [13], 妈: [38, 187], 吗: [30, 187], 买: [5, 37],
  猫: [94, 140, 102], 没: [85, 79], 什: [9, 24], 么: [4, 28], 有: [74],
  米: [119], 明: [72, 109], 名: [36, 30], 字: [40, 39], 哪: [30, 170],
  那: [170], 呢: [30, 44, 21], 能: [74, 21], 你: [9, 42], 年: [51],
  朋: [74], 友: [29, 1], 漂: [85, 146, 113], 亮: [8, 30, 16], 苹: [140, 51],
  果: [75, 102], 七: [1], 骑: [187, 37], 前: [18, 74], 请: [149, 174],
  去: [32, 28], 热: [64, 86], 人: [9], 认: [149, 9], 日: [72],
  三: [33], 商: [30, 8], 店: [53, 25], 上: [1], 午: [24],
  谁: [149, 172], 十: [24], 时: [72, 41], 候: [9, 111], 是: [72, 103],
  书: [5], 水: [85], 睡: [109, 32], 觉: [14, 147], 说: [149, 13],
  四: [31], 岁: [46, 36], 他: [9, 5], 她: [38, 5], 太: [37, 3],
  踢: [157, 72], 听: [30, 69], 同: [14, 30], 学: [14, 39], 喂: [30, 102],
  我: [62, 64], 五: [7], 喜: [30, 33], 欢: [76, 29], 下: [1, 25],
  雨: [173], 夏: [34, 132], 先: [10, 32], 生: [100], 现: [96, 147],
  在: [32, 64], 想: [75, 109, 61], 小: [42], 姐: [38, 109], 写: [14, 1],
  谢: [149, 158, 41], 星: [72, 100], 期: [13, 74], 习: [5], 校: [75, 8],
  一: [1], 衣: [145], 服: [74, 26, 29], 医: [22, 111], 院: [170, 40],
  椅: [75, 37], 月: [74], 再: [14, 32], 怎: [61, 4], 样: [75, 123],
  这: [162, 67], 中: [2], 国: [31, 96], 住: [9, 96], 桌: [75, 72],
  昨: [72, 4], 坐: [32, 9], 做: [9, 30, 66], 影: [59, 72, 8], 帮: [50, 170],
  忙: [61, 8], 报: [64, 26, 29], 纸: [120, 83], 比: [81], 别: [30, 19, 18],
  宾: [40, 13], 馆: [184, 40], 冰: [15, 85], 边: [162, 19], 但: [9, 72],
  蛋: [103, 142], 糕: [119, 123, 86], 担: [64, 72], 心: [61], 地: [32, 5],
  球: [96, 85], 方: [70], 健: [9, 54], 康: [53, 171],
  东: [75], 冬: [34, 15], 动: [19, 7], 物: [93, 20], 短: [111, 151],
  段: [79], 堆: [32, 172], 对: [29, 41], 发: [29], 放: [70, 66],
  万: [1], 为: [3], 可: [30, 1], 以: [9], 渴: [85, 72],
  快: [61, 37], 累: [120, 102], 解: [148, 18, 93], 绿: [120, 85], 慢: [61, 73],
  帽: [50, 73], 门: [169], 包: [20, 49], 拿: [64, 9], 奶: [38, 4],
  南: [24, 14], 难: [29, 172], 内: [14, 9], 容: [40, 150], 龄: [211, 9],
  鸟: [196], 努: [19, 38], 力: [19], 跑: [157, 20], 胖: [74, 24],
  皮: [107], 鞋: [177, 32], 便: [9, 73], 宜: [40], 票: [113, 146],
  西: [146], 瓜: [97], 其: [13], 实: [40, 37], 奇: [37, 30],
  怪: [61, 32], 起: [156, 49], 全: [9, 96], 部: [117, 170], 却: [26, 32],
  然: [86, 74], 让: [149, 1], 情: [61, 174], 真: [109, 24], 易: [72, 20],
  如: [38, 30], 伞: [9, 24], 沙: [85, 42], 拉: [64, 117], 超: [156, 30],
  市: [50, 8], 身: [158], 体: [9, 75], 声: [33, 44], 音: [180],
  世: [1], 界: [102, 9], 叔: [29, 42], 数: [119, 66], 刷: [44, 50, 18],
  双: [29], 床: [53, 75], 虽: [30, 142], 阳: [170, 72], 特: [93, 32],
  疼: [104, 34], 提: [64, 72], 育: [74, 8], 题: [72, 181], 足: [157],
  安: [40, 38], 静: [174, 58], 最: [73, 128], 新: [69, 117, 75], 鲜: [195, 123],
  洗: [85, 10], 信: [9, 149], 行: [144], 李: [75, 39], 箱: [118, 75],
  熊: [86, 74], 需: [173, 126], 要: [146, 38], 眼: [109, 138], 睛: [109, 174],
  颜: [181, 59], 色: [139], 光: [10, 42], 求: [85], 邀: [162, 66],
  爷: [88, 26], 定: [40, 103], 已: [49], 经: [120, 48], 意: [180, 61],
  思: [102, 61], 因: [31, 37], 乐: [4], 银: [167, 138], 越: [156, 62],
  运: [162, 7], 站: [117, 25], 长: [168], 找: [64, 62], 到: [133, 18],
  照: [86, 72], 相: [75, 109], 片: [91], 着: [123, 109], 正: [1, 77],
  确: [112, 148], 知: [111, 30], 道: [162, 185], 准: [15, 172], 备: [34, 102],
  自: [132], 总: [61, 30], 阿: [170, 30], 姨: [38, 37], 消: [85, 74],
  息: [132, 61], 近: [162, 69], 远: [162, 10], 晴: [72, 174], 阴: [170, 74],
  考: [125, 1], 试: [149, 48], 复: [34, 72], 预: [181, 5], 办: [19, 13],
  公: [13, 28], 室: [40, 133], 差: [48, 123], 班: [96, 18], 顾: [181, 27],
  也: [5], 许: [149, 24], 直: [24, 109], 或: [62, 30], 者: [125, 72],
  手: [64], 遍: [162, 63], 练: [120, 75], 借: [9, 72], 还: [162, 75],
  啊: [30, 170], 矮: [111, 115], 把: [64, 49], 白: [106], 事: [6, 30],
  半: [24], 法: [85, 32], 饱: [184, 20], 极: [75, 29], 被: [145, 107],
  鼻: [209], 较: [159, 8], 笔: [118, 82], 记: [149, 49], 必: [61, 4],
  须: [59, 181], 变: [8, 29], 化: [9, 21], 舒: [135, 9], 散: [74, 66],
  步: [77, 42], 产: [117], 城: [32, 62], 常: [50, 42], 场: [32],
  合: [9, 30], 成: [62], 功: [48, 19], 诚: [149, 62], 乘: [4, 75],
  程: [115, 30], 序: [53, 5], 迟: [162, 44], 除: [170, 9], 船: [137, 16, 30],
  春: [72, 9], 词: [149, 30], 典: [13], 聪: [128, 61], 算: [118, 109],
  概: [75, 138], 处: [34, 25], 得: [60, 72], 灯: [86, 1], 址: [32, 77],
  铁: [167, 4], 图: [31, 34], 歉: [76, 13], 重: [166], 懂: [61, 140],
  读: [149, 154], 堵: [32, 125], 饿: [184, 62], 而: [126], 且: [1],
  耳: [128], 朵: [75, 16], 翻: [124, 102], 译: [149, 29], 风: [182],
  景: [72, 8], 付: [9, 41], 款: [76, 113], 附: [170, 9], 杂: [75, 5],
  该: [149, 8], 改: [49, 66], 赶: [156, 51], 感: [61, 30], 冒: [73, 109],
  刚: [14, 18], 才: [64], 各: [34, 30], 根: [75, 138], 据: [64, 30],
  跟: [157, 138], 更: [73], 厂: [27], 共: [13], 够: [36, 20],
  姑: [38, 30], 故: [30, 66], 刮: [135, 18], 首: [185], 惯: [61, 154],
  海: [85, 80], 军: [14, 159], 害: [40, 30], 羞: [123], 汗: [85, 51],
  香: [186], 蕉: [140, 86], 像: [9, 152], 醉: [164, 9], 盒: [108, 9],
  黑: [203], 护: [64, 63], 士: [33], 画: [102, 17], 坏: [32, 75],
  迎: [162, 26], 环: [96, 75], 境: [32, 117], 黄: [201], 河: [85, 30],
  婚: [38, 83], 礼: [113, 5], 乎: [4], 集: [172, 75], 挤: [64, 67],
  计: [149, 24], 划: [62, 18], 忆: [61, 5], 技: [64, 65], 术: [75, 3],
  继: [120, 119], 续: [120, 154], 庭: [53, 54], 价: [9], 格: [75, 30],
  坚: [32, 25], 持: [64, 32], 简: [118, 169], 交: [8], 流: [85, 8],
  郊: [170, 8], 区: [22], 教: [66, 125], 节: [140, 26], 目: [109],
  结: [120, 30], 束: [75, 30], 决: [15, 37], 释: [165, 40], 紧: [120, 131],
  进: [162, 7], 度: [53, 29], 过: [162, 41], 理: [96, 166], 验: [187, 9],
  久: [4], 句: [20, 30], 绝: [120, 139], 咳: [30, 8], 嗽: [30, 76],
  空: [116, 48], 苦: [140, 30], 裤: [145, 53], 筷: [118, 61], 蓝: [140, 108],
  虎: [141, 16], 离: [114, 8], 历: [27, 19], 史: [30], 脸: [74, 9],
  两: [1, 14], 落: [140, 85], 律: [60, 129], 马: [187], 路: [157, 30],
  满: [85], 每: [80], 霓: [173, 10], 虹: [142, 48], 轻: [159],
  爬: [87, 49], 山: [46], 盘: [137, 108], 普: [72, 13], 通: [162, 101],
  铅: [167, 16], 千: [4, 24], 巧: [48, 1], 清: [85, 174], 楚: [75, 103],
  秋: [115, 86], 裙: [145, 30], 伤: [9, 19], 深: [85, 14], 傅: [9, 41],
  瘦: [104, 29], 牙: [92], 甜: [135, 99], 条: [75, 34], 跳: [157, 10],
  舞: [136], 头: [37], 突: [116, 94], 腿: [74, 162], 完: [40, 10],
  碗: [112, 40], 忘: [61, 8], 位: [9, 117], 文: [67], 警: [149, 66],
  察: [40, 113], 向: [14, 30], 闻: [169, 128], 姓: [38, 100], 周: [14, 30],
  幸: [51, 32], 趣: [156, 128], 选: [162, 10], 择: [64, 29], 雪: [173, 58],
  花: [140, 9], 般: [137, 79], 应: [53], 响: [30, 14], 用: [101],
  敢: [66, 128], 勇: [101, 19], 末: [75, 11], 爪: [87],
};

// ── Derived indexes (built once, lazily) ──────────────────────────────────

export interface HanziRadicalMatch {
  hanzi: string;
  pinyin: string;
  meanings: string[];
  hskLevel: number;
  /** Radikal-radikal pembentuk karakter ini (nomor Kangxi). */
  radicalIds: number[];
  /** Info kata lengkap dari dataset (bisa multi-karakter, mis. 妈妈). */
  words: ChineseWord[];
}

interface RadicalIndex {
  /** radicalId → hanzi matches (urut HSK lalu urutan dataset) */
  byRadical: Map<number, HanziRadicalMatch[]>;
  /** char → radical entries */
  radicalsOf: Map<string, RadicalEntry[]>;
  /** char → words (kata dataset yang memuat char) */
  wordsOf: Map<string, ChineseWord[]>;
  /** normalized pinyin + meaning → matches */
  searchList: { match: HanziRadicalMatch; normPinyin: string; meaning: string }[];
}

let _index: RadicalIndex | null = null;

function stripTone(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
}

function buildIndex(): RadicalIndex {
  const byRadical = new Map<number, HanziRadicalMatch[]>();
  const radicalsOf = new Map<string, RadicalEntry[]>();
  const wordsOf = new Map<string, ChineseWord[]>();
  const searchList: RadicalIndex['searchList'] = [];
  const seen = new Set<string>();

  for (const word of FULL_HSK_DATASET) {
    for (const char of word.hanzi) {
      if (!/[\u4e00-\u9fff]/.test(char)) continue;
      const radicalIds = RADICALS_FOR_HANZI[char];
      if (!radicalIds) continue;

      const entries: RadicalEntry[] = [];
      for (const rid of radicalIds) {
        const entry = RADICAL_BY_ID.get(rid);
        if (!entry) continue;
        entries.push(entry);
        let list = byRadical.get(rid);
        if (!list) {
          list = [];
          byRadical.set(rid, list);
        }
        let match = list.find((m) => m.hanzi === char);
        if (!match) {
          match = { hanzi: char, pinyin: '', meanings: [], hskLevel: word.hskLevel, radicalIds: [], words: [] };
          list.push(match);
        }
        if (word.hskLevel < match.hskLevel) match.hskLevel = word.hskLevel;
        if (word.pinyin && !match.pinyin) match.pinyin = word.pinyin;
        if (!match.words.some((w) => w.id === word.id)) match.words.push(word);
      }
      if (entries.length === 0) continue;
      radicalsOf.set(char, entries);

      const key = char;
      if (!seen.has(key)) {
        seen.add(key);
        const words = wordsOf.get(char) || [];
        words.push(word);
        wordsOf.set(char, words);
        const pinyin = word.pinyin || '';
        const meanings = word.meanings.length > 0 ? word.meanings : [''];
        searchList.push({
          match: {
            hanzi: char,
            pinyin,
            meanings,
            hskLevel: word.hskLevel,
            radicalIds: entries.map((e) => e.id),
            words,
          },
          normPinyin: stripTone(pinyin),
          meaning: meanings.join(' ').toLowerCase(),
        });
      }
    }
  }

  // Urutkan hanzi per radikal: HSK terkecil dulu, lalu abjad pinyin (tanpa nada)
  for (const list of byRadical.values()) {
    list.sort(
      (a, b) =>
        a.hskLevel - b.hskLevel || stripTone(a.pinyin).localeCompare(stripTone(b.pinyin))
    );
  }

  return { byRadical, radicalsOf, wordsOf, searchList };
}

function getIndex(): RadicalIndex {
  if (!_index) _index = buildIndex();
  return _index;
}

// ── Public API ────────────────────────────────────────────────────────────

/** Semua hanzi dataset yang memakai radikal tertentu. */
export function getHanziForRadical(radicalId: number): HanziRadicalMatch[] {
  return getIndex().byRadical.get(radicalId) || [];
}

/** Jumlah hanzi untuk tiap radikal (untuk badge angka di grid indeks). */
export function getRadicalHanziCount(radicalId: number): number {
  return (getIndex().byRadical.get(radicalId) || []).length;
}

/** Radikal-radikal pembentuk satu karakter (untuk panel detail). */
export function findRadicalsForHanzi(char: string): RadicalEntry[] {
  return getIndex().radicalsOf.get(char) || [];
}

/** Kata-kata dataset yang memuat karakter ini. */
export function getWordsContaining(char: string): ChineseWord[] {
  return getIndex().wordsOf.get(char) || [];
}

export interface ExampleSentence {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

/**
 * Kalimat contoh terbaik untuk satu karakter.
 * Prioritas: kata yang TEPAT berisi karakter ini sebagai kata mandiri
 * (mis. 你 → 你), jika tidak ada, kata pertama yang memuatnya (mis. 么 → 什么).
 */
export function getExampleSentence(char: string): ExampleSentence | null {
  const words = getIndex().wordsOf.get(char) || [];
  const word = words.find((w) => w.hanzi === char) || words[0];
  const s = word?.exampleSentences?.[0];
  return s ? { hanzi: s.hanzi, pinyin: s.pinyin, meaning: s.meaning } : null;
}

export interface RadicalSearchResult {
  /** Radikal yang cocok dengan query (nomor / karakter / arti). */
  radicals: RadicalEntry[];
  /** Hanzi yang cocok dengan query (pinyin / arti Indonesia / karakter). */
  hanziMatches: HanziRadicalMatch[];
}

/** Search dua arah: radikal ↔ hanzi/pinyin/arti. */
export function searchRadicals(rawQuery: string): RadicalSearchResult {
  const q = rawQuery.trim();
  if (!q) return { radicals: [], hanziMatches: [] };
  const idx = getIndex();
  const qNorm = stripTone(q);
  const qLower = q.toLowerCase();

  // 1. Cocokkan radikal: nomor Kangxi, bentuk/varian, arti
  const radicals: RadicalEntry[] = [];
  for (const r of KANGXI_RADICALS) {
    if (
      String(r.id) === q ||
      r.radical.includes(q) ||
      r.variants.some((v) => v.includes(q)) ||
      r.meaning.toLowerCase().includes(qLower) ||
      stripTone(r.pinyin).startsWith(qNorm)
    ) {
      radicals.push(r);
    }
  }

  // 2. Cocokkan hanzi: karakter, pinyin (tonal bebas), arti Indonesia
  const hanziMatches: HanziRadicalMatch[] = [];
  const seen = new Set<string>();
  for (const item of idx.searchList) {
    if (
      item.match.hanzi.includes(q) ||
      (qNorm.length >= 1 && item.normPinyin.startsWith(qNorm)) ||
      item.meaning.includes(qLower)
    ) {
      if (!seen.has(item.match.hanzi)) {
        seen.add(item.match.hanzi);
        hanziMatches.push(item.match);
      }
    }
  }
  hanziMatches.sort((a, b) => a.hskLevel - b.hskLevel);

  return { radicals, hanziMatches: hanziMatches.slice(0, 60) };
}

export interface RadicalStats {
  totalRadicals: number;
  mappedHanzi: number;
  multiRadicalHanzi: number;
}

/** Statistik kecil untuk header view. */
export function getRadicalStats(): RadicalStats {
  const idx = getIndex();
  let multi = 0;
  for (const entries of idx.radicalsOf.values()) {
    if (entries.length > 1) multi += 1;
  }
  return {
    totalRadicals: 214,
    mappedHanzi: idx.radicalsOf.size,
    multiRadicalHanzi: multi,
  };
}
