// ====================================================================
// OmniLife Chinese Arena — Ungkapan Sehari-hari
//
// Frasa Indonesia yang BENAR-BENAR dipakai ngobrol sehari-hari
// (termasuk bahasa gaul) → padanan Mandarin yang natural, bukan
// terjemahan kaku. Setiap entri punya register (gaul/netral/formal)
// dan catatan kapan dipakai, supaya tidak salah konteks.
// ====================================================================

export type ExpressionRegister = 'gaul' | 'netral' | 'formal';

export type ExpressionCategory =
  | 'Sapaan'
  | 'Reaksi'
  | 'Emosi'
  | 'Santai'
  | 'Kampus'
  | 'Makan'
  | 'Belanja'
  | 'Semangat'
  | 'Koleksi Saya';

export interface DailyExpression {
  id: string;
  /** Frasa Indonesia (gaya ngobrol). */
  indo: string;
  hanzi: string;
  pinyin: string;
  /** Arti harfiah kata-per-kata, kalau menarik untuk diketahui. */
  literal?: string;
  register: ExpressionRegister;
  category: ExpressionCategory;
  note?: string;
}

export const EXPRESSION_CATEGORIES: ExpressionCategory[] = [
  'Sapaan',
  'Reaksi',
  'Emosi',
  'Santai',
  'Kampus',
  'Makan',
  'Belanja',
  'Semangat',
];

export const REGISTER_LABEL: Record<ExpressionRegister, string> = {
  gaul: 'Gaul',
  netral: 'Netral',
  formal: 'Formal',
};

export const DAILY_EXPRESSIONS: DailyExpression[] = [
  // ── SAPAAN ────────────────────────────────────────────────────────────
  { id: 'exp_001', indo: 'Hai, apa kabar?', hanzi: '你好，最近怎么样？', pinyin: 'Nǐ hǎo, zuìjìn zěnmeyàng?', register: 'netral', category: 'Sapaan' },
  { id: 'exp_002', indo: 'Sudah lama tidak bertemu!', hanzi: '好久不见！', pinyin: 'Hǎojiǔ bú jiàn!', literal: 'lama tidak melihat', register: 'netral', category: 'Sapaan', note: 'Dipakai ke teman yang lama tak jumpa.' },
  { id: 'exp_003', indo: 'Kamu sedang sibuk apa?', hanzi: '你在忙什么？', pinyin: 'Nǐ zài máng shénme?', register: 'netral', category: 'Sapaan' },
  { id: 'exp_004', indo: 'Mau ke mana?', hanzi: '去哪儿啊？', pinyin: 'Qù nǎr a?', register: 'gaul', category: 'Sapaan', note: 'Sapaan santai antar-teman, bukan pertanyaan serius.' },
  { id: 'exp_005', indo: 'Sudah makan belum?', hanzi: '吃了吗？', pinyin: 'Chī le ma?', register: 'gaul', category: 'Sapaan', note: 'Sapaan akrab khas Tionghoa, mirip "sudah makan?" di Indonesia.' },
  { id: 'exp_006', indo: 'Selamat pagi', hanzi: '早上好', pinyin: 'Zǎoshang hǎo', register: 'netral', category: 'Sapaan' },
  { id: 'exp_007', indo: 'Selamat malam / tidur nyenyak', hanzi: '晚安', pinyin: 'Wǎn\'ān', register: 'netral', category: 'Sapaan', note: 'Ucapan sebelum tidur, bukan "selamat malam" saat bertemu.' },
  { id: 'exp_008', indo: 'Sampai jumpa besok', hanzi: '明天见', pinyin: 'Míngtiān jiàn', register: 'netral', category: 'Sapaan' },
  { id: 'exp_009', indo: 'Hati-hati di jalan', hanzi: '路上小心', pinyin: 'Lùshang xiǎoxīn', register: 'netral', category: 'Sapaan' },
  { id: 'exp_010', indo: 'Lama tak ada kabar', hanzi: '你最近都没消息', pinyin: 'Nǐ zuìjìn dōu méi xiāoxi', register: 'netral', category: 'Sapaan' },
  { id: 'exp_011', indo: 'Ada yang baru?', hanzi: '有什么新鲜事吗？', pinyin: 'Yǒu shénme xīnxiān shì ma?', register: 'netral', category: 'Sapaan' },
  { id: 'exp_012', indo: 'Salam buat keluargamu', hanzi: '替我向你家人问好', pinyin: 'Tì wǒ xiàng nǐ jiārén wènhǎo', register: 'formal', category: 'Sapaan' },
  { id: 'exp_013', indo: 'Senang berkenalan denganmu', hanzi: '很高兴认识你', pinyin: 'Hěn gāoxìng rènshi nǐ', register: 'formal', category: 'Sapaan' },
  { id: 'exp_014', indo: 'Maaf mengganggu waktumu', hanzi: '打扰你了', pinyin: 'Dǎrǎo nǐ le', register: 'formal', category: 'Sapaan' },
  { id: 'exp_015', indo: 'Ayo main kapan-kapan', hanzi: '有空一起玩', pinyin: 'Yǒukòng yìqǐ wán', register: 'gaul', category: 'Sapaan' },

  // ── REAKSI ────────────────────────────────────────────────────────────
  { id: 'exp_016', indo: 'Aduh!', hanzi: '哎呀！', pinyin: 'Āiyā!', register: 'gaul', category: 'Reaksi', note: 'Seruan kaget/kesal, persis seperti "aduh" di Indonesia.' },
  { id: 'exp_017', indo: 'Gila, kok bisa gitu?!', hanzi: '不会吧？！', pinyin: 'Bú huì ba?!', literal: 'tidak mungkin kan?', register: 'gaul', category: 'Reaksi', note: 'Ekspresi tidak percaya — paling sering dipakai anak muda.' },
  { id: 'exp_018', indo: 'Serius?!', hanzi: '真的吗？！', pinyin: 'Zhēn de ma?!', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_019', indo: 'Masa sih?', hanzi: '真的假的？', pinyin: 'Zhēn de jiǎ de?', literal: 'yang asli atau palsu?', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_020', indo: 'Astaga!', hanzi: '天啊！', pinyin: 'Tiān a!', literal: 'langit!', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_021', indo: 'Wow, keren!', hanzi: '哇，太厉害了！', pinyin: 'Wā, tài lìhai le!', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_022', indo: 'Ya ampun', hanzi: '我的天啊', pinyin: 'Wǒ de tiān a', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_023', indo: 'Tega banget!', hanzi: '太过分了！', pinyin: 'Tài guòfèn le!', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_024', indo: 'Beneran nih?', hanzi: '你没骗我吧？', pinyin: 'Nǐ méi piàn wǒ ba?', literal: 'kamu tidak membohongiku kan?', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_025', indo: 'Apa-apaan ini?', hanzi: '这是怎么回事？', pinyin: 'Zhè shì zěnme huí shì?', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_026', indo: 'Jangan bercanda!', hanzi: '别开玩笑了！', pinyin: 'Bié kāi wánxiào le!', register: 'gaul', category: 'Reaksi' },
  { id: 'exp_027', indo: 'Terserah kamu', hanzi: '随你便', pinyin: 'Suí nǐ biàn', register: 'gaul', category: 'Reaksi', note: 'Nada bisa terdengar ketus — pakai ke teman dekat saja.' },
  { id: 'exp_028', indo: 'Oh, begitu', hanzi: '原来如此', pinyin: 'Yuánlái rúcǐ', register: 'netral', category: 'Reaksi', note: 'Paham setelah dijelaskan.' },
  { id: 'exp_029', indo: 'Oke, siap!', hanzi: '好的，没问题！', pinyin: 'Hǎo de, méi wèntí!', register: 'netral', category: 'Reaksi' },
  { id: 'exp_030', indo: 'Siap, laksanakan', hanzi: '收到！', pinyin: 'Shōudào!', literal: 'diterima', register: 'gaul', category: 'Reaksi', note: 'Gaya chat grup kerja/panitia: "oke, dicatat".' },
  { id: 'exp_031', indo: 'Tidak masalah', hanzi: '没关系', pinyin: 'Méi guānxi', register: 'netral', category: 'Reaksi' },
  { id: 'exp_032', indo: 'Tidak apa-apa', hanzi: '没事', pinyin: 'Méi shì', register: 'netral', category: 'Reaksi' },
  { id: 'exp_033', indo: 'Bodo amat', hanzi: '我才不在乎呢', pinyin: 'Wǒ cái bú zàihu ne', register: 'gaul', category: 'Reaksi', note: 'Cukup kuat nadanya, hati-hati pemakaian.' },
  { id: 'exp_034', indo: 'Wih, mantap!', hanzi: '哇，牛！', pinyin: 'Wā, niú!', literal: 'sapi', register: 'gaul', category: 'Reaksi', note: '牛 = slang "hebat/keren" di kalangan anak muda.' },
  { id: 'exp_035', indo: 'Yaudah deh', hanzi: '那好吧', pinyin: 'Nà hǎo ba', register: 'gaul', category: 'Reaksi', note: 'Menerima dengan sedikit berat hati.' },

  // ── EMOSI ─────────────────────────────────────────────────────────────
  { id: 'exp_036', indo: 'Aku senang sekali hari ini', hanzi: '我今天特别开心', pinyin: 'Wǒ jīntiān tèbié kāixīn', register: 'netral', category: 'Emosi' },
  { id: 'exp_037', indo: 'Aku sedih', hanzi: '我很难过', pinyin: 'Wǒ hěn nánguò', register: 'netral', category: 'Emosi' },
  { id: 'exp_038', indo: 'Aku capek banget', hanzi: '我累死了', pinyin: 'Wǒ lèi sǐ le', literal: 'aku capek sampai mati', register: 'gaul', category: 'Emosi' },
  { id: 'exp_039', indo: 'Aku kesal', hanzi: '我很烦', pinyin: 'Wǒ hěn fán', register: 'netral', category: 'Emosi' },
  { id: 'exp_040', indo: 'Aku agak takut', hanzi: '我有点害怕', pinyin: 'Wǒ yǒudiǎn hàipà', register: 'netral', category: 'Emosi' },
  { id: 'exp_041', indo: 'Aku kangen kamu', hanzi: '我想你了', pinyin: 'Wǒ xiǎng nǐ le', register: 'netral', category: 'Emosi' },
  { id: 'exp_042', indo: 'Aku gugup', hanzi: '我很紧张', pinyin: 'Wǒ hěn jǐnzhāng', register: 'netral', category: 'Emosi' },
  { id: 'exp_043', indo: 'Bosan banget', hanzi: '好无聊啊', pinyin: 'Hǎo wúliáo a', register: 'gaul', category: 'Emosi' },
  { id: 'exp_044', indo: 'Aku nggak paham', hanzi: '我搞不懂', pinyin: 'Wǒ gǎo bù dǒng', register: 'gaul', category: 'Emosi' },
  { id: 'exp_045', indo: 'Aku agak malu', hanzi: '我有点不好意思', pinyin: 'Wǒ yǒudiǎn bù hǎoyìsi', register: 'netral', category: 'Emosi' },
  { id: 'exp_046', indo: 'Aku bangga padamu', hanzi: '我为你骄傲', pinyin: 'Wǒ wèi nǐ jiāo\'ào', register: 'formal', category: 'Emosi' },
  { id: 'exp_047', indo: 'Aku kecewa', hanzi: '我太失望了', pinyin: 'Wǒ tài shīwàng le', register: 'netral', category: 'Emosi' },
  { id: 'exp_048', indo: 'Aku lega', hanzi: '我放心了', pinyin: 'Wǒ fàngxīn le', register: 'netral', category: 'Emosi' },
  { id: 'exp_049', indo: 'Aku merasa kesepian', hanzi: '我有点孤单', pinyin: 'Wǒ yǒudiǎn gūdān', register: 'netral', category: 'Emosi' },
  { id: 'exp_050', indo: 'Jangan sedih', hanzi: '别难过了', pinyin: 'Bié nánguò le', register: 'netral', category: 'Emosi' },

  // ── SANTAI ────────────────────────────────────────────────────────────
  { id: 'exp_051', indo: 'Santai aja', hanzi: '放松点', pinyin: 'Fàngsōng diǎn', register: 'gaul', category: 'Santai' },
  { id: 'exp_052', indo: 'Gampang kok', hanzi: '很简单的', pinyin: 'Hěn jiǎndān de', register: 'gaul', category: 'Santai' },
  { id: 'exp_053', indo: 'Nanti aja', hanzi: '等会儿再说', pinyin: 'Děng huìr zài shuō', register: 'gaul', category: 'Santai' },
  { id: 'exp_054', indo: 'Aku lagi malas', hanzi: '我不想动', pinyin: 'Wǒ bù xiǎng dòng', literal: 'aku tidak mau bergerak', register: 'gaul', category: 'Santai' },
  { id: 'exp_055', indo: 'Lagi ngapain?', hanzi: '干嘛呢？', pinyin: 'Gàn ma ne?', register: 'gaul', category: 'Santai' },
  { id: 'exp_056', indo: 'Nggak tau', hanzi: '不知道', pinyin: 'Bù zhīdào', register: 'netral', category: 'Santai' },
  { id: 'exp_057', indo: 'Gimana kalau nanti malam?', hanzi: '晚上怎么样？', pinyin: 'Wǎnshang zěnmeyàng?', register: 'netral', category: 'Santai' },
  { id: 'exp_058', indo: 'Boleh pinjam sebentar?', hanzi: '可以借我用一下吗？', pinyin: 'Kěyǐ jiè wǒ yòng yíxià ma?', register: 'netral', category: 'Santai' },
  { id: 'exp_059', indo: 'Aku traktir', hanzi: '我请客', pinyin: 'Wǒ qǐngkè', register: 'gaul', category: 'Santai' },
  { id: 'exp_060', indo: 'Ayo pergi!', hanzi: '走吧！', pinyin: 'Zǒu ba!', register: 'gaul', category: 'Santai' },
  { id: 'exp_061', indo: 'Jangan lupa ya', hanzi: '别忘了', pinyin: 'Bié wàng le', register: 'netral', category: 'Santai' },
  { id: 'exp_062', indo: 'Nanti kusampaikan', hanzi: '我回头告诉他', pinyin: 'Wǒ huítóu gàosu tā', register: 'netral', category: 'Santai' },
  { id: 'exp_063', indo: 'Tunggu sebentar', hanzi: '等一下', pinyin: 'Děng yíxià', register: 'netral', category: 'Santai' },
  { id: 'exp_064', indo: 'Sudah, cukup', hanzi: '好了，够了', pinyin: 'Hǎo le, gòu le', register: 'netral', category: 'Santai' },
  { id: 'exp_065', indo: 'Kamu gila ya?', hanzi: '你有病吧？', pinyin: 'Nǐ yǒu bìng ba?', literal: 'kamu sedang sakit?', register: 'gaul', category: 'Santai', note: 'Kasar — hanya bercanda dengan teman sangat dekat.' },
  { id: 'exp_066', indo: 'Keren banget, bro!', hanzi: '兄弟，太牛了！', pinyin: 'Xiōngdì, tài niú le!', register: 'gaul', category: 'Santai' },
  { id: 'exp_067', indo: 'Aku jadi baper', hanzi: '我有点动心了', pinyin: 'Wǒ yǒudiǎn dòngxīn le', literal: 'hatiku mulai bergerak', register: 'gaul', category: 'Santai', note: 'Baper romantis; untuk baper sedih pakai 我有点感动.' },
  { id: 'exp_068', indo: 'Nanti kita ngobrol ya', hanzi: '我们回头聊', pinyin: 'Wǒmen huítóu liáo', register: 'gaul', category: 'Santai' },

  // ── KAMPUS ────────────────────────────────────────────────────────────
  { id: 'exp_069', indo: 'Tugasnya sudah selesai?', hanzi: '作业做完了吗？', pinyin: 'Zuòyè zuò wán le ma?', register: 'netral', category: 'Kampus' },
  { id: 'exp_070', indo: 'Besok ada ujian', hanzi: '明天有考试', pinyin: 'Míngtiān yǒu kǎoshì', register: 'netral', category: 'Kampus' },
  { id: 'exp_071', indo: 'Aku belajar di perpustakaan', hanzi: '我在图书馆学习', pinyin: 'Wǒ zài túshūguǎn xuéxí', register: 'netral', category: 'Kampus' },
  { id: 'exp_072', indo: 'Kuliahnya jam berapa?', hanzi: '几点上课？', pinyin: 'Jǐ diǎn shàngkè?', register: 'netral', category: 'Kampus' },
  { id: 'exp_073', indo: 'Dosennya galak', hanzi: '老师很严格', pinyin: 'Lǎoshī hěn yángé', register: 'netral', category: 'Kampus' },
  { id: 'exp_074', indo: 'Boleh pinjam catatanmu?', hanzi: '能借我笔记吗？', pinyin: 'Néng jiè wǒ bǐjì ma?', register: 'netral', category: 'Kampus' },
  { id: 'exp_075', indo: 'Aku belum paham', hanzi: '我还没听懂', pinyin: 'Wǒ hái méi tīngdǒng', register: 'netral', category: 'Kampus' },
  { id: 'exp_076', indo: 'Bisa dijelaskan sekali lagi?', hanzi: '能再解释一遍吗？', pinyin: 'Néng zài jiěshì yí biàn ma?', register: 'formal', category: 'Kampus' },
  { id: 'exp_077', indo: 'Deadline tugasnya kapan?', hanzi: '作业什么时候交？', pinyin: 'Zuòyè shénme shíhou jiāo?', register: 'netral', category: 'Kampus' },
  { id: 'exp_078', indo: 'Aku bolos kelas', hanzi: '我逃课了', pinyin: 'Wǒ táokè le', register: 'gaul', category: 'Kampus' },
  { id: 'exp_079', indo: 'Besok presentasi kelompok', hanzi: '明天小组展示', pinyin: 'Míngtiān xiǎozǔ zhǎnshì', register: 'netral', category: 'Kampus' },
  { id: 'exp_080', indo: 'Nilainya bagus!', hanzi: '成绩不错！', pinyin: 'Chéngjì búcuò!', register: 'netral', category: 'Kampus' },
  { id: 'exp_081', indo: 'Aku harus fokus belajar', hanzi: '我得专心学习', pinyin: 'Wǒ děi zhuānxīn xuéxí', register: 'netral', category: 'Kampus' },
  { id: 'exp_082', indo: 'Ayo belajar bareng', hanzi: '一起学习吧', pinyin: 'Yìqǐ xuéxí ba', register: 'netral', category: 'Kampus' },
  { id: 'exp_083', indo: 'Semoga sukses ujiannya', hanzi: '祝你考试顺利', pinyin: 'Zhù nǐ kǎoshì shùnlì', register: 'formal', category: 'Kampus' },

  // ── MAKAN ─────────────────────────────────────────────────────────────
  { id: 'exp_084', indo: 'Aku lapar banget', hanzi: '我饿死了', pinyin: 'Wǒ è sǐ le', register: 'gaul', category: 'Makan' },
  { id: 'exp_085', indo: 'Mau makan apa?', hanzi: '想吃什么？', pinyin: 'Xiǎng chī shénme?', register: 'netral', category: 'Makan' },
  { id: 'exp_086', indo: 'Pedas banget!', hanzi: '太辣了！', pinyin: 'Tài là le!', register: 'netral', category: 'Makan' },
  { id: 'exp_087', indo: 'Enak banget!', hanzi: '太好吃了！', pinyin: 'Tài hǎochī le!', register: 'netral', category: 'Makan' },
  { id: 'exp_088', indo: 'Aku kenyang', hanzi: '我吃饱了', pinyin: 'Wǒ chībǎo le', register: 'netral', category: 'Makan' },
  { id: 'exp_089', indo: 'Porsinya besar', hanzi: '分量很大', pinyin: 'Fènliàng hěn dà', register: 'netral', category: 'Makan' },
  { id: 'exp_090', indo: 'Aku tidak makan daging', hanzi: '我不吃肉', pinyin: 'Wǒ bù chī ròu', register: 'netral', category: 'Makan' },
  { id: 'exp_091', indo: 'Tolong air putih', hanzi: '请给我白开水', pinyin: 'Qǐng gěi wǒ báikāishuǐ', register: 'formal', category: 'Makan' },
  { id: 'exp_092', indo: 'Tambah nasi satu', hanzi: '再加一碗饭', pinyin: 'Zài jiā yì wǎn fàn', register: 'netral', category: 'Makan' },
  { id: 'exp_093', indo: 'Aku traktir makan siang', hanzi: '我请你吃午饭', pinyin: 'Wǒ qǐng nǐ chī wǔfàn', register: 'netral', category: 'Makan' },
  { id: 'exp_094', indo: 'Jangan pedas ya', hanzi: '不要辣', pinyin: 'Bú yào là', register: 'netral', category: 'Makan' },
  { id: 'exp_095', indo: 'Rasanya agak aneh', hanzi: '这个味道有点怪', pinyin: 'Zhège wèidào yǒudiǎn guài', register: 'gaul', category: 'Makan' },

  // ── BELANJA ───────────────────────────────────────────────────────────
  { id: 'exp_096', indo: 'Berapa harganya?', hanzi: '多少钱？', pinyin: 'Duōshao qián?', register: 'netral', category: 'Belanja' },
  { id: 'exp_097', indo: 'Mahal banget!', hanzi: '太贵了！', pinyin: 'Tài guì le!', register: 'netral', category: 'Belanja' },
  { id: 'exp_098', indo: 'Bisa kurang?', hanzi: '能便宜点吗？', pinyin: 'Néng piányi diǎn ma?', register: 'gaul', category: 'Belanja', note: 'Standar saat nawar di pasar.' },
  { id: 'exp_099', indo: 'Aku cuma lihat-lihat', hanzi: '我随便看看', pinyin: 'Wǒ suíbiàn kànkan', register: 'netral', category: 'Belanja' },
  { id: 'exp_100', indo: 'Aku mau beli ini', hanzi: '我要买这个', pinyin: 'Wǒ yào mǎi zhège', register: 'netral', category: 'Belanja' },
  { id: 'exp_101', indo: 'Ada ukuran lain?', hanzi: '有别的尺码吗？', pinyin: 'Yǒu bié de chǐmǎ ma?', register: 'netral', category: 'Belanja' },
  { id: 'exp_102', indo: 'Bisa bayar QRIS?', hanzi: '可以扫码支付吗？', pinyin: 'Kěyǐ sǎo mǎ zhīfù ma?', literal: 'bisa bayar dengan scan kode?', register: 'netral', category: 'Belanja' },
  { id: 'exp_103', indo: 'Diskonnya berapa?', hanzi: '打几折？', pinyin: 'Dǎ jǐ zhé?', register: 'netral', category: 'Belanja', note: '打折 di Tiongkok: 打八折 = diskon 20% (bayar 80%).' },
  { id: 'exp_104', indo: 'Aku bayar tunai', hanzi: '我付现金', pinyin: 'Wǒ fù xiànjīn', register: 'netral', category: 'Belanja' },
  { id: 'exp_105', indo: 'Bungkus ya', hanzi: '打包', pinyin: 'Dǎbāo', register: 'netral', category: 'Belanja', note: 'Untuk makanan dibungkus pulang.' },

  // ── SEMANGAT ──────────────────────────────────────────────────────────
  { id: 'exp_106', indo: 'Semangat!', hanzi: '加油！', pinyin: 'Jiāyóu!', literal: 'tambah oli', register: 'netral', category: 'Semangat', note: 'Seruan penyemangat paling umum — dipakai untuk apa saja.' },
  { id: 'exp_107', indo: 'Kamu pasti bisa!', hanzi: '你一定行！', pinyin: 'Nǐ yídìng xíng!', register: 'netral', category: 'Semangat' },
  { id: 'exp_108', indo: 'Jangan menyerah', hanzi: '别放弃', pinyin: 'Bié fàngqì', register: 'netral', category: 'Semangat' },
  { id: 'exp_109', indo: 'Pelan-pelan saja', hanzi: '慢慢来', pinyin: 'Mànman lái', register: 'netral', category: 'Semangat' },
  { id: 'exp_110', indo: 'Sudah bagus, tinggal sedikit lagi', hanzi: '已经很好了，就差一点', pinyin: 'Yǐjīng hěn hǎo le, jiù chà yìdiǎn', register: 'netral', category: 'Semangat' },
  { id: 'exp_111', indo: 'Pertahankan!', hanzi: '继续保持！', pinyin: 'Jìxù bǎochí!', register: 'formal', category: 'Semangat' },
  { id: 'exp_112', indo: 'Hati-hati ya', hanzi: '小心点', pinyin: 'Xiǎoxīn diǎn', register: 'netral', category: 'Semangat' },
  { id: 'exp_113', indo: 'Semoga berhasil!', hanzi: '祝你好运！', pinyin: 'Zhù nǐ hǎoyùn!', register: 'netral', category: 'Semangat' },
  { id: 'exp_114', indo: 'Kamu hebat!', hanzi: '你真棒！', pinyin: 'Nǐ zhēn bàng!', register: 'netral', category: 'Semangat' },
  { id: 'exp_115', indo: 'Ayo, jangan malas!', hanzi: '快点，别偷懒！', pinyin: 'Kuài diǎn, bié tōulǎn!', register: 'gaul', category: 'Semangat' },
  { id: 'exp_116', indo: 'Tenang saja', hanzi: '别担心', pinyin: 'Bié dānxīn', register: 'netral', category: 'Semangat' },
  { id: 'exp_117', indo: 'Istirahat dulu', hanzi: '先休息一下', pinyin: 'Xiān xiūxi yíxià', register: 'netral', category: 'Semangat' },
  { id: 'exp_118', indo: 'Besok pasti lebih baik', hanzi: '明天会更好', pinyin: 'Míngtiān huì gèng hǎo', register: 'netral', category: 'Semangat' },
  { id: 'exp_119', indo: 'Aku percaya padamu', hanzi: '我相信你', pinyin: 'Wǒ xiāngxìn nǐ', register: 'netral', category: 'Semangat' },
  { id: 'exp_120', indo: 'Terima kasih banyak', hanzi: '太感谢你了', pinyin: 'Tài gǎnxiè nǐ le', register: 'netral', category: 'Semangat' },
];
