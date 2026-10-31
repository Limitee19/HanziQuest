// ====================================================================
// OmniLife Chinese — Program Harian: Urutan Kurikulum Pedagogis
//
// Menentukan KATA BARU mana yang diperkenalkan lebih dulu oleh mesin
// Program Harian. HSK 1 diurut MANUAL (bertahan hidup dulu: pronomina,
// ya/tidak, angka, terima kasih → verba inti 是 有 吃 喝 去 会 能 →
// nomina → adjektiva → partikel paling akhir). HSK 2–3 diurut otomatis
// per level lalu FREQUENCY_RANK (kata frekuensi tinggi lebih dulu),
// sisanya urut id agar deterministik.
// ====================================================================
import { FULL_HSK_DATASET } from '@/services/chinese/chineseDataset';

// ── Tipe ────────────────────────────────────────────────────────────────

export interface CurriculumEntry {
  wordId: string;
  /** 0 = kata pertama yang wajib dikuasai. Naik monoton. */
  orderIndex: number;
}

// ── HSK 1: urutan manual (bertahan hidup dulu) ──────────────────────────

/**
 * Urutan pedagogis HSK 1. Hanya daftar "kerangka" — kata HSK 1 yang tidak
 * ada di daftar ini otomatis ditambahkan di belakang, dikelompokkan per
 * kelas kata (POS_FALLBACK di bawah) lalu urut id, sehingga SEMUA kata
 * HSK 1 tetap tercakup tanpa daftar 150 entri manual.
 */
const HSK1_PEDAGOGICAL_ORDER: string[] = [
  // 1) Pronomina + sapaan dasar
  '你', '我', '他', '她', '好', '再见', '谢谢', '不客气', '没什么', '请', '喂',
  // 2) Ya / tidak / ada
  '是', '不', '没有',
  // 3) Angka 1–10 + satuan dasar
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  // 4) Kata tanya inti
  '什么', '谁', '哪', '那儿', '多少', '几', '怎么', '怎么样',
  // 5) Waktu Dan tanggal
  '点', '分', '分钟', '号', '日', '月', '年', '岁', '星期',
  '今天', '明天', '昨天', '现在', '时候', '上午', '下午', '中午',
  // 6) Verba inti
  '有', '吃', '喝', '去', '来', '回', '会', '能', '想', '喜欢',
  '叫', '住', '在', '学习', '看', '看见', '听', '说话', '写', '做',
  '打电话', '睡觉', '工作', '买', '骑', '踢', '坐', '开', '认', '上课',
  // 7) Orang Dan keluarga
  '人', '名字', '爸爸', '妈妈', '老师', '学生', '同学', '朋友',
  '儿子', '女儿', '先生', '小姐', '医生',
  // 8) Nomina sehari-hari
  '家', '学校', '商店', '医院', '中国', '北京', '汉语',
  '房间', '桌子', '椅子', '书', '字', '课', '菜', '饭', '米饭', '茶',
  '水', '苹果', '猫', '狗', '衣服', '杯子', '电脑', '电视', '电影',
  '块', '天气', '飞机', '出租车', '前面', '后面', '里面', '下面', '上', '下',
  // 9) Adjektiva
  '大', '小', '多', '漂亮', '高兴', '冷', '热',
  // 10) Adverbia Dan konjungsi
  '很', '都', '太', '和',
  // 11) Partikel Dan kata bantu — paling akhir (abstrak)
  '的', '了', '个', '本', '一点儿',
];

/** Prioritas kelas kata untuk sisa kata HSK 1 yang tidak ada di daftar atas. */
const POS_FALLBACK: Record<string, number> = {
  pronomina: 1,
  ucapan: 2,
  tanya: 3,
  numeral: 4,
  verba: 5,
  nomina: 6,
  adjektiva: 7,
  adverbia: 8,
  konjungsi: 9,
  partikel: 10,
  'kata bantu': 10,
};

function hsk1Rank(word: { hanzi: string; partOfSpeech?: string; id: string }): number {
  const idx = HSK1_PEDAGOGICAL_ORDER.indexOf(word.hanzi);
  if (idx >= 0) return idx; // 0..N — di depan
  const pos = (word.partOfSpeech || '').split('/')[0].trim();
  const bucket = POS_FALLBACK[pos] ?? 12;
  // Sesudah seluruh daftar manual (panjang daftar + offset per bucket).
  return HSK1_PEDAGOGICAL_ORDER.length + bucket * 1000 + word.id.length * 0 + hashId(word.id);
}

/** Hash kecil deterministik agar sisa kata berurutan stabil tapi tercampur per bucket. */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h;
}

// ── HSK 2–3: peringkat frekuensi statis ─────────────────────────────────

/**
 * ±80 kata frekuensi tertinggi dari HSK 2–3 (berdasar frekuensi korpus
 * umum). Kata yang ada di daftar ini muncul lebih dulu dalam kurikulum;
 * sisanya urut id. Hanzi yang tidak ada di dataset diabaikan saja.
 */
const FREQUENCY_RANK: string[] = [
  '可以', '需要', '应该', '知道', '认为', '可能', '对', '找到', '帮', '帮忙',
  '担心', '放心', '然后', '因为', '但是', '如果', '虽然', '也许', '或者', '一直',
  '已经', '一起', '总是', '正在', '最', '最后', '越来越', '特别', '一定', '其实',
  '感觉', '明白', '懂', '同意', '决定', '打算', '准备', '练习', '复习', '预习',
  '考试', '借', '还', '拿', '放', '洗', '跑', '容易', '难', '快',
  '慢', '忙', '累', '饿', '渴', '健康', '舒服', '安静', '认真', '努力',
  '热情', '正确', '快乐', '便宜', '可爱', '身体', '眼睛', '颜色', '生日', '音乐',
  '运动', '手机', '银行', '超市', '水果', '面包', '世界', '地球', '太阳', '照片',
  '自行车', '地铁', '地图', '地址', '历史', '文化', '机会', '计划', '习惯', '经验',
];

const FREQUENCY_INDEX = new Map(FREQUENCY_RANK.map((h, i) => [h, i]));

// ── API utama ───────────────────────────────────────────────────────────

let orderCache: CurriculumEntry[] | null = null;

/**
 * Urutan belajar penuh HSK 1–3. Hasil di-cache (dataset statis) sehingga
 * aman dipanggil tiap render/plan tanpa sort ulang.
 */
export function getCurriculumOrder(): CurriculumEntry[] {
  if (orderCache) return orderCache;

  const candidates = FULL_HSK_DATASET.filter(
    (w) => w.hskLevel >= 1 && w.hskLevel <= 3 && w.hanzi && w.pinyin
  );

  const sorted = [...candidates].sort((a, b) => {
    // Level naik dulu (HSK 1 → 2 → 3).
    if (a.hskLevel !== b.hskLevel) return a.hskLevel - b.hskLevel;
    if (a.hskLevel === 1) {
      const ra = hsk1Rank(a);
      const rb = hsk1Rank(b);
      if (ra !== rb) return ra - rb;
    } else {
      const fa = FREQUENCY_INDEX.get(a.hanzi);
      const fb = FREQUENCY_INDEX.get(b.hanzi);
      if (fa !== undefined && fb !== undefined && fa !== fb) return fa - fb;
      if (fa !== undefined) return -1;
      if (fb !== undefined) return 1;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  orderCache = sorted.map((w, i) => ({ wordId: w.id, orderIndex: i }));
  return orderCache;
}

/** Kata dataset berdasarkan id — dipakai mesin program untuk render kartu. */
export function getCurriculumWord(wordId: string) {
  return FULL_HSK_DATASET.find((w) => w.id === wordId) || null;
}
