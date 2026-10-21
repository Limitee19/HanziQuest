/**
 * Tabel 214 Radikal Kangxi (康熙部首)
 * ─────────────────────────────────────
 * Indeks resmi radikal bahasa Mandarin, dikelompokkan per jumlah goresan.
 * `variants` mencantumkan bentuk-bentuk yang muncul saat radikal dipakai
 * sebagai komponen (mis. 水 → 氵 di sisi kiri, 心 → 忄).
 * `id` = nomor urut Kangxi 1–214. Beberapa radikal tradisional punya bentuk
 * sederhana (simplified) yang dicantumkan di `variants` agar terdeteksi juga.
 */

export interface RadicalEntry {
  id: number; // Nomor Kangxi 1–214
  radical: string; // Bentuk utama
  variants: string[]; // Bentuk varian / simplified sebagai komponen
  strokes: number; // Jumlah goresan radikal
  meaning: string; // Arti singkat Bahasa Indonesia
  pinyin: string; // Bacaan radikal
  /** Petunjuk semantik: "medan makna" radikal sebagai komponen (terkurasi). */
  semanticHint?: string;
}

export const KANGXI_RADICALS: RadicalEntry[] = [
  // ── 1 goresan ──
  { id: 1, radical: '一', variants: [], strokes: 1, meaning: 'satu', pinyin: 'yī', semanticHint: 'angka, urutan, dan garis dasar — sering muncul di karakter tentang hitungan dan tingkatan' },
  { id: 2, radical: '丨', variants: [], strokes: 1, meaning: 'garis vertikal', pinyin: 'gǔn' },
  { id: 3, radical: '丶', variants: [], strokes: 1, meaning: 'titik', pinyin: 'zhǔ' },
  { id: 4, radical: '丿', variants: [], strokes: 1, meaning: 'garis miring', pinyin: 'piě' },
  { id: 5, radical: '乙', variants: [], strokes: 1, meaning: 'kedua / lengkung', pinyin: 'yǐ' },
  { id: 6, radical: '亅', variants: [], strokes: 1, meaning: 'kait vertikal', pinyin: 'jué' },

  // ── 2 goresan ──
  { id: 7, radical: '二', variants: [], strokes: 2, meaning: 'dua', pinyin: 'èr' },
  { id: 8, radical: '亠', variants: [], strokes: 2, meaning: 'tudung atas', pinyin: 'tóu' },
  { id: 9, radical: '人', variants: ['亻'], strokes: 2, meaning: 'manusia', pinyin: 'rén', semanticHint: 'karakter dengan radikal ini hampir selalu berkaitan dengan orang — peran, profesi, dan tindakan manusia: 他 (dia), 你 (kamu), 住 (tinggal), 作 (bekerja)' },
  { id: 10, radical: '儿', variants: ['兀'], strokes: 2, meaning: 'anak / kaki', pinyin: 'rén', semanticHint: 'kaki berjalan di bawah karakter — gerakan dan posisi kaki' },
  { id: 11, radical: '入', variants: [], strokes: 2, meaning: 'masuk', pinyin: 'rù' },
  { id: 12, radical: '八', variants: [], strokes: 2, meaning: 'delapan', pinyin: 'bā' },
  { id: 13, radical: '冂', variants: [], strokes: 2, meaning: 'batas luar', pinyin: 'jiōng' },
  { id: 14, radical: '冖', variants: [], strokes: 2, meaning: 'tudung', pinyin: 'mì' },
  { id: 15, radical: '冫', variants: [], strokes: 2, meaning: 'es / dingin', pinyin: 'bīng' },
  { id: 16, radical: '几', variants: [], strokes: 2, meaning: 'meja kecil', pinyin: 'jī' },
  { id: 17, radical: '凵', variants: [], strokes: 2, meaning: 'wadah terbuka', pinyin: 'qū' },
  { id: 18, radical: '刀', variants: ['刂'], strokes: 2, meaning: 'pisau', pinyin: 'dāo', semanticHint: 'memotong, membagi, atau ketajaman' },
  { id: 19, radical: '力', variants: [], strokes: 2, meaning: 'kekuatan', pinyin: 'lì', semanticHint: 'usaha, energi, dan hasil kerja — 动 (bergerak), 加 (menambah)' },
  { id: 20, radical: '勹', variants: [], strokes: 2, meaning: 'pembungkus', pinyin: 'bāo' },
  { id: 21, radical: '匕', variants: [], strokes: 2, meaning: 'sendok / belati', pinyin: 'bǐ' },
  { id: 22, radical: '匚', variants: [], strokes: 2, meaning: 'kotak terbuka', pinyin: 'fāng' },
  { id: 23, radical: '匸', variants: [], strokes: 2, meaning: 'persembunyian', pinyin: 'xì' },
  { id: 24, radical: '十', variants: [], strokes: 2, meaning: 'sepuluh', pinyin: 'shí', semanticHint: 'angka dan kelengkapan; sering jadi komponen hitungan' },
  { id: 25, radical: '卜', variants: [], strokes: 2, meaning: 'peramal', pinyin: 'bǔ' },
  { id: 26, radical: '卩', variants: [], strokes: 2, meaning: 'segel', pinyin: 'jié' },
  { id: 27, radical: '厂', variants: [], strokes: 2, meaning: 'tebing / pabrik', pinyin: 'hǎn' },
  { id: 28, radical: '厶', variants: [], strokes: 2, meaning: 'pribadi', pinyin: 'sī' },
  { id: 29, radical: '又', variants: [], strokes: 2, meaning: 'tangan kanan / lagi', pinyin: 'yòu', semanticHint: 'aksi tangan dan pengulangan — 分 (membagi), 对 (benar), 欢 (gembira)' },

  // ── 3 goresan ──
  { id: 30, radical: '口', variants: [], strokes: 3, meaning: 'mulut', pinyin: 'kǒu', semanticHint: 'mulut membuka banyak makna: berbicara (叫, 唱), makan-minum (吃, 喝), bunyi dan nama barang berkotak (号, 员)' },
  { id: 31, radical: '囗', variants: [], strokes: 3, meaning: 'pagar / batas', pinyin: 'wéi' },
  { id: 32, radical: '土', variants: [], strokes: 3, meaning: 'tanah', pinyin: 'tǔ', semanticHint: 'tanah, tempat, dan hal fisik-material — 地 (tanah), 场 (tempat)' },
  { id: 33, radical: '士', variants: [], strokes: 3, meaning: 'sarjana', pinyin: 'shì' },
  { id: 34, radical: '夂', variants: [], strokes: 3, meaning: 'pergi lambat', pinyin: 'zhǐ' },
  { id: 35, radical: '夊', variants: [], strokes: 3, meaning: 'pergi lambat', pinyin: 'suī' },
  { id: 36, radical: '夕', variants: [], strokes: 3, meaning: 'petang', pinyin: 'xī' },
  { id: 37, radical: '大', variants: [], strokes: 3, meaning: 'besar', pinyin: 'dà', semanticHint: 'ukuran, derajat, dan manusia dewasa — 太, 夫, 天' },
  { id: 38, radical: '女', variants: [], strokes: 3, meaning: 'perempuan', pinyin: 'nǚ', semanticHint: 'perempuan dan hubungan keluarga — 妈 (ibu), 她 (dia, perempuan), 姐 (kakak perempuan), 好 (perempuan+anak = baik)' },
  { id: 39, radical: '子', variants: [], strokes: 3, meaning: 'anak', pinyin: 'zǐ' },
  { id: 40, radical: '宀', variants: [], strokes: 3, meaning: 'atap rumah', pinyin: 'mián', semanticHint: 'atap di atas kepala: rumah, keluarga, dan rasa aman — 家 (rumah), 完 (selesai/utuh), 实 (nyata)' },
  { id: 41, radical: '寸', variants: [], strokes: 3, meaning: 'jengkal', pinyin: 'cùn' },
  { id: 42, radical: '小', variants: ['⺌'], strokes: 3, meaning: 'kecil', pinyin: 'xiǎo', semanticHint: 'ukuran kecil dan detail — 少 (sedikit), 尔 (kamu, bentuk lama)' },
  { id: 43, radical: '尢', variants: ['兀'], strokes: 3, meaning: 'lumpuh', pinyin: 'wāng' },
  { id: 44, radical: '尸', variants: [], strokes: 3, meaning: 'mayat', pinyin: 'shī' },
  { id: 45, radical: '屮', variants: [], strokes: 3, meaning: 'tunas', pinyin: 'chè' },
  { id: 46, radical: '山', variants: [], strokes: 3, meaning: 'gunung', pinyin: 'shān' },
  { id: 47, radical: '巛', variants: ['川'], strokes: 3, meaning: 'aliran sungai', pinyin: 'chuān' },
  { id: 48, radical: '工', variants: [], strokes: 3, meaning: 'kerja', pinyin: 'gōng', semanticHint: 'kerja tangan, alat, dan keterampilan' },
  { id: 49, radical: '己', variants: [], strokes: 3, meaning: 'diri sendiri', pinyin: 'jǐ' },
  { id: 50, radical: '巾', variants: [], strokes: 3, meaning: 'kain', pinyin: 'jīn' },
  { id: 51, radical: '干', variants: [], strokes: 3, meaning: 'kering / perisai', pinyin: 'gān' },
  { id: 52, radical: '幺', variants: [], strokes: 3, meaning: 'kecil-kecil', pinyin: 'yāo' },
  { id: 53, radical: '广', variants: [], strokes: 3, meaning: 'rumah tunggal', pinyin: 'guǎng', semanticHint: 'bangunan dan tempat luas — 店 (toko), 应 (menjawab)' },
  { id: 54, radical: '廴', variants: [], strokes: 3, meaning: 'langkah panjang', pinyin: 'yǐn' },
  { id: 55, radical: '廾', variants: [], strokes: 3, meaning: 'dua tangan', pinyin: 'gǒng' },
  { id: 56, radical: '弋', variants: [], strokes: 3, meaning: 'panah bidik', pinyin: 'yì' },
  { id: 57, radical: '弓', variants: [], strokes: 3, meaning: 'busur', pinyin: 'gōng' },
  { id: 58, radical: '彐', variants: ['彑'], strokes: 3, meaning: 'moncong babi', pinyin: 'jì' },
  { id: 59, radical: '彡', variants: [], strokes: 3, meaning: 'rambut / pola', pinyin: 'shān' },
  { id: 60, radical: '彳', variants: [], strokes: 3, meaning: 'langkah kecil', pinyin: 'chì' },

  // ── 4 goresan ──
  { id: 61, radical: '心', variants: ['忄', '⺗'], strokes: 4, meaning: 'hati / pikiran', pinyin: 'xīn', semanticHint: 'hati = perasaan dan pikiran: 忘 (lupa), 快 (senang), 想 (pikir/rindu), 慢 (lambat)' },
  { id: 62, radical: '戈', variants: [], strokes: 4, meaning: 'senjata / golok', pinyin: 'gē', semanticHint: 'senjata dan konflik — 我 (saya, tangan memegang senjata), 找 (mencari)' },
  { id: 63, radical: '戶', variants: ['户', '戸'], strokes: 4, meaning: 'pintu rumah', pinyin: 'hù' },
  { id: 64, radical: '手', variants: ['扌', '龵'], strokes: 4, meaning: 'tangan', pinyin: 'shǒu', semanticHint: 'segala aksi tangan: 打 (memukul/tekan), 找 (mencari), 拿 (mengambil), 把 (memegang), 拍 (menepuk)' },
  { id: 65, radical: '支', variants: [], strokes: 4, meaning: 'cabang', pinyin: 'zhī' },
  { id: 66, radical: '攴', variants: ['攵'], strokes: 4, meaning: 'pukulan', pinyin: 'pū' },
  { id: 67, radical: '文', variants: [], strokes: 4, meaning: 'tulisan / sastra', pinyin: 'wén' },
  { id: 68, radical: '斗', variants: [], strokes: 4, meaning: 'takaran', pinyin: 'dǒu' },
  { id: 69, radical: '斤', variants: [], strokes: 4, meaning: 'kapak', pinyin: 'jīn' },
  { id: 70, radical: '方', variants: [], strokes: 4, meaning: 'persegi / arah', pinyin: 'fāng' },
  { id: 71, radical: '无', variants: [], strokes: 4, meaning: 'tanpa', pinyin: 'wú' },
  { id: 72, radical: '日', variants: [], strokes: 4, meaning: 'matahari / hari', pinyin: 'rì', semanticHint: 'matahari dan waktu: 明 (terang), 晴 (cerah), 早 (pagi), 星 (bintang), 昨 (kemarin), 时 (waktu)' },
  { id: 73, radical: '曰', variants: [], strokes: 4, meaning: 'berkata', pinyin: 'yuē', semanticHint: 'ucapan yang tertulis; sering tertukar dengan 日 — perhatikan proporsinya' },
  { id: 74, radical: '月', variants: ['⺼'], strokes: 4, meaning: 'bulan / daging', pinyin: 'yuè', semanticHint: 'dua wajah: bulan dan waktu (明, 月) ATAU daging/tubuh (脑 otak, 腿 paha, 脸 muka) — cek konteksnya' },
  { id: 75, radical: '木', variants: [], strokes: 4, meaning: 'kayu / pohon', pinyin: 'mù', semanticHint: 'pohon, kayu, dan barang dari kayu: 树 (pohon), 林 (hutan), 桥 (jembatan), 桌 (meja), 机 (mesin, awalnya kolar kayu)' },
  { id: 76, radical: '欠', variants: [], strokes: 4, meaning: 'kekurangan', pinyin: 'qiàn' },
  { id: 77, radical: '止', variants: [], strokes: 4, meaning: 'berhenti', pinyin: 'zhǐ' },
  { id: 78, radical: '歹', variants: ['歺'], strokes: 4, meaning: 'jahat / kematian', pinyin: 'dǎi' },
  { id: 79, radical: '殳', variants: [], strokes: 4, meaning: 'tombak', pinyin: 'shū' },
  { id: 80, radical: '毋', variants: ['母'], strokes: 4, meaning: 'jangan / ibu', pinyin: 'wú' },
  { id: 81, radical: '比', variants: [], strokes: 4, meaning: 'membandingkan', pinyin: 'bǐ' },
  { id: 82, radical: '毛', variants: [], strokes: 4, meaning: 'rambut / bulu', pinyin: 'máo' },
  { id: 83, radical: '氏', variants: [], strokes: 4, meaning: 'marga', pinyin: 'shì' },
  { id: 84, radical: '气', variants: [], strokes: 4, meaning: 'udara / napas', pinyin: 'qì' },
  { id: 85, radical: '水', variants: ['氵', '氺'], strokes: 4, meaning: 'air', pinyin: 'shuǐ', semanticHint: 'air dan cairan: 河 (sungai), 海 (laut), 洗 (cuci), 游 (berenang), 汽 (uap)' },
  { id: 86, radical: '火', variants: ['灬'], strokes: 4, meaning: 'api', pinyin: 'huǒ', semanticHint: 'api, panas, dan cahaya — 灯 (lampu), 烧 (membakar), 热 (panas)' },
  { id: 87, radical: '爪', variants: ['爫'], strokes: 4, meaning: 'cakar', pinyin: 'zhǎo' },
  { id: 88, radical: '父', variants: [], strokes: 4, meaning: 'ayah', pinyin: 'fù' },
  { id: 89, radical: '爻', variants: [], strokes: 4, meaning: 'garis ramal', pinyin: 'yáo' },
  { id: 90, radical: '爿', variants: [], strokes: 4, meaning: 'belahan kayu', pinyin: 'qiáng' },
  { id: 91, radical: '片', variants: [], strokes: 4, meaning: 'keping / potongan', pinyin: 'piàn' },
  { id: 92, radical: '牙', variants: [], strokes: 4, meaning: 'gigi', pinyin: 'yá' },
  { id: 93, radical: '牛', variants: ['牜'], strokes: 4, meaning: 'sapi / lembu', pinyin: 'niú', semanticHint: 'hewan ternak dan kekuatan kerja' },
  { id: 94, radical: '犬', variants: ['犭'], strokes: 4, meaning: 'anjing', pinyin: 'quǎn', semanticHint: 'hewan — 猫 (kucing), 狗 (anjing), 猪 (babi), 猴 (monyet): ciri binatang, bukan manusia' },

  // ── 5 goresan ──
  { id: 95, radical: '玄', variants: [], strokes: 5, meaning: 'gelap / misterius', pinyin: 'xuán' },
  { id: 96, radical: '玉', variants: ['王', '⺩'], strokes: 5, meaning: 'giok / permata', pinyin: 'yù', semanticHint: 'batu permata dan hal berharga — 球 (bola, batu bulat), 现 (masa kini)' },
  { id: 97, radical: '瓜', variants: [], strokes: 5, meaning: 'melon', pinyin: 'guā' },
  { id: 98, radical: '瓦', variants: [], strokes: 5, meaning: 'genteng', pinyin: 'wǎ' },
  { id: 99, radical: '甘', variants: [], strokes: 5, meaning: 'manis', pinyin: 'gān' },
  { id: 100, radical: '生', variants: [], strokes: 5, meaning: 'lahir / hidup', pinyin: 'shēng' },
  { id: 101, radical: '用', variants: [], strokes: 5, meaning: 'memakai', pinyin: 'yòng' },
  { id: 102, radical: '田', variants: [], strokes: 5, meaning: 'sawah / ladang', pinyin: 'tián', semanticHint: 'ladang, wilayah, dan kotak-kotak terbagi — 里, 界' },
  { id: 103, radical: '疋', variants: ['⺪'], strokes: 5, meaning: 'kain gulungan', pinyin: 'pǐ' },
  { id: 104, radical: '疒', variants: [], strokes: 5, meaning: 'sakit / penyakit', pinyin: 'chuáng' },
  { id: 105, radical: '癶', variants: [], strokes: 5, meaning: 'kaki menolak', pinyin: 'bō' },
  { id: 106, radical: '白', variants: [], strokes: 5, meaning: 'putih', pinyin: 'bái' },
  { id: 107, radical: '皮', variants: [], strokes: 5, meaning: 'kulit', pinyin: 'pí' },
  { id: 108, radical: '皿', variants: [], strokes: 5, meaning: 'piring / wadah', pinyin: 'mǐn' },
  { id: 109, radical: '目', variants: ['罒'], strokes: 5, meaning: 'mata', pinyin: 'mù', semanticHint: 'mata dan melihat: 看 (lihat), 眼 (mata), 睡 (tidur, mata turun), 相 (saling/pandang)' },
  { id: 110, radical: '矛', variants: [], strokes: 5, meaning: 'tombak', pinyin: 'máo' },
  { id: 111, radical: '矢', variants: [], strokes: 5, meaning: 'panah', pinyin: 'shǐ' },
  { id: 112, radical: '石', variants: [], strokes: 5, meaning: 'batu', pinyin: 'shí' },
  { id: 113, radical: '示', variants: ['礻'], strokes: 5, meaning: 'altar / pertanda', pinyin: 'shì', semanticHint: 'ritual dan penanda: 视 (menonton), 礼 (sopan)' },
  { id: 114, radical: '禸', variants: [], strokes: 5, meaning: 'telapak binatang', pinyin: 'róu' },
  { id: 115, radical: '禾', variants: [], strokes: 5, meaning: 'padi / biji-bijian', pinyin: 'hé' },
  { id: 116, radical: '穴', variants: [], strokes: 5, meaning: 'gua / lubang', pinyin: 'xué' },
  { id: 117, radical: '立', variants: [], strokes: 5, meaning: 'berdiri', pinyin: 'lì', semanticHint: 'berdiri, didirikan, dan posisi tegak' },

  // ── 6 goresan ──
  { id: 118, radical: '竹', variants: ['⺮'], strokes: 6, meaning: 'bambu', pinyin: 'zhú', semanticHint: 'bambu: alat tulis kuno dan barang anyaman — 笔 (pulpen), 第 (urutan)' },
  { id: 119, radical: '米', variants: [], strokes: 6, meaning: 'beras', pinyin: 'mǐ' },
  { id: 120, radical: '糸', variants: ['纟', '糹'], strokes: 6, meaning: 'benang / sutra', pinyin: 'sī', semanticHint: 'benang dan hasil kerja halus: 级 (tingkat), 纸 (kertas), 练 (latihan), 绿 (hijau)' },
  { id: 121, radical: '缶', variants: [], strokes: 6, meaning: 'tempayan', pinyin: 'fǒu' },
  { id: 122, radical: '网', variants: ['罒', '罓'], strokes: 6, meaning: 'jaring', pinyin: 'wǎng' },
  { id: 123, radical: '羊', variants: ['⺷'], strokes: 6, meaning: 'kambing', pinyin: 'yáng' },
  { id: 124, radical: '羽', variants: [], strokes: 6, meaning: 'bulu / sayap', pinyin: 'yǔ' },
  { id: 125, radical: '老', variants: ['耂'], strokes: 6, meaning: 'tua', pinyin: 'lǎo', semanticHint: 'orang tua dan senioritas — 老 (tua), 者 (orang yang...)' },
  { id: 126, radical: '而', variants: [], strokes: 6, meaning: 'janggot / dan', pinyin: 'ér' },
  { id: 127, radical: '耒', variants: [], strokes: 6, meaning: 'bajak', pinyin: 'lěi' },
  { id: 128, radical: '耳', variants: [], strokes: 6, meaning: 'telinga', pinyin: 'ěr', semanticHint: 'telinga dan mendengar — 闻 (mencium/dengar), 聪 (pintar, telinga jernih)' },
  { id: 129, radical: '聿', variants: [], strokes: 6, meaning: 'kuas', pinyin: 'yù' },
  { id: 130, radical: '肉', variants: ['月'], strokes: 6, meaning: 'daging', pinyin: 'ròu' },
  { id: 131, radical: '臣', variants: [], strokes: 6, meaning: 'menteri', pinyin: 'chén' },
  { id: 132, radical: '自', variants: [], strokes: 6, meaning: 'sendiri / dari', pinyin: 'zì' },
  { id: 133, radical: '至', variants: [], strokes: 6, meaning: 'sampai / tiba', pinyin: 'zhì' },
  { id: 134, radical: '臼', variants: [], strokes: 6, meaning: 'lumpang', pinyin: 'jiù' },
  { id: 135, radical: '舌', variants: [], strokes: 6, meaning: 'lidah', pinyin: 'shé' },
  { id: 136, radical: '舛', variants: [], strokes: 6, meaning: 'bertentangan', pinyin: 'chuǎn' },
  { id: 137, radical: '舟', variants: [], strokes: 6, meaning: 'perahu', pinyin: 'zhōu' },
  { id: 138, radical: '艮', variants: [], strokes: 6, meaning: 'kaku / jejak', pinyin: 'gèn' },
  { id: 139, radical: '色', variants: [], strokes: 6, meaning: 'warna / wajah', pinyin: 'sè' },
  { id: 140, radical: '艹', variants: ['艸'], strokes: 6, meaning: 'rumput / tumbuhan', pinyin: 'cǎo', semanticHint: 'tumbuhan: 花 (bunga), 药 (obat), 茶 (teh), 苹 (apel), 菜 (sayur)' },
  { id: 141, radical: '虍', variants: [], strokes: 6, meaning: 'harimau', pinyin: 'hū' },
  { id: 142, radical: '虫', variants: [], strokes: 6, meaning: 'serangga / cacing', pinyin: 'huǐ' },
  { id: 143, radical: '血', variants: [], strokes: 6, meaning: 'darah', pinyin: 'xuè' },
  { id: 144, radical: '行', variants: [], strokes: 6, meaning: 'berjalan', pinyin: 'xíng' },
  { id: 145, radical: '衣', variants: ['衤'], strokes: 6, meaning: 'pakaian', pinyin: 'yī', semanticHint: 'pakaian dan lapisan penutup — 装 (pakaian), 裤 (celana)' },
  { id: 146, radical: '襾', variants: ['西'], strokes: 6, meaning: 'barat / tudung', pinyin: 'yà' },

  // ── 7 goresan ──
  { id: 147, radical: '見', variants: ['见'], strokes: 7, meaning: 'melihat', pinyin: 'jiàn' },
  { id: 148, radical: '角', variants: [], strokes: 7, meaning: 'tanduk / sudut', pinyin: 'jiǎo' },
  { id: 149, radical: '言', variants: ['讠'], strokes: 7, meaning: 'ucapan / kata', pinyin: 'yán', semanticHint: 'bahasa dan tutur: 说 (bicara), 话 (kata), 请 (silakan), 谢 (terima kasih), 读 (baca), 语 (bahasa), 课 (pelajaran) — radikal paling ramai di HSK' },
  { id: 150, radical: '谷', variants: [], strokes: 7, meaning: 'lembah', pinyin: 'gǔ' },
  { id: 151, radical: '豆', variants: [], strokes: 7, meaning: 'kacang', pinyin: 'dòu' },
  { id: 152, radical: '豕', variants: [], strokes: 7, meaning: 'babi', pinyin: 'shǐ' },
  { id: 153, radical: '豸', variants: [], strokes: 7, meaning: 'kucing liar', pinyin: 'zhì' },
  { id: 154, radical: '貝', variants: ['贝'], strokes: 7, meaning: 'kerang / uang', pinyin: 'bèi' },
  { id: 155, radical: '赤', variants: [], strokes: 7, meaning: 'merah / telanjang', pinyin: 'chì' },
  { id: 156, radical: '走', variants: [], strokes: 7, meaning: 'berlari', pinyin: 'zǒu', semanticHint: 'gerakan kaki: 走 (jalan), 起 (bangun), 趣 (menarik)' },
  { id: 157, radical: '足', variants: ['⻊'], strokes: 7, meaning: 'kaki', pinyin: 'zú', semanticHint: 'kaki dan gerakan: 踢 (menendang), 跑 (lari), 跳 (melompat), 跟 (mengikuti)' },
  { id: 158, radical: '身', variants: [], strokes: 7, meaning: 'tubuh', pinyin: 'shēn' },
  { id: 159, radical: '車', variants: ['车'], strokes: 7, meaning: 'kendaraan', pinyin: 'chē', semanticHint: 'kendaraan dan roda — 车 (mobil), 轮 (roda), 辆 (kata bantu kendaraan)' },
  { id: 160, radical: '辛', variants: [], strokes: 7, meaning: 'pahit / pedih', pinyin: 'xīn' },
  { id: 161, radical: '辰', variants: [], strokes: 7, meaning: 'naga / waktu', pinyin: 'chén' },
  { id: 162, radical: '辵', variants: ['辶'], strokes: 7, meaning: 'jalan / pergi', pinyin: 'chuò', semanticHint: 'jalan dan perpindahan: 这 (ini), 过 (melewati), 送 (mengantar), 远 (jauh), 近 (dekat), 边 (sisi), 还 (kembali)' },
  { id: 163, radical: '邑', variants: ['阝'], strokes: 7, meaning: 'kota (阝 kanan)', pinyin: 'yì' },
  { id: 164, radical: '酉', variants: [], strokes: 7, meaning: 'anggur / arak', pinyin: 'yǒu' },
  { id: 165, radical: '釆', variants: [], strokes: 7, meaning: 'memilah', pinyin: 'biàn' },
  { id: 166, radical: '里', variants: [], strokes: 7, meaning: 'desa / jarak', pinyin: 'lǐ' },

  // ── 8 goresan ──
  { id: 167, radical: '金', variants: ['钅', '釒'], strokes: 8, meaning: 'logam / emas', pinyin: 'jīn', semanticHint: 'logam dan uang — 钱 (uang), 钟 (jam, logam berdenting), 银 (perak/bank)' },
  { id: 168, radical: '長', variants: ['长'], strokes: 8, meaning: 'panjang', pinyin: 'cháng' },
  { id: 169, radical: '門', variants: ['门'], strokes: 8, meaning: 'pintu', pinyin: 'mén', semanticHint: 'pintu dan akses — 门 (pintu), 们 (penanda jamak), 间 (ruang di antara)' },
  { id: 170, radical: '阜', variants: ['阝'], strokes: 8, meaning: 'bukit (阝 kiri)', pinyin: 'fù', semanticHint: 'bukit dan kenampakan: 阳 (matahari/sisi terang), 阴 (bayangan), 院 (halaman), 队 (barisan)' },
  { id: 171, radical: '隶', variants: [], strokes: 8, meaning: 'budak / buruh', pinyin: 'dài' },
  { id: 172, radical: '隹', variants: [], strokes: 8, meaning: 'burung pendek', pinyin: 'zhuī' },
  { id: 173, radical: '雨', variants: [], strokes: 8, meaning: 'hujan', pinyin: 'yǔ', semanticHint: 'cuaca dan langit — 雪 (salju), 需 (butuh, awalnya hujan yang menetes)' },
  { id: 174, radical: '青', variants: [], strokes: 8, meaning: 'biru / hijau', pinyin: 'qīng', semanticHint: 'warna dan masa muda — 请 (mohon), 清 (jernih), 情 (perasaan)' },
  { id: 175, radical: '非', variants: [], strokes: 8, meaning: 'bukan / salah', pinyin: 'fēi' },

  // ── 9 goresan ──
  { id: 176, radical: '面', variants: [], strokes: 9, meaning: 'wajah / permukaan', pinyin: 'miàn' },
  { id: 177, radical: '革', variants: [], strokes: 9, meaning: 'kulit samak', pinyin: 'gé' },
  { id: 178, radical: '韋', variants: ['韦'], strokes: 9, meaning: 'kulit samak lembut', pinyin: 'wéi' },
  { id: 179, radical: '韭', variants: [], strokes: 9, meaning: 'kucai', pinyin: 'jiǔ' },
  { id: 180, radical: '音', variants: [], strokes: 9, meaning: 'suara / nada', pinyin: 'yīn' },
  { id: 181, radical: '頁', variants: ['页'], strokes: 9, meaning: 'halaman / kepala', pinyin: 'yè', semanticHint: 'kepala dan wajah — 头 (kepala), 题 (judul, topik di atas kertas)' },
  { id: 182, radical: '風', variants: ['风'], strokes: 9, meaning: 'angin', pinyin: 'fēng' },
  { id: 183, radical: '飛', variants: ['飞'], strokes: 9, meaning: 'terbang', pinyin: 'fēi' },
  { id: 184, radical: '食', variants: ['饣', '飠'], strokes: 9, meaning: 'makanan', pinyin: 'shí', semanticHint: 'makanan dan rasa — 饭 (nasi/makan), 饿 (lapar), 馆 (restoran)' },
  { id: 185, radical: '首', variants: [], strokes: 9, meaning: 'kepala', pinyin: 'shǒu' },
  { id: 186, radical: '香', variants: [], strokes: 9, meaning: 'wangi / harum', pinyin: 'xiāng' },

  // ── 10 goresan ──
  { id: 187, radical: '馬', variants: ['马'], strokes: 10, meaning: 'kuda', pinyin: 'mǎ', semanticHint: 'kuda dan kecepatan — 马 (kuda), 骑 (menunggang), 吗 (partikel tanya, kuda dipakai sebagai bunyi)' },
  { id: 188, radical: '骨', variants: [], strokes: 10, meaning: 'tulang', pinyin: 'gǔ' },
  { id: 189, radical: '高', variants: [], strokes: 10, meaning: 'tinggi', pinyin: 'gāo', semanticHint: 'bangunan bertingkat dan ketinggian' },
  { id: 190, radical: '髟', variants: [], strokes: 10, meaning: 'rambut panjang', pinyin: 'biāo' },
  { id: 191, radical: '鬥', variants: [], strokes: 10, meaning: 'bertarung', pinyin: 'dòu' },
  { id: 192, radical: '鬯', variants: [], strokes: 10, meaning: 'arak upacara', pinyin: 'chàng' },
  { id: 193, radical: '鬲', variants: [], strokes: 10, meaning: 'periuk kaki', pinyin: 'lì' },
  { id: 194, radical: '鬼', variants: [], strokes: 10, meaning: 'hantu / roh', pinyin: 'guǐ' },

  // ── 11 goresan ──
  { id: 195, radical: '魚', variants: ['鱼'], strokes: 11, meaning: 'ikan', pinyin: 'yú' },
  { id: 196, radical: '鳥', variants: ['鸟'], strokes: 11, meaning: 'burung', pinyin: 'niǎo' },
  { id: 197, radical: '鹵', variants: ['卤'], strokes: 11, meaning: 'asinan', pinyin: 'lǔ' },
  { id: 198, radical: '鹿', variants: [], strokes: 11, meaning: 'rusa', pinyin: 'lù' },
  { id: 199, radical: '麥', variants: ['麦'], strokes: 11, meaning: 'gandum', pinyin: 'mài' },
  { id: 200, radical: '麻', variants: [], strokes: 11, meaning: 'rami / kasar', pinyin: 'má' },

  // ── 12 goresan ──
  { id: 201, radical: '黃', variants: ['黄'], strokes: 12, meaning: 'kuning', pinyin: 'huáng' },
  { id: 202, radical: '黍', variants: [], strokes: 12, meaning: 'jowar / jawawut', pinyin: 'shǔ' },
  { id: 203, radical: '黑', variants: [], strokes: 12, meaning: 'hitam', pinyin: 'hēi' },
  { id: 204, radical: '黹', variants: [], strokes: 12, meaning: 'sulam', pinyin: 'zhǐ' },

  // ── 13 goresan ──
  { id: 205, radical: '黽', variants: [], strokes: 13, meaning: 'katak', pinyin: 'měng' },
  { id: 206, radical: '鼎', variants: [], strokes: 13, meaning: 'periuk tiga kaki', pinyin: 'dǐng' },
  { id: 207, radical: '鼓', variants: [], strokes: 13, meaning: 'genderang', pinyin: 'gǔ' },
  { id: 208, radical: '鼠', variants: [], strokes: 13, meaning: 'tikus', pinyin: 'shǔ' },

  // ── 14 goresan ──
  { id: 209, radical: '鼻', variants: [], strokes: 14, meaning: 'hidung', pinyin: 'bí' },
  { id: 210, radical: '齊', variants: ['齐'], strokes: 14, meaning: 'rata / seragam', pinyin: 'qí' },

  // ── 15 goresan ──
  { id: 211, radical: '齒', variants: ['齿'], strokes: 15, meaning: 'gigi', pinyin: 'chǐ' },
  { id: 212, radical: '龍', variants: ['龙'], strokes: 15, meaning: 'naga', pinyin: 'lóng' },
  { id: 213, radical: '龜', variants: ['龟'], strokes: 15, meaning: 'kura-kura', pinyin: 'guī' },

  // ── 17 goresan ──
  { id: 214, radical: '龠', variants: [], strokes: 17, meaning: 'seruling', pinyin: 'yuè' },
];

export const RADICAL_BY_ID: Map<number, RadicalEntry> = new Map(
  KANGXI_RADICALS.map((r) => [r.id, r])
);

/** Pengelompokan per jumlah goresan untuk indeks gaya kamus. */
export function groupRadicalsByStrokes(): { strokes: number; radicals: RadicalEntry[] }[] {
  const groups = new Map<number, RadicalEntry[]>();
  for (const r of KANGXI_RADICALS) {
    const list = groups.get(r.strokes) || [];
    list.push(r);
    groups.set(r.strokes, list);
  }
  return Array.from(groups.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([strokes, radicals]) => ({ strokes, radicals }));
}

// ── Urutan belajar ───────────────────────────────────────────────────────────
// Tier berdasarkan seberapa sering radikal muncul sebagai komponen karakter
// HSK 1–3 dan kegunaannya bagi pemula — BUKAN urutan resmi mana pun.
// Di dalam tier, radikal diurutkan lagi berdasarkan produktivitas (jumlah
// hanzi) oleh `groupRadicalsByLearningOrder`.

export type RadicalTier = 1 | 2 | 3;

/** Tier 1 — Fondasi: radikal paling produktif, pelajari paling awal. */
const TIER_1_IDS: number[] = [
  9, // 人 manusia
  30, // 口 mulut
  75, // 木 kayu
  85, // 水 air
  72, // 日 matahari/hari
  64, // 手 tangan
  149, // 言 ucapan
  61, // 心 hati
  74, // 月 bulan/daging
  32, // 土 tanah
  38, // 女 perempuan
  40, // 宀 atap rumah
  109, // 目 mata
  96, // 玉 giok
  18, // 刀 pisau
  162, // 辶 jalan/pergi
  140, // 艹 rumput
  37, // 大 besar
  42, // 小 kecil
  19, // 力 kekuatan
  29, // 又 tangan kanan
  170, // 阝 bukit
  14, // 冖 tudung
  120, // 糸 benang
  157, // 足 kaki
  86, // 火 api
];

/** Tier 2 — Perluas: komponen umum berikutnya, sering di HSK 2–3. */
const TIER_2_IDS: number[] = [
  1, // 一 satu
  24, // 十 sepuluh
  10, // 儿 anak/kaki
  13, // 冂 batas luar
  8, // 亠 tudung atas
  20, // 勹 pembungkus
  66, // 攴 pukulan
  5, // 乙 lengkung
  4, // 丿 garis miring
  2, // 丨 garis vertikal
  34, // 夂 pergi lambat
  48, // 工 kerja
  53, // 广 rumah tunggal
  16, // 几 meja kecil
  102, // 田 sawah
  49, // 己 diri sendiri
  62, // 戈 senjata
  73, // 曰 berkata
  117, // 立 berdiri
  25, // 卜 peramal
  41, // 寸 jengkal
  50, // 巾 kain
  26, // 卩 segel
  27, // 厂 tebing
  15, // 冫 es
];

export interface RadicalLearningGroup {
  tier: RadicalTier;
  title: string;
  subtitle: string;
  radicals: RadicalEntry[];
}

/**
 * Kelompokkan 214 radikal untuk mode "urutan belajar":
 * tier fondasi → perluas → lengkapi. Di dalam tier diurutkan berdasarkan
 * produktivitas (`getCount` menurun), lalu nomor Kangxi.
 */
export function groupRadicalsByLearningOrder(
  getCount: (radicalId: number) => number
): RadicalLearningGroup[] {
  const byProductivity = (a: RadicalEntry, b: RadicalEntry) =>
    getCount(b.id) - getCount(a.id) || a.id - b.id;

  const pick = (ids: number[]): RadicalEntry[] =>
    ids
      .map((id) => RADICAL_BY_ID.get(id))
      .filter((r): r is RadicalEntry => !!r)
      .sort(byProductivity);

  const assigned = new Set<number>([...TIER_1_IDS, ...TIER_2_IDS]);
  const rest = KANGXI_RADICALS.filter((r) => !assigned.has(r.id)).sort(byProductivity);

  return [
    {
      tier: 1,
      title: 'Fondasi',
      subtitle: 'Pelajari paling awal — radikal paling sering muncul di karakter HSK 1–3',
      radicals: pick(TIER_1_IDS),
    },
    {
      tier: 2,
      title: 'Perluas',
      subtitle: 'Komponen umum berikutnya — sering muncul di HSK 2–3',
      radicals: pick(TIER_2_IDS),
    },
    {
      tier: 3,
      title: 'Lengkapi',
      subtitle: 'Radikal minor & arsip Kangxi — kenali seperlunya saja',
      radicals: rest,
    },
  ];
}
