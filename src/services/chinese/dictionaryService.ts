/**
 * dictionaryService.ts
 * Layanan kamus dan penerjemahan kosakata Mandarin ke Bahasa Indonesia yang akurat,
 * wajar, dan kontekstual untuk HSK 1–6 (khususnya memperbaiki terjemahan mentah,
 * sisa bahasa Inggris seperti "they (for inanimate objects)", atau entri nama marga seperti "surname Ye").
 */

/** Peta terjemahan kurasi langsung Hanzi → Bahasa Indonesia akurat */
export const HANZI_INDO_DICT: Record<string, string> = {
  // Pronomina & Kata Bantu Kunci
  '它们': 'mereka (khusus benda mati / hewan / bukan manusia)',
  '它': 'dia / itu (khusus hewan atau benda mati)',
  '他': 'dia (laki-laki / umum untuk manusia)',
  '他们': 'mereka (laki-laki / campuran manusia)',
  '她': 'dia (perempuan)',
  '她们': 'mereka (khusus perempuan)',
  '这': 'ini',
  '这个': 'ini / yang ini',
  '这些': 'ini semua (benda-benda ini)',
  '这里': 'di sini',
  '这儿': 'di sini',
  '这边': 'sebelah sini / sisi ini',
  '那': 'itu',
  '那个': 'itu / yang itu',
  '那些': 'itu semua (benda-benda itu)',
  '那里': 'di sana',
  '那儿': 'di sana',
  '那边': 'sebelah sana / sisi itu',
  '哪': 'yang mana',
  '哪个': 'yang mana',
  '哪些': 'yang mana saja',
  '哪里': 'di mana',
  '哪儿': 'di mana',
  '谁': 'siapa',
  '什么': 'apa',
  '怎么': 'bagaimana / kenapa',
  '怎么样': 'bagaimana / bagaimana kabarnya',
  '多少': 'berapa (jumlah banyak)',
  '几': 'berapa (jumlah sedikit, < 10) / beberapa',
  '多': 'banyak / seberapa (dalam ukuran)',
  '少': 'sedikit / kurang',
  '的': '(partikel kepemilikan / penjelas kata sifat)',
  '得': '(partikel penghubung kata kerja & derajat/hasil)',
  '地': '(partikel pembentuk adverbia / dengan cara)',
  '了': '(partikel perubahan situasi / aksi telah terjadi)',
  '着': '(partikel aksi sedang berlangsung / berkelanjutan)',
  '过': '(partikel pernah melakukan sesuatu / melewati)',
  '吗': '(partikel tanya ya/tidak)',
  '呢': '(partikel penegas / menanyakan kembali: "bagaimana dengan...")',
  '吧': '(partikel saran / ajakan: "ayo" atau "kan?")',

  // Kata HSK 1 yang sering bermasalah di kamus mentah
  '小学': 'sekolah dasar (SD)',
  '小学生': 'murid sekolah dasar (SD)',
  '中学': 'sekolah menengah (SMP/SMA)',
  '中学生': 'siswa sekolah menengah',
  '大学': 'universitas / perguruan tinggi',
  '大学生': 'mahasiswa',
  '星期日': 'hari Minggu',
  '星期天': 'hari Minggu',
  '休息': 'istirahat / beristirahat',
  '要': 'mau, ingin; harus; perlu',
  '不要': 'jangan; tidak mau',
  '也': 'juga, pula',
  '一半': 'setengah, separuh',
  '一些': 'beberapa, sejumlah',
  '有的': 'ada yang / sebagian',
  '有些': 'beberapa / ada yang',
  '雨': 'hujan',
  '下雨': 'turun hujan',
  '雪': 'salju',
  '下雪': 'turun salju',
  '元': 'yuan (mata uang resmi Tiongkok / RMB)',
  '块': 'yuan (kata bantu uang lisan / sepotong)',
  '再': 'lagi, sekali lagi; baru kemudian',
  '再见': 'sampai jumpa / selamat tinggal',
  '早': 'pagi; lebih awal',
  '早饭': 'sarapan / makan pagi',
  '午饭': 'makan siang',
  '晚饭': 'makan malam',
  '真': 'sungguh, benar-benar, asli',
  '店': 'toko / kedai / restoran kecil',
  '公司': 'perusahaan / kantor',
  '件': 'potong, helai (kata bantu pakaian / perkara)',
  '饺子': 'pangsit (jiaozi)',
  '问题': 'pertanyaan / masalah / persoalan',
  '有点儿': 'agak, sedikit (cenderung kurang disukai)',
  '一点儿': 'sedikit (dalam jumlah/kuantitas)',
  '只': 'hanya; ekor (kata bantu untuk hewan)',
  '女士': 'Nona, Ibu, wanita terhormat',
  '些': 'beberapa (kata bantu jumlah kecil)',
  '打车': 'naik taksi / memanggil taksi',
  '打折': 'diskon / potongan harga',

  // Kata HSK 2 yang bermasalah di kamus mentah
  '爱好': 'hobi / kegemaran / menyukai',
  '班': 'kelas / kelompok / regu kerja',
  '本子': 'buku catatan / buku tulis',
  '出来': 'keluar (mendekati pembicara)',
  '出去': 'pergi keluar',
  '进来': 'masuk (ke mari)',
  '进去': 'masuk ke dalam',
  '床': 'tempat tidur / ranjang',
  '次': 'kali (frekuensi: 1 kali, 2 kali) / urutan',
  '错': 'salah, keliru / kesalahan',
  '等': 'menunggu; dan sebagainya; tingkat/kelas',
  '动': 'bergerak / memindahkan',
  '高': 'tinggi (postur/derajat/tingkat)',
  '还是': 'masih (tetap); atau (dalam kalimat tanya)',
  '花': 'bunga; menghabiskan (uang/waktu)',
  '机票': 'tiket pesawat',
  '车票': 'tiket kendaraan (bus/kereta)',
  '门票': 'tiket masuk (tempat wisata/bioskop)',
  '间': 'antara; ruangan (kata bantu kamar)',
  '楼': 'gedung bertingkat / lantai gedung',
  '路': 'jalan / rute / jalur kendaraan',
  '路上': 'di perjalanan / di jalan',
  '门口': 'pintu gerbang / depan pintu',
  '奶奶': 'nenek (ibu dari ayah)',
  '爷爷': 'kakek (ayah dari ayah)',
  '姥姥': 'nenek (ibu dari ibu)',
  '姥爷': 'kakek (ayah dari ibu)',
  '外公': 'kakek (ayah dari ibu)',
  '外婆': 'nenek (ibu dari ibu)',
  '旁边': 'di samping / sebelah',
  '球': 'bola',
  '肉': 'daging',
  '商场': 'mal / pusat perbelanjaan',
  '超市': 'supermarket / pasar swalayan',
  '上网': 'berselancar di internet / online',
  '身体': 'tubuh / badan / kesehatan',
  '生病': 'jatuh sakit',
  '时间': 'waktu',
  '事情': 'urusan / hal / kejadian',
  '手表': 'jam tangan',
  '手机': 'ponsel / HP',
  '说话': 'berbicara / mengobrol',
  '送': 'mengantar / memberikan (hadiah)',
  '虽然': 'meskipun / walaupun',
  '所以': 'oleh karena itu / jadi',
  '但是': 'tetapi / namun',
  '踢足球': 'bermain sepak bola',
  '打篮球': 'bermain bola basket',
  '跑步': 'lari / joging',
  '跳舞': 'menari',
  '唱歌': 'bernyanyi',
  '完': 'selesai / habis',
  '玩': 'bermain / jalan-jalan santai',
  '晚上': 'malam hari',
  '为什么': 'mengapa / kenapa',
  '因为': 'karena / sebab',
  '问': 'bertanya',
  '希望': 'berharap / harapan',
  '洗': 'mencuci',
  '向': 'menuju ke / menghadap',
  '笑': 'tersenyum / tertawa',
  '新': 'baru',
  '姓': 'marga / bermarga',
  '颜色': 'warna',
  '眼睛': 'mata',
  '眼镜': 'kacamata',
  '羊肉': 'daging domba / kambing',
  '药': 'obat',
  '衣服': 'pakaian / baju',
  '已经': 'sudah / telah',
  '一起': 'bersama-sama',
  '意思': 'arti, makna; menarik (bermakna)',
  '阴': 'mendung / berawan',
  '晴': 'cerah',
  '游泳': 'berenang',
  '右边': 'sebelah kanan',
  '左边': 'sebelah kiri',
  '鱼': 'ikan',
  '远': 'jauh',
  '近': 'dekat',
  '运动': 'olahraga / berolahraga',
  '张': 'lembar (kata bantu kertas, tiket, meja, tempat tidur)',
  '长': 'panjang; tumbuh/berkembang',
  '找': 'mencari; memberi uang kembalian',
  '正在': 'sedang (dalam proses aksi)',
  '知道': 'tahu / mengetahui / paham',
  '准备': 'mempersiapkan / persiapan',
  '走': 'berjalan / pergi / berangkat',
  '最': 'paling / ter-',
  '给': 'memberi / kepada / untuk',
};

/**
 * Peta frasa umum bahasa Inggris dari kamus CC-CEDICT ke Bahasa Indonesia
 */
const EN_PHRASE_TRANSLATIONS: [RegExp, string][] = [
  [/^they \(for inanimate objects\)$/i, 'mereka (khusus benda mati / hewan / bukan manusia)'],
  [/^they \(for females\)$/i, 'mereka (khusus perempuan)'],
  [/^they$/i, 'mereka'],
  [/^he; him$/i, 'dia (laki-laki)'],
  [/^she; her$/i, 'dia (perempuan)'],
  [/^it \(inanimate\)$/i, 'dia / itu (khusus benda mati atau hewan)'],
  [/^it$/i, 'itu / dia (benda)'],
  [/^surname \w+$/i, 'marga (nama keluarga)'],
  [/^elementary school; primary school$/i, 'sekolah dasar (SD)'],
  [/^primary school student$/i, 'murid sekolah dasar (SD)'],
  [/^middle school$/i, 'sekolah menengah (SMP)'],
  [/^middle-school student$/i, 'siswa sekolah menengah'],
  [/^high school$/i, 'sekolah menengah atas (SMA)'],
  [/^university; college$/i, 'universitas / perguruan tinggi'],
  [/^Sunday$/i, 'hari Minggu'],
  [/^rest$/i, 'istirahat, beristirahat'],
  [/^half$/i, 'setengah, separuh'],
  [/^some$/i, 'beberapa, sejumlah'],
  [/^\(there are\) some \(who are\.\.\.\)$/i, 'ada yang, sebagian'],
  [/^again; once more; re-$/i, 'lagi, sekali lagi'],
  [/^early$/i, 'pagi, lebih awal'],
  [/^breakfast$/i, 'sarapan, makan pagi'],
  [/^lunch$/i, 'makan siang'],
  [/^dinner; supper$/i, 'makan malam'],
  [/^this side$/i, 'sebelah sini, sisi ini'],
  [/^here$/i, 'di sini'],
  [/^these$/i, 'ini semua (benda-benda ini)'],
  [/^really$/i, 'sungguh, benar-benar'],
  [/^don't!$/i, 'jangan!'],
  [/^inn; old-style hotel$/i, 'penginapan, kedai'],
  [/^company; firm; corporation$/i, 'perusahaan'],
  [/^dumpling$/i, 'pangsit (jiaozi)'],
  [/^question$/i, 'pertanyaan, masalah'],
  [/^slightly$/i, 'agak, sedikit'],
  [/^only$/i, 'hanya'],
  [/^lady$/i, 'Nona, Ibu, wanita terhormat'],
  [/^rain$/i, 'hujan'],
  [/^snow$/i, 'salju'],
  [/^air ticket$/i, 'tiket pesawat'],
  [/^doorway$/i, 'pintu masuk, depan pintu'],
  [/^shopping mall$/i, 'pusat perbelanjaan, mal'],
  [/^on the road$/i, 'di perjalanan, di jalan'],
  [/^to come out$/i, 'keluar (ke arah sini)'],
  [/^to go out$/i, 'pergi keluar'],
  [/^to come in$/i, 'masuk ke mari'],
  [/^to go in$/i, 'masuk ke dalam'],
  [/^to go online$/i, 'berselancar di internet (online)'],
  [/^to take a taxi.*$/i, 'naik taksi'],
  [/^to like; to be fond of.*$/i, 'menyukai, menggemari (hobi)'],
];

/**
 * Deteksi apakah teks berbau bahasa Inggris murni
 */
export function isEnglishText(text: string): boolean {
  if (!text) return false;
  // Deteksi kata penanda Inggris
  const enWords = /\b(they|them|their|he|she|him|her|inanimate|surname|primary|school|student|classifier|indicating|bound form|to demand|to coerce|inn|hotel|company|firm|corporation|dumpling|slightly|theater|cinema|grandma|adjacent|online|dozen|loanword)\b/i;
  return enWords.test(text);
}

/**
 * Terjemahkan arti Inggris ke Bahasa Indonesia yang wajar
 */
export function translateEnglishMeaningToIndonesian(enText: string): string {
  if (!enText) return '';
  const trimmed = enText.trim();

  // Cek exact atau regex regex phrase
  for (const [re, replacement] of EN_PHRASE_TRANSLATIONS) {
    if (re.test(trimmed)) return replacement;
  }

  // Bersihkan format kamus CC-CEDICT seperti "(bound form)", "to ...", "classifier..."
  let clean = trimmed
    .replace(/^\(bound form\)\s*/i, '')
    .replace(/^classifier indicating a small amount.*$/i, 'beberapa (kata bantu jumlah kecil)')
    .replace(/^classifier for\s+/i, 'kata bantu untuk ')
    .replace(/^measure word for\s+/i, 'kata bantu satuan untuk ')
    .replace(/^to be called\b/i, 'bernama, dipanggil')
    .replace(/^to like\b/i, 'menyukai, gemar')
    .replace(/^to want\b/i, 'menginginkan, mau')
    .replace(/^to go\b/i, 'pergi')
    .replace(/^to come\b/i, 'datang')
    .replace(/^to eat\b/i, 'makan')
    .replace(/^to drink\b/i, 'minum')
    .replace(/^to see; to watch\b/i, 'melihat, menonton')
    .replace(/^to read\b/i, 'membaca')
    .replace(/^to write\b/i, 'menulis')
    .replace(/^to listen\b/i, 'mendengarkan')
    .replace(/^to speak\b/i, 'berbicara')
    .replace(/^to ask\b/i, 'bertanya');

  return clean;
}

/**
 * Dapatkan arti Bahasa Indonesia terbaik untuk kata kursus
 */
export function getAccurateIndonesianMeaning(
  hanzi: string,
  existingMeanId?: string,
  meanEn: string[] = []
): string {
  // 1. Prioritas tertinggi: Kamus kurasi spesifik
  if (hanzi && HANZI_INDO_DICT[hanzi]) {
    return HANZI_INDO_DICT[hanzi];
  }

  // 2. Jika meanId ada dan bukan bahasa Inggris / bukan teks error
  if (existingMeanId && existingMeanId.trim().length > 0 && !isEnglishText(existingMeanId)) {
    return existingMeanId.trim();
  }

  // 3. Terjemahkan meanEn jika ada
  if (meanEn && meanEn.length > 0 && meanEn[0]) {
    const translated = translateEnglishMeaningToIndonesian(meanEn[0]);
    if (translated && !isEnglishText(translated)) {
      return translated;
    }
    // Jika masih ada sisa bahasa Inggris, gunakan versi bersih
    return translated || meanEn[0];
  }

  return existingMeanId || '';
}

/**
 * Format label Kelas Kata (Part of Speech) linguistik Mandarin ke Bahasa Indonesia ramah
 */
export function formatPartOfSpeech(pos: string): string {
  if (!pos) return '';
  const trimmed = pos.toLowerCase().trim();
  const map: Record<string, string> = {
    r: 'Kata Ganti (Pronomina)',
    n: 'Kata Benda (Nomina)',
    v: 'Kata Kerja (Verba)',
    a: 'Kata Sifat (Adjektiva)',
    d: 'Kata Keterangan (Adverbia)',
    m: 'Kata Bilangan (Numeralia)',
    q: 'Kata Bantu Satuan (Penggolong)',
    p: 'Kata Depan (Preposisi)',
    c: 'Kata Sambung (Konjungsi)',
    u: 'Partikel Tata Bahasa',
    e: 'Kata Seru (Interjeksi)',
    y: 'Partikel Nada / Modalitas',
    o: 'Tiruan Bunyi (Onomatope)',
    k: 'Awalan / Akhiran',
    w: 'Tanda Baca',
  };
  return map[trimmed] || pos;
}
