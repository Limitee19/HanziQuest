"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/chinese/dataset/index.ts
var index_exports = {};
__export(index_exports, {
  FULL_HSK_DATASET: () => FULL_HSK_DATASET,
  HSK1_WORDS: () => HSK1_WORDS,
  HSK2_WORDS: () => HSK2_WORDS,
  HSK3_WORDS: () => HSK3_WORDS,
  buildToneFillers: () => buildToneFillers
});
module.exports = __toCommonJS(index_exports);

// src/services/chinese/pinyinEngine.ts
function removeToneMarks(text) {
  if (!text) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/v/g, "\xFC").toLowerCase();
}
function normalizePinyin(text) {
  if (!text) return "";
  return removeToneMarks(text).replace(/[^a-zü]/g, "").trim();
}
function getToneFromPinyin(pinyin) {
  if (!pinyin) return 5;
  if (/[\u0101\u0113\u012b\u014d\u016b\u01d6]/i.test(pinyin)) return 1;
  if (/[\u00e1\u00e9\u00ed\u00f3\u00fa\u01d8]/i.test(pinyin)) return 2;
  if (/[\u01ce\u011b\u01d0\u01d2\u01d4\u01da]/i.test(pinyin)) return 3;
  if (/[\u00e0\u00e8\u00ec\u00f2\u00f9\u01dc]/i.test(pinyin)) return 4;
  return 5;
}

// src/services/chinese/dataset/types.ts
function w(id, hskLevel, hanzi, pinyin, meanings, example, opts) {
  return {
    id,
    hanzi,
    pinyin,
    pinyinNormalized: normalizePinyin(pinyin),
    tone: getToneFromPinyin(pinyin),
    meanings,
    exampleSentences: example ? [{ hanzi: example[0], pinyin: example[1], meaning: example[2] }] : void 0,
    hskLevel,
    partOfSpeech: opts?.pos,
    emoji: opts?.emoji,
    imageKey: opts?.imageKey,
    secondaryMeanings: opts?.en
  };
}

// src/services/chinese/dataset/hsk1.ts
var HSK1_WORDS = [
  w("h1_001", 1, "\u7231", "\xE0i", ["cinta", "mencintai"], ["\u6211\u7231\u4F60\u3002", "W\u01D2 \xE0i n\u01D0.", "Aku mencintaimu."], { pos: "verba", emoji: "\u2764\uFE0F", imageKey: "Love", en: ["love"] }),
  w("h1_002", 1, "\u516B", "b\u0101", ["delapan"], ["\u516B\u6708\u5F88\u70ED\u3002", "B\u0101yu\xE8 h\u011Bn r\xE8.", "Bulan Agustus panas."], { pos: "numeral", emoji: "8\uFE0F\u20E3", en: ["eight"] }),
  w("h1_003", 1, "\u7238\u7238", "b\xE0ba", ["ayah", "bapak"], ["\u6211\u7238\u7238\u662F\u8001\u5E08\u3002", "W\u01D2 b\xE0ba sh\xEC l\u01CEosh\u012B.", "Ayahku seorang guru."], { pos: "nomina", emoji: "\u{1F468}", imageKey: "Father", en: ["dad", "father"] }),
  w("h1_004", 1, "\u676F\u5B50", "b\u0113izi", ["gelas", "cangkir"], ["\u8FD9\u4E2A\u676F\u5B50\u5F88\u5E72\u51C0\u3002", "Zh\xE8ge b\u0113izi h\u011Bn g\u0101nj\xECng.", "Gelas ini bersih."], { pos: "nomina", emoji: "\u{1F964}", imageKey: "Cup", en: ["cup", "glass"] }),
  w("h1_005", 1, "\u5317\u4EAC", "B\u011Bij\u012Bng", ["Beijing"], ["\u5317\u4EAC\u662F\u4E2D\u56FD\u7684\u9996\u90FD\u3002", "B\u011Bij\u012Bng sh\xEC Zh\u014Dnggu\xF3 de sh\u01D2ud\u016B.", "Beijing adalah ibu kota Tiongkok."], { pos: "nama tempat", emoji: "\u{1F3EF}", imageKey: "Beijing", en: ["Beijing"] }),
  w("h1_006", 1, "\u672C", "b\u011Bn", ["buku (kata bantu)"], ["\u8FD9\u672C\u4E66\u5F88\u6709\u610F\u601D\u3002", "Zh\xE8 b\u011Bn sh\u016B h\u011Bn y\u01D2uy\xECsi.", "Buku ini sangat menarik."], { pos: "kata bantu", en: ["measure word for books"] }),
  w("h1_007", 1, "\u4E0D\u5BA2\u6C14", "b\xFA k\xE8qi", ["jangan sungkan", "silakan"], ["\u4E0D\u5BA2\u6C14\uFF0C\u8BF7\u5750\u3002", "B\xFA k\xE8qi, q\u01D0ng zu\xF2.", "Jangan sungkan, silakan duduk."], { pos: "ucapan", emoji: "\u{1F64F}", en: ["you are welcome"] }),
  w("h1_008", 1, "\u4E0D", "b\xF9", ["tidak"], ["\u6211\u4E0D\u559D\u5496\u5561\u3002", "W\u01D2 b\xF9 h\u0113 k\u0101f\u0113i.", "Aku tidak minum kopi."], { pos: "adverbia", emoji: "\u{1F6AB}", en: ["no", "not"] }),
  w("h1_009", 1, "\u83DC", "c\xE0i", ["masakan", "sayur", "hidangan"], ["\u8FD9\u4E2A\u83DC\u5F88\u597D\u5403\u3002", "Zh\xE8ge c\xE0i h\u011Bn h\u01CEoch\u012B.", "Masakan ini enak sekali."], { pos: "nomina", emoji: "\u{1F96C}", imageKey: "Chinese cuisine", en: ["dish", "vegetable"] }),
  w("h1_010", 1, "\u8336", "ch\xE1", ["teh"], ["\u6211\u6BCF\u5929\u559D\u8336\u3002", "W\u01D2 m\u011Biti\u0101n h\u0113 ch\xE1.", "Aku minum teh setiap hari."], { pos: "nomina", emoji: "\u{1F375}", imageKey: "Tea", en: ["tea"] }),
  w("h1_011", 1, "\u5403", "ch\u012B", ["makan"], ["\u6211\u4EEC\u4E00\u8D77\u5403\u996D\u5427\u3002", "W\u01D2men y\u012Bq\u01D0 ch\u012Bf\xE0n ba.", "Ayo kita makan bersama."], { pos: "verba", emoji: "\u{1F35A}", imageKey: "Eating", en: ["eat"] }),
  w("h1_012", 1, "\u51FA\u79DF\u8F66", "ch\u016Bz\u016Bch\u0113", ["taksi"], ["\u51FA\u79DF\u8F66\u7AD9\u5728\u54EA\u513F\uFF1F", "Ch\u016Bz\u016Bch\u0113 zh\xE0n z\xE0i n\u01CEr?", "Di mana terminal taksi?"], { pos: "nomina", emoji: "\u{1F695}", imageKey: "Taxi", en: ["taxi"] }),
  w("h1_013", 1, "\u6253\u7535\u8BDD", "d\u01CE di\xE0nhu\xE0", ["menelepon"], ["\u6211\u7ED9\u5988\u5988\u6253\u7535\u8BDD\u3002", "W\u01D2 g\u011Bi m\u0101ma d\u01CE di\xE0nhu\xE0.", "Aku menelepon ibu."], { pos: "verba", emoji: "\u{1F4DE}", imageKey: "Telephone", en: ["make a phone call"] }),
  w("h1_014", 1, "\u5927", "d\xE0", ["besar"], ["\u8FD9\u4E2A\u5B66\u6821\u5F88\u5927\u3002", "Zh\xE8ge xu\xE9xi\xE0o h\u011Bn d\xE0.", "Sekolah ini besar."], { pos: "adjektiva", emoji: "\u{1F418}", en: ["big", "large"] }),
  w("h1_015", 1, "\u7684", "de", ["(partikel kepemilikan)"], ["\u8FD9\u662F\u6211\u7684\u4E66\u3002", "Zh\xE8 sh\xEC w\u01D2 de sh\u016B.", "Ini buku saya."], { pos: "partikel", en: ["particle of possession"] }),
  w("h1_016", 1, "\u7535\u8111", "di\xE0nn\u01CEo", ["komputer"], ["\u7535\u8111\u5728\u684C\u5B50\u4E0A\u3002", "Di\xE0nn\u01CEo z\xE0i zhu\u014Dzi sh\xE0ng.", "Komputernya di atas meja."], { pos: "nomina", emoji: "\u{1F4BB}", imageKey: "Computer", en: ["computer"] }),
  w("h1_017", 1, "\u7535\u89C6", "di\xE0nsh\xEC", ["televisi"], ["\u6211\u5728\u770B\u7535\u89C6\u3002", "W\u01D2 z\xE0i k\xE0n di\xE0nsh\xEC.", "Aku sedang menonton TV."], { pos: "nomina", emoji: "\u{1F4FA}", imageKey: "Television", en: ["television", "TV"] }),
  w("h1_018", 1, "\u70B9", "di\u01CEn", ["pukul", "sedikit"], ["\u73B0\u5728\u51E0\u70B9\uFF1F", "Xi\xE0nz\xE0i j\u01D0 di\u01CEn?", "Sekarang jam berapa?"], { pos: "nomina/waktu", emoji: "\u{1F550}", en: ["oclock", "a bit"] }),
  w("h1_019", 1, "\u7535\u8111", "di\xE0nn\u01CEo", ["komputer"], ["\u4ED6\u7528\u7535\u8111\u5DE5\u4F5C\u3002", "T\u0101 y\xF2ng di\xE0nn\u01CEo g\u014Dngzu\xF2.", "Dia bekerja dengan komputer."], { pos: "nomina", emoji: "\u{1F5A5}\uFE0F", en: ["computer"] }),
  w("h1_020", 1, "\u90FD", "d\u014Du", ["semua", "semuanya"], ["\u6211\u4EEC\u90FD\u662F\u5B66\u751F\u3002", "W\u01D2men d\u014Du sh\xEC xu\xE9sheng.", "Kami semua adalah siswa."], { pos: "adverbia", en: ["all", "both"] }),
  w("h1_021", 1, "\u591A", "du\u014D", ["banyak"], ["\u4ECA\u5929\u7684\u4EBA\u5F88\u591A\u3002", "J\u012Bnti\u0101n de r\xE9n h\u011Bn du\u014D.", "Orang hari ini banyak sekali."], { pos: "adjektiva", en: ["many", "much"] }),
  w("h1_022", 1, "\u591A\u5C11", "du\u014Dshao", ["berapa"], ["\u8FD9\u4E2A\u591A\u5C11\u94B1\uFF1F", "Zh\xE8ge du\u014Dshao qi\xE1n?", "Berapa harga ini?"], { pos: "tanya", emoji: "\u{1F4B0}", en: ["how many", "how much"] }),
  w("h1_023", 1, "\u513F\u5B50", "\xE9rzi", ["anak laki-laki"], ["\u4ED6\u6709\u4E00\u4E2A\u513F\u5B50\u3002", "T\u0101 y\u01D2u y\xED g\xE8 \xE9rzi.", "Dia punya satu anak laki-laki."], { pos: "nomina", emoji: "\u{1F466}", imageKey: "Son", en: ["son"] }),
  w("h1_024", 1, "\u4E8C", "\xE8r", ["dua"], ["\u6211\u6709\u4E8C\u672C\u4E66\u3002", "W\u01D2 y\u01D2u \xE8r b\u011Bn sh\u016B.", "Aku punya dua buku."], { pos: "numeral", emoji: "2\uFE0F\u20E3", en: ["two"] }),
  w("h1_025", 1, "\u996D", "f\xE0n", ["nasi", "makanan"], ["\u996D\u505A\u597D\u4E86\u3002", "F\xE0n zu\xF2 h\u01CEo le.", "Makanannya sudah jadi."], { pos: "nomina", emoji: "\u{1F35A}", imageKey: "Rice", en: ["cooked rice", "meal"] }),
  w("h1_026", 1, "\u623F\u95F4", "f\xE1ngji\u0101n", ["kamar", "ruangan"], ["\u8FD9\u4E2A\u623F\u95F4\u5F88\u4EAE\u3002", "Zh\xE8ge f\xE1ngji\u0101n h\u011Bn li\xE0ng.", "Kamar ini terang."], { pos: "nomina", emoji: "\u{1F6AA}", imageKey: "Room", en: ["room"] }),
  w("h1_027", 1, "\u98DE\u673A", "f\u0113ij\u012B", ["pesawat terbang"], ["\u98DE\u673A\u5FEB\u8D77\u98DE\u4E86\u3002", "F\u0113ij\u012B ku\xE0i q\u01D0f\u0113i le.", "Pesawatnya segera lepas landas."], { pos: "nomina", emoji: "\u2708\uFE0F", imageKey: "Airplane", en: ["airplane"] }),
  w("h1_028", 1, "\u5206\u949F", "f\u0113nzh\u014Dng", ["menit"], ["\u7B49\u4E94\u5206\u949F\u3002", "D\u011Bng w\u01D4 f\u0113nzh\u014Dng.", "Tunggu lima menit."], { pos: "nomina waktu", emoji: "\u23F1\uFE0F", en: ["minute"] }),
  w("h1_029", 1, "\u9AD8\u5174", "g\u0101ox\xECng", ["senang", "gembira"], ["\u89C1\u5230\u4F60\u5F88\u9AD8\u5174\u3002", "Ji\xE0nd\xE0o n\u01D0 h\u011Bn g\u0101ox\xECng.", "Senang bertemu denganmu."], { pos: "adjektiva", emoji: "\u{1F60A}", en: ["happy", "glad"] }),
  w("h1_030", 1, "\u4E2A", "g\xE8", ["(kata bantu umum)"], ["\u4E00\u4E2A\u82F9\u679C", "y\xED g\xE8 p\xEDnggu\u01D2", "satu apel"], { pos: "kata bantu", en: ["general measure word"] }),
  w("h1_031", 1, "\u5DE5\u4F5C", "g\u014Dngzu\xF2", ["bekerja", "pekerjaan"], ["\u6211\u5728\u5317\u4EAC\u5DE5\u4F5C\u3002", "W\u01D2 z\xE0i B\u011Bij\u012Bng g\u014Dngzu\xF2.", "Aku bekerja di Beijing."], { pos: "verba/nomina", emoji: "\u{1F4BC}", imageKey: "Work", en: ["work", "job"] }),
  w("h1_032", 1, "\u72D7", "g\u01D2u", ["anjing"], ["\u8FD9\u53EA\u72D7\u5F88\u5C0F\u3002", "Zh\xE8 zh\u012B g\u01D2u h\u011Bn xi\u01CEo.", "Anjing ini kecil."], { pos: "nomina", emoji: "\u{1F415}", imageKey: "Dog", en: ["dog"] }),
  w("h1_033", 1, "\u6C49\u8BED", "H\xE0ny\u01D4", ["bahasa Mandarin"], ["\u6211\u5B66\u6C49\u8BED\u4E24\u5E74\u4E86\u3002", "W\u01D2 xu\xE9 H\xE0ny\u01D4 li\u01CEng ni\xE1n le.", "Aku belajar Mandarin dua tahun."], { pos: "nomina", emoji: "\u{1F236}", en: ["Chinese language"] }),
  w("h1_034", 1, "\u597D", "h\u01CEo", ["baik", "bagus"], ["\u4ECA\u5929\u5929\u6C14\u5F88\u597D\u3002", "J\u012Bnti\u0101n ti\u0101nq\xEC h\u011Bn h\u01CEo.", "Cuaca hari ini bagus."], { pos: "adjektiva", emoji: "\u{1F44D}", en: ["good", "well"] }),
  w("h1_035", 1, "\u53F7", "h\xE0o", ["tanggal", "nomor"], ["\u4ECA\u5929\u51E0\u53F7\uFF1F", "J\u012Bnti\u0101n j\u01D0 h\xE0o?", "Sekarang tanggal berapa?"], { pos: "nomina", emoji: "\u{1F522}", en: ["date", "number"] }),
  w("h1_036", 1, "\u559D", "h\u0113", ["minum"], ["\u4F60\u60F3\u559D\u4EC0\u4E48\uFF1F", "N\u01D0 xi\u01CEng h\u0113 sh\xE9nme?", "Kamu mau minum apa?"], { pos: "verba", emoji: "\u{1F95B}", imageKey: "Drinking", en: ["drink"] }),
  w("h1_037", 1, "\u548C", "h\xE9", ["dan", "dengan"], ["\u6211\u548C\u7238\u7238\u56DE\u5BB6\u3002", "W\u01D2 h\xE9 b\xE0ba hu\xED ji\u0101.", "Aku dan ayah pulang."], { pos: "konjungsi", en: ["and", "with"] }),
  w("h1_038", 1, "\u5F88", "h\u011Bn", ["sangat"], ["\u4ED6\u5F88\u9AD8\u5174\u3002", "T\u0101 h\u011Bn g\u0101ox\xECng.", "Dia sangat senang."], { pos: "adverbia", en: ["very"] }),
  w("h1_039", 1, "\u540E\u9762", "h\xF2umi\xE0n", ["belakang"], ["\u8F66\u7AD9\u5728\u5B66\u6821\u540E\u9762\u3002", "Ch\u0113zh\xE0n z\xE0i xu\xE9xi\xE0o h\xF2umi\xE0n.", "Stasiun ada di belakang sekolah."], { pos: "nomina lokasi", emoji: "\u{1F519}", en: ["behind", "back"] }),
  w("h1_040", 1, "\u56DE", "hu\xED", ["kembali"], ["\u6211\u660E\u5929\u56DE\u5BB6\u3002", "W\u01D2 m\xEDngti\u0101n hu\xED ji\u0101.", "Aku pulang ke rumah besok."], { pos: "verba", emoji: "\u21A9\uFE0F", en: ["return", "go back"] }),
  w("h1_041", 1, "\u4F1A", "hu\xEC", ["bisa", "dapat (kemampuan)"], ["\u6211\u4F1A\u8BF4\u6C49\u8BED\u3002", "W\u01D2 hu\xEC shu\u014D H\xE0ny\u01D4.", "Aku bisa berbahasa Mandarin."], { pos: "verba modal", emoji: "\u{1F4AA}", en: ["can", "know how to"] }),
  w("h1_042", 1, "\u51E0", "j\u01D0", ["berapa"], ["\u4F60\u51E0\u5C81\uFF1F", "N\u01D0 j\u01D0 su\xEC?", "Umurmu berapa?"], { pos: "tanya", en: ["how many"] }),
  w("h1_043", 1, "\u5BB6", "ji\u0101", ["rumah", "keluarga"], ["\u6211\u7231\u6211\u7684\u5BB6\u3002", "W\u01D2 \xE0i w\u01D2 de ji\u0101.", "Aku cinta keluargaku."], { pos: "nomina", emoji: "\u{1F3E0}", imageKey: "Home", en: ["home", "family"] }),
  w("h1_044", 1, "\u53EB", "ji\xE0o", ["bernama", "dipanggil"], ["\u6211\u53EB\u5C0F\u660E\u3002", "W\u01D2 ji\xE0o Xi\u01CEom\xEDng.", "Namaku Xiaoming."], { pos: "verba", emoji: "\u{1F3F7}\uFE0F", en: ["to be called"] }),
  w("h1_045", 1, "\u4ECA\u5929", "j\u012Bnti\u0101n", ["hari ini"], ["\u4ECA\u5929\u661F\u671F\u5929\u3002", "J\u012Bnti\u0101n x\u012Bngq\u012Bti\u0101n.", "Hari ini hari Minggu."], { pos: "nomina waktu", emoji: "\u{1F4C5}", en: ["today"] }),
  w("h1_046", 1, "\u4E5D", "ji\u01D4", ["sembilan"], ["\u73B0\u5728\u4E5D\u70B9\u3002", "Xi\xE0nz\xE0i ji\u01D4 di\u01CEn.", "Sekarang jam sembilan."], { pos: "numeral", emoji: "9\uFE0F\u20E3", en: ["nine"] }),
  w("h1_047", 1, "\u5F00", "k\u0101i", ["membuka", "mengemudi"], ["\u8BF7\u5F00\u95E8\u3002", "Q\u01D0ng k\u0101i m\xE9n.", "Tolong buka pintu."], { pos: "verba", emoji: "\u{1F6AA}", en: ["open", "drive"] }),
  w("h1_048", 1, "\u770B\u89C1", "k\xE0nji\xE0n", ["melihat", "terlihat"], ["\u6211\u770B\u89C1\u4ED6\u4E86\u3002", "W\u01D2 k\xE0nji\xE0n t\u0101 le.", "Aku melihat dia."], { pos: "verba", emoji: "\u{1F440}", imageKey: "Eye", en: ["see", "catch sight of"] }),
  w("h1_049", 1, "\u8BFE", "k\xE8", ["pelajaran", "kelas"], ["\u7B2C\u4E09\u8282\u8BFE\u662F\u6570\u5B66\u3002", "D\xEC-s\u0101n ji\xE9 k\xE8 sh\xEC sh\xF9xu\xE9.", "Pelajaran ketiga adalah matematika."], { pos: "nomina", emoji: "\u{1F4DA}", en: ["class", "lesson"] }),
  w("h1_050", 1, "\u5757", "ku\xE0i", ["yuan (kata bantu uang)"], ["\u4E00\u74F6\u6C34\u4E24\u5757\u94B1\u3002", "Y\xEC p\xEDng shu\u01D0 li\u01CEng ku\xE0i qi\xE1n.", "Satu botol air dua yuan."], { pos: "kata bantu", emoji: "\u{1F4B4}", en: ["yuan (colloquial)"] }),
  w("h1_051", 1, "\u6765", "l\xE1i", ["datang"], ["\u6B22\u8FCE\u4F60\u6765\u6211\u5BB6\u3002", "Hu\u0101ny\xEDng n\u01D0 l\xE1i w\u01D2 ji\u0101.", "Selamat datang kerumahku."], { pos: "verba", emoji: "\u{1F44B}", en: ["come"] }),
  w("h1_052", 1, "\u8001\u5E08", "l\u01CEosh\u012B", ["guru"], ["\u8001\u5E08\u5F88\u597D\u3002", "L\u01CEosh\u012B h\u011Bn h\u01CEo.", "Gurunya baik."], { pos: "nomina", emoji: "\u{1F9D1}\u200D\u{1F3EB}", imageKey: "Teacher", en: ["teacher"] }),
  w("h1_053", 1, "\u4E86", "le", ["(partikel selesai/perubahan)"], ["\u4E0B\u96E8\u4E86\u3002", "Xi\xE0 y\u01D4 le.", "Sudah hujan."], { pos: "partikel", en: ["completed action particle"] }),
  w("h1_054", 1, "\u51B7", "l\u011Bng", ["dingin"], ["\u51AC\u5929\u5F88\u51B7\u3002", "D\u014Dngti\u0101n h\u011Bn l\u011Bng.", "Musim dingin sangat dingin."], { pos: "adjektiva", emoji: "\u2744\uFE0F", imageKey: "Cold", en: ["cold"] }),
  w("h1_055", 1, "\u91CC\u9762", "l\u01D0mi\xE0n", ["di dalam"], ["\u5305\u91CC\u9762\u6709\u4E00\u672C\u4E66\u3002", "B\u0101o l\u01D0mi\xE0n y\u01D2u y\xEC b\u011Bn sh\u016B.", "Di dalam tas ada buku."], { pos: "nomina lokasi", emoji: "\u{1F4E6}", en: ["inside"] }),
  w("h1_056", 1, "\u516D", "li\xF9", ["enam"], ["\u516D\u6708\u4E00\u65E5\u662F\u513F\u7AE5\u8282\u3002", "Li\xF9yu\xE8 y\u012B r\xEC sh\xEC \xE9rt\xF3ngji\xE9.", "Tanggal 1 Juni adalah Hari Anak."], { pos: "numeral", emoji: "6\uFE0F\u20E3", en: ["six"] }),
  w("h1_057", 1, "\u5988\u5988", "m\u0101ma", ["ibu"], ["\u5988\u5988\u5728\u505A\u996D\u3002", "M\u0101ma z\xE0i zu\xF2 f\xE0n.", "Ibu sedang memasak."], { pos: "nomina", emoji: "\u{1F469}", imageKey: "Mother", en: ["mom", "mother"] }),
  w("h1_058", 1, "\u5417", "ma", ["(partikel tanya)"], ["\u4F60\u597D\u5417\uFF1F", "N\u01D0 h\u01CEo ma?", "Apakah kamu baik?"], { pos: "partikel", en: ["question particle"] }),
  w("h1_059", 1, "\u4E70", "m\u01CEi", ["membeli"], ["\u6211\u53BB\u4E70\u6C34\u679C\u3002", "W\u01D2 q\xF9 m\u01CEi shu\u01D0gu\u01D2.", "Aku pergi membeli buah."], { pos: "verba", emoji: "\u{1F6D2}", imageKey: "Shopping", en: ["buy"] }),
  w("h1_060", 1, "\u732B", "m\u0101o", ["kucing"], ["\u8FD9\u53EA\u732B\u5F88\u53EF\u7231\u3002", "Zh\xE8 zh\u012B m\u0101o h\u011Bn k\u011B'\xE0i.", "Kucing ini lucu sekali."], { pos: "nomina", emoji: "\u{1F431}", imageKey: "Cat", en: ["cat"] }),
  w("h1_061", 1, "\u6CA1\u4EC0\u4E48", "m\xE9i sh\xE9nme", ["tidak ada apa-apa"], ["\u6CA1\u4EC0\u4E48\uFF0C\u6211\u5F88\u597D\u3002", "M\xE9i sh\xE9nme, w\u01D2 h\u011Bn h\u01CEo.", "Tidak apa-apa, aku baik-baik saja."], { pos: "ucapan", en: ["it is nothing"] }),
  w("h1_062", 1, "\u6CA1\u6709", "m\xE9iy\u01D2u", ["tidak punya", "tidak ada"], ["\u6211\u6CA1\u6709\u94B1\u3002", "W\u01D2 m\xE9iy\u01D2u qi\xE1n.", "Aku tidak punya uang."], { pos: "verba", emoji: "\u{1F6AB}", en: ["not have", "there is not"] }),
  w("h1_063", 1, "\u7C73\u996D", "m\u01D0f\xE0n", ["nasi putih"], ["\u6211\u559C\u6B22\u5403\u7C73\u996D\u3002", "W\u01D2 x\u01D0huan ch\u012B m\u01D0f\xE0n.", "Aku suka makan nasi."], { pos: "nomina", emoji: "\u{1F35A}", imageKey: "White rice", en: ["cooked rice"] }),
  w("h1_064", 1, "\u660E\u5929", "m\xEDngti\u0101n", ["besok"], ["\u660E\u5929\u6211\u53BB\u5B66\u6821\u3002", "M\xEDngti\u0101n w\u01D2 q\xF9 xu\xE9xi\xE0o.", "Besok aku ke sekolah."], { pos: "nomina waktu", emoji: "\u{1F305}", en: ["tomorrow"] }),
  w("h1_065", 1, "\u540D\u5B57", "m\xEDngzi", ["nama"], ["\u4F60\u7684\u540D\u5B57\u5F88\u597D\u542C\u3002", "N\u01D0 de m\xEDngzi h\u011Bn h\u01CEot\u012Bng.", "Namamu bagus didengar."], { pos: "nomina", emoji: "\u{1F3F7}\uFE0F", imageKey: "Name", en: ["name"] }),
  w("h1_066", 1, "\u54EA", "n\u01CE", ["mana"], ["\u4F60\u662F\u54EA\u91CC\u4EBA\uFF1F", "N\u01D0 sh\xEC n\u01CEl\u01D0 r\xE9n?", "Orang mana kamu?"], { pos: "tanya", en: ["which", "where"] }),
  w("h1_067", 1, "\u90A3\u513F", "n\xE0r", ["di sana"], ["\u4E66\u5728\u90A3\u513F\u3002", "Sh\u016B z\xE0i n\xE0r.", "Bukunya di sana."], { pos: "nomina lokasi", emoji: "\u{1F449}", en: ["there"] }),
  w("h1_068", 1, "\u5462", "ne", ["(partikel tanya lanjut)"], ["\u4F60\u5462\uFF1F", "N\u01D0 ne?", "Kalau kamu?"], { pos: "partikel", en: ["particle: what about"] }),
  w("h1_069", 1, "\u80FD", "n\xE9ng", ["dapat", "mampu"], ["\u4ECA\u5929\u6211\u80FD\u6765\u3002", "J\u012Bnti\u0101n w\u01D2 n\xE9ng l\xE1i.", "Hari ini aku bisa datang."], { pos: "verba modal", emoji: "\u2705", en: ["can", "be able to"] }),
  w("h1_070", 1, "\u4F60", "n\u01D0", ["kamu", "Anda"], ["\u4F60\u597D\uFF01", "N\u01D0 h\u01CEo!", "Halo!"], { pos: "pronomina", emoji: "\u{1F44B}", en: ["you"] }),
  w("h1_071", 1, "\u5E74", "ni\xE1n", ["tahun"], ["\u4E00\u5E74\u6709\u5341\u4E8C\u4E2A\u6708\u3002", "Y\xEC ni\xE1n y\u01D2u sh\xED\u2019\xE8r g\xE8 yu\xE8.", "Satu tahun ada dua belas bulan."], { pos: "nomina waktu", emoji: "\u{1F5D3}\uFE0F", imageKey: "Year", en: ["year"] }),
  w("h1_072", 1, "\u5973\u513F", "n\u01DA'\xE9r", ["anak perempuan"], ["\u5979\u7684\u5973\u513F\u5F88\u806A\u660E\u3002", "T\u0101 de n\u01DA'\xE9r h\u011Bn c\u014Dngming.", "Anak perempuannya pintar."], { pos: "nomina", emoji: "\u{1F467}", imageKey: "Daughter", en: ["daughter"] }),
  w("h1_073", 1, "\u670B\u53CB", "p\xE9ngyou", ["teman"], ["\u4ED6\u662F\u6211\u6700\u597D\u7684\u670B\u53CB\u3002", "T\u0101 sh\xEC w\u01D2 zu\xEC h\u01CEo de p\xE9ngyou.", "Dia adalah teman terbaikku."], { pos: "nomina", emoji: "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}", imageKey: "Friendship", en: ["friend"] }),
  w("h1_074", 1, "\u6F02\u4EAE", "pi\xE0oliang", ["cantik", "elok"], ["\u8FD9\u4E2A\u516C\u56ED\u5F88\u6F02\u4EAE\u3002", "Zh\xE8ge g\u014Dngyu\xE1n h\u011Bn pi\xE0oliang.", "Taman ini indah sekali."], { pos: "adjektiva", emoji: "\u{1F338}", en: ["pretty", "beautiful"] }),
  w("h1_075", 1, "\u82F9\u679C", "p\xEDnggu\u01D2", ["apel"], ["\u82F9\u679C\u5F88\u751C\u3002", "P\xEDnggu\u01D2 h\u011Bn ti\xE1n.", "Apelnya manis."], { pos: "nomina", emoji: "\u{1F34E}", imageKey: "Apple", en: ["apple"] }),
  w("h1_076", 1, "\u4E03", "q\u012B", ["tujuh"], ["\u73B0\u5728\u662F\u4E03\u70B9\u3002", "Xi\xE0nz\xE0i sh\xEC q\u012B di\u01CEn.", "Sekarang jam tujuh."], { pos: "numeral", emoji: "7\uFE0F\u20E3", en: ["seven"] }),
  w("h1_077", 1, "\u9A91", "q\xED", ["menunggang (sepeda)"], ["\u6211\u4F1A\u9A91\u81EA\u884C\u8F66\u3002", "W\u01D2 hu\xEC q\xED z\xECx\xEDngch\u0113.", "Aku bisa bersepeda."], { pos: "verba", emoji: "\u{1F6B2}", en: ["to ride"] }),
  w("h1_078", 1, "\u524D\u9762", "qi\xE1nmi\xE0n", ["depan"], ["\u94F6\u884C\u5728\u524D\u9762\u3002", "Y\xEDnh\xE1ng z\xE0i qi\xE1nmi\xE0n.", "Bank ada di depan."], { pos: "nomina lokasi", emoji: "\u23E9", en: ["in front"] }),
  w("h1_079", 1, "\u8BF7", "q\u01D0ng", ["silakan", "mohon"], ["\u8BF7\u5750\u3002", "Q\u01D0ng zu\xF2.", "Silakan duduk."], { pos: "verba", emoji: "\u{1F647}", en: ["please", "invite"] }),
  w("h1_080", 1, "\u53BB", "q\xF9", ["pergi"], ["\u6211\u4EEC\u53BB\u516C\u56ED\u3002", "W\u01D2men q\xF9 g\u014Dngyu\xE1n.", "Kita pergi ke taman."], { pos: "verba", emoji: "\u{1F6B6}", en: ["go"] }),
  w("h1_081", 1, "\u70ED", "r\xE8", ["panas"], ["\u590F\u5929\u5F88\u70ED\u3002", "Xi\xE0ti\u0101n h\u011Bn r\xE8.", "Musim panas sangat panas."], { pos: "adjektiva", emoji: "\u{1F525}", imageKey: "Heat", en: ["hot"] }),
  w("h1_082", 1, "\u4EBA", "r\xE9n", ["orang", "manusia"], ["\u8FD9\u91CC\u4EBA\u5F88\u591A\u3002", "Zh\xE8l\u01D0 r\xE9n h\u011Bn du\u014D.", "Di sini banyak orang."], { pos: "nomina", emoji: "\u{1F9CD}", imageKey: "Human", en: ["person", "people"] }),
  w("h1_083", 1, "\u8BA4", "r\xE8n", ["mengenali", "mengakui"], ["\u6211\u8BA4\u8BC6\u4ED6\u3002", "W\u01D2 r\xE8nshi t\u0101.", "Aku mengenal dia."], { pos: "verba", en: ["recognize"] }),
  w("h1_084", 1, "\u65E5", "r\xEC", ["hari", "tanggal", "matahari"], ["\u5341\u6708\u4E00\u65E5", "sh\xEDyu\xE8 y\u012B r\xEC", "tanggal 1 Oktober"], { pos: "nomina waktu", emoji: "\u2600\uFE0F", imageKey: "Sun", en: ["sun", "day"] }),
  w("h1_085", 1, "\u4E09", "s\u0101n", ["tiga"], ["\u6211\u6709\u4E09\u4E2A\u82F9\u679C\u3002", "W\u01D2 y\u01D2u s\u0101n g\xE8 p\xEDnggu\u01D2.", "Aku punya tiga apel."], { pos: "numeral", emoji: "3\uFE0F\u20E3", en: ["three"] }),
  w("h1_086", 1, "\u5546\u5E97", "sh\u0101ngdi\xE0n", ["toko"], ["\u5546\u5E97\u516B\u70B9\u5F00\u95E8\u3002", "Sh\u0101ngdi\xE0n b\u0101 di\u01CEn k\u0101im\xE9n.", "Toko buka jam delapan."], { pos: "nomina", emoji: "\u{1F3EA}", imageKey: "Shop", en: ["shop", "store"] }),
  w("h1_087", 1, "\u4E0A", "sh\xE0ng", ["atas", "naik"], ["\u4E66\u5728\u684C\u5B50\u4E0A\u3002", "Sh\u016B z\xE0i zhu\u014Dzi sh\xE0ng.", "Buku ada di atas meja."], { pos: "nomina lokasi", emoji: "\u2B06\uFE0F", en: ["up", "on", "above"] }),
  w("h1_088", 1, "\u4E0A\u5348", "sh\xE0ngw\u01D4", ["pagi (sebelum siang)"], ["\u4E0A\u5348\u6211\u6709\u8BFE\u3002", "Sh\xE0ngw\u01D4 w\u01D2 y\u01D2u k\xE8.", "Pagi ini aku ada kelas."], { pos: "nomina waktu", emoji: "\u{1F324}\uFE0F", en: ["morning"] }),
  w("h1_089", 1, "\u8C01", "sh\xE9i", ["siapa"], ["\u4ED6\u662F\u8C01\uFF1F", "T\u0101 sh\xEC sh\xE9i?", "Siapa dia?"], { pos: "tanya", en: ["who"] }),
  w("h1_090", 1, "\u4EC0\u4E48", "sh\xE9nme", ["apa"], ["\u4F60\u8BF4\u4EC0\u4E48\uFF1F", "N\u01D0 shu\u014D sh\xE9nme?", "Kamu bilang apa?"], { pos: "tanya", en: ["what"] }),
  w("h1_091", 1, "\u5341", "sh\xED", ["sepuluh"], ["\u5341\u4E2A\u4EBA\u6765\u4E86\u3002", "Sh\xED g\xE8 r\xE9n l\xE1i le.", "Sepuluh orang datang."], { pos: "numeral", emoji: "\u{1F51F}", en: ["ten"] }),
  w("h1_092", 1, "\u65F6\u5019", "sh\xEDhou", ["waktu", "saat"], ["\u5C0F\u65F6\u5019\u6211\u4F4F\u5728\u8FD9\u91CC\u3002", "Xi\u01CEosh\xEDhou w\u01D2 zh\xF9 z\xE0i zh\xE8l\u01D0.", "Kecil dulu aku tinggal di sini."], { pos: "nomina waktu", emoji: "\u231B", en: ["time", "moment"] }),
  w("h1_093", 1, "\u662F", "sh\xEC", ["adalah"], ["\u4ED6\u662F\u533B\u751F\u3002", "T\u0101 sh\xEC y\u012Bsh\u0113ng.", "Dia adalah dokter."], { pos: "verba", emoji: "\u{1F7F0}", en: ["to be"] }),
  w("h1_094", 1, "\u4E66", "sh\u016B", ["buku"], ["\u6211\u559C\u6B22\u770B\u4E66\u3002", "W\u01D2 x\u01D0huan k\xE0n sh\u016B.", "Aku suka membaca buku."], { pos: "nomina", emoji: "\u{1F4D6}", imageKey: "Book", en: ["book"] }),
  w("h1_095", 1, "\u6C34", "shu\u01D0", ["air"], ["\u6211\u60F3\u559D\u6C34\u3002", "W\u01D2 xi\u01CEng h\u0113 shu\u01D0.", "Aku ingin minum air."], { pos: "nomina", emoji: "\u{1F4A7}", imageKey: "Water", en: ["water"] }),
  w("h1_096", 1, "\u7761\u89C9", "shu\xECji\xE0o", ["tidur"], ["\u6211\u5341\u70B9\u7761\u89C9\u3002", "W\u01D2 sh\xED di\u01CEn shu\xECji\xE0o.", "Aku tidur jam sepuluh."], { pos: "verba", emoji: "\u{1F634}", imageKey: "Sleep", en: ["sleep"] }),
  w("h1_097", 1, "\u8BF4\u8BDD", "shu\u014Dhu\xE0", ["berbicara"], ["\u8BF7\u5C0F\u58F0\u8BF4\u8BDD\u3002", "Q\u01D0ng xi\u01CEosh\u0113ng shu\u014Dhu\xE0.", "Tolong bicara pelan."], { pos: "verba", emoji: "\u{1F5E3}\uFE0F", imageKey: "Speech", en: ["speak", "talk"] }),
  w("h1_098", 1, "\u56DB", "s\xEC", ["empat"], ["\u4E00\u5E74\u6709\u56DB\u5B63\u3002", "Y\xEC ni\xE1n y\u01D2u s\xEC j\xEC.", "Satu tahun ada empat musim."], { pos: "numeral", emoji: "4\uFE0F\u20E3", en: ["four"] }),
  w("h1_099", 1, "\u5C81", "su\xEC", ["tahun (umur)"], ["\u6211\u4E8C\u5341\u5C81\u4E86\u3002", "W\u01D2 \xE8rsh\xED su\xEC le.", "Aku dua puluh tahun."], { pos: "kata bantu", emoji: "\u{1F382}", en: ["years old"] }),
  w("h1_100", 1, "\u4ED6", "t\u0101", ["dia (laki-laki)"], ["\u4ED6\u662F\u6211\u7684\u54E5\u54E5\u3002", "T\u0101 sh\xEC w\u01D2 de g\u0113ge.", "Dia adalah kakak laki-lakiku."], { pos: "pronomina", emoji: "\u{1F468}", en: ["he", "him"] }),
  w("h1_101", 1, "\u5979", "t\u0101", ["dia (perempuan)"], ["\u5979\u662F\u6211\u7684\u59D0\u59D0\u3002", "T\u0101 sh\xEC w\u01D2 de ji\u011Bjie.", "Dia adalah kakak perempuanku."], { pos: "pronomina", emoji: "\u{1F469}", en: ["she", "her"] }),
  w("h1_102", 1, "\u592A", "t\xE0i", ["terlalu", "sangat"], ["\u4ECA\u5929\u592A\u70ED\u4E86\u3002", "J\u012Bnti\u0101n t\xE0i r\xE8 le.", "Hari ini terlalu panas."], { pos: "adverbia", en: ["too", "extremely"] }),
  w("h1_103", 1, "\u5929\u6C14", "ti\u0101nq\xEC", ["cuaca"], ["\u660E\u5929\u5929\u6C14\u600E\u4E48\u6837\uFF1F", "M\xEDngti\u0101n ti\u0101nq\xEC z\u011Bnmey\xE0ng?", "Bagaimana cuaca besok?"], { pos: "nomina", emoji: "\u{1F326}\uFE0F", imageKey: "Weather", en: ["weather"] }),
  w("h1_104", 1, "\u8E22", "t\u012B", ["menendang"], ["\u6211\u4EEC\u53BB\u8E22\u8DB3\u7403\u5427\u3002", "W\u01D2men q\xF9 t\u012B z\xFAqi\xFA ba.", "Ayo kita main sepak bola."], { pos: "verba", emoji: "\u26BD", en: ["kick"] }),
  w("h1_105", 1, "\u542C", "t\u012Bng", ["mendengar", "mendengarkan"], ["\u6211\u559C\u6B22\u542C\u97F3\u4E50\u3002", "W\u01D2 x\u01D0huan t\u012Bng y\u012Bnyu\xE8.", "Aku suka mendengarkan musik."], { pos: "verba", emoji: "\u{1F442}", imageKey: "Hearing", en: ["listen"] }),
  w("h1_106", 1, "\u540C\u5B66", "t\xF3ngxu\xE9", ["teman sekelas"], ["\u4ED6\u662F\u6211\u7684\u540C\u5B66\u3002", "T\u0101 sh\xEC w\u01D2 de t\xF3ngxu\xE9.", "Dia teman sekelasku."], { pos: "nomina", emoji: "\u{1F392}", en: ["classmate"] }),
  w("h1_107", 1, "\u5582", "w\xE8i", ["halo (telepon)"], ["\u5582\uFF0C\u4F60\u597D\uFF01", "W\xE8i, n\u01D0 h\u01CEo!", "Halo, apa kabar!"], { pos: "ucapan", emoji: "\u260E\uFE0F", en: ["hello (phone)"] }),
  w("h1_108", 1, "\u6211", "w\u01D2", ["saya", "aku"], ["\u6211\u662F\u5B66\u751F\u3002", "W\u01D2 sh\xEC xu\xE9sheng.", "Saya seorang pelajar."], { pos: "pronomina", emoji: "\u{1F64B}", en: ["I", "me"] }),
  w("h1_109", 1, "\u4E94", "w\u01D4", ["lima"], ["\u73B0\u5728\u4E94\u70B9\u3002", "Xi\xE0nz\xE0i w\u01D4 di\u01CEn.", "Sekarang jam lima."], { pos: "numeral", emoji: "5\uFE0F\u20E3", en: ["five"] }),
  w("h1_110", 1, "\u559C\u6B22", "x\u01D0huan", ["suka"], ["\u6211\u559C\u6B22\u8FD9\u4E2A\u989C\u8272\u3002", "W\u01D2 x\u01D0huan zh\xE8ge y\xE1ns\xE8.", "Aku suka warna ini."], { pos: "verba", emoji: "\u{1F970}", en: ["like"] }),
  w("h1_111", 1, "\u4E0B\u9762", "xi\xE0mi\xE0n", ["di bawah"], ["\u732B\u5728\u684C\u5B50\u4E0B\u9762\u3002", "M\u0101o z\xE0i zhu\u014Dzi xi\xE0mi\xE0n.", "Kucingnya di bawah meja."], { pos: "nomina lokasi", emoji: "\u2B07\uFE0F", en: ["below", "under"] }),
  w("h1_112", 1, "\u4E0B\u5348", "xi\xE0w\u01D4", ["sore"], ["\u4E0B\u5348\u4E09\u70B9\u5F00\u4F1A\u3002", "Xi\xE0w\u01D4 s\u0101n di\u01CEn k\u0101ihu\xEC.", "Ada rapat jam tiga sore."], { pos: "nomina waktu", emoji: "\u{1F307}", en: ["afternoon"] }),
  w("h1_113", 1, "\u4E0B\u96E8", "xi\xE0 y\u01D4", ["hujan"], ["\u4ECA\u5929\u4E0B\u96E8\u4E86\u3002", "J\u012Bnti\u0101n xi\xE0 y\u01D4 le.", "Hari ini hujan."], { pos: "verba", emoji: "\u{1F327}\uFE0F", imageKey: "Rain", en: ["rain"] }),
  w("h1_114", 1, "\u590F\u5929", "xi\xE0ti\u0101n", ["musim panas"], ["\u590F\u5929\u6211\u4EEC\u53BB\u6D77\u8FB9\u3002", "Xi\xE0ti\u0101n w\u01D2men q\xF9 h\u01CEibi\u0101n.", "Musim panas kita ke pantai."], { pos: "nomina waktu", emoji: "\u{1F3D6}\uFE0F", imageKey: "Summer", en: ["summer"] }),
  w("h1_115", 1, "\u5148\u751F", "xi\u0101nsheng", ["Tuan", "Bapak"], ["\u738B\u5148\u751F\u662F\u8001\u5E08\u3002", "W\xE1ng xi\u0101nsheng sh\xEC l\u01CEosh\u012B.", "Tuan Wang adalah guru."], { pos: "nomina", emoji: "\u{1F935}", en: ["Mister", "sir"] }),
  w("h1_116", 1, "\u73B0\u5728", "xi\xE0nz\xE0i", ["sekarang"], ["\u73B0\u5728\u51E0\u70B9\uFF1F", "Xi\xE0nz\xE0i j\u01D0 di\u01CEn?", "Sekarang jam berapa?"], { pos: "nomina waktu", emoji: "\u23F0", en: ["now"] }),
  w("h1_117", 1, "\u60F3", "xi\u01CEng", ["ingin", "berpikir"], ["\u6211\u60F3\u56DE\u5BB6\u3002", "W\u01D2 xi\u01CEng hu\xED ji\u0101.", "Aku ingin pulang."], { pos: "verba", emoji: "\u{1F4AD}", imageKey: "Thought", en: ["want to", "think"] }),
  w("h1_118", 1, "\u5C0F", "xi\u01CEo", ["kecil"], ["\u6211\u7684\u623F\u95F4\u5F88\u5C0F\u3002", "W\u01D2 de f\xE1ngji\u0101n h\u011Bn xi\u01CEo.", "Kamarku kecil."], { pos: "adjektiva", emoji: "\u{1F42D}", en: ["small", "little"] }),
  w("h1_119", 1, "\u5C0F\u59D0", "xi\u01CEoji\u011B", ["Nona"], ["\u5C0F\u59D0\uFF0C\u8BF7\u95EE\u51E0\u70B9\u4E86\uFF1F", "Xi\u01CEoji\u011B, q\u01D0ngw\xE8n j\u01D0 di\u01CEn le?", "Nona, permisi jam berapa sekarang?"], { pos: "nomina", emoji: "\u{1F469}", en: ["Miss", "young lady"] }),
  w("h1_120", 1, "\u5199", "xi\u011B", ["menulis"], ["\u6211\u4F1A\u5199\u6C49\u5B57\u3002", "W\u01D2 hu\xEC xi\u011B h\xE0nz\xEC.", "Aku bisa menulis Hanzi."], { pos: "verba", emoji: "\u270D\uFE0F", imageKey: "Writing", en: ["write"] }),
  w("h1_121", 1, "\u8C22\u8C22", "xi\xE8xie", ["terima kasih"], ["\u8C22\u8C22\u4F60\u7684\u5E2E\u52A9\u3002", "Xi\xE8xie n\u01D0 de b\u0101ngzh\xF9.", "Terima kasih atas bantuanmu."], { pos: "ucapan", emoji: "\u{1F64F}", en: ["thank you"] }),
  w("h1_122", 1, "\u661F\u671F", "x\u012Bngq\u012B", ["minggu (pekan)"], ["\u8FD9\u4E2A\u661F\u671F\u5F88\u5FD9\u3002", "Zh\xE8ge x\u012Bngq\u012B h\u011Bn m\xE1ng.", "Pekan ini sibuk sekali."], { pos: "nomina waktu", emoji: "\u{1F4C6}", imageKey: "Week", en: ["week"] }),
  w("h1_123", 1, "\u5B66\u751F", "xu\xE9sheng", ["pelajar", "mahasiswa"], ["\u4ED6\u662F\u5927\u5B66\u751F\u3002", "T\u0101 sh\xEC d\xE0xu\xE9sh\u0113ng.", "Dia mahasiswa."], { pos: "nomina", emoji: "\u{1F393}", imageKey: "Student", en: ["student"] }),
  w("h1_124", 1, "\u5B66\u4E60", "xu\xE9x\xED", ["belajar"], ["\u6211\u5B66\u4E60\u6C49\u8BED\u3002", "W\u01D2 xu\xE9x\xED H\xE0ny\u01D4.", "Aku belajar bahasa Mandarin."], { pos: "verba", emoji: "\u{1F4DA}", imageKey: "Learning", en: ["study", "learn"] }),
  w("h1_125", 1, "\u5B66\u6821", "xu\xE9xi\xE0o", ["sekolah"], ["\u5B66\u6821\u79BB\u5BB6\u5F88\u8FD1\u3002", "Xu\xE9xi\xE0o l\xED ji\u0101 h\u011Bn j\xECn.", "Sekolahnya dekat dari rumah."], { pos: "nomina", emoji: "\u{1F3EB}", imageKey: "School", en: ["school"] }),
  w("h1_126", 1, "\u4E00", "y\u012B", ["satu"], ["\u4E00\u676F\u5496\u5561", "y\xEC b\u0113i k\u0101f\u0113i", "satu cangkir kopi"], { pos: "numeral", emoji: "1\uFE0F\u20E3", en: ["one"] }),
  w("h1_127", 1, "\u4E00\u70B9\u513F", "y\xECdi\u01CEnr", ["sedikit"], ["\u6211\u4F1A\u8BF4\u4E00\u70B9\u513F\u6C49\u8BED\u3002", "W\u01D2 hu\xEC shu\u014D y\xECdi\u01CEnr H\xE0ny\u01D4.", "Aku bisa bicara sedikit Mandarin."], { pos: "nomina", en: ["a little"] }),
  w("h1_128", 1, "\u8863\u670D", "y\u012Bfu", ["pakaian"], ["\u8FD9\u4EF6\u8863\u670D\u5F88\u6F02\u4EAE\u3002", "Zh\xE8 ji\xE0n y\u012Bfu h\u011Bn pi\xE0oliang.", "Pakaian ini cantik sekali."], { pos: "nomina", emoji: "\u{1F455}", imageKey: "Clothing", en: ["clothes"] }),
  w("h1_129", 1, "\u533B\u751F", "y\u012Bsh\u0113ng", ["dokter"], ["\u533B\u751F\u5728\u533B\u9662\u5DE5\u4F5C\u3002", "Y\u012Bsh\u0113ng z\xE0i y\u012Byu\xE0n g\u014Dngzu\xF2.", "Dokter bekerja di rumah sakit."], { pos: "nomina", emoji: "\u{1FA7A}", imageKey: "Physician", en: ["doctor"] }),
  w("h1_130", 1, "\u533B\u9662", "y\u012Byu\xE0n", ["rumah sakit"], ["\u533B\u9662\u79BB\u8FD9\u91CC\u5F88\u8FD1\u3002", "Y\u012Byu\xE0n l\xED zh\xE8l\u01D0 h\u011Bn j\xECn.", "Rumah sakit dekat dari sini."], { pos: "nomina", emoji: "\u{1F3E5}", imageKey: "Hospital", en: ["hospital"] }),
  w("h1_131", 1, "\u6905\u5B50", "y\u01D0zi", ["kursi"], ["\u8FD9\u628A\u6905\u5B50\u5F88\u8212\u670D\u3002", "Zh\xE8 b\u01CE y\u01D0zi h\u011Bn sh\u016Bfu.", "Kursi ini nyaman."], { pos: "nomina", emoji: "\u{1FA91}", imageKey: "Chair", en: ["chair"] }),
  w("h1_132", 1, "\u6709", "y\u01D2u", ["punya", "ada"], ["\u6211\u6709\u4E00\u8F86\u8F66\u3002", "W\u01D2 y\u01D2u y\xED li\xE0ng ch\u0113.", "Aku punya satu mobil."], { pos: "verba", emoji: "\u{1F511}", en: ["have", "there is"] }),
  w("h1_133", 1, "\u6708", "yu\xE8", ["bulan"], ["\u4E00\u5E74\u6709\u5341\u4E8C\u4E2A\u6708\u3002", "Y\xEC ni\xE1n y\u01D2u sh\xED'\xE8r g\xE8 yu\xE8.", "Setahun ada dua belas bulan."], { pos: "nomina waktu", emoji: "\u{1F319}", imageKey: "Month", en: ["month", "moon"] }),
  w("h1_134", 1, "\u5728", "z\xE0i", ["di", "berada di"], ["\u4ED6\u5728\u5BB6\u3002", "T\u0101 z\xE0i ji\u0101.", "Dia ada di rumah."], { pos: "preposisi/verba", emoji: "\u{1F4CD}", en: ["at", "in", "to be located"] }),
  w("h1_135", 1, "\u518D\u89C1", "z\xE0iji\xE0n", ["sampai jumpa"], ["\u8001\u5E08\uFF0C\u518D\u89C1\uFF01", "L\u01CEosh\u012B, z\xE0iji\xE0n!", "Sampai jumpa, Guru!"], { pos: "ucapan", emoji: "\u{1F44B}", en: ["goodbye"] }),
  w("h1_136", 1, "\u600E\u4E48", "z\u011Bnme", ["bagaimana"], ["\u4F60\u600E\u4E48\u6765\u5B66\u6821\uFF1F", "N\u01D0 z\u011Bnme l\xE1i xu\xE9xi\xE0o?", "Kamu ke sekolah bagaimana?"], { pos: "tanya", en: ["how", "why"] }),
  w("h1_137", 1, "\u600E\u4E48\u6837", "z\u011Bnmey\xE0ng", ["bagaimana"], ["\u4ECA\u5929\u4F60\u600E\u4E48\u6837\uFF1F", "J\u012Bnti\u0101n n\u01D0 z\u011Bnmey\xE0ng?", "Bagaimana harimu?"], { pos: "tanya", en: ["how about", "how is"] }),
  w("h1_138", 1, "\u8FD9", "zh\xE8", ["ini"], ["\u8FD9\u662F\u6211\u7684\u5BB6\u3002", "Zh\xE8 sh\xEC w\u01D2 de ji\u0101.", "Ini rumahku."], { pos: "pronomina", emoji: "\u{1F449}", en: ["this"] }),
  w("h1_139", 1, "\u4E2D\u56FD", "Zh\u014Dnggu\xF3", ["Tiongkok"], ["\u4E2D\u56FD\u5F88\u5927\u3002", "Zh\u014Dnggu\xF3 h\u011Bn d\xE0.", "Tiongkok itu luas."], { pos: "nama tempat", emoji: "\u{1F1E8}\u{1F1F3}", imageKey: "China", en: ["China"] }),
  w("h1_140", 1, "\u4E2D\u5348", "zh\u014Dngw\u01D4", ["tengah hari"], ["\u4E2D\u5348\u6211\u4EEC\u5403\u996D\u3002", "Zh\u014Dngw\u01D4 w\u01D2men ch\u012Bf\xE0n.", "Tengah hari kita makan."], { pos: "nomina waktu", emoji: "\u2600\uFE0F", en: ["noon"] }),
  w("h1_141", 1, "\u4F4F", "zh\xF9", ["tinggal (bermukim)"], ["\u6211\u4F4F\u5728\u5317\u4EAC\u3002", "W\u01D2 zh\xF9 z\xE0i B\u011Bij\u012Bng.", "Aku tinggal di Beijing."], { pos: "verba", emoji: "\u{1F3D8}\uFE0F", imageKey: "Residence", en: ["live", "reside"] }),
  w("h1_142", 1, "\u684C\u5B50", "zhu\u014Dzi", ["meja"], ["\u684C\u5B50\u4E0A\u6709\u4E24\u672C\u4E66\u3002", "Zhu\u014Dzi sh\xE0ng y\u01D2u li\u01CEng b\u011Bn sh\u016B.", "Di atas meja ada dua buku."], { pos: "nomina", emoji: "\u{1FAB5}", imageKey: "Table", en: ["table", "desk"] }),
  w("h1_143", 1, "\u5B57", "z\xEC", ["huruf", "karakter"], ["\u8FD9\u4E2A\u5B57\u6211\u4E0D\u8BA4\u8BC6\u3002", "Zh\xE8ge z\xEC w\u01D2 b\xFA r\xE8nshi.", "Aku tidak kenal karakter ini."], { pos: "nomina", emoji: "\u{1F520}", en: ["character", "word"] }),
  w("h1_144", 1, "\u6628\u5929", "zu\xF3ti\u0101n", ["kemarin"], ["\u6628\u5929\u6211\u53BB\u4E86\u516C\u56ED\u3002", "Zu\xF3ti\u0101n w\u01D2 q\xF9le g\u014Dngyu\xE1n.", "Kemarin aku pergi ke taman."], { pos: "nomina waktu", emoji: "\u{1F570}\uFE0F", en: ["yesterday"] }),
  w("h1_145", 1, "\u5750", "zu\xF2", ["duduk", "naik (kendaraan)"], ["\u8BF7\u5750\u8FD9\u91CC\u3002", "Q\u01D0ng zu\xF2 zh\xE8l\u01D0.", "Silakan duduk di sini."], { pos: "verba", emoji: "\u{1FA91}", imageKey: "Sitting", en: ["sit", "take (transport)"] }),
  w("h1_146", 1, "\u505A", "zu\xF2", ["membuat", "melakukan"], ["\u4F60\u5728\u505A\u4EC0\u4E48\uFF1F", "N\u01D0 z\xE0i zu\xF2 sh\xE9nme?", "Kamu sedang melakukan apa?"], { pos: "verba", emoji: "\u{1F528}", imageKey: "Making", en: ["do", "make"] }),
  w("h1_147", 1, "\u4E0A\u8BFE", "sh\xE0ng k\xE8", ["masuk kelas"], ["\u516B\u70B9\u4E0A\u8BFE\u3002", "B\u0101 di\u01CEn sh\xE0ng k\xE8.", "Kelas mulai jam delapan."], { pos: "verba", emoji: "\u{1F3EB}", en: ["attend class"] }),
  w("h1_148", 1, "\u5462\u5B50", "n\xEDzi", ["kain wol"], ["\u8FD9\u4EF6\u5462\u5B50\u5927\u8863\u5F88\u6696\u548C\u3002", "Zh\xE8 ji\xE0n n\xEDzi d\xE0y\u012B h\u011Bn nu\u01CEnhuo.", "Mantel wol ini hangat."], { pos: "nomina", emoji: "\u{1F9E5}", en: ["woolen cloth"] }),
  w("h1_149", 1, "\u7535\u5F71", "di\xE0ny\u01D0ng", ["film"], ["\u6211\u4EEC\u53BB\u770B\u7535\u5F71\u5427\u3002", "W\u01D2men q\xF9 k\xE0n di\xE0ny\u01D0ng ba.", "Ayo kita nonton film."], { pos: "nomina", emoji: "\u{1F3AC}", imageKey: "Film", en: ["movie"] }),
  w("h1_150", 1, "\u5206", "f\u0113n", ["menit", "poin"], ["\u73B0\u5728\u5341\u70B9\u5341\u5206\u3002", "Xi\xE0nz\xE0i sh\xED di\u01CEn sh\xED f\u0113n.", "Sekarang jam sepuluh lewat sepuluh."], { pos: "kata bantu", emoji: "\u23F1\uFE0F", en: ["minute", "point"] })
];

// src/services/chinese/dataset/hsk2.ts
var HSK2_WORDS = [
  w("h2_001", 2, "\u5E2E\u5FD9", "b\u0101ngm\xE1ng", ["menolong", "membantu"], ["\u8BF7\u5E2E\u6211\u4E00\u4E2A\u5FD9\u3002", "Q\u01D0ng b\u0101ng w\u01D2 y\xED g\xE8 m\xE1ng.", "Tolong bantu aku."], { pos: "verba", emoji: "\u{1F91D}", en: ["help"] }),
  w("h2_002", 2, "\u62A5\u7EB8", "b\xE0ozh\u01D0", ["koran"], ["\u7237\u7237\u6BCF\u5929\u770B\u62A5\u7EB8\u3002", "Y\xE9ye m\u011Biti\u0101n k\xE0n b\xE0ozh\u01D0.", "Kakek membaca koran tiap hari."], { pos: "nomina", emoji: "\u{1F4F0}", imageKey: "Newspaper", en: ["newspaper"] }),
  w("h2_003", 2, "\u6BD4", "b\u01D0", ["dibanding", "lebih dari"], ["\u4ED6\u6BD4\u6211\u9AD8\u3002", "T\u0101 b\u01D0 w\u01D2 g\u0101o.", "Dia lebih tinggi dariku."], { pos: "preposisi", en: ["than", "compare"] }),
  w("h2_004", 2, "\u522B", "bi\xE9", ["jangan"], ["\u522B\u62C5\u5FC3\uFF01", "Bi\xE9 d\u0101nx\u012Bn!", "Jangan khawatir!"], { pos: "adverbia", emoji: "\u270B", en: ["don't"] }),
  w("h2_005", 2, "\u522B\u4EBA", "bi\xE9r\xE9n", ["orang lain"], ["\u522B\u7BA1\u522B\u4EBA\u600E\u4E48\u8BF4\u3002", "Bi\xE9 gu\u01CEn bi\xE9r\xE9n z\u011Bnme shu\u014D.", "Biarkan orang lain berkata apa."], { pos: "nomina", emoji: "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}", en: ["other people"] }),
  w("h2_006", 2, "\u5BBE\u9986", "b\u012Bngu\u01CEn", ["hotel"], ["\u5BBE\u9986\u79BB\u8F66\u7AD9\u5F88\u8FD1\u3002", "B\u012Bngu\u01CEn l\xED ch\u0113zh\xE0n h\u011Bn j\xECn.", "Hotelnya dekat dari stasiun."], { pos: "nomina", emoji: "\u{1F3E8}", imageKey: "Hotel", en: ["hotel"] }),
  w("h2_007", 2, "\u51B0", "b\u012Bng", ["es", "beku"], ["\u996E\u6599\u91CC\u52A0\u51B0\u3002", "Y\u01D0nli\xE0o l\u01D0 ji\u0101 b\u012Bng.", "Minumannya diberi es."], { pos: "nomina", emoji: "\u{1F9CA}", imageKey: "Ice", en: ["ice"] }),
  w("h2_008", 2, "\u8FB9", "bi\u0101n", ["sisi", "tepi"], ["\u6CB3\u8FB9\u6709\u5F88\u591A\u6811\u3002", "H\xE9 bi\u0101n y\u01D2u h\u011Bn du\u014D sh\xF9.", "Di tepi sungai banyak pohon."], { pos: "nomina", emoji: "\u{1F6E3}\uFE0F", en: ["side", "edge"] }),
  w("h2_009", 2, "\u4F46\u662F", "d\xE0nsh\xEC", ["tetapi"], ["\u6211\u60F3\u53BB\uFF0C\u4F46\u662F\u5F88\u5FD9\u3002", "W\u01D2 xi\u01CEng q\xF9, d\xE0nsh\xEC h\u011Bn m\xE1ng.", "Aku ingin pergi, tapi sibuk."], { pos: "konjungsi", en: ["but"] }),
  w("h2_010", 2, "\u86CB\u7CD5", "d\xE0ng\u0101o", ["kue"], ["\u751F\u65E5\u86CB\u7CD5\u5F88\u597D\u5403\u3002", "Sh\u0113ngr\xEC d\xE0ng\u0101o h\u011Bn h\u01CEoch\u012B.", "Kue ulang tahunnya enak."], { pos: "nomina", emoji: "\u{1F382}", imageKey: "Cake", en: ["cake"] }),
  w("h2_011", 2, "\u62C5\u5FC3", "d\u0101nx\u012Bn", ["khawatir"], ["\u5988\u5988\u5F88\u62C5\u5FC3\u6211\u3002", "M\u0101ma h\u011Bn d\u0101nx\u012Bn w\u01D2.", "Ibu sangat khawatir kepadaku."], { pos: "verba", emoji: "\u{1F61F}", en: ["worry"] }),
  w("h2_012", 2, "\u5730\u7403", "d\xECqi\xFA", ["bumi"], ["\u5730\u7403\u662F\u6211\u4EEC\u7684\u5BB6\u3002", "D\xECqi\xFA sh\xEC w\u01D2men de ji\u0101.", "Bumi adalah rumah kita."], { pos: "nomina", emoji: "\u{1F30D}", imageKey: "Earth", en: ["Earth"] }),
  w("h2_013", 2, "\u5730\u65B9", "d\xECfang", ["tempat"], ["\u8FD9\u4E2A\u5730\u65B9\u5F88\u7F8E\u3002", "Zh\xE8ge d\xECfang h\u011Bn m\u011Bi.", "Tempat ini indah."], { pos: "nomina", emoji: "\u{1F4CD}", en: ["place"] }),
  w("h2_014", 2, "\u5065\u5EB7", "ji\xE0nk\u0101ng", ["sehat", "kesehatan"], ["\u795D\u4F60\u8EAB\u4F53\u5065\u5EB7\uFF01", "Zh\xF9 n\u01D0 sh\u0113nt\u01D0 ji\xE0nk\u0101ng!", "Semoga tubuhmu sehat!"], { pos: "adjektiva/nomina", emoji: "\u{1F4AA}", imageKey: "Health", en: ["health", "healthy"] }),
  w("h2_015", 2, "\u4E1C", "d\u014Dng", ["timur"], ["\u592A\u9633\u4ECE\u4E1C\u65B9\u5347\u8D77\u3002", "T\xE0iy\xE1ng c\xF3ng d\u014Dngf\u0101ng sh\u0113ngq\u01D0.", "Matahari terbit dari timur."], { pos: "nomina", emoji: "\u{1F9ED}", imageKey: "East", en: ["east"] }),
  w("h2_016", 2, "\u51AC", "d\u014Dng", ["musim dingin"], ["\u51AC\u5929\u4E0B\u96EA\u3002", "D\u014Dngti\u0101n xi\xE0 xu\u011B.", "Musim dingin turun salju."], { pos: "nomina waktu", emoji: "\u26C4", imageKey: "Winter", en: ["winter"] }),
  w("h2_017", 2, "\u52A8\u7269", "d\xF2ngw\xF9", ["hewan"], ["\u5B69\u5B50\u559C\u6B22\u52A8\u7269\u3002", "H\xE1izi x\u01D0huan d\xF2ngw\xF9.", "Anak-anak suka hewan."], { pos: "nomina", emoji: "\u{1F43E}", imageKey: "Animal", en: ["animal"] }),
  w("h2_018", 2, "\u77ED", "du\u01CEn", ["pendek"], ["\u8FD9\u6761\u88D9\u5B50\u5F88\u77ED\u3002", "Zh\xE8 ti\xE1o q\xFAnzi h\u011Bn du\u01CEn.", "Rok ini pendek."], { pos: "adjektiva", emoji: "\u{1F4CF}", en: ["short"] }),
  w("h2_019", 2, "\u6BB5", "du\xE0n", ["bagian", "kata bantu"], ["\u8FD9\u6BB5\u8DEF\u5F88\u597D\u8D70\u3002", "Zh\xE8 du\xE0n l\xF9 h\u011Bn h\u01CEo z\u01D2u.", "Jalur ini mudah dilewati."], { pos: "kata bantu", en: ["segment", "paragraph"] }),
  w("h2_020", 2, "\u5806", "du\u012B", ["tumpukan"], ["\u684C\u4E0A\u6709\u4E00\u5806\u4E66\u3002", "Zhu\u014D sh\xE0ng y\u01D2u y\xEC du\u012B sh\u016B.", "Di atas meja ada setumpuk buku."], { pos: "nomina/kata bantu", emoji: "\u{1F4DA}", en: ["pile"] }),
  w("h2_021", 2, "\u5BF9", "du\xEC", ["benar", "tepat"], ["\u4F60\u7684\u7B54\u6848\u662F\u5BF9\u7684\u3002", "N\u01D0 de d\xE1'\xE0n sh\xEC du\xEC de.", "Jawabanmu benar."], { pos: "adjektiva", emoji: "\u2714\uFE0F", en: ["correct", "right"] }),
  w("h2_022", 2, "\u53D1", "f\u0101", ["mengirim", "mengeluarkan"], ["\u6211\u7ED9\u4F60\u53D1\u90AE\u4EF6\u3002", "W\u01D2 g\u011Bi n\u01D0 f\u0101 y\xF3uji\xE0n.", "Aku kirim email kepadamu."], { pos: "verba", emoji: "\u{1F4E8}", en: ["send", "emit"] }),
  w("h2_023", 2, "\u653E\u5FC3", "f\xE0ngx\u012Bn", ["tenang", "tidak khawatir"], ["\u8BF7\u653E\u5FC3\uFF0C\u6211\u5F88\u597D\u3002", "Q\u01D0ng f\xE0ngx\u012Bn, w\u01D2 h\u011Bn h\u01CEo.", "Tenang saja, aku baik."], { pos: "verba", emoji: "\u{1F60C}", en: ["be at ease"] }),
  w("h2_024", 2, "\u4E07", "w\xE0n", ["sepuluh ribu"], ["\u8FD9\u672C\u4E66\u6709\u4E00\u4E07\u5B57\u3002", "Zh\xE8 b\u011Bn sh\u016B y\u01D2u y\xED w\xE0n z\xEC.", "Buku ini ada sepuluh ribu karakter."], { pos: "numeral", emoji: "\u{1F522}", en: ["ten thousand"] }),
  w("h2_025", 2, "\u4E3A\u4EC0\u4E48", "w\xE8ish\xE9nme", ["mengapa", "kenapa"], ["\u4F60\u4E3A\u4EC0\u4E48\u8FDF\u5230\uFF1F", "N\u01D0 w\xE8ish\xE9nme ch\xEDd\xE0o?", "Kenapa kamu terlambat?"], { pos: "tanya", en: ["why"] }),
  w("h2_026", 2, "\u53EF\u80FD", "k\u011Bn\xE9ng", ["mungkin"], ["\u660E\u5929\u53EF\u80FD\u4E0B\u96E8\u3002", "M\xEDngti\u0101n k\u011Bn\xE9ng xi\xE0 y\u01D4.", "Besok mungkin hujan."], { pos: "adverbia", emoji: "\u2753", en: ["maybe", "possible"] }),
  w("h2_027", 2, "\u53EF\u4EE5", "k\u011By\u01D0", ["boleh", "bisa"], ["\u8FD9\u91CC\u53EF\u4EE5\u62CD\u7167\u3002", "Zh\xE8l\u01D0 k\u011By\u01D0 p\u0101izh\xE0o.", "Di sini boleh memotret."], { pos: "verba modal", emoji: "\u{1F646}", en: ["can", "may"] }),
  w("h2_028", 2, "\u6E34", "k\u011B", ["haus"], ["\u6211\u5F88\u6E34\u3002", "W\u01D2 h\u011Bn k\u011B.", "Aku haus sekali."], { pos: "adjektiva", emoji: "\u{1F975}", en: ["thirsty"] }),
  w("h2_029", 2, "\u53EF\u7231", "k\u011B'\xE0i", ["menggemaskan"], ["\u8FD9\u53EA\u732B\u771F\u53EF\u7231\u3002", "Zh\xE8 zh\u012B m\u0101o zh\u0113n k\u011B'\xE0i.", "Kucing ini menggemaskan."], { pos: "adjektiva", emoji: "\u{1F970}", en: ["cute", "lovely"] }),
  w("h2_030", 2, "\u5FEB", "ku\xE0i", ["cepat"], ["\u8F66\u5F00\u5F97\u5F88\u5FEB\u3002", "Ch\u0113 k\u0101i de h\u011Bn ku\xE0i.", "Mobilnya jalan cepat."], { pos: "adjektiva", emoji: "\u26A1", imageKey: "Speed", en: ["fast", "quick"] }),
  w("h2_031", 2, "\u7D2F", "l\xE8i", ["lelah"], ["\u4ECA\u5929\u5DE5\u4F5C\u5F88\u7D2F\u3002", "J\u012Bnti\u0101n g\u014Dngzu\xF2 h\u011Bn l\xE8i.", "Kerja hari ini melelahkan."], { pos: "adjektiva", emoji: "\u{1F629}", en: ["tired"] }),
  w("h2_032", 2, "\u4E86\u89E3", "li\u01CEoji\u011B", ["mengerti", "memahami"], ["\u6211\u4E86\u89E3\u4ED6\u7684\u60F3\u6CD5\u3002", "W\u01D2 li\u01CEoji\u011B t\u0101 de xi\u01CEngf\u01CE.", "Aku paham pemikirannya."], { pos: "verba", emoji: "\u{1F4A1}", en: ["understand"] }),
  w("h2_033", 2, "\u7EFF", "l\u01DC", ["hijau"], ["\u6811\u53F6\u662F\u7EFF\u8272\u7684\u3002", "Sh\xF9y\xE8 sh\xEC l\u01DCs\xE8 de.", "Daun berwarna hijau."], { pos: "adjektiva", emoji: "\u{1F7E2}", imageKey: "Green", en: ["green"] }),
  w("h2_034", 2, "\u6162", "m\xE0n", ["lambat", "pelan"], ["\u8BF7\u8BF4\u6162\u4E00\u70B9\u3002", "Q\u01D0ng shu\u014D m\xE0n y\xECdi\u01CEn.", "Tolong bicara lebih pelan."], { pos: "adjektiva", emoji: "\u{1F422}", imageKey: "Tortoise", en: ["slow"] }),
  w("h2_035", 2, "\u5FD9", "m\xE1ng", ["sibuk"], ["\u8FD9\u5468\u6211\u5F88\u5FD9\u3002", "Zh\xE8 zh\u014Du w\u01D2 h\u011Bn m\xE1ng.", "Pekan ini aku sibuk."], { pos: "adjektiva", emoji: "\u{1F3C3}", en: ["busy"] }),
  w("h2_036", 2, "\u5E3D", "m\xE0o", ["topi"], ["\u51AC\u5929\u8981\u6234\u5E3D\u5B50\u3002", "D\u014Dngti\u0101n y\xE0o d\xE0i m\xE0ozi.", "Musim dingin harus pakai topi."], { pos: "nomina", emoji: "\u{1F3A9}", imageKey: "Hat", en: ["hat"] }),
  w("h2_037", 2, "\u95E8", "m\xE9n", ["pintu"], ["\u8BF7\u5173\u95E8\u3002", "Q\u01D0ng gu\u0101n m\xE9n.", "Tolong tutup pintu."], { pos: "nomina", emoji: "\u{1F6AA}", imageKey: "Door", en: ["door"] }),
  w("h2_038", 2, "\u7C73", "m\u01D0", ["meter", "beras"], ["\u8FD9\u95F4\u623F\u4E8C\u5341\u5E73\u65B9\u7C73\u3002", "Zh\xE8 ji\u0101n f\xE1ng \xE8rsh\xED p\xEDngf\u0101ng m\u01D0.", "Ruangan ini dua puluh meter persegi."], { pos: "kata bantu/nomina", emoji: "\u{1F4CF}", imageKey: "Rice", en: ["meter", "uncooked rice"] }),
  w("h2_039", 2, "\u9762\u5305", "mi\xE0nb\u0101o", ["roti"], ["\u65E9\u9910\u6211\u5403\u9762\u5305\u3002", "Z\u01CEoc\u0101n w\u01D2 ch\u012B mi\xE0nb\u0101o.", "Sarapan aku makan roti."], { pos: "nomina", emoji: "\u{1F35E}", imageKey: "Bread", en: ["bread"] }),
  w("h2_040", 2, "\u62FF", "n\xE1", ["mengambil"], ["\u8BF7\u5E2E\u6211\u62FF\u4E00\u4E0B\u3002", "Q\u01D0ng b\u0101ng w\u01D2 n\xE1 y\xEDxi\xE0.", "Tolong ambilkan sebentar."], { pos: "verba", emoji: "\u{1F932}", en: ["take", "hold"] }),
  w("h2_041", 2, "\u5976", "n\u01CEi", ["susu", "nenek"], ["\u5B69\u5B50\u6BCF\u5929\u559D\u725B\u5976\u3002", "H\xE1izi m\u011Biti\u0101n h\u0113 ni\xFAn\u01CEi.", "Anak minum susu tiap hari."], { pos: "nomina", emoji: "\u{1F95B}", imageKey: "Milk", en: ["milk", "grandma"] }),
  w("h2_042", 2, "\u5357", "n\xE1n", ["selatan"], ["\u4ED6\u6765\u81EA\u5357\u65B9\u3002", "T\u0101 l\xE1iz\xEC n\xE1nf\u0101ng.", "Dia dari selatan."], { pos: "nomina", emoji: "\u{1F9ED}", imageKey: "South", en: ["south"] }),
  w("h2_043", 2, "\u96BE", "n\xE1n", ["sulit"], ["\u8FD9\u4E2A\u95EE\u9898\u5F88\u96BE\u3002", "Zh\xE8ge w\xE8nt\xED h\u011Bn n\xE1n.", "Soal ini sulit."], { pos: "adjektiva", emoji: "\u{1F9E9}", imageKey: "Difficulty", en: ["difficult"] }),
  w("h2_044", 2, "\u5185\u5BB9", "n\xE8ir\xF3ng", ["isi", "konten"], ["\u8FD9\u672C\u4E66\u5185\u5BB9\u5F88\u597D\u3002", "Zh\xE8 b\u011Bn sh\u016B n\xE8ir\xF3ng h\u011Bn h\u01CEo.", "Isi buku ini bagus."], { pos: "nomina", emoji: "\u{1F4DD}", en: ["content"] }),
  w("h2_045", 2, "\u5E74\u9F84", "ni\xE1nl\xEDng", ["usia"], ["\u4E0D\u8981\u95EE\u5973\u58EB\u7684\u5E74\u9F84\u3002", "B\xFA y\xE0o w\xE8n n\u01DAsh\xEC de ni\xE1nl\xEDng.", "Jangan tanya usia wanita."], { pos: "nomina", emoji: "\u{1F382}", en: ["age"] }),
  w("h2_046", 2, "\u9E1F", "ni\u01CEo", ["burung"], ["\u6811\u4E0A\u6709\u4E00\u53EA\u9E1F\u3002", "Sh\xF9 sh\xE0ng y\u01D2u y\xEC zh\u012B ni\u01CEo.", "Di pohon ada seekor burung."], { pos: "nomina", emoji: "\u{1F426}", imageKey: "Bird", en: ["bird"] }),
  w("h2_047", 2, "\u52AA\u529B", "n\u01D4l\xEC", ["berusaha keras"], ["\u5B66\u4E60\u8981\u52AA\u529B\u3002", "Xu\xE9x\xED y\xE0o n\u01D4l\xEC.", "Belajar harus tekun."], { pos: "adjektiva/verba", emoji: "\u{1F4AA}", en: ["effort", "hard-working"] }),
  w("h2_048", 2, "\u8DD1", "p\u01CEo", ["berlari"], ["\u4ED6\u8DD1\u5F97\u5F88\u5FEB\u3002", "T\u0101 p\u01CEo de h\u011Bn ku\xE0i.", "Dia lari cepat."], { pos: "verba", emoji: "\u{1F3C3}", imageKey: "Running", en: ["run"] }),
  w("h2_049", 2, "\u80D6", "p\xE0ng", ["gemuk"], ["\u8FD9\u53EA\u732A\u5F88\u80D6\u3002", "Zh\xE8 zh\u012B zh\u016B h\u011Bn p\xE0ng.", "Babi ini gemuk."], { pos: "adjektiva", emoji: "\u{1F437}", en: ["fat"] }),
  w("h2_050", 2, "\u76AE\u978B", "p\xEDxi\xE9", ["sepatu kulit"], ["\u4ED6\u7A7F\u7740\u9ED1\u76AE\u978B\u3002", "T\u0101 chu\u0101nzhe h\u0113i p\xEDxi\xE9.", "Dia memakai sepatu kulit hitam."], { pos: "nomina", emoji: "\u{1F45E}", imageKey: "Leather shoe", en: ["leather shoes"] }),
  w("h2_051", 2, "\u4FBF\u5B9C", "pi\xE1nyi", ["murah"], ["\u8FD9\u4E2A\u4E1C\u897F\u5F88\u4FBF\u5B9C\u3002", "Zh\xE8ge d\u014Dngxi h\u011Bn pi\xE1nyi.", "Barang ini murah."], { pos: "adjektiva", emoji: "\u{1F3F7}\uFE0F", en: ["cheap"] }),
  w("h2_052", 2, "\u7968", "pi\xE0o", ["tiket"], ["\u6211\u4E70\u4E86\u4E24\u5F20\u7968\u3002", "W\u01D2 m\u01CEile li\u01CEng zh\u0101ng pi\xE0o.", "Aku beli dua tiket."], { pos: "nomina", emoji: "\u{1F39F}\uFE0F", imageKey: "Ticket", en: ["ticket"] }),
  w("h2_053", 2, "\u897F\u74DC", "x\u012Bgu\u0101", ["semangka"], ["\u590F\u5929\u7684\u897F\u74DC\u5F88\u751C\u3002", "Xi\xE0ti\u0101n de x\u012Bgu\u0101 h\u011Bn ti\xE1n.", "Semangka musim panas manis."], { pos: "nomina", emoji: "\u{1F349}", imageKey: "Watermelon", en: ["watermelon"] }),
  w("h2_054", 2, "\u5176\u5B9E", "q\xEDsh\xED", ["sebenarnya"], ["\u5176\u5B9E\u6211\u65E9\u77E5\u9053\u4E86\u3002", "Q\xEDsh\xED w\u01D2 z\u01CEo zh\u012Bd\xE0o le.", "Sebenarnya aku sudah tahu."], { pos: "adverbia", en: ["actually"] }),
  w("h2_055", 2, "\u5947\u602A", "q\xEDgu\xE0i", ["aneh"], ["\u8FD9\u4E2A\u58F0\u97F3\u5F88\u5947\u602A\u3002", "Zh\xE8ge sh\u0113ngy\u012Bn h\u011Bn q\xEDgu\xE0i.", "Suara ini aneh."], { pos: "adjektiva", emoji: "\u{1F914}", en: ["strange", "weird"] }),
  w("h2_056", 2, "\u8D77", "q\u01D0", ["bangkit", "mulai"], ["\u8BF7\u7AD9\u8D77\u6765\u3002", "Q\u01D0ng zh\xE0n q\u01D0l\xE1i.", "Tolong berdiri."], { pos: "verba", en: ["rise", "start"] }),
  w("h2_057", 2, "\u5168\u90E8", "qu\xE1nb\xF9", ["semua"], ["\u4F5C\u4E1A\u5168\u90E8\u5B8C\u6210\u4E86\u3002", "Zu\xF2y\xE8 qu\xE1nb\xF9 w\xE1nch\xE9ng le.", "PR selesai semua."], { pos: "nomina", emoji: "\u{1F9EE}", en: ["all", "whole"] }),
  w("h2_058", 2, "\u5374", "qu\xE8", ["namun", "justru"], ["\u4ED6\u8BF4\u4E86\uFF0C\u5374\u6CA1\u505A\u5230\u3002", "T\u0101 shu\u014D le, qu\xE8 m\xE9i zu\xF2d\xE0o.", "Dia berkata tapi tidak melakukannya."], { pos: "adverbia", en: ["yet", "but"] }),
  w("h2_059", 2, "\u7136\u540E", "r\xE1nh\xF2u", ["kemudian"], ["\u5148\u6D17\u624B\uFF0C\u7136\u540E\u5403\u996D\u3002", "Xi\u0101n x\u01D0 sh\u01D2u, r\xE1nh\xF2u ch\u012Bf\xE0n.", "Cuci tangan dulu, lalu makan."], { pos: "konjungsi", en: ["then", "afterwards"] }),
  w("h2_060", 2, "\u8BA9", "r\xE0ng", ["membiarkan", "menyuruh"], ["\u8BA9\u6211\u770B\u770B\u3002", "R\xE0ng w\u01D2 k\xE0nkan.", "Biarkan aku lihat."], { pos: "verba", en: ["let", "allow"] }),
  w("h2_061", 2, "\u70ED\u60C5", "r\xE8q\xEDng", ["ramah", "antusias"], ["\u4E3B\u4EBA\u7684\u70ED\u60C5\u62DB\u5F85\u3002", "Zh\u01D4r\xE9n de r\xE8q\xEDng zh\u0101od\xE0i.", "Sambutan hangat tuan rumah."], { pos: "adjektiva", emoji: "\u{1F917}", en: ["warm", "enthusiastic"] }),
  w("h2_062", 2, "\u8BA4\u4E3A", "r\xE8nw\xE9i", ["menganggap", "menurut pendapat"], ["\u6211\u8BA4\u4E3A\u4ED6\u8BF4\u5F97\u5BF9\u3002", "W\u01D2 r\xE8nw\xE9i t\u0101 shu\u014D de du\xEC.", "Menurutku dia benar."], { pos: "verba", en: ["think", "consider"] }),
  w("h2_063", 2, "\u8BA4\u771F", "r\xE8nzh\u0113n", ["serius", "teliti"], ["\u4ED6\u5B66\u4E60\u5F88\u8BA4\u771F\u3002", "T\u0101 xu\xE9x\xED h\u011Bn r\xE8nzh\u0113n.", "Dia belajar dengan serius."], { pos: "adjektiva", emoji: "\u{1F9D0}", en: ["serious", "conscientious"] }),
  w("h2_064", 2, "\u5BB9\u6613", "r\xF3ngy\xEC", ["mudah"], ["\u8FD9\u4E2A\u95EE\u9898\u5F88\u5BB9\u6613\u3002", "Zh\xE8ge w\xE8nt\xED h\u011Bn r\xF3ngy\xEC.", "Soal ini mudah."], { pos: "adjektiva", emoji: "\u{1F9E9}", en: ["easy"] }),
  w("h2_065", 2, "\u5982\u679C", "r\xFAgu\u01D2", ["jika", "kalau"], ["\u5982\u679C\u4E0B\u96E8\u5C31\u4E0D\u53BB\u4E86\u3002", "R\xFAgu\u01D2 xi\xE0 y\u01D4 ji\xF9 b\xFA q\xF9 le.", "Kalau hujan, tidak jadi pergi."], { pos: "konjungsi", en: ["if"] }),
  w("h2_066", 2, "\u4F1E", "s\u01CEn", ["payung"], ["\u4E0B\u96E8\u4E86\uFF0C\u5E26\u4F1E\u3002", "Xi\xE0 y\u01D4 le, d\xE0i s\u01CEn.", "Hujan, bawa payung."], { pos: "nomina", emoji: "\u2602\uFE0F", imageKey: "Umbrella", en: ["umbrella"] }),
  w("h2_067", 2, "\u6C99\u62C9", "sh\u0101l\u0101", ["salad"], ["\u5348\u9910\u6211\u5403\u6C99\u62C9\u3002", "W\u01D4c\u0101n w\u01D2 ch\u012B sh\u0101l\u0101.", "Makan siang aku makan salad."], { pos: "nomina", emoji: "\u{1F957}", imageKey: "Salad", en: ["salad"] }),
  w("h2_068", 2, "\u8D85\u5E02", "ch\u0101osh\xEC", ["supermarket"], ["\u6211\u53BB\u8D85\u5E02\u4E70\u83DC\u3002", "W\u01D2 q\xF9 ch\u0101osh\xEC m\u01CEi c\xE0i.", "Aku ke supermarket belanja."], { pos: "nomina", emoji: "\u{1F3EC}", imageKey: "Supermarket", en: ["supermarket"] }),
  w("h2_069", 2, "\u8EAB\u4F53", "sh\u0113nt\u01D0", ["tubuh", "badan"], ["\u4ED6\u8EAB\u4F53\u5F88\u597D\u3002", "T\u0101 sh\u0113nt\u01D0 h\u011Bn h\u01CEo.", "Badannya sehat."], { pos: "nomina", emoji: "\u{1F9CD}", imageKey: "Human body", en: ["body", "health"] }),
  w("h2_070", 2, "\u751F\u65E5", "sh\u0113ngr\xEC", ["ulang tahun"], ["\u4ECA\u5929\u662F\u6211\u7684\u751F\u65E5\u3002", "J\u012Bnti\u0101n sh\xEC w\u01D2 de sh\u0113ngr\xEC.", "Hari ini ulang tahunku."], { pos: "nomina", emoji: "\u{1F382}", imageKey: "Birthday", en: ["birthday"] }),
  w("h2_071", 2, "\u58F0\u97F3", "sh\u0113ngy\u012Bn", ["suara"], ["\u5979\u7684\u58F0\u97F3\u5F88\u597D\u542C\u3002", "T\u0101 de sh\u0113ngy\u012Bn h\u011Bn h\u01CEot\u012Bng.", "Suaranya merdu."], { pos: "nomina", emoji: "\u{1F50A}", imageKey: "Sound", en: ["voice", "sound"] }),
  w("h2_072", 2, "\u4E16\u754C", "sh\xECji\xE8", ["dunia"], ["\u4E16\u754C\u5F88\u5927\u3002", "Sh\xECji\xE8 h\u011Bn d\xE0.", "Dunia itu luas."], { pos: "nomina", emoji: "\u{1F30F}", imageKey: "World", en: ["world"] }),
  w("h2_073", 2, "\u53D4\u53D4", "sh\u016Bshu", ["om", "paman"], ["\u53D4\u53D4\u9001\u6211\u793C\u7269\u3002", "Sh\u016Bshu s\xF2ng w\u01D2 l\u01D0w\xF9.", "Om memberiku hadiah."], { pos: "nomina", emoji: "\u{1F468}", en: ["uncle"] }),
  w("h2_074", 2, "\u6570\u5B66", "sh\xF9xu\xE9", ["matematika"], ["\u6570\u5B66\u5F88\u6709\u8DA3\u3002", "Sh\xF9xu\xE9 h\u011Bn y\u01D2uq\xF9.", "Matematika menarik."], { pos: "nomina", emoji: "\u2797", imageKey: "Mathematics", en: ["mathematics"] }),
  w("h2_075", 2, "\u5237", "shu\u0101", ["menyikat"], ["\u7761\u524D\u5237\u7259\u3002", "Shu\xEC qi\xE1n shu\u0101 y\xE1.", "Sikat gigi sebelum tidur."], { pos: "verba", emoji: "\u{1FAA5}", en: ["brush"] }),
  w("h2_076", 2, "\u53CC", "shu\u0101ng", ["pasang", "kata bantu"], ["\u6211\u4E70\u4E86\u53CC\u978B\u3002", "W\u01D2 m\u01CEile y\xEC shu\u0101ng xi\xE9.", "Aku beli sepasang sepatu."], { pos: "kata bantu", emoji: "\u{1F9E6}", en: ["pair"] }),
  w("h2_077", 2, "\u6C34\u679C", "shu\u01D0gu\u01D2", ["buah"], ["\u591A\u5403\u6C34\u679C\u6709\u76CA\u5065\u5EB7\u3002", "Du\u014D ch\u012B shu\u01D0gu\u01D2 y\u01D2uy\xEC ji\xE0nk\u0101ng.", "Banyak makan buah menyehatkan."], { pos: "nomina", emoji: "\u{1F347}", imageKey: "Fruit", en: ["fruit"] }),
  w("h2_078", 2, "\u8D77\u5E8A", "q\u01D0chu\xE1ng", ["bangun tidur"], ["\u6211\u6BCF\u5929\u516D\u70B9\u8D77\u5E8A\u3002", "W\u01D2 m\u011Biti\u0101n li\xF9 di\u01CEn q\u01D0chu\xE1ng.", "Aku bangun jam enam tiap hari."], { pos: "verba", emoji: "\u23F0", en: ["get up"] }),
  w("h2_079", 2, "\u867D\u7136", "su\u012Br\xE1n", ["walaupun"], ["\u867D\u7136\u7D2F\uFF0C\u4F46\u662F\u5F88\u5F00\u5FC3\u3002", "Su\u012Br\xE1n l\xE8i, d\xE0nsh\xEC h\u011Bn k\u0101ix\u012Bn.", "Walaupun lelah, tapi senang."], { pos: "konjungsi", en: ["although"] }),
  w("h2_080", 2, "\u592A\u9633", "t\xE0iy\xE1ng", ["matahari"], ["\u4ECA\u5929\u592A\u9633\u5F88\u597D\u3002", "J\u012Bnti\u0101n t\xE0iy\xE1ng h\u011Bn h\u01CEo.", "Hari ini matahari cerah."], { pos: "nomina", emoji: "\u2600\uFE0F", imageKey: "Sun", en: ["sun"] }),
  w("h2_081", 2, "\u522B\u7684", "bi\xE9de", ["yang lain"], ["\u6211\u8FD8\u6709\u522B\u7684\u4E8B\u60C5\u3002", "W\u01D2 h\xE1i y\u01D2u bi\xE9de sh\xECqing.", "Aku masih ada urusan lain."], { pos: "pronomina", en: ["other", "else"] }),
  w("h2_082", 2, "\u7279\u522B", "t\xE8bi\xE9", ["istimewa", "khusus"], ["\u4ECA\u5929\u7279\u522B\u70ED\u3002", "J\u012Bnti\u0101n t\xE8bi\xE9 r\xE8.", "Hari ini sangat panas."], { pos: "adverbia/adjektiva", emoji: "\u2B50", en: ["special", "especially"] }),
  w("h2_083", 2, "\u75BC", "t\xE9ng", ["sakit"], ["\u6211\u7684\u5934\u75BC\u3002", "W\u01D2 de t\xF3u t\xE9ng.", "Kepalaku sakit."], { pos: "verba/adjektiva", emoji: "\u{1F915}", en: ["ache", "pain"] }),
  w("h2_084", 2, "\u63D0\u9AD8", "t\xEDg\u0101o", ["meningkatkan"], ["\u8981\u63D0\u9AD8\u6210\u7EE9\u3002", "Y\xE0o t\xEDg\u0101o ch\xE9ngj\xEC.", "Harus menaikkan nilai."], { pos: "verba", emoji: "\u{1F4C8}", en: ["improve", "raise"] }),
  w("h2_085", 2, "\u4F53\u80B2", "t\u01D0y\xF9", ["olahraga (pelajaran)"], ["\u4F53\u80B2\u8BFE\u5728\u64CD\u573A\u3002", "T\u01D0y\xF9 k\xE8 z\xE0i c\u0101och\u01CEng.", "Pelajaran olahraga di lapangan."], { pos: "nomina", emoji: "\u{1F3C5}", imageKey: "Physical education", en: ["physical education"] }),
  w("h2_086", 2, "\u9898", "t\xED", ["soal", "pertanyaan"], ["\u8FD9\u9053\u9898\u5F88\u7B80\u5355\u3002", "Zh\xE8 d\xE0o t\xED h\u011Bn ji\u01CEnd\u0101n.", "Soal ini sederhana."], { pos: "nomina", emoji: "\u2753", en: ["question", "problem"] }),
  w("h2_087", 2, "\u8E22\u8DB3\u7403", "t\u012B z\xFAqi\xFA", ["main sepak bola"], ["\u5468\u672B\u6211\u4EEC\u8E22\u8DB3\u7403\u3002", "Zh\u014Dum\xF2 w\u01D2men t\u012B z\xFAqi\xFA.", "Akhir pekan kami main bola."], { pos: "verba", emoji: "\u26BD", imageKey: "Association football", en: ["play football"] }),
  w("h2_088", 2, "\u5B89\u9759", "\u0101nj\xECng", ["tenang", "sepi"], ["\u56FE\u4E66\u9986\u5F88\u5B89\u9759\u3002", "T\xFAsh\u016Bgu\u01CEn h\u011Bn \u0101nj\xECng.", "Perpustakaan tenang."], { pos: "adjektiva", emoji: "\u{1F92B}", en: ["quiet"] }),
  w("h2_089", 2, "\u6700", "zu\xEC", ["paling"], ["\u4ED6\u662F\u6211\u6700\u597D\u7684\u670B\u53CB\u3002", "T\u0101 sh\xEC w\u01D2 zu\xEC h\u01CEo de p\xE9ngyou.", "Dia sahabat terbaikku."], { pos: "adverbia", en: ["most", "-est"] }),
  w("h2_090", 2, "\u6700\u540E", "zu\xECh\xF2u", ["terakhir"], ["\u6700\u540E\u4ED6\u8D62\u4E86\u3002", "Zu\xECh\xF2u t\u0101 y\xEDng le.", "Akhirnya dia menang."], { pos: "nomina", emoji: "\u{1F3C1}", en: ["finally", "last"] }),
  w("h2_091", 2, "\u65B0\u9C9C", "x\u012Bnxi\u0101n", ["segar"], ["\u8FD9\u4E9B\u9C7C\u5F88\u65B0\u9C9C\u3002", "Zh\xE8xi\u0113 y\xFA h\u011Bn x\u012Bnxi\u0101n.", "Ikan-ikan ini segar."], { pos: "adjektiva", emoji: "\u{1F41F}", en: ["fresh"] }),
  w("h2_092", 2, "\u6D17", "x\u01D0", ["mencuci"], ["\u6211\u5728\u6D17\u624B\u3002", "W\u01D2 z\xE0i x\u01D0 sh\u01D2u.", "Aku sedang cuci tangan."], { pos: "verba", emoji: "\u{1F9FC}", en: ["wash"] }),
  w("h2_093", 2, "\u978B", "xi\xE9", ["sepatu"], ["\u8FD9\u53CC\u978B\u5F88\u8212\u670D\u3002", "Zh\xE8 shu\u0101ng xi\xE9 h\u011Bn sh\u016Bfu.", "Sepatu ini nyaman."], { pos: "nomina", emoji: "\u{1F45F}", imageKey: "Shoe", en: ["shoe"] }),
  w("h2_094", 2, "\u5199\u5B57", "xi\u011B z\xEC", ["menulis"], ["\u6BCF\u5929\u7EC3\u4E60\u5199\u5B57\u3002", "M\u011Biti\u0101n li\xE0nx\xED xi\u011B z\xEC.", "Latihan menulis tiap hari."], { pos: "verba", emoji: "\u270D\uFE0F", en: ["write characters"] }),
  w("h2_095", 2, "\u4FE1", "x\xECn", ["surat", "percaya"], ["\u6211\u6536\u5230\u4E86\u4F60\u7684\u4FE1\u3002", "W\u01D2 sh\u014Dud\xE0ole n\u01D0 de x\xECn.", "Aku menerima suratmu."], { pos: "nomina", emoji: "\u2709\uFE0F", imageKey: "Letter (message)", en: ["letter", "trust"] }),
  w("h2_096", 2, "\u884C\u674E\u7BB1", "x\xEDngl\u01D0xi\u0101ng", ["koper"], ["\u884C\u674E\u7BB1\u5F88\u91CD\u3002", "X\xEDngl\u01D0xi\u0101ng h\u011Bn zh\xF2ng.", "Kopernya berat."], { pos: "nomina", emoji: "\u{1F9F3}", imageKey: "Suitcase", en: ["suitcase"] }),
  w("h2_097", 2, "\u718A\u732B", "xi\xF3ngm\u0101o", ["panda"], ["\u718A\u732B\u662F\u4E2D\u56FD\u7684\u56FD\u5B9D\u3002", "Xi\xF3ngm\u0101o sh\xEC Zh\u014Dnggu\xF3 de gu\xF3b\u01CEo.", "Panda adalah hewan nasional Tiongkok."], { pos: "nomina", emoji: "\u{1F43C}", imageKey: "Giant panda", en: ["panda"] }),
  w("h2_098", 2, "\u9700\u8981", "x\u016By\xE0o", ["perlu", "butuh"], ["\u6211\u9700\u8981\u4F60\u7684\u5E2E\u52A9\u3002", "W\u01D2 x\u016By\xE0o n\u01D0 de b\u0101ngzh\xF9.", "Aku butuh bantuanmu."], { pos: "verba", emoji: "\u{1F198}", en: ["need"] }),
  w("h2_099", 2, "\u773C\u775B", "y\u01CEnjing", ["mata"], ["\u5979\u7684\u773C\u775B\u5F88\u5927\u3002", "T\u0101 de y\u01CEnjing h\u011Bn d\xE0.", "Matanya besar."], { pos: "nomina", emoji: "\u{1F441}\uFE0F", imageKey: "Eye", en: ["eye"] }),
  w("h2_100", 2, "\u989C\u8272", "y\xE1ns\xE8", ["warna"], ["\u4F60\u559C\u6B22\u4EC0\u4E48\u989C\u8272\uFF1F", "N\u01D0 x\u01D0huan sh\xE9nme y\xE1ns\xE8?", "Kamu suka warna apa?"], { pos: "nomina", emoji: "\u{1F3A8}", imageKey: "Color", en: ["color"] }),
  w("h2_101", 2, "\u9633\u5149", "y\xE1nggu\u0101ng", ["cahaya matahari"], ["\u623F\u95F4\u91CC\u90FD\u662F\u9633\u5149\u3002", "F\xE1ngji\u0101n l\u01D0 d\u014Du sh\xEC y\xE1nggu\u0101ng.", "Kamar penuh cahaya matahari."], { pos: "nomina", emoji: "\u{1F31E}", en: ["sunlight"] }),
  w("h2_102", 2, "\u8981\u6C42", "y\u0101oqi\xFA", ["menuntut", "syarat"], ["\u8001\u5E08\u8981\u6C42\u5F88\u4E25\u3002", "L\u01CEosh\u012B y\u0101oqi\xFA h\u011Bn y\xE1n.", "Guru menuntut dengan ketat."], { pos: "verba/nomina", en: ["require", "demand"] }),
  w("h2_103", 2, "\u9080\u8BF7", "y\u0101oq\u01D0ng", ["mengundang"], ["\u4ED6\u9080\u8BF7\u6211\u53BB\u4ED6\u5BB6\u3002", "T\u0101 y\u0101oq\u01D0ng w\u01D2 q\xF9 t\u0101 ji\u0101.", "Dia mengundangku ke rumahnya."], { pos: "verba", emoji: "\u{1F48C}", en: ["invite"] }),
  w("h2_104", 2, "\u7237\u7237", "y\xE9ye", ["kakek (ayah dari ayah)"], ["\u7237\u7237\u4ECA\u5E74\u516B\u5341\u5C81\u3002", "Y\xE9ye j\u012Bnni\xE1n b\u0101sh\xED su\xEC.", "Kakek sekarang delapan puluh tahun."], { pos: "nomina", emoji: "\u{1F474}", imageKey: "Grandparent", en: ["grandpa (paternal)"] }),
  w("h2_105", 2, "\u4E00\u5B9A", "y\xEDd\xECng", ["pasti", "tentu"], ["\u4ED6\u4E00\u5B9A\u4F1A\u6765\u3002", "T\u0101 y\xEDd\xECng hu\xEC l\xE1i.", "Dia pasti datang."], { pos: "adverbia", emoji: "\u{1F4AF}", en: ["surely", "definitely"] }),
  w("h2_106", 2, "\u4E00\u8D77", "y\xECq\u01D0", ["bersama"], ["\u6211\u4EEC\u4E00\u8D77\u53BB\u3002", "W\u01D2men y\xECq\u01D0 q\xF9.", "Kita pergi bersama."], { pos: "adverbia", emoji: "\u{1F91D}", en: ["together"] }),
  w("h2_107", 2, "\u5DF2\u7ECF", "y\u01D0j\u012Bng", ["sudah"], ["\u4ED6\u5DF2\u7ECF\u8D70\u4E86\u3002", "T\u0101 y\u01D0j\u012Bng z\u01D2u le.", "Dia sudah pergi."], { pos: "adverbia", en: ["already"] }),
  w("h2_108", 2, "\u610F\u601D", "y\xECsi", ["arti", "maksud"], ["\u8FD9\u4E2A\u8BCD\u4EC0\u4E48\u610F\u601D\uFF1F", "Zh\xE8ge c\xED sh\xE9nme y\xECsi?", "Apa arti kata ini?"], { pos: "nomina", emoji: "\u{1F4AC}", en: ["meaning", "idea"] }),
  w("h2_109", 2, "\u56E0\u4E3A", "y\u012Bnw\xE8i", ["karena"], ["\u56E0\u4E3A\u4E0B\u96E8\uFF0C\u6240\u4EE5\u6CA1\u53BB\u3002", "Y\u012Bnw\xE8i xi\xE0 y\u01D4, su\u01D2y\u01D0 m\xE9i q\xF9.", "Karena hujan, jadi tidak pergi."], { pos: "konjungsi", en: ["because"] }),
  w("h2_110", 2, "\u97F3\u4E50", "y\u012Bnyu\xE8", ["musik"], ["\u6211\u559C\u6B22\u542C\u97F3\u4E50\u3002", "W\u01D2 x\u01D0huan t\u012Bng y\u012Bnyu\xE8.", "Aku suka mendengarkan musik."], { pos: "nomina", emoji: "\u{1F3B5}", imageKey: "Music", en: ["music"] }),
  w("h2_111", 2, "\u94F6\u884C", "y\xEDnh\xE1ng", ["bank"], ["\u94F6\u884C\u4E5D\u70B9\u5F00\u95E8\u3002", "Y\xEDnh\xE1ng ji\u01D4 di\u01CEn k\u0101im\xE9n.", "Bank buka jam sembilan."], { pos: "nomina", emoji: "\u{1F3E6}", imageKey: "Bank", en: ["bank"] }),
  w("h2_112", 2, "\u8D8A\u6765\u8D8A", "yu\xE8l\xE1iyu\xE8", ["semakin"], ["\u5929\u6C14\u8D8A\u6765\u8D8A\u70ED\u3002", "Ti\u0101nq\xEC yu\xE8l\xE1iyu\xE8 r\xE8.", "Cuaca semakin panas."], { pos: "pola", en: ["more and more"] }),
  w("h2_113", 2, "\u8FD0\u52A8", "y\xF9nd\xF2ng", ["olahraga", "berolahraga"], ["\u591A\u8FD0\u52A8\u5BF9\u8EAB\u4F53\u597D\u3002", "Du\u014D y\xF9nd\xF2ng du\xEC sh\u0113nt\u01D0 h\u01CEo.", "Sering berolahraga menyehatkan."], { pos: "verba/nomina", emoji: "\u{1F3C0}", imageKey: "Exercise", en: ["exercise", "sport"] }),
  w("h2_114", 2, "\u7AD9", "zh\xE0n", ["berdiri", "stasiun"], ["\u8F66\u7AD9\u5728\u54EA\u513F\uFF1F", "Ch\u0113zh\xE0n z\xE0i n\u01CEr?", "Di mana stasiunnya?"], { pos: "verba/nomina", emoji: "\u{1F689}", imageKey: "Railway station", en: ["stand", "station"] }),
  w("h2_115", 2, "\u957F", "ch\xE1ng", ["panjang"], ["\u8FD9\u6761\u8DEF\u5F88\u957F\u3002", "Zh\xE8 ti\xE1o l\xF9 h\u011Bn ch\xE1ng.", "Jalan ini panjang."], { pos: "adjektiva", emoji: "\u{1F4CF}", en: ["long"] }),
  w("h2_116", 2, "\u627E\u5230", "zh\u01CEod\xE0o", ["menemukan"], ["\u6211\u627E\u5230\u4E86\u94A5\u5319\u3002", "W\u01D2 zh\u01CEod\xE0ole y\xE0oshi.", "Aku menemukan kuncinya."], { pos: "verba", emoji: "\u{1F511}", en: ["find"] }),
  w("h2_117", 2, "\u7167\u76F8\u673A", "zh\xE0oxi\xE0ngj\u012B", ["kamera"], ["\u6211\u7684\u7167\u76F8\u673A\u574F\u4E86\u3002", "W\u01D2 de zh\xE0oxi\xE0ngj\u012B hu\xE0i le.", "Kameraku rusak."], { pos: "nomina", emoji: "\u{1F4F7}", imageKey: "Camera", en: ["camera"] }),
  w("h2_118", 2, "\u7167\u7247", "zh\xE0opi\xE0n", ["foto"], ["\u8FD9\u5F20\u7167\u7247\u5F88\u597D\u770B\u3002", "Zh\xE8 zh\u0101ng zh\xE0opi\xE0n h\u011Bn h\u01CEok\xE0n.", "Foto ini bagus."], { pos: "nomina", emoji: "\u{1F5BC}\uFE0F", imageKey: "Photograph", en: ["photo"] }),
  w("h2_119", 2, "\u7740", "zhe", ["(partikel sedang)"], ["\u95E8\u5F00\u7740\u3002", "M\xE9n k\u0101izhe.", "Pintunya terbuka."], { pos: "partikel", en: ["ongoing particle"] }),
  w("h2_120", 2, "\u6B63\u786E", "zh\xE8ngqu\xE8", ["benar", "tepat"], ["\u7B54\u6848\u662F\u6B63\u786E\u7684\u3002", "D\xE1'\xE0n sh\xEC zh\xE8ngqu\xE8 de.", "Jawabannya benar."], { pos: "adjektiva", emoji: "\u2714\uFE0F", en: ["correct"] }),
  w("h2_121", 2, "\u6B63\u5728", "zh\xE8ngz\xE0i", ["sedang"], ["\u4ED6\u6B63\u5728\u7761\u89C9\u3002", "T\u0101 zh\xE8ngz\xE0i shu\xECji\xE0o.", "Dia sedang tidur."], { pos: "adverbia", en: ["in the process of"] }),
  w("h2_122", 2, "\u77E5\u9053", "zh\u012Bd\xE0o", ["tahu"], ["\u6211\u77E5\u9053\u7B54\u6848\u3002", "W\u01D2 zh\u012Bd\xE0o d\xE1'\xE0n.", "Aku tahu jawabannya."], { pos: "verba", emoji: "\u{1F4A1}", en: ["know"] }),
  w("h2_123", 2, "\u51C6\u5907", "zh\u01D4nb\xE8i", ["bersiap", "persiapan"], ["\u8003\u8BD5\u51C6\u5907\u5F97\u600E\u4E48\u6837\uFF1F", "K\u01CEosh\xEC zh\u01D4nb\xE8i de z\u011Bnmey\xE0ng?", "Bagaimana persiapan ujianmu?"], { pos: "verba/nomina", emoji: "\u{1F4CB}", en: ["prepare"] }),
  w("h2_124", 2, "\u81EA\u884C\u8F66", "z\xECx\xEDngch\u0113", ["sepeda"], ["\u6211\u9A91\u81EA\u884C\u8F66\u4E0A\u5B66\u3002", "W\u01D2 q\xED z\xECx\xEDngch\u0113 sh\xE0ngxu\xE9.", "Aku bersepeda ke sekolah."], { pos: "nomina", emoji: "\u{1F6B2}", imageKey: "Bicycle", en: ["bicycle"] }),
  w("h2_125", 2, "\u603B\u662F", "z\u01D2ngsh\xEC", ["selalu"], ["\u4ED6\u603B\u662F\u8FDF\u5230\u3002", "T\u0101 z\u01D2ngsh\xEC ch\xEDd\xE0o.", "Dia selalu terlambat."], { pos: "adverbia", en: ["always"] }),
  w("h2_126", 2, "\u8DB3\u7403", "z\xFAqi\xFA", ["sepak bola"], ["\u6211\u6700\u559C\u6B22\u8DB3\u7403\u3002", "W\u01D2 zu\xEC x\u01D0huan z\xFAqi\xFA.", "Aku paling suka sepak bola."], { pos: "nomina", emoji: "\u26BD", imageKey: "Association football", en: ["football", "soccer"] }),
  w("h2_127", 2, "\u5FEB\u4E50", "ku\xE0il\xE8", ["bahagia", "gembira"], ["\u795D\u4F60\u751F\u65E5\u5FEB\u4E50\uFF01", "Zh\xF9 n\u01D0 sh\u0113ngr\xEC ku\xE0il\xE8!", "Selamat ulang tahun!"], { pos: "adjektiva", emoji: "\u{1F604}", en: ["happy", "joyful"] }),
  w("h2_128", 2, "\u963F\u59E8", "\u0101y\xED", ["bibi", "ibu (sapaan)"], ["\u963F\u59E8\u505A\u7684\u83DC\u5F88\u597D\u5403\u3002", "\u0100y\xED zu\xF2 de c\xE0i h\u011Bn h\u01CEoch\u012B.", "Masakan bibi enak."], { pos: "nomina", emoji: "\u{1F469}", en: ["aunt", "aunty"] }),
  w("h2_129", 2, "\u77ED\u6D88\u606F", "du\u01CEnxi\u0101oxi", ["SMS", "pesan singkat"], ["\u6211\u7ED9\u4F60\u53D1\u77ED\u6D88\u606F\u3002", "W\u01D2 g\u011Bi n\u01D0 f\u0101 du\u01CEnxi\u0101oxi.", "Aku kirim SMS kepadamu."], { pos: "nomina", emoji: "\u{1F4AC}", en: ["text message"] }),
  w("h2_130", 2, "\u8FD1", "j\xECn", ["dekat"], ["\u5B66\u6821\u79BB\u5BB6\u5F88\u8FD1\u3002", "Xu\xE9xi\xE0o l\xED ji\u0101 h\u011Bn j\xECn.", "Sekolah dekat dari rumah."], { pos: "adjektiva", emoji: "\u{1F4CD}", en: ["near"] }),
  w("h2_131", 2, "\u8FDC", "yu\u01CEn", ["jauh"], ["\u673A\u573A\u5F88\u8FDC\u3002", "J\u012Bch\u01CEng h\u011Bn yu\u01CEn.", "Bandaranya jauh."], { pos: "adjektiva", emoji: "\u{1F6E3}\uFE0F", en: ["far"] }),
  w("h2_132", 2, "\u6674", "q\xEDng", ["cerah"], ["\u660E\u5929\u5929\u6C14\u6674\u3002", "M\xEDngti\u0101n ti\u0101nq\xEC q\xEDng.", "Besok cuaca cerah."], { pos: "adjektiva", emoji: "\u{1F324}\uFE0F", en: ["clear", "sunny"] }),
  w("h2_133", 2, "\u9634", "y\u012Bn", ["berawan", "gelap"], ["\u4ECA\u5929\u9634\u5929\u3002", "J\u012Bnti\u0101n y\u012Bnti\u0101n.", "Hari ini berawan."], { pos: "adjektiva", emoji: "\u2601\uFE0F", en: ["cloudy", "overcast"] }),
  w("h2_134", 2, "\u8003\u8BD5", "k\u01CEosh\xEC", ["ujian"], ["\u4E0B\u5468\u4E00\u8003\u8BD5\u3002", "Xi\xE0 zh\u014Duy\u012B k\u01CEosh\xEC.", "Senin depan ada ujian."], { pos: "verba/nomina", emoji: "\u{1F4DD}", imageKey: "Test (assessment)", en: ["exam", "test"] }),
  w("h2_135", 2, "\u590D\u4E60", "f\xF9x\xED", ["mengulang pelajaran"], ["\u8003\u8BD5\u524D\u8981\u590D\u4E60\u3002", "K\u01CEosh\xEC qi\xE1n y\xE0o f\xF9x\xED.", "Mengulang sebelum ujian."], { pos: "verba", emoji: "\u{1F501}", en: ["review", "revise"] }),
  w("h2_136", 2, "\u9884\u4E60", "y\xF9x\xED", ["mempelajari dulu"], ["\u8BFE\u524D\u9884\u4E60\u8BFE\u6587\u3002", "K\xE8 qi\xE1n y\xF9x\xED k\xE8w\xE9n.", "Pelajari materi sebelum kelas."], { pos: "verba", emoji: "\u{1F4D6}", en: ["preview lessons"] }),
  w("h2_137", 2, "\u529E\u516C\u5BA4", "b\xE0ng\u014Dngsh\xEC", ["ruang kantor"], ["\u4ED6\u5728\u529E\u516C\u5BA4\u5F00\u4F1A\u3002", "T\u0101 z\xE0i b\xE0ng\u014Dngsh\xEC k\u0101ihu\xEC.", "Dia rapat di ruang kantor."], { pos: "nomina", emoji: "\u{1F3E2}", imageKey: "Office", en: ["office"] }),
  w("h2_138", 2, "\u51FA\u5DEE", "ch\u016Bch\u0101i", ["dinas luar kota"], ["\u7238\u7238\u51FA\u5DEE\u4E86\u3002", "B\xE0ba ch\u016Bch\u0101i le.", "Ayah dinas ke luar kota."], { pos: "verba", emoji: "\u{1F4BC}", en: ["business trip"] }),
  w("h2_139", 2, "\u4E0A\u73ED", "sh\xE0ngb\u0101n", ["pergi kerja"], ["\u4ED6\u6BCF\u5929\u516B\u70B9\u4E0A\u73ED\u3002", "T\u0101 m\u011Biti\u0101n b\u0101 di\u01CEn sh\xE0ngb\u0101n.", "Dia kerja tiap hari jam delapan."], { pos: "verba", emoji: "\u{1F4BC}", en: ["go to work"] }),
  w("h2_140", 2, "\u4E0B\u73ED", "xi\xE0b\u0101n", ["pulang kerja"], ["\u6211\u516D\u70B9\u4E0B\u73ED\u3002", "W\u01D2 li\xF9 di\u01CEn xi\xE0b\u0101n.", "Aku pulang kerja jam enam."], { pos: "verba", en: ["get off work"] }),
  w("h2_141", 2, "\u7167\u987E", "zh\xE0og\xF9", ["menjaga", "merawat"], ["\u59D0\u59D0\u7167\u987E\u5F1F\u5F1F\u3002", "Ji\u011Bjie zh\xE0og\xF9 d\xECdi.", "Kakak menjaga adiknya."], { pos: "verba", emoji: "\u{1F932}", en: ["take care of"] }),
  w("h2_142", 2, "\u5E2E", "b\u0101ng", ["menolong", "membantu"], ["\u6211\u6765\u5E2E\u4F60\u3002", "W\u01D2 l\xE1i b\u0101ng n\u01D0.", "Aku bantu kamu."], { pos: "verba", emoji: "\u{1F91D}", en: ["help"] }),
  w("h2_143", 2, "\u4E5F\u8BB8", "y\u011Bx\u01D4", ["mungkin"], ["\u4ED6\u4E5F\u8BB8\u660E\u5929\u6765\u3002", "T\u0101 y\u011Bx\u01D4 m\xEDngti\u0101n l\xE1i.", "Mungkin dia datang besok."], { pos: "adverbia", en: ["perhaps", "maybe"] }),
  w("h2_144", 2, "\u4E00\u76F4", "y\xECzh\xED", ["selalu", "terus-menerus"], ["\u4ED6\u4E00\u76F4\u5728\u5B66\u4E60\u3002", "T\u0101 y\xECzh\xED z\xE0i xu\xE9x\xED.", "Dia terus belajar."], { pos: "adverbia", en: ["always", "continuously"] }),
  w("h2_145", 2, "\u6216\u8005", "hu\xF2zh\u011B", ["atau"], ["\u559D\u8336\u6216\u8005\u5496\u5561\u3002", "H\u0113 ch\xE1 hu\xF2zh\u011B k\u0101f\u0113i.", "Minum teh atau kopi."], { pos: "konjungsi", en: ["or"] }),
  w("h2_146", 2, "\u624B\u673A", "sh\u01D2uj\u012B", ["ponsel", "HP"], ["\u6211\u7684\u624B\u673A\u6CA1\u7535\u4E86\u3002", "W\u01D2 de sh\u01D2uj\u012B m\xE9i di\xE0n le.", "HP-ku habis baterai."], { pos: "nomina", emoji: "\u{1F4F1}", imageKey: "Mobile phone", en: ["mobile phone"] }),
  w("h2_147", 2, "\u904D", "bi\xE0n", ["kali (kata bantu)"], ["\u8FD9\u9996\u6B4C\u6211\u542C\u4E86\u4E09\u904D\u3002", "Zh\xE8 sh\u01D2u g\u0113 w\u01D2 t\u012Bngle s\u0101n bi\xE0n.", "Lagu ini kukuh tiga kali."], { pos: "kata bantu", en: ["times (occurrences)"] }),
  w("h2_148", 2, "\u7EC3\u4E60", "li\xE0nx\xED", ["latihan", "berlatih"], ["\u6BCF\u5929\u7EC3\u4E60\u53D1\u97F3\u3002", "M\u011Biti\u0101n li\xE0nx\xED f\u0101y\u012Bn.", "Latihan pelafalan tiap hari."], { pos: "verba/nomina", emoji: "\u{1F501}", en: ["practice", "exercise"] }),
  w("h2_149", 2, "\u501F", "ji\xE8", ["meminjam"], ["\u6211\u80FD\u501F\u4F60\u7684\u7B14\u5417\uFF1F", "W\u01D2 n\xE9ng ji\xE8 n\u01D0 de b\u01D0 ma?", "Boleh pinjam penamu?"], { pos: "verba", emoji: "\u{1F58A}\uFE0F", en: ["borrow", "lend"] }),
  w("h2_150", 2, "\u8FD8", "h\xE1i", ["masih", "lagi"], ["\u4ED6\u8FD8\u6CA1\u6765\u3002", "T\u0101 h\xE1i m\xE9i l\xE1i.", "Dia belum datang."], { pos: "adverbia", en: ["still", "yet"] })
];

// src/services/chinese/dataset/hsk3.ts
var HSK3_WORDS = [
  w("h3_001", 3, "\u963F\u59E8", "\u0101y\xED", ["bibi", "ibu (sapaan)"], ["\u963F\u59E8\u6253\u626B\u623F\u95F4\u3002", "\u0100y\xED d\u01CEs\u01CEo f\xE1ngji\u0101n.", "Bibi membersihkan kamar."], { pos: "nomina", emoji: "\u{1F469}", en: ["aunt"] }),
  w("h3_002", 3, "\u554A", "a", ["(partikel seru)"], ["\u771F\u7F8E\u554A\uFF01", "Zh\u0113n m\u011Bi a!", "Indah sekali!"], { pos: "partikel", en: ["ah", "exclamation particle"] }),
  w("h3_003", 3, "\u77EE", "\u01CEi", ["pendek (badan)"], ["\u4ED6\u6BD4\u6211\u77EE\u4E00\u70B9\u3002", "T\u0101 b\u01D0 w\u01D2 \u01CEi y\xECdi\u01CEn.", "Dia sedikit lebih pendek dariku."], { pos: "adjektiva", emoji: "\u{1F4CF}", en: ["short (height)"] }),
  w("h3_004", 3, "\u7231\u5FC3", "\xE0ix\u012Bn", ["kepedulian", "kasih sayang"], ["\u5979\u5BF9\u52A8\u7269\u5F88\u6709\u7231\u5FC3\u3002", "T\u0101 du\xEC d\xF2ngw\xF9 h\u011Bn y\u01D2u \xE0ix\u012Bn.", "Dia sangat penyayang hewan."], { pos: "nomina", emoji: "\u{1F496}", en: ["loving heart", "kindness"] }),
  w("h3_005", 3, "\u5B89\u9759", "\u0101nj\xECng", ["tenang", "sepi"], ["\u8BF7\u4FDD\u6301\u5B89\u9759\u3002", "Q\u01D0ng b\u01CEoch\xED \u0101nj\xECng.", "Tolong jaga ketenangan."], { pos: "adjektiva", emoji: "\u{1F92B}", en: ["quiet"] }),
  w("h3_006", 3, "\u628A", "b\u01CE", ["(kata bantu objek)"], ["\u628A\u95E8\u5173\u4E0A\u3002", "B\u01CE m\xE9n gu\u0101n sh\xE0ng.", "Tutup pintunya."], { pos: "preposisi", en: ["disposal marker"] }),
  w("h3_007", 3, "\u767D\u5929", "b\xE1iti\u0101n", ["siang hari"], ["\u767D\u5929\u4ED6\u4E0A\u73ED\uFF0C\u665A\u4E0A\u5B66\u4E60\u3002", "B\xE1iti\u0101n t\u0101 sh\xE0ngb\u0101n, w\u01CEnshang xu\xE9x\xED.", "Siang dia kerja, malam belajar."], { pos: "nomina waktu", emoji: "\u2600\uFE0F", en: ["daytime"] }),
  w("h3_008", 3, "\u73ED\u957F", "b\u0101nzh\u01CEng", ["ketua kelas"], ["\u73ED\u957F\u5E2E\u52A9\u540C\u5B66\u3002", "B\u0101nzh\u01CEng b\u0101ngzh\xF9 t\xF3ngxu\xE9.", "Ketua kelas membantu teman."], { pos: "nomina", emoji: "\u{1F396}\uFE0F", en: ["class monitor"] }),
  w("h3_009", 3, "\u529E\u4E8B", "b\xE0nsh\xEC", ["mengurus sesuatu"], ["\u6211\u4E0B\u5348\u53BB\u529E\u4E8B\u3002", "W\u01D2 xi\xE0w\u01D4 q\xF9 b\xE0nsh\xEC.", "Sore aku mengurus sesuatu."], { pos: "verba", emoji: "\u{1F4CB}", en: ["handle affairs"] }),
  w("h3_010", 3, "\u534A", "b\xE0n", ["setengah"], ["\u73B0\u5728\u516D\u70B9\u534A\u3002", "Xi\xE0nz\xE0i li\xF9 di\u01CEn b\xE0n.", "Sekarang setengah jam tujuh."], { pos: "numeral", emoji: "\xBD", en: ["half"] }),
  w("h3_011", 3, "\u529E\u6CD5", "b\xE0nf\u01CE", ["cara", "jalan keluar"], ["\u6211\u6709\u4E00\u4E2A\u597D\u529E\u6CD5\u3002", "W\u01D2 y\u01D2u y\xED g\xE8 h\u01CEo b\xE0nf\u01CE.", "Aku punya satu cara bagus."], { pos: "nomina", emoji: "\u{1F6E0}\uFE0F", en: ["method", "way"] }),
  w("h3_012", 3, "\u529E\u516C\u5BA4", "b\xE0ng\u014Dngsh\xEC", ["ruang kantor"], ["\u529E\u516C\u5BA4\u5F88\u5B89\u9759\u3002", "B\xE0ng\u014Dngsh\xEC h\u011Bn \u0101nj\xECng.", "Ruang kantor tenang."], { pos: "nomina", emoji: "\u{1F3E2}", imageKey: "Office", en: ["office"] }),
  w("h3_013", 3, "\u5E2E", "b\u0101ng", ["menolong"], ["\u8BF7\u5E2E\u6211\u4E00\u4E0B\u3002", "Q\u01D0ng b\u0101ng w\u01D2 y\xEDxi\xE0.", "Tolong bantu aku sebentar."], { pos: "verba", emoji: "\u{1F91D}", en: ["help"] }),
  w("h3_014", 3, "\u5305", "b\u0101o", ["tas", "membungkus"], ["\u8FD9\u4E2A\u5305\u5F88\u8F7B\u3002", "Zh\xE8ge b\u0101o h\u011Bn q\u012Bng.", "Tas ini ringan."], { pos: "nomina/verba", emoji: "\u{1F392}", imageKey: "Bag", en: ["bag", "wrap"] }),
  w("h3_015", 3, "\u5305\u5B50", "b\u0101ozi", ["bakpao"], ["\u6211\u65E9\u4E0A\u5403\u4E86\u4E09\u4E2A\u5305\u5B50\u3002", "W\u01D2 z\u01CEoshang ch\u012Ble s\u0101n g\xE8 b\u0101ozi.", "Pagi tadi aku makan tiga bakpao."], { pos: "nomina", emoji: "\u{1F95F}", imageKey: "Baozi", en: ["steamed bun"] }),
  w("h3_016", 3, "\u9971", "b\u01CEo", ["kenyang"], ["\u6211\u5403\u9971\u4E86\u3002", "W\u01D2 ch\u012B b\u01CEo le.", "Aku sudah kenyang."], { pos: "adjektiva", emoji: "\u{1F60B}", en: ["full (from eating)"] }),
  w("h3_017", 3, "\u5317\u6781", "b\u011Bij\xED", ["kutub utara"], ["\u5317\u6781\u718A\u751F\u6D3B\u5728\u5317\u6781\u3002", "B\u011Bij\xEDxi\xF3ng sh\u0113nghu\xF3 z\xE0i B\u011Bij\xED.", "Beruang kutub hidup di kutub utara."], { pos: "nomina", emoji: "\u{1F9CA}", imageKey: "North Pole", en: ["North Pole"] }),
  w("h3_018", 3, "\u88AB", "b\xE8i", ["(partikel pasif)"], ["\u676F\u5B50\u88AB\u4ED6\u6253\u7834\u4E86\u3002", "B\u0113izi b\xE8i t\u0101 d\u01CEp\xF2 le.", "Gelas dipecahkan dia."], { pos: "preposisi", en: ["passive marker"] }),
  w("h3_019", 3, "\u9F3B\u5B50", "b\xEDzi", ["hidung"], ["\u4ED6\u7684\u9F3B\u5B50\u5F88\u9AD8\u3002", "T\u0101 de b\xEDzi h\u011Bn g\u0101o.", "Hidungnya mancung."], { pos: "nomina", emoji: "\u{1F443}", imageKey: "Nose", en: ["nose"] }),
  w("h3_020", 3, "\u6BD4\u8F83", "b\u01D0ji\xE0o", ["relatif", "membandingkan"], ["\u4ECA\u5929\u6BD4\u8F83\u51B7\u3002", "J\u012Bnti\u0101n b\u01D0ji\xE0o l\u011Bng.", "Hari ini relatif dingin."], { pos: "adverbia/verba", en: ["relatively", "compare"] }),
  w("h3_021", 3, "\u7B14\u8BB0", "b\u01D0j\xEC", ["catatan"], ["\u4E0A\u8BFE\u8981\u505A\u7B14\u8BB0\u3002", "Sh\xE0ng k\xE8 y\xE0o zu\xF2 b\u01D0j\xEC.", "Saat kelas harus mencatat."], { pos: "nomina", emoji: "\u{1F4D3}", en: ["notes"] }),
  w("h3_022", 3, "\u5FC5\u987B", "b\xECx\u016B", ["harus"], ["\u6211\u4EEC\u5FC5\u987B\u51FA\u53D1\u4E86\u3002", "W\u01D2men b\xECx\u016B ch\u016Bf\u0101 le.", "Kita harus berangkat sekarang."], { pos: "verba modal", emoji: "\u2757", en: ["must"] }),
  w("h3_023", 3, "\u53D8\u5316", "bi\xE0nhu\xE0", ["perubahan"], ["\u57CE\u5E02\u53D8\u5316\u5F88\u5927\u3002", "Ch\xE9ngsh\xEC bi\xE0nhu\xE0 h\u011Bn d\xE0.", "Kota berubah besar."], { pos: "verba/nomina", emoji: "\u{1F504}", imageKey: "Change (philosophy)", en: ["change"] }),
  w("h3_024", 3, "\u522B\u4EBA", "bi\xE9r\xE9n", ["orang lain"], ["\u5C0A\u91CD\u522B\u4EBA\u7684\u610F\u89C1\u3002", "Z\u016Bnzh\xF2ng bi\xE9r\xE9n de y\xECji\xE0n.", "Hormati pendapat orang lain."], { pos: "nomina", en: ["others"] }),
  w("h3_025", 3, "\u51B0\u7BB1", "b\u012Bngxi\u0101ng", ["kulkas"], ["\u51B0\u7BB1\u91CC\u6709\u6C34\u679C\u3002", "B\u012Bngxi\u0101ng l\u01D0 y\u01D2u shu\u01D0gu\u01D2.", "Di kulkas ada buah."], { pos: "nomina", emoji: "\u{1F9CA}", imageKey: "Refrigerator", en: ["refrigerator"] }),
  w("h3_026", 3, "\u4E0D\u8212\u670D", "b\xF9 sh\u016Bfu", ["tidak enak badan"], ["\u6211\u4ECA\u5929\u4E0D\u8212\u670D\u3002", "W\u01D2 j\u012Bnti\u0101n b\xF9 sh\u016Bfu.", "Aku kurang sehat hari ini."], { pos: "adjektiva", emoji: "\u{1F912}", en: ["unwell"] }),
  w("h3_027", 3, "\u4E0D\u4E00\u6837", "b\xF9 y\xEDy\xE0ng", ["berbeda"], ["\u6211\u4EEC\u60F3\u6CD5\u4E0D\u4E00\u6837\u3002", "W\u01D2men xi\u01CEngf\u01CE b\xF9 y\xEDy\xE0ng.", "Cara pikir kami berbeda."], { pos: "adjektiva", en: ["different"] }),
  w("h3_028", 3, "\u90E8", "b\xF9", ["(kata bantu film/hp)"], ["\u6211\u770B\u4E86\u4E00\u90E8\u7535\u5F71\u3002", "W\u01D2 k\xE0nle y\xED b\xF9 di\xE0ny\u01D0ng.", "Aku menonton satu film."], { pos: "kata bantu", en: ["measure for films/phones"] }),
  w("h3_029", 3, "\u90E8\u95E8", "b\xF9m\xE9n", ["departemen", "bagian"], ["\u4ED6\u5728\u9500\u552E\u90E8\u95E8\u5DE5\u4F5C\u3002", "T\u0101 z\xE0i xi\u0101osh\xF2u b\xF9m\xE9n g\u014Dngzu\xF2.", "Dia kerja di bagian penjualan."], { pos: "nomina", emoji: "\u{1F3E2}", en: ["department"] }),
  w("h3_030", 3, "\u6563\u6B65", "s\xE0nb\xF9", ["jalan santai"], ["\u996D\u540E\u6211\u4EEC\u53BB\u6563\u6B65\u3002", "F\xE0n h\xF2u w\u01D2men q\xF9 s\xE0nb\xF9.", "Setelah makan kami jalan santai."], { pos: "verba", emoji: "\u{1F6B6}", imageKey: "Walking", en: ["take a walk"] }),
  w("h3_031", 3, "\u5DEE\u522B", "ch\u0101bi\xE9", ["perbedaan"], ["\u4E24\u5730\u7684\u5DEE\u522B\u5F88\u5927\u3002", "Li\u01CEng d\xEC de ch\u0101bi\xE9 h\u011Bn d\xE0.", "Perbedaan kedua tempat besar."], { pos: "nomina", en: ["difference"] }),
  w("h3_032", 3, "\u5DEE\u70B9\u513F", "ch\xE0di\u01CEnr", ["hampir"], ["\u6211\u5DEE\u70B9\u513F\u5FD8\u4E86\u3002", "W\u01D2 ch\xE0di\u01CEnr w\xE0ng le.", "Aku hampir lupa."], { pos: "adverbia", en: ["almost"] }),
  w("h3_033", 3, "\u4EA7\u751F", "ch\u01CEnsh\u0113ng", ["menimbulkan"], ["\u8FD9\u4F1A\u4EA7\u751F\u95EE\u9898\u3002", "Zh\xE8 hu\xEC ch\u01CEnsh\u0113ng w\xE8nt\xED.", "Ini akan menimbulkan masalah."], { pos: "verba", en: ["produce", "arise"] }),
  w("h3_034", 3, "\u957F\u57CE", "Ch\xE1ngch\xE9ng", ["Tembok Besar"], ["\u957F\u57CE\u975E\u5E38\u6709\u540D\u3002", "Ch\xE1ngch\xE9ng f\u0113ich\xE1ng y\u01D2um\xEDng.", "Tembok Besar sangat terkenal."], { pos: "nama tempat", emoji: "\u{1F9F1}", imageKey: "Great Wall of China", en: ["Great Wall"] }),
  w("h3_035", 3, "\u957F\u671F", "ch\xE1ngq\u012B", ["jangka panjang"], ["\u957F\u671F\u8BA1\u5212\u5F88\u91CD\u8981\u3002", "Ch\xE1ngq\u012B j\xEChu\xE0 h\u011Bn zh\xF2ngy\xE0o.", "Rencana jangka panjang penting."], { pos: "nomina", emoji: "\u{1F4C6}", en: ["long-term"] }),
  w("h3_036", 3, "\u5E38", "ch\xE1ng", ["sering"], ["\u6211\u4EEC\u5E38\u89C1\u9762\u3002", "W\u01D2men ch\xE1ng ji\xE0nmi\xE0n.", "Kami sering bertemu."], { pos: "adverbia", en: ["often"] }),
  w("h3_037", 3, "\u573A\u5408", "ch\u01CEngh\xE9", ["kesempatan", "acara"], ["\u8FD9\u4E2A\u573A\u5408\u5F88\u6B63\u5F0F\u3002", "Zh\xE8ge ch\u01CEngh\xE9 h\u011Bn zh\xE8ngsh\xEC.", "Acara ini formal."], { pos: "nomina", en: ["occasion"] }),
  w("h3_038", 3, "\u8F66\u7AD9", "ch\u0113zh\xE0n", ["terminal", "stasiun"], ["\u8F66\u7AD9\u5728\u524D\u9762\u3002", "Ch\u0113zh\xE0n z\xE0i qi\xE1nmi\xE0n.", "Terminalnya di depan."], { pos: "nomina", emoji: "\u{1F68F}", imageKey: "Bus stop", en: ["station", "stop"] }),
  w("h3_039", 3, "\u6210\u529F", "ch\xE9ngg\u014Dng", ["sukses"], ["\u4ED6\u7EC8\u4E8E\u6210\u529F\u4E86\u3002", "T\u0101 zh\u014Dngy\xFA ch\xE9ngg\u014Dng le.", "Dia akhirnya sukses."], { pos: "verba/nomina", emoji: "\u{1F3C6}", imageKey: "Success", en: ["success"] }),
  w("h3_040", 3, "\u8BDA\u5B9E", "ch\xE9ngsh\xED", ["jujur"], ["\u4ED6\u662F\u4E2A\u8BDA\u5B9E\u7684\u5B69\u5B50\u3002", "T\u0101 sh\xEC g\xE8 ch\xE9ngsh\xED de h\xE1izi.", "Dia anak yang jujur."], { pos: "adjektiva", emoji: "\u{1F90D}", en: ["honest"] }),
  w("h3_041", 3, "\u4E58\u5750", "ch\xE9ngzu\xF2", ["menaiki"], ["\u4E58\u5750\u5730\u94C1\u5F88\u65B9\u4FBF\u3002", "Ch\xE9ngzu\xF2 d\xECti\u011B h\u011Bn f\u0101ngbi\xE0n.", "Naik subway sangat nyaman."], { pos: "verba", en: ["ride (transport)"] }),
  w("h3_042", 3, "\u7A0B\u5E8F", "ch\xE9ngx\xF9", ["program", "prosedur"], ["\u4ED6\u7F16\u5199\u7535\u8111\u7A0B\u5E8F\u3002", "T\u0101 bi\u0101nxi\u011B di\xE0nn\u01CEo ch\xE9ngx\xF9.", "Dia menulis program komputer."], { pos: "nomina", emoji: "\u{1F468}\u200D\u{1F4BB}", imageKey: "Computer program", en: ["program", "procedure"] }),
  w("h3_043", 3, "\u8FDF\u5230", "ch\xEDd\xE0o", ["terlambat"], ["\u4ED6\u53C8\u8FDF\u5230\u4E86\u3002", "T\u0101 y\xF2u ch\xEDd\xE0o le.", "Dia terlambat lagi."], { pos: "verba", emoji: "\u23F0", en: ["be late"] }),
  w("h3_044", 3, "\u9664\u4E86", "ch\xFAle", ["selain", "kecuali"], ["\u9664\u4E86\u4ED6\uFF0C\u5927\u5BB6\u90FD\u6765\u4E86\u3002", "Ch\xFAle t\u0101, d\xE0ji\u0101 d\u014Du l\xE1i le.", "Selain dia, semua datang."], { pos: "preposisi", en: ["besides", "except"] }),
  w("h3_045", 3, "\u8239", "chu\xE1n", ["kapal"], ["\u6211\u4EEC\u5750\u8239\u8FC7\u6CB3\u3002", "W\u01D2men zu\xF2 chu\xE1n gu\xF2 h\xE9.", "Kami menyeberangi sungai dengan perahu."], { pos: "nomina", emoji: "\u{1F6A2}", imageKey: "Ship", en: ["boat", "ship"] }),
  w("h3_046", 3, "\u6625", "ch\u016Bn", ["musim semi"], ["\u6625\u5929\u82B1\u5F00\u4E86\u3002", "Ch\u016Bnti\u0101n hu\u0101 k\u0101i le.", "Musim semi bunga bermekaran."], { pos: "nomina waktu", emoji: "\u{1F338}", imageKey: "Spring (season)", en: ["spring"] }),
  w("h3_047", 3, "\u8BCD\u5178", "c\xEDdi\u01CEn", ["kamus"], ["\u6211\u7528\u8BCD\u5178\u67E5\u751F\u8BCD\u3002", "W\u01D2 y\xF2ng c\xEDdi\u01CEn ch\xE1 sh\u0113ngc\xED.", "Aku cari kata baru pakai kamus."], { pos: "nomina", emoji: "\u{1F4D5}", imageKey: "Dictionary", en: ["dictionary"] }),
  w("h3_048", 3, "\u806A\u660E", "c\u014Dngming", ["pintar"], ["\u8FD9\u4E2A\u5B69\u5B50\u5F88\u806A\u660E\u3002", "Zh\xE8ge h\xE1izi h\u011Bn c\u014Dngming.", "Anak ini pintar."], { pos: "adjektiva", emoji: "\u{1F9E0}", en: ["smart", "clever"] }),
  w("h3_049", 3, "\u6253\u7B97", "d\u01CEsu\xE0n", ["berniat", "rencana"], ["\u4F60\u6691\u5047\u6253\u7B97\u505A\u4EC0\u4E48\uFF1F", "N\u01D0 sh\u01D4ji\xE0 d\u01CEsu\xE0n zu\xF2 sh\xE9nme?", "Liburan mau apa rencanamu?"], { pos: "verba/nomina", emoji: "\u{1F5D2}\uFE0F", en: ["plan", "intend"] }),
  w("h3_050", 3, "\u5927\u6982", "d\xE0g\xE0i", ["kurang lebih"], ["\u5927\u6982\u8981\u4E00\u4E2A\u5C0F\u65F6\u3002", "D\xE0g\xE0i y\xE0o y\xED g\xE8 xi\u01CEosh\xED.", "Kurang lebih satu jam."], { pos: "adverbia", en: ["probably", "roughly"] }),
  w("h3_051", 3, "\u5230\u5904", "d\xE0och\xF9", ["di mana-mana"], ["\u5230\u5904\u90FD\u662F\u82B1\u3002", "D\xE0och\xF9 d\u014Du sh\xEC hu\u0101.", "Di mana-mana bunga."], { pos: "adverbia", emoji: "\u{1F5FA}\uFE0F", en: ["everywhere"] }),
  w("h3_052", 3, "\u5F97", "d\u011Bi", ["harus"], ["\u6211\u5F97\u8D70\u4E86\u3002", "W\u01D2 d\u011Bi z\u01D2u le.", "Aku harus pergi."], { pos: "verba modal", en: ["must", "need to"] }),
  w("h3_053", 3, "\u706F", "d\u0113ng", ["lampu"], ["\u8BF7\u5173\u706F\u3002", "Q\u01D0ng gu\u0101n d\u0113ng.", "Tolong matikan lampu."], { pos: "nomina", emoji: "\u{1F4A1}", imageKey: "Lamp (electrical component)", en: ["lamp", "light"] }),
  w("h3_054", 3, "\u5730\u65B9", "d\xECfang", ["tempat"], ["\u8FD9\u662F\u4E2A\u597D\u5730\u65B9\u3002", "Zh\xE8 sh\xEC g\xE8 h\u01CEo d\xECfang.", "Ini tempat yang bagus."], { pos: "nomina", emoji: "\u{1F4CD}", en: ["place"] }),
  w("h3_055", 3, "\u5730\u5740", "d\xECzh\u01D0", ["alamat"], ["\u8BF7\u544A\u8BC9\u6211\u4F60\u7684\u5730\u5740\u3002", "Q\u01D0ng g\xE0osu w\u01D2 n\u01D0 de d\xECzh\u01D0.", "Tolong beri tahu alamatmu."], { pos: "nomina", emoji: "\u{1F5FA}\uFE0F", imageKey: "Address (geography)", en: ["address"] }),
  w("h3_056", 3, "\u5730\u94C1", "d\xECti\u011B", ["kereta bawah tanah"], ["\u5730\u94C1\u5F88\u5FEB\u3002", "D\xECti\u011B h\u011Bn ku\xE0i.", "Subway-nya cepat."], { pos: "nomina", emoji: "\u{1F687}", imageKey: "Rapid transit", en: ["subway", "metro"] }),
  w("h3_057", 3, "\u5730\u56FE", "d\xECt\xFA", ["peta"], ["\u5730\u56FE\u5728\u5305\u91CC\u3002", "D\xECt\xFA z\xE0i b\u0101o l\u01D0.", "Petanya di dalam tas."], { pos: "nomina", emoji: "\u{1F5FA}\uFE0F", imageKey: "Map", en: ["map"] }),
  w("h3_058", 3, "\u9053\u6B49", "d\xE0oqi\xE0n", ["meminta maaf"], ["\u4ED6\u5411\u6211\u9053\u6B49\u4E86\u3002", "T\u0101 xi\xE0ng w\u01D2 d\xE0oqi\xE0n le.", "Dia minta maaf kepadaku."], { pos: "verba", emoji: "\u{1F647}", en: ["apologize"] }),
  w("h3_059", 3, "\u91CD\u8981\u7684\u662F", "zh\xF2ngy\xE0o de sh\xEC", ["yang penting adalah"], ["\u91CD\u8981\u7684\u662F\u4F60\u52AA\u529B\u4E86\u3002", "Zh\xF2ngy\xE0o de sh\xEC n\u01D0 n\u01D4l\xEC le.", "Yang penting kamu sudah berusaha."], { pos: "frasa", en: ["what matters is"] }),
  w("h3_060", 3, "\u4E1C", "d\u014Dng", ["timur"], ["\u4E1C\u8FB9\u6709\u4E2A\u516C\u56ED\u3002", "D\u014Dngbian y\u01D2u g\xE8 g\u014Dngyu\xE1n.", "Di timur ada taman."], { pos: "nomina", emoji: "\u{1F9ED}", en: ["east"] }),
  w("h3_061", 3, "\u51AC", "d\u014Dng", ["musim dingin"], ["\u51AC\u5929\u6211\u5B66\u6ED1\u96EA\u3002", "D\u014Dngti\u0101n w\u01D2 xu\xE9 hu\xE1xu\u011B.", "Musim dingin aku belajar ski."], { pos: "nomina waktu", emoji: "\u2744\uFE0F", en: ["winter"] }),
  w("h3_062", 3, "\u61C2", "d\u01D2ng", ["mengerti"], ["\u4F60\u61C2\u6211\u7684\u610F\u601D\u5417\uFF1F", "N\u01D0 d\u01D2ng w\u01D2 de y\xECsi ma?", "Kamu paham maksudku?"], { pos: "verba", emoji: "\u{1F4A1}", en: ["understand"] }),
  w("h3_063", 3, "\u52A8\u4F5C", "d\xF2ngzu\xF2", ["gerakan"], ["\u4ED6\u7684\u52A8\u4F5C\u5F88\u5FEB\u3002", "T\u0101 de d\xF2ngzu\xF2 h\u011Bn ku\xE0i.", "Gerakannya cepat."], { pos: "nomina", emoji: "\u{1F938}", imageKey: "Motion (physics)", en: ["movement", "action"] }),
  w("h3_064", 3, "\u8BFB", "d\xFA", ["membaca"], ["\u6211\u559C\u6B22\u8BFB\u4E66\u3002", "W\u01D2 x\u01D0huan d\xFA sh\u016B.", "Aku suka membaca."], { pos: "verba", emoji: "\u{1F4D6}", imageKey: "Reading (process)", en: ["read"] }),
  w("h3_065", 3, "\u5835\u8F66", "d\u01D4ch\u0113", ["macet"], ["\u8DEF\u4E0A\u5835\u8F66\u4E86\u3002", "L\xF9 sh\xE0ng d\u01D4ch\u0113 le.", "Di jalan macet."], { pos: "verba", emoji: "\u{1F697}", imageKey: "Traffic congestion", en: ["traffic jam"] }),
  w("h3_066", 3, "\u997F", "\xE8", ["lapar"], ["\u6211\u6709\u70B9\u513F\u997F\u3002", "W\u01D2 y\u01D2udi\u01CEnr \xE8.", "Aku agak lapar."], { pos: "adjektiva", emoji: "\u{1F37D}\uFE0F", en: ["hungry"] }),
  w("h3_067", 3, "\u800C\u4E14", "\xE9rqi\u011B", ["dan juga", "lagipula"], ["\u4ED6\u806A\u660E\u800C\u4E14\u52AA\u529B\u3002", "T\u0101 c\u014Dngming \xE9rqi\u011B n\u01D4l\xEC.", "Dia pintar dan juga rajin."], { pos: "konjungsi", en: ["moreover"] }),
  w("h3_068", 3, "\u8033\u6735", "\u011Brduo", ["telinga"], ["\u5C0F\u5154\u5B50\u7684\u8033\u6735\u5F88\u957F\u3002", "Xi\u01CEo t\xF9zi de \u011Brduo h\u011Bn ch\xE1ng.", "Telinga kelinci panjang."], { pos: "nomina", emoji: "\u{1F442}", imageKey: "Ear", en: ["ear"] }),
  w("h3_069", 3, "\u53D1", "f\u0101", ["mengirim"], ["\u53D1\u90AE\u4EF6\u7ED9\u6211\u3002", "F\u0101 y\xF3uji\xE0n g\u011Bi w\u01D2.", "Kirim email ke aku."], { pos: "verba", emoji: "\u{1F4E8}", en: ["send"] }),
  w("h3_070", 3, "\u53D1\u751F", "f\u0101sh\u0113ng", ["terjadi"], ["\u53D1\u751F\u4EC0\u4E48\u4E8B\u4E86\uFF1F", "F\u0101sh\u0113ng sh\xE9nme sh\xEC le?", "Apa yang terjadi?"], { pos: "verba", emoji: "\u2753", en: ["happen", "occur"] }),
  w("h3_071", 3, "\u53D1\u73B0", "f\u0101xi\xE0n", ["menemukan"], ["\u6211\u53D1\u73B0\u4E86\u4E00\u4E2A\u9519\u8BEF\u3002", "W\u01D2 f\u0101xi\xE0nle y\xED g\xE8 cu\xF2w\xF9.", "Aku menemukan satu kesalahan."], { pos: "verba", emoji: "\u{1F50E}", imageKey: "Discovery", en: ["discover", "find out"] }),
  w("h3_072", 3, "\u7FFB\u8BD1", "f\u0101ny\xEC", ["menerjemahkan", "penerjemah"], ["\u8BF7\u628A\u8FD9\u53E5\u8BDD\u7FFB\u8BD1\u6210\u82F1\u8BED\u3002", "Q\u01D0ng b\u01CE zh\xE8 j\xF9 hu\xE0 f\u0101ny\xEC ch\xE9ng y\u012Bngy\u01D4.", "Terjemahkan kalimat ini ke Inggris."], { pos: "verba/nomina", emoji: "\u{1F310}", en: ["translate", "translation"] }),
  w("h3_073", 3, "\u65B9\u4FBF", "f\u0101ngbi\xE0n", ["nyaman", "praktis"], ["\u5730\u94C1\u5F88\u65B9\u4FBF\u3002", "D\xECti\u011B h\u011Bn f\u0101ngbi\xE0n.", "Subway sangat praktis."], { pos: "adjektiva", emoji: "\u{1F44C}", en: ["convenient"] }),
  w("h3_074", 3, "\u653E", "f\xE0ng", ["meletakkan"], ["\u4E66\u653E\u5728\u684C\u5B50\u4E0A\u3002", "Sh\u016B f\xE0ng z\xE0i zhu\u014Dzi sh\xE0ng.", "Buku diletakkan di meja."], { pos: "verba", emoji: "\u{1F4E5}", en: ["put", "place"] }),
  w("h3_075", 3, "\u653E\u5FC3", "f\xE0ngx\u012Bn", ["tenang hati"], ["\u4F60\u653E\u5FC3\u5427\u3002", "N\u01D0 f\xE0ngx\u012Bn ba.", "Tenang saja."], { pos: "verba", emoji: "\u{1F60C}", en: ["be relieved"] }),
  w("h3_076", 3, "\u5206", "f\u0113n", ["menit", "membagi"], ["\u6211\u4EEC\u5206\u4E00\u4E0B\u5DE5\u4F5C\u3002", "W\u01D2men f\u0113n y\xEDxi\xE0 g\u014Dngzu\xF2.", "Kita bagi tugasnya."], { pos: "verba/kata bantu", en: ["divide", "minute"] }),
  w("h3_077", 3, "\u98CE\u666F", "f\u0113ngj\u01D0ng", ["pemandangan"], ["\u8FD9\u91CC\u7684\u98CE\u666F\u5F88\u7F8E\u3002", "Zh\xE8l\u01D0 de f\u0113ngj\u01D0ng h\u011Bn m\u011Bi.", "Pemandangan di sini indah."], { pos: "nomina", emoji: "\u{1F3DE}\uFE0F", imageKey: "Scenery", en: ["scenery", "landscape"] }),
  w("h3_078", 3, "\u4ED8\u6B3E", "f\xF9ku\u01CEn", ["membayar"], ["\u5728\u54EA\u91CC\u4ED8\u6B3E\uFF1F", "Z\xE0i n\u01CEl\u01D0 f\xF9ku\u01CEn?", "Bayarnya di mana?"], { pos: "verba", emoji: "\u{1F4B3}", en: ["pay"] }),
  w("h3_079", 3, "\u9644\u8FD1", "f\xF9j\xECn", ["sekitar", "dekat sini"], ["\u9644\u8FD1\u6709\u94F6\u884C\u3002", "F\xF9j\xECn y\u01D2u y\xEDnh\xE1ng.", "Di sekitar sini ada bank."], { pos: "nomina", emoji: "\u{1F4CD}", en: ["nearby"] }),
  w("h3_080", 3, "\u590D\u6742", "f\xF9z\xE1", ["rumit"], ["\u8FD9\u4E2A\u95EE\u9898\u5F88\u590D\u6742\u3002", "Zh\xE8ge w\xE8nt\xED h\u011Bn f\xF9z\xE1.", "Masalah ini rumit."], { pos: "adjektiva", emoji: "\u{1F9E9}", en: ["complicated"] }),
  w("h3_081", 3, "\u8BE5", "g\u0101i", ["harusnya", "seharusnya"], ["\u6211\u8BE5\u51FA\u53D1\u4E86\u3002", "W\u01D2 g\u0101i ch\u016Bf\u0101 le.", "Sebaiknya aku berangkat."], { pos: "verba modal", en: ["should"] }),
  w("h3_082", 3, "\u6539\u6B63", "g\u01CEizh\xE8ng", ["memperbaiki"], ["\u8BF7\u6539\u6B63\u8FD9\u4E2A\u9519\u8BEF\u3002", "Q\u01D0ng g\u01CEizh\xE8ng zh\xE8ge cu\xF2w\xF9.", "Tolong perbaiki kesalahan ini."], { pos: "verba", emoji: "\u{1F527}", en: ["correct", "amend"] }),
  w("h3_083", 3, "\u8D76", "g\u01CEn", ["mengejar"], ["\u6211\u8981\u8D76\u706B\u8F66\u3002", "W\u01D2 y\xE0o g\u01CEn hu\u01D2ch\u0113.", "Aku harus kejar kereta."], { pos: "verba", emoji: "\u{1F686}", en: ["catch", "rush"] }),
  w("h3_084", 3, "\u611F\u89C9", "g\u01CEnju\xE9", ["merasa", "perasaan"], ["\u4F60\u611F\u89C9\u600E\u4E48\u6837\uFF1F", "N\u01D0 g\u01CEnju\xE9 z\u011Bnmey\xE0ng?", "Apa perasaanmu?"], { pos: "verba/nomina", emoji: "\u{1FAF6}", en: ["feel", "feeling"] }),
  w("h3_085", 3, "\u611F\u5192", "g\u01CEnm\xE0o", ["flu", "masuk angin"], ["\u4ED6\u611F\u5192\u4E86\u3002", "T\u0101 g\u01CEnm\xE0o le.", "Dia flu."], { pos: "verba/nomina", emoji: "\u{1F927}", imageKey: "Common cold", en: ["catch a cold"] }),
  w("h3_086", 3, "\u611F\u60C5", "g\u01CEnq\xEDng", ["perasaan", "afeksi"], ["\u4ED6\u4EEC\u611F\u60C5\u5F88\u597D\u3002", "T\u0101men g\u01CEnq\xEDng h\u011Bn h\u01CEo.", "Hubungan mereka erat."], { pos: "nomina", emoji: "\u{1F49E}", en: ["emotion", "affection"] }),
  w("h3_087", 3, "\u611F\u52A8", "g\u01CEnd\xF2ng", ["terharu"], ["\u8FD9\u4E2A\u6545\u4E8B\u5F88\u611F\u4EBA\u3002", "Zh\xE8ge g\xF9shi h\u011Bn g\u01CEnr\xE9n.", "Cerita ini menyentuh hati."], { pos: "verba", emoji: "\u{1F979}", en: ["moved (emotionally)"] }),
  w("h3_088", 3, "\u521A\u624D", "g\u0101ngc\xE1i", ["tadi"], ["\u4ED6\u521A\u624D\u5728\u8FD9\u91CC\u3002", "T\u0101 g\u0101ngc\xE1i z\xE0i zh\xE8l\u01D0.", "Tadi dia ada di sini."], { pos: "nomina waktu", en: ["just now"] }),
  w("h3_089", 3, "\u5404\u4E2A", "g\xE8g\xE8", ["masing-masing"], ["\u5404\u4E2A\u56FD\u5BB6\u6587\u5316\u4E0D\u540C\u3002", "G\xE8g\xE8 gu\xF3ji\u0101 w\xE9nhu\xE0 b\xF9t\xF3ng.", "Budaya tiap negara berbeda."], { pos: "pronomina", en: ["each and every"] }),
  w("h3_090", 3, "\u6839\u636E", "g\u0113nj\xF9", ["berdasarkan"], ["\u6839\u636E\u5730\u56FE\u8D70\u5427\u3002", "G\u0113nj\xF9 d\xECt\xFA z\u01D2u ba.", "Ayo jalan berdasarkan peta."], { pos: "preposisi/nomina", en: ["according to", "basis"] }),
  w("h3_091", 3, "\u8DDF", "g\u0113n", ["dengan", "mengikuti"], ["\u8DDF\u6211\u6765\u3002", "G\u0113n w\u01D2 l\xE1i.", "Ikut aku."], { pos: "preposisi", en: ["with", "follow"] }),
  w("h3_092", 3, "\u66F4\u597D", "g\xE8ng h\u01CEo", ["lebih baik"], ["\u660E\u5929\u4F1A\u66F4\u597D\u3002", "M\xEDngti\u0101n hu\xEC g\xE8ng h\u01CEo.", "Besok akan lebih baik."], { pos: "frasa", en: ["even better"] }),
  w("h3_093", 3, "\u5DE5\u5382", "g\u014Dngch\u01CEng", ["pabrik"], ["\u5DE5\u5382\u91CC\u6709\u5F88\u591A\u5DE5\u4EBA\u3002", "G\u014Dngch\u01CEng l\u01D0 y\u01D2u h\u011Bn du\u014D g\u014Dngr\xE9n.", "Di pabrik banyak pekerja."], { pos: "nomina", emoji: "\u{1F3ED}", imageKey: "Factory", en: ["factory"] }),
  w("h3_094", 3, "\u529F", "g\u014Dng", ["prestasi", "jasa"], ["\u4ED6\u80FD\u6210\u529F\u5168\u9760\u52AA\u529B\u3002", "T\u0101 n\xE9ng ch\xE9ngg\u014Dng qu\xE1n k\xE0o n\u01D4l\xEC.", "Kesuksesannya karena usaha."], { pos: "nomina", en: ["achievement", "merit"] }),
  w("h3_095", 3, "\u5171", "g\xF2ng", ["total", "bersama"], ["\u4E00\u5171\u591A\u5C11\u94B1\uFF1F", "Y\xEDg\xF2ng du\u014Dshao qi\xE1n?", "Semuanya berapa?"], { pos: "adverbia", en: ["altogether"] }),
  w("h3_096", 3, "\u591F", "g\xF2u", ["cukup"], ["\u65F6\u95F4\u591F\u4E86\u5417\uFF1F", "Sh\xEDji\u0101n g\xF2u le ma?", "Waktunya cukup?"], { pos: "adjektiva", emoji: "\u2705", en: ["enough"] }),
  w("h3_097", 3, "\u59D1\u59D1", "g\u016Bgu", ["bibi (saudara ayah)"], ["\u59D1\u59D1\u4F4F\u5728\u4E61\u4E0B\u3002", "G\u016Bgu zh\xF9 z\xE0i xi\u0101ngxi\xE0.", "Bibi tinggal di desa."], { pos: "nomina", emoji: "\u{1F469}", en: ["aunt (paternal)"] }),
  w("h3_098", 3, "\u6545\u4E8B", "g\xF9shi", ["cerita"], ["\u5988\u5988\u8BB2\u7684\u6545\u4E8B\u5F88\u597D\u542C\u3002", "M\u0101ma ji\u01CEng de g\xF9shi h\u011Bn h\u01CEot\u012Bng.", "Cerita yang diceritakan ibu merdu."], { pos: "nomina", emoji: "\u{1F4D6}", imageKey: "Story", en: ["story"] }),
  w("h3_099", 3, "\u522E\u98CE", "gu\u0101f\u0113ng", ["berangin"], ["\u5916\u9762\u5728\u522E\u98CE\u3002", "W\xE0imi\xE0n z\xE0i gu\u0101f\u0113ng.", "Di luar berangin."], { pos: "verba", emoji: "\u{1F32C}\uFE0F", en: ["windy"] }),
  w("h3_100", 3, "\u987E\u5BA2", "g\xF9k\xE8", ["pelanggan"], ["\u987E\u5BA2\u5F88\u591A\u3002", "G\xF9k\xE8 h\u011Bn du\u014D.", "Pelanggannya banyak."], { pos: "nomina", emoji: "\u{1F9CD}", imageKey: "Customer", en: ["customer"] }),
  w("h3_101", 3, "\u9996\u90FD", "sh\u01D2ud\u016B", ["ibu kota"], ["\u5317\u4EAC\u662F\u4E2D\u56FD\u7684\u9996\u90FD\u3002", "B\u011Bij\u012Bng sh\xEC Zh\u014Dnggu\xF3 de sh\u01D2ud\u016B.", "Beijing ibu kota Tiongkok."], { pos: "nomina", emoji: "\u{1F3DB}\uFE0F", imageKey: "Capital city", en: ["capital city"] }),
  w("h3_102", 3, "\u4E60\u60EF", "x\xEDgu\xE0n", ["kebiasaan", "terbiasa"], ["\u6211\u4E60\u60EF\u4E86\u8FD9\u91CC\u7684\u751F\u6D3B\u3002", "W\u01D2 x\xEDgu\xE0nle zh\xE8l\u01D0 de sh\u0113nghu\xF3.", "Aku terbiasa hidup di sini."], { pos: "nomina/verba", emoji: "\u{1F501}", en: ["habit", "be used to"] }),
  w("h3_103", 3, "\u6D77\u519B", "h\u01CEij\u016Bn", ["angkatan laut"], ["\u4ED6\u5728\u6D77\u519B\u670D\u5F79\u3002", "T\u0101 z\xE0i h\u01CEij\u016Bn f\xFAy\xEC.", "Dia bertugas di angkatan laut."], { pos: "nomina", emoji: "\u2693", imageKey: "Navy", en: ["navy"] }),
  w("h3_104", 3, "\u5BB3", "h\xE0i", ["merugikan", "takut"], ["\u5438\u70DF\u6709\u5BB3\u5065\u5EB7\u3002", "X\u012By\u0101n y\u01D2uh\xE0i ji\xE0nk\u0101ng.", "Merokok merugikan kesehatan."], { pos: "verba", en: ["harm", "fear"] }),
  w("h3_105", 3, "\u5BB3\u7F9E", "h\xE0ixi\u016B", ["malu"], ["\u5C0F\u59D1\u5A18\u5F88\u5BB3\u7F9E\u3002", "Xi\u01CEo g\u016Bniang h\u011Bn h\xE0ixi\u016B.", "Gadis kecil pemalu."], { pos: "adjektiva", emoji: "\u{1F633}", en: ["shy"] }),
  w("h3_106", 3, "\u6C57", "h\xE0n", ["keringat"], ["\u4ED6\u6EE1\u5934\u662F\u6C57\u3002", "T\u0101 m\u01CEn t\xF3u sh\xEC h\xE0n.", "Kepalanya penuh keringat."], { pos: "nomina", emoji: "\u{1F4A7}", imageKey: "Perspiration", en: ["sweat"] }),
  w("h3_107", 3, "\u9999\u8549", "xi\u0101ngji\u0101o", ["pisang"], ["\u7334\u5B50\u7231\u5403\u9999\u8549\u3002", "H\xF3uzi \xE0i ch\u012B xi\u0101ngji\u0101o.", "Monyet suka makan pisang."], { pos: "nomina", emoji: "\u{1F34C}", imageKey: "Banana", en: ["banana"] }),
  w("h3_108", 3, "\u597D\u50CF", "h\u01CEoxi\xE0ng", ["tampaknya", "seperti"], ["\u4ED6\u597D\u50CF\u4E0D\u9AD8\u5174\u3002", "T\u0101 h\u01CEoxi\xE0ng b\xFA g\u0101ox\xECng.", "Tampaknya dia tidak senang."], { pos: "adverbia", en: ["seem", "as if"] }),
  w("h3_109", 3, "\u53F7", "h\xE0o", ["nomor", "tanggal"], ["\u4F60\u7684\u53F7\u7801\u662F\u591A\u5C11\uFF1F", "N\u01D0 de h\xE0om\u01CE sh\xEC du\u014Dshao?", "Nomormu berapa?"], { pos: "nomina", en: ["number", "date"] }),
  w("h3_110", 3, "\u559D\u9189", "h\u0113 zu\xEC", ["mabuk"], ["\u4ED6\u559D\u9189\u4E86\u3002", "T\u0101 h\u0113 zu\xEC le.", "Dia mabuk."], { pos: "verba", emoji: "\u{1F37E}", en: ["drunk"] }),
  w("h3_111", 3, "\u76D2\u5B50", "h\xE9zi", ["kotak"], ["\u793C\u7269\u5728\u76D2\u5B50\u91CC\u3002", "L\u01D0w\xF9 z\xE0i h\xE9zi l\u01D0.", "Hadiahnya di dalam kotak."], { pos: "nomina", emoji: "\u{1F4E6}", imageKey: "Box", en: ["box"] }),
  w("h3_112", 3, "\u9ED1", "h\u0113i", ["hitam"], ["\u4ED6\u7A7F\u7740\u9ED1\u88E4\u5B50\u3002", "T\u0101 chu\u0101nzhe h\u0113i k\xF9zi.", "Dia pakai celana hitam."], { pos: "adjektiva", emoji: "\u26AB", imageKey: "Black", en: ["black", "dark"] }),
  w("h3_113", 3, "\u540E\u6765", "h\xF2ul\xE1i", ["kemudian"], ["\u540E\u6765\u4ED6\u6539\u53D8\u4E86\u60F3\u6CD5\u3002", "H\xF2ul\xE1i t\u0101 g\u01CEibi\xE0nle xi\u01CEngf\u01CE.", "Kemudian dia berubah pikiran."], { pos: "nomina waktu", en: ["later", "afterwards"] }),
  w("h3_114", 3, "\u62A4\u58EB", "h\xF9shi", ["perawat"], ["\u62A4\u58EB\u5728\u533B\u9662\u5DE5\u4F5C\u3002", "H\xF9shi z\xE0i y\u012Byu\xE0n g\u014Dngzu\xF2.", "Perawat bekerja di rumah sakit."], { pos: "nomina", emoji: "\u{1F469}\u200D\u2695\uFE0F", imageKey: "Nursing", en: ["nurse"] }),
  w("h3_115", 3, "\u753B", "hu\xE0", ["melukis", "gambar"], ["\u6211\u559C\u6B22\u753B\u753B\u3002", "W\u01D2 x\u01D0huan hu\xE0 hu\xE0.", "Aku suka melukis."], { pos: "verba/nomina", emoji: "\u{1F3A8}", imageKey: "Painting", en: ["paint", "picture"] }),
  w("h3_116", 3, "\u574F", "hu\xE0i", ["rusak", "buruk"], ["\u6211\u7684\u81EA\u884C\u8F66\u574F\u4E86\u3002", "W\u01D2 de z\xECx\xEDngch\u0113 hu\xE0i le.", "Sepedaku rusak."], { pos: "adjektiva", emoji: "\u26A0\uFE0F", en: ["broken", "bad"] }),
  w("h3_117", 3, "\u6B22\u8FCE", "hu\u0101ny\xEDng", ["menyambut", "selamat datang"], ["\u6B22\u8FCE\u6765\u4E2D\u56FD\uFF01", "Hu\u0101ny\xEDng l\xE1i Zh\u014Dnggu\xF3!", "Selamat datang ke Tiongkok!"], { pos: "verba", emoji: "\u{1F389}", en: ["welcome"] }),
  w("h3_118", 3, "\u73AF\u5883", "hu\xE1nj\xECng", ["lingkungan"], ["\u4FDD\u62A4\u73AF\u5883\u5F88\u91CD\u8981\u3002", "B\u01CEoh\xF9 hu\xE1nj\xECng h\u011Bn zh\xF2ngy\xE0o.", "Melindungi lingkungan penting."], { pos: "nomina", emoji: "\u{1F333}", imageKey: "Natural environment", en: ["environment"] }),
  w("h3_119", 3, "\u9EC4\u6CB3", "Hu\xE1ng H\xE9", ["Sungai Kuning"], ["\u9EC4\u6CB3\u662F\u4E2D\u56FD\u7684\u6BCD\u4EB2\u6CB3\u3002", "Hu\xE1ng H\xE9 sh\xEC Zh\u014Dnggu\xF3 de m\u01D4q\u012Bn h\xE9.", "Sungai Kuning adalah ibu dari sungai Tiongkok."], { pos: "nama tempat", emoji: "\u{1F30A}", imageKey: "Yellow River", en: ["Yellow River"] }),
  w("h3_120", 3, "\u9EC4\u8272", "hu\xE1ngs\xE8", ["warna kuning"], ["\u5979\u7684\u88D9\u5B50\u662F\u9EC4\u8272\u7684\u3002", "T\u0101 de q\xFAnzi sh\xEC hu\xE1ngs\xE8 de.", "Roknya kuning."], { pos: "nomina", emoji: "\u{1F7E1}", imageKey: "Yellow", en: ["yellow"] }),
  w("h3_121", 3, "\u56DE\u6765", "hu\xEDl\xE1i", ["kembali"], ["\u4ED6\u4EC0\u4E48\u65F6\u5019\u56DE\u6765\uFF1F", "T\u0101 sh\xE9nme sh\xEDhou hu\xEDl\xE1i?", "Kapan dia kembali?"], { pos: "verba", emoji: "\u{1F519}", en: ["come back"] }),
  w("h3_122", 3, "\u5A5A\u793C", "h\u016Bnl\u01D0", ["pernikahan"], ["\u5A5A\u793C\u5F88\u70ED\u95F9\u3002", "H\u016Bnl\u01D0 h\u011Bn r\xE8nao.", "Pernikahannya meriah."], { pos: "nomina", emoji: "\u{1F492}", imageKey: "Wedding", en: ["wedding"] }),
  w("h3_123", 3, "\u6216\u8005", "hu\xF2zh\u011B", ["atau"], ["\u5750\u706B\u8F66\u6216\u8005\u98DE\u673A\u3002", "Zu\xF2 hu\u01D2ch\u0113 hu\xF2zh\u011B f\u0113ij\u012B.", "Naik kereta atau pesawat."], { pos: "konjungsi", en: ["or"] }),
  w("h3_124", 3, "\u51E0\u4E4E", "j\u012Bh\u016B", ["hampir"], ["\u4ED6\u51E0\u4E4E\u6BCF\u5929\u90FD\u8DD1\u6B65\u3002", "T\u0101 j\u012Bh\u016B m\u011Biti\u0101n d\u014Du p\u01CEob\xF9.", "Dia hampir tiap hari lari."], { pos: "adverbia", en: ["almost"] }),
  w("h3_125", 3, "\u673A\u4F1A", "j\u012Bhu\xEC", ["kesempatan"], ["\u8FD9\u662F\u4E2A\u597D\u673A\u4F1A\u3002", "Zh\xE8 sh\xEC g\xE8 h\u01CEo j\u012Bhu\xEC.", "Ini kesempatan bagus."], { pos: "nomina", emoji: "\u{1F3AF}", imageKey: "Opportunity", en: ["opportunity"] }),
  w("h3_126", 3, "\u6781\u5927", "j\xEDd\xE0", ["sangat besar"], ["\u8FD9\u6B21\u6210\u529F\u5BF9\u4ED6\u5F71\u54CD\u6781\u5927\u3002", "Zh\xE8 c\xEC ch\xE9ngg\u014Dng du\xEC t\u0101 y\u01D0ngxi\u01CEng j\xEDd\xE0.", "Kesuksesan ini berdampak besar."], { pos: "adjektiva", en: ["enormous"] }),
  w("h3_127", 3, "\u96C6\u5408", "j\xEDh\xE9", ["berkumpul"], ["\u65E9\u4E0A\u516B\u70B9\u96C6\u5408\u3002", "Z\u01CEoshang b\u0101 di\u01CEn j\xEDh\xE9.", "Kumpul jam delapan pagi."], { pos: "verba", emoji: "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}", en: ["gather", "assemble"] }),
  w("h3_128", 3, "\u6781\u4E86", "j\xEDle", ["sangat"], ["\u8FD9\u4E2A\u83DC\u597D\u5403\u6781\u4E86\u3002", "Zh\xE8ge c\xE0i h\u01CEoch\u012B j\xEDle.", "Masakan ini lezat sekali."], { pos: "adverbia", en: ["extremely"] }),
  w("h3_129", 3, "\u6324", "j\u01D0", ["penuh sesak"], ["\u516C\u4EA4\u8F66\u4E0A\u5F88\u6324\u3002", "G\u014Dngji\u0101och\u0113 sh\xE0ng h\u011Bn j\u01D0.", "Di dalam bus sesak."], { pos: "adjektiva", emoji: "\u{1F90F}", en: ["crowded", "squeeze"] }),
  w("h3_130", 3, "\u8BA1\u5212", "j\xEChu\xE0", ["rencana", "merencanakan"], ["\u5047\u671F\u6709\u4EC0\u4E48\u8BA1\u5212\uFF1F", "Ji\xE0q\u012B y\u01D2u sh\xE9nme j\xEChu\xE0?", "Rencana liburan apa?"], { pos: "nomina/verba", emoji: "\u{1F5D3}\uFE0F", imageKey: "Planning", en: ["plan"] }),
  w("h3_131", 3, "\u8BB0\u5FC6", "j\xECy\xEC", ["ingatan"], ["\u7AE5\u5E74\u7684\u8BB0\u5FC6\u5F88\u7F8E\u597D\u3002", "T\xF3ngni\xE1n de j\xECy\xEC h\u011Bn m\u011Bih\u01CEo.", "Ingatan masa kecil indah."], { pos: "nomina", emoji: "\u{1F9E0}", imageKey: "Memory", en: ["memory"] }),
  w("h3_132", 3, "\u6280\u672F", "j\xECsh\xF9", ["teknologi", "teknik"], ["\u4ED6\u7684\u6280\u672F\u5F88\u597D\u3002", "T\u0101 de j\xECsh\xF9 h\u011Bn h\u01CEo.", "Tekniknya bagus."], { pos: "nomina", emoji: "\u{1F527}", imageKey: "Technology", en: ["technology", "skill"] }),
  w("h3_133", 3, "\u7EE7\u7EED", "j\xECx\xF9", ["melanjutkan"], ["\u8BF7\u7EE7\u7EED\u8BF4\u3002", "Q\u01D0ng j\xECx\xF9 shu\u014D.", "Silakan lanjutkan."], { pos: "verba", emoji: "\u25B6\uFE0F", en: ["continue"] }),
  w("h3_134", 3, "\u5BB6\u5EAD", "ji\u0101t\xEDng", ["keluarga"], ["\u4ED6\u6709\u4E00\u4E2A\u5E78\u798F\u7684\u5BB6\u5EAD\u3002", "T\u0101 y\u01D2u y\xED g\xE8 x\xECngf\xFA de ji\u0101t\xEDng.", "Dia punya keluarga bahagia."], { pos: "nomina", emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}", imageKey: "Family", en: ["family"] }),
  w("h3_135", 3, "\u4EF7\u683C", "ji\xE0g\xE9", ["harga"], ["\u4EF7\u683C\u5F88\u5408\u7406\u3002", "Ji\xE0g\xE9 h\u011Bn h\xE9l\u01D0.", "Harganya wajar."], { pos: "nomina", emoji: "\u{1F3F7}\uFE0F", imageKey: "Price", en: ["price"] }),
  w("h3_136", 3, "\u575A\u6301", "ji\u0101nch\xED", ["bertahan", "persisten"], ["\u575A\u6301\u5C31\u662F\u80DC\u5229\u3002", "Ji\u0101nch\xED ji\xF9sh\xEC sh\xE8ngl\xEC.", "Bertahan artinya menang."], { pos: "verba", emoji: "\u{1F9D7}", en: ["persist", "insist"] }),
  w("h3_137", 3, "\u7B80\u77ED", "ji\u01CEndu\u01CEn", ["singkat"], ["\u53D1\u8A00\u8BF7\u7B80\u77ED\u3002", "F\u0101y\xE1n q\u01D0ng ji\u01CEndu\u01CEn.", "Berbicara tolong singkat."], { pos: "adjektiva", en: ["brief"] }),
  w("h3_138", 3, "\u89C1\u9762", "ji\xE0nmi\xE0n", ["bertemu"], ["\u6211\u4EEC\u5468\u672B\u89C1\u9762\u5427\u3002", "W\u01D2men zh\u014Dum\xF2 ji\xE0nmi\xE0n ba.", "Ayo ketemu akhir pekan."], { pos: "verba", emoji: "\u{1F91D}", en: ["meet"] }),
  w("h3_139", 3, "\u5065\u5EB7", "ji\xE0nk\u0101ng", ["sehat"], ["\u795D\u4F60\u8EAB\u4F53\u5065\u5EB7\u3002", "Zh\xF9 n\u01D0 sh\u0113nt\u01D0 ji\xE0nk\u0101ng.", "Semoga sehat."], { pos: "adjektiva/nomina", emoji: "\u{1F49A}", en: ["health", "healthy"] }),
  w("h3_140", 3, "\u4EA4\u6D41", "ji\u0101oli\xFA", ["berkomunikasi"], ["\u591A\u4EA4\u6D41\u53EF\u4EE5\u8FDB\u6B65\u3002", "Du\u014D ji\u0101oli\xFA k\u011By\u01D0 j\xECnb\xF9.", "Sering berkomunikasi membawa kemajuan."], { pos: "verba", emoji: "\u{1F4AC}", en: ["communicate", "exchange"] }),
  w("h3_141", 3, "\u90CA\u533A", "ji\u0101oq\u016B", ["pinggir kota"], ["\u90CA\u533A\u7A7A\u6C14\u597D\u3002", "Ji\u0101oq\u016B k\u014Dngq\xEC h\u01CEo.", "Udara di pinggir kota bagus."], { pos: "nomina", emoji: "\u{1F307}", en: ["suburbs"] }),
  w("h3_142", 3, "\u6559\u5BA4", "ji\xE0osh\xEC", ["ruang kelas"], ["\u6559\u5BA4\u91CC\u6709\u4E09\u5341\u4E2A\u5B66\u751F\u3002", "Ji\xE0osh\xEC l\u01D0 y\u01D2u s\u0101nsh\xED g\xE8 xu\xE9sheng.", "Di kelas ada tiga puluh siswa."], { pos: "nomina", emoji: "\u{1F3EB}", imageKey: "Classroom", en: ["classroom"] }),
  w("h3_143", 3, "\u8282\u76EE", "ji\xE9m\xF9", ["acara", "program"], ["\u8FD9\u4E2A\u8282\u76EE\u5F88\u6709\u610F\u601D\u3002", "Zh\xE8ge ji\xE9m\xF9 h\u011Bn y\u01D2uy\xECsi.", "Acara ini menarik."], { pos: "nomina", emoji: "\u{1F4FA}", en: ["program", "show"] }),
  w("h3_144", 3, "\u7ED3\u5A5A", "ji\xE9h\u016Bn", ["menikah"], ["\u4ED6\u4EEC\u660E\u5E74\u7ED3\u5A5A\u3002", "T\u0101men m\xEDngni\xE1n ji\xE9h\u016Bn.", "Mereka menikah tahun depan."], { pos: "verba", emoji: "\u{1F48D}", imageKey: "Marriage", en: ["get married"] }),
  w("h3_145", 3, "\u7ED3\u675F", "ji\xE9sh\xF9", ["berakhir", "mengakhiri"], ["\u4F1A\u8BAE\u4E94\u70B9\u7ED3\u675F\u3002", "Hu\xECy\xEC w\u01D4 di\u01CEn ji\xE9sh\xF9.", "Rapat selesai jam lima."], { pos: "verba", emoji: "\u{1F51A}", en: ["end", "finish"] }),
  w("h3_146", 3, "\u89E3\u51B3", "ji\u011Bju\xE9", ["menyelesaikan"], ["\u6211\u4EEC\u8981\u89E3\u51B3\u95EE\u9898\u3002", "W\u01D2men y\xE0o ji\u011Bju\xE9 w\xE8nt\xED.", "Kita harus selesaikan masalah."], { pos: "verba", emoji: "\u2705", imageKey: "Problem solving", en: ["solve"] }),
  w("h3_147", 3, "\u501F", "ji\xE8", ["meminjam"], ["\u6211\u501F\u4E86\u672C\u4E66\u3002", "W\u01D2 ji\xE8le b\u011Bn sh\u016B.", "Aku meminjam buku."], { pos: "verba", emoji: "\u{1F4DA}", en: ["borrow"] }),
  w("h3_148", 3, "\u89E3\u91CA", "ji\u011Bsh\xEC", ["menjelaskan"], ["\u8BF7\u4F60\u89E3\u91CA\u4E00\u4E0B\u3002", "Q\u01D0ng n\u01D0 ji\u011Bsh\xEC y\xEDxi\xE0.", "Tolong jelaskan."], { pos: "verba/nomina", emoji: "\u{1F4AC}", en: ["explain"] }),
  w("h3_149", 3, "\u7D27", "j\u01D0n", ["ketat", "sibuk"], ["\u65F6\u95F4\u5F88\u7D27\u3002", "Sh\xEDji\u0101n h\u011Bn j\u01D0n.", "Waktunya mepet."], { pos: "adjektiva", en: ["tight", "strict"] }),
  w("h3_150", 3, "\u8FDB\u884C", "j\xECnx\xEDng", ["melaksanakan"], ["\u6BD4\u8D5B\u6B63\u5728\u8FDB\u884C\u3002", "B\u01D0s\xE0i zh\xE8ngz\xE0i j\xECnx\xEDng.", "Pertandingan sedang berlangsung."], { pos: "verba", en: ["carry out", "proceed"] }),
  w("h3_151", 3, "\u8FDB\u5EA6", "j\xECnd\xF9", ["kemajuan", "progres"], ["\u5DE5\u7A0B\u8FDB\u5EA6\u5F88\u5FEB\u3002", "G\u014Dngch\xE9ng j\xECnd\xF9 h\u011Bn ku\xE0i.", "Progres proyeknya cepat."], { pos: "nomina", emoji: "\u{1F4CA}", en: ["progress"] }),
  w("h3_152", 3, "\u7ECF\u5E38", "j\u012Bngch\xE1ng", ["sering"], ["\u4ED6\u7ECF\u5E38\u953B\u70BC\u3002", "T\u0101 j\u012Bngch\xE1ng du\xE0nli\xE0n.", "Dia sering berolahraga."], { pos: "adverbia", en: ["often"] }),
  w("h3_153", 3, "\u7ECF\u8FC7", "j\u012Bnggu\xF2", ["melewati", "proses"], ["\u7ECF\u8FC7\u52AA\u529B\uFF0C\u4ED6\u6210\u529F\u4E86\u3002", "J\u012Bnggu\xF2 n\u01D4l\xEC, t\u0101 ch\xE9ngg\u014Dng le.", "Melalui usaha, dia sukses."], { pos: "verba/preposisi", en: ["pass through", "process"] }),
  w("h3_154", 3, "\u7ECF\u7406", "j\u012Bngl\u01D0", ["manajer"], ["\u7ECF\u7406\u5728\u5F00\u4F1A\u3002", "J\u012Bngl\u01D0 z\xE0i k\u0101ihu\xEC.", "Manajer sedang rapat."], { pos: "nomina", emoji: "\u{1F454}", imageKey: "Management", en: ["manager"] }),
  w("h3_155", 3, "\u7ECF\u9A8C", "j\u012Bngy\xE0n", ["pengalaman"], ["\u4ED6\u7ECF\u9A8C\u4E30\u5BCC\u3002", "T\u0101 j\u012Bngy\xE0n f\u0113ngf\xF9.", "Pengalamannya luas."], { pos: "nomina", emoji: "\u{1F3C5}", imageKey: "Experience", en: ["experience"] }),
  w("h3_156", 3, "\u4E45", "ji\u01D4", ["lama"], ["\u597D\u4E45\u4E0D\u89C1\uFF01", "H\u01CEoji\u01D4 b\xFA ji\xE0n!", "Lama tak jumpa!"], { pos: "adjektiva", en: ["long time"] }),
  w("h3_157", 3, "\u53E5", "j\xF9", ["(kata bantu kalimat)"], ["\u8BF7\u9020\u4E00\u4E2A\u53E5\u5B50\u3002", "Q\u01D0ng z\xE0o y\xED g\xE8 j\xF9zi.", "Tolong buat satu kalimat."], { pos: "kata bantu", en: ["sentence measure"] }),
  w("h3_158", 3, "\u51B3\u5B9A", "ju\xE9d\xECng", ["memutuskan", "keputusan"], ["\u6211\u51B3\u5B9A\u5B66\u4E60\u4E86\u3002", "W\u01D2 ju\xE9d\xECng xu\xE9x\xED le.", "Aku putuskan untuk belajar."], { pos: "verba/nomina", emoji: "\u{1F9ED}", imageKey: "Decision making", en: ["decide", "decision"] }),
  w("h3_159", 3, "\u7EDD\u5BF9", "ju\xE9du\xEC", ["mutlak"], ["\u8FD9\u4E0D\u662F\u7EDD\u5BF9\u7684\u3002", "Zh\xE8 b\xFA sh\xEC ju\xE9du\xEC de.", "Ini tidak mutlak."], { pos: "adjektiva/adverbia", en: ["absolute"] }),
  w("h3_160", 3, "\u5F00\u5FC3", "k\u0101ix\u012Bn", ["gembira"], ["\u73A9\u5F97\u5F88\u5F00\u5FC3\u3002", "W\xE1n de h\u011Bn k\u0101ix\u012Bn.", "Bermain dengan gembira."], { pos: "adjektiva", emoji: "\u{1F604}", en: ["happy"] }),
  w("h3_161", 3, "\u770B\u61C2", "k\xE0nd\u01D2ng", ["paham (dari membaca)"], ["\u8FD9\u7BC7\u6587\u7AE0\u6211\u770B\u61C2\u4E86\u3002", "Zh\xE8 pi\u0101n w\xE9nzh\u0101ng w\u01D2 k\xE0nd\u01D2ng le.", "Aku paham artikel ini."], { pos: "verba", en: ["understand by reading"] }),
  w("h3_162", 3, "\u54B3\u55FD", "k\xE9sou", ["batuk"], ["\u4ED6\u54B3\u55FD\u4E86\u3002", "T\u0101 k\xE9sou le.", "Dia batuk."], { pos: "verba", emoji: "\u{1F927}", en: ["cough"] }),
  w("h3_163", 3, "\u6E34", "k\u011B", ["haus"], ["\u8DD1\u5B8C\u6B65\u5F88\u6E34\u3002", "P\u01CEo w\xE1n b\xF9 h\u011Bn k\u011B.", "Setelah lari haus."], { pos: "adjektiva", emoji: "\u{1F964}", en: ["thirsty"] }),
  w("h3_164", 3, "\u53EF\u7231", "k\u011B'\xE0i", ["menggemaskan"], ["\u5C0F\u732B\u5F88\u53EF\u7231\u3002", "Xi\u01CEo m\u0101o h\u011Bn k\u011B'\xE0i.", "Kucing kecil menggemaskan."], { pos: "adjektiva", emoji: "\u{1F63B}", en: ["cute"] }),
  w("h3_165", 3, "\u7A7A\u6C14", "k\u014Dngq\xEC", ["udara"], ["\u5C71\u91CC\u7A7A\u6C14\u6E05\u65B0\u3002", "Sh\u0101n l\u01D0 k\u014Dngq\xEC q\u012Bngx\u012Bn.", "Udara di gunung segar."], { pos: "nomina", emoji: "\u{1F33F}", imageKey: "Atmosphere of Earth", en: ["air", "atmosphere"] }),
  w("h3_166", 3, "\u82E6", "k\u01D4", ["pahit", "susah"], ["\u836F\u5F88\u82E6\u3002", "Y\xE0o h\u011Bn k\u01D4.", "Obatnya pahit."], { pos: "adjektiva", emoji: "\u{1F48A}", en: ["bitter", "hardship"] }),
  w("h3_167", 3, "\u88E4\u5B50", "k\xF9zi", ["celana"], ["\u8FD9\u6761\u88E4\u5B50\u5F88\u77ED\u3002", "Zh\xE8 ti\xE1o k\xF9zi h\u011Bn du\u01CEn.", "Celana ini pendek."], { pos: "nomina", emoji: "\u{1F456}", imageKey: "Trousers", en: ["trousers", "pants"] }),
  w("h3_168", 3, "\u7B77\u5B50", "ku\xE0izi", ["sumpit"], ["\u4E2D\u56FD\u4EBA\u7528\u7B77\u5B50\u5403\u996D\u3002", "Zh\u014Dnggu\xF3r\xE9n y\xF2ng ku\xE0izi ch\u012Bf\xE0n.", "Orang Tiongkok makan pakai sumpit."], { pos: "nomina", emoji: "\u{1F962}", imageKey: "Chopsticks", en: ["chopsticks"] }),
  w("h3_169", 3, "\u84DD", "l\xE1n", ["biru"], ["\u5929\u7A7A\u5F88\u84DD\u3002", "Ti\u0101nk\u014Dng h\u011Bn l\xE1n.", "Langitnya biru."], { pos: "adjektiva", emoji: "\u{1F535}", imageKey: "Blue", en: ["blue"] }),
  w("h3_170", 3, "\u8001", "l\u01CEo", ["tua", "lama"], ["\u7237\u7237\u8001\u4E86\u3002", "Y\xE9ye l\u01CEo le.", "Kakek sudah tua."], { pos: "adjektiva", emoji: "\u{1F474}", en: ["old"] }),
  w("h3_171", 3, "\u8001\u864E", "l\u01CEoh\u01D4", ["harimau"], ["\u8001\u864E\u662F\u731B\u517D\u3002", "L\u01CEoh\u01D4 sh\xEC m\u011Bngsh\xF2u.", "Harimau predator buas."], { pos: "nomina", emoji: "\u{1F42F}", imageKey: "Tiger", en: ["tiger"] }),
  w("h3_172", 3, "\u79BB\u5F00", "l\xEDk\u0101i", ["meninggalkan"], ["\u4ED6\u79BB\u5F00\u5BB6\u53BB\u4E0A\u6D77\u3002", "T\u0101 l\xEDk\u0101i ji\u0101 q\xF9 Sh\xE0ngh\u01CEi.", "Dia tinggalkan rumah ke Shanghai."], { pos: "verba", emoji: "\u{1F44B}", en: ["leave"] }),
  w("h3_173", 3, "\u793C\u7269", "l\u01D0w\xF9", ["hadiah"], ["\u751F\u65E5\u793C\u7269\u5F88\u559C\u6B22\u3002", "Sh\u0113ngr\xEC l\u01D0w\xF9 h\u011Bn x\u01D0huan.", "Hadiah ulang tahunnya disukai."], { pos: "nomina", emoji: "\u{1F381}", imageKey: "Gift", en: ["gift", "present"] }),
  w("h3_174", 3, "\u5386\u53F2", "l\xECsh\u01D0", ["sejarah"], ["\u6211\u559C\u6B22\u5386\u53F2\u3002", "W\u01D2 x\u01D0huan l\xECsh\u01D0.", "Aku suka sejarah."], { pos: "nomina", emoji: "\u{1F3DB}\uFE0F", imageKey: "History", en: ["history"] }),
  w("h3_175", 3, "\u8138", "li\u01CEn", ["wajah"], ["\u5979\u7684\u8138\u7EA2\u4E86\u3002", "T\u0101 de li\u01CEn h\xF3ng le.", "Wajahnya memerah."], { pos: "nomina", emoji: "\u{1F60A}", imageKey: "Face", en: ["face"] }),
  w("h3_176", 3, "\u7EC3\u4E60", "li\xE0nx\xED", ["latihan"], ["\u591A\u505A\u7EC3\u4E60\u3002", "Du\u014D zu\xF2 li\xE0nx\xED.", "Banyak-banyak latihan."], { pos: "nomina/verba", emoji: "\u{1F4DD}", en: ["practice"] }),
  w("h3_177", 3, "\u4E24", "li\u01CEng", ["dua (kata bantu)"], ["\u4E24\u676F\u6C34", "li\u01CEng b\u0113i shu\u01D0", "dua gelas air"], { pos: "numeral", emoji: "2\uFE0F\u20E3", en: ["two (measure)"] }),
  w("h3_178", 3, "\u843D\u540E", "lu\xF2h\xF2u", ["tertinggal"], ["\u4ED6\u843D\u540E\u4E86\uFF0C\u4F46\u6CA1\u653E\u5F03\u3002", "T\u0101 lu\xF2h\xF2u le, d\xE0n m\xE9i f\xE0ngq\xEC.", "Dia tertinggal tapi menyerah."], { pos: "verba", en: ["fall behind"] }),
  w("h3_179", 3, "\u5F8B\u5E08", "l\u01DCsh\u012B", ["pengacara"], ["\u5F8B\u5E08\u5E2E\u52A9\u89E3\u51B3\u7EA0\u7EB7\u3002", "L\u01DCsh\u012B b\u0101ngzh\xF9 ji\u011Bju\xE9 ji\u016Bf\u0113n.", "Pengacara bantu selesaikan sengketa."], { pos: "nomina", emoji: "\u2696\uFE0F", imageKey: "Lawyer", en: ["lawyer"] }),
  w("h3_180", 3, "\u9A6C\u8DEF", "m\u01CEl\xF9", ["jalan raya"], ["\u8FC7\u9A6C\u8DEF\u8981\u5C0F\u5FC3\u3002", "Gu\xF2 m\u01CEl\xF9 y\xE0o xi\u01CEox\u012Bn.", "Menyeberang jalan hati-hati."], { pos: "nomina", emoji: "\u{1F6E3}\uFE0F", en: ["road"] }),
  w("h3_181", 3, "\u6EE1", "m\u01CEn", ["penuh"], ["\u676F\u5B50\u91CC\u6C34\u6EE1\u4E86\u3002", "B\u0113izi l\u01D0 shu\u01D0 m\u01CEn le.", "Air di gelas penuh."], { pos: "adjektiva", emoji: "\u{1F235}", en: ["full"] }),
  w("h3_182", 3, "\u5E3D\u5B50", "m\xE0ozi", ["topi"], ["\u8FD9\u9876\u5E3D\u5B50\u5F88\u6F02\u4EAE\u3002", "Zh\xE8 d\u01D0ng m\xE0ozi h\u011Bn pi\xE0oliang.", "Topi ini cantik."], { pos: "nomina", emoji: "\u{1F9E2}", imageKey: "Hat", en: ["hat"] }),
  w("h3_183", 3, "\u6BCF", "m\u011Bi", ["setiap"], ["\u6211\u6BCF\u5929\u8DD1\u6B65\u3002", "W\u01D2 m\u011Biti\u0101n p\u01CEob\xF9.", "Aku lari tiap hari."], { pos: "pronomina", en: ["every"] }),
  w("h3_184", 3, "\u9762\u5305", "mi\xE0nb\u0101o", ["roti"], ["\u9762\u5305\u5F88\u65B0\u9C9C\u3002", "Mi\xE0nb\u0101o h\u011Bn x\u012Bnxi\u0101n.", "Rotinya segar."], { pos: "nomina", emoji: "\u{1F35E}", en: ["bread"] }),
  w("h3_185", 3, "\u660E\u767D", "m\xEDngbai", ["mengerti"], ["\u4F60\u660E\u767D\u4E86\u5417\uFF1F", "N\u01D0 m\xEDngbai le ma?", "Kamu paham?"], { pos: "verba", emoji: "\u{1F4A1}", en: ["understand"] }),
  w("h3_186", 3, "\u62FF", "n\xE1", ["membawa", "mengambil"], ["\u8BF7\u62FF\u597D\u4F60\u7684\u5305\u3002", "Q\u01D0ng n\xE1 h\u01CEo n\u01D0 de b\u0101o.", "Pegang tas baik-baik."], { pos: "verba", emoji: "\u{1F932}", en: ["take", "hold"] }),
  w("h3_187", 3, "\u96BE\u8FC7", "n\xE1ngu\xF2", ["sedih"], ["\u4ED6\u5F88\u96BE\u8FC7\u3002", "T\u0101 h\u011Bn n\xE1ngu\xF2.", "Dia sedih sekali."], { pos: "adjektiva", emoji: "\u{1F622}", en: ["sad"] }),
  w("h3_188", 3, "\u9713\u8679\u706F", "n\xEDh\xF3ngd\u0113ng", ["lampu neon"], ["\u8857\u4E0A\u7684\u9713\u8679\u706F\u5F88\u4EAE\u3002", "Ji\u0113 sh\xE0ng de n\xEDh\xF3ngd\u0113ng h\u011Bn li\xE0ng.", "Lampu neon di jalan terang."], { pos: "nomina", emoji: "\u{1F303}", en: ["neon light"] }),
  w("h3_189", 3, "\u5E74\u8F7B", "ni\xE1nq\u012Bng", ["muda"], ["\u5979\u770B\u8D77\u6765\u5F88\u5E74\u8F7B\u3002", "T\u0101 k\xE0n q\u01D0l\xE1i h\u011Bn ni\xE1nq\u012Bng.", "Dia tampak muda."], { pos: "adjektiva", emoji: "\u{1F9D1}", imageKey: "Youth", en: ["young"] }),
  w("h3_190", 3, "\u52AA\u529B", "n\u01D4l\xEC", ["berusaha keras"], ["\u7EE7\u7EED\u52AA\u529B\uFF01", "J\xECx\xF9 n\u01D4l\xEC!", "Terus berusaha!"], { pos: "verba/adjektiva", emoji: "\u{1F4AA}", en: ["strive", "effort"] }),
  w("h3_191", 3, "\u722C\u5C71", "p\xE1 sh\u0101n", ["mendaki gunung"], ["\u5468\u672B\u6211\u4EEC\u53BB\u722C\u5C71\u3002", "Zh\u014Dum\xF2 w\u01D2men q\xF9 p\xE1 sh\u0101n.", "Akhir pekan kami mendaki."], { pos: "verba", emoji: "\u26F0\uFE0F", imageKey: "Mountaineering", en: ["climb a mountain"] }),
  w("h3_192", 3, "\u76D8\u5B50", "p\xE1nzi", ["piring"], ["\u76D8\u5B50\u5F88\u5E72\u51C0\u3002", "P\xE1nzi h\u011Bn g\u0101nj\xECng.", "Piringnya bersih."], { pos: "nomina", emoji: "\u{1F37D}\uFE0F", imageKey: "Plate", en: ["plate"] }),
  w("h3_193", 3, "\u80D6", "p\xE0ng", ["gemuk"], ["\u4ED6\u6709\u70B9\u513F\u80D6\u3002", "T\u0101 y\u01D2udi\u01CEnr p\xE0ng.", "Dia agak gemuk."], { pos: "adjektiva", emoji: "\u{1F437}", en: ["fat"] }),
  w("h3_194", 3, "\u76AE\u5305", "p\xEDb\u0101o", ["tas kulit"], ["\u7238\u7238\u7684\u76AE\u5305\u5F88\u65E7\u3002", "B\xE0ba de p\xEDb\u0101o h\u011Bn ji\xF9.", "Tas kulit ayah tua."], { pos: "nomina", emoji: "\u{1F45D}", en: ["leather bag"] }),
  w("h3_195", 3, "\u666E\u901A\u8BDD", "p\u01D4t\u014Dnghu\xE0", ["bahasa Mandarin standar"], ["\u8BF7\u8BF4\u666E\u901A\u8BDD\u3002", "Q\u01D0ng shu\u014D p\u01D4t\u014Dnghu\xE0.", "Tolong bicara Mandarin standar."], { pos: "nomina", emoji: "\u{1F5E3}\uFE0F", en: ["Mandarin"] }),
  w("h3_196", 3, "\u94C5\u7B14", "qi\u0101nb\u01D0", ["pensil"], ["\u6211\u7528\u94C5\u7B14\u5199\u5B57\u3002", "W\u01D2 y\xF2ng qi\u0101nb\u01D0 xi\u011B z\xEC.", "Aku menulis pakai pensil."], { pos: "nomina", emoji: "\u270F\uFE0F", imageKey: "Pencil", en: ["pencil"] }),
  w("h3_197", 3, "\u9A91", "q\xED", ["mengendarai"], ["\u4ED6\u4F1A\u9A91\u9A6C\u3002", "T\u0101 hu\xEC q\xED m\u01CE.", "Dia bisa berkuda."], { pos: "verba", emoji: "\u{1F40E}", en: ["ride"] }),
  w("h3_198", 3, "\u51E0\u4E4E", "j\u012Bh\u016B", ["hampir"], ["\u51E0\u4E4E\u6240\u6709\u4EBA\u90FD\u6765\u4E86\u3002", "J\u012Bh\u016B su\u01D2y\u01D2u r\xE9n d\u014Du l\xE1i le.", "Hampir semua orang datang."], { pos: "adverbia", en: ["almost"] }),
  w("h3_199", 3, "\u6C14\u5019", "q\xECh\xF2u", ["iklim"], ["\u5357\u65B9\u6C14\u5019\u6E29\u6696\u3002", "N\xE1nf\u0101ng q\xECh\xF2u w\u0113nnu\u01CEn.", "Iklim selatan hangat."], { pos: "nomina", emoji: "\u{1F326}\uFE0F", imageKey: "Climate", en: ["climate"] }),
  w("h3_200", 3, "\u5343\u4E07", "qi\u0101nw\xE0n", ["pasti (tolong)"], ["\u5343\u4E07\u8981\u5C0F\u5FC3\u3002", "Qi\u0101nw\xE0n y\xE0o xi\u01CEox\u012Bn.", "Pasti harus hati-hati."], { pos: "adverbia", en: ["must (reminder)"] }),
  w("h3_201", 3, "\u5DE7", "qi\u01CEo", ["tepat", "kebetulan"], ["\u6211\u4EEC\u5DE7\u9047\u4E86\u3002", "W\u01D2men qi\u01CEoy\xF9 le.", "Kami bertemu kebetulan."], { pos: "adjektiva/adverbia", en: ["coincidental", "clever"] }),
  w("h3_202", 3, "\u8F7B", "q\u012Bng", ["ringan"], ["\u8FD9\u4E2A\u7BB1\u5B50\u5F88\u8F7B\u3002", "Zh\xE8ge xi\u0101ngzi h\u011Bn q\u012Bng.", "Koper ini ringan."], { pos: "adjektiva", emoji: "\u{1FAB6}", imageKey: "Weight", en: ["light (weight)"] }),
  w("h3_203", 3, "\u6E05\u695A", "q\u012Bngchu", ["jelas"], ["\u4ED6\u8BF4\u5F97\u5F88\u6E05\u695A\u3002", "T\u0101 shu\u014D de h\u011Bn q\u012Bngchu.", "Dia menjelaskan dengan jelas."], { pos: "adjektiva", emoji: "\u{1F50D}", en: ["clear", "distinct"] }),
  w("h3_204", 3, "\u8BF7", "q\u01D0ng", ["mengundang", "silakan"], ["\u8BF7\u591A\u6307\u6559\u3002", "Q\u01D0ng du\u014D zh\u01D0ji\xE0o.", "Mohon bimbingannya."], { pos: "verba", en: ["please", "invite"] }),
  w("h3_205", 3, "\u79CB", "qi\u016B", ["musim gugur"], ["\u79CB\u5929\u6C14\u5019\u51C9\u723D\u3002", "Qi\u016Bti\u0101n q\xECh\xF2u li\xE1ngshu\u01CEng.", "Musim gugur sejuk."], { pos: "nomina waktu", emoji: "\u{1F342}", imageKey: "Autumn", en: ["autumn"] }),
  w("h3_206", 3, "\u88D9\u5B50", "q\xFAnzi", ["rok"], ["\u8FD9\u6761\u88D9\u5B50\u5F88\u6F02\u4EAE\u3002", "Zh\xE8 ti\xE1o q\xFAnzi h\u011Bn pi\xE0oliang.", "Rok ini cantik."], { pos: "nomina", emoji: "\u{1F457}", imageKey: "Skirt", en: ["skirt"] }),
  w("h3_207", 3, "\u7136\u540E", "r\xE1nh\xF2u", ["kemudian"], ["\u5148\u505A\u4F5C\u4E1A\uFF0C\u7136\u540E\u73A9\u3002", "Xi\u0101n zu\xF2 zu\xF2y\xE8, r\xE1nh\xF2u w\xE1n.", "Kerjakan PR dulu, lalu bermain."], { pos: "konjungsi", en: ["then"] }),
  w("h3_208", 3, "\u70ED\u60C5", "r\xE8q\xEDng", ["ramah hangat"], ["\u4E2D\u56FD\u4EBA\u5F88\u70ED\u60C5\u3002", "Zh\u014Dnggu\xF3r\xE9n h\u011Bn r\xE8q\xEDng.", "Orang Tiongkok ramah."], { pos: "adjektiva", emoji: "\u{1F917}", en: ["warm", "enthusiastic"] }),
  w("h3_209", 3, "\u8BA4\u4E3A", "r\xE8nw\xE9i", ["menurut pendapat"], ["\u6211\u8BA4\u4E3A\u53EF\u4EE5\u3002", "W\u01D2 r\xE8nw\xE9i k\u011By\u01D0.", "Menurutku bisa."], { pos: "verba", en: ["believe", "consider"] }),
  w("h3_210", 3, "\u8BA4\u771F", "r\xE8nzh\u0113n", ["serius"], ["\u8BA4\u771F\u5B66\u4E60\u3002", "R\xE8nzh\u0113n xu\xE9x\xED.", "Belajar dengan serius."], { pos: "adjektiva", emoji: "\u{1F4D6}", en: ["earnest"] }),
  w("h3_211", 3, "\u5BB9\u6613", "r\xF3ngy\xEC", ["mudah"], ["\u8FD9\u4E2A\u95EE\u9898\u5BB9\u6613\u3002", "Zh\xE8ge w\xE8nt\xED r\xF3ngy\xEC.", "Soal ini mudah."], { pos: "adjektiva", en: ["easy"] }),
  w("h3_212", 3, "\u5982\u679C", "r\xFAgu\u01D2", ["jika"], ["\u5982\u679C\u6709\u65F6\u95F4\u5C31\u6765\u3002", "R\xFAgu\u01D2 y\u01D2u sh\xEDji\u0101n ji\xF9 l\xE1i.", "Kalau ada waktu, datang."], { pos: "konjungsi", en: ["if"] }),
  w("h3_213", 3, "\u4F1E", "s\u01CEn", ["payung"], ["\u5E26\u4F1E\u4E86\u5417\uFF1F", "D\xE0i s\u01CEn le ma?", "Sudah bawa payung?"], { pos: "nomina", emoji: "\u2602\uFE0F", en: ["umbrella"] }),
  w("h3_214", 3, "\u4F24\u5FC3", "sh\u0101ngx\u012Bn", ["patah hati"], ["\u522B\u4F24\u5FC3\u4E86\u3002", "Bi\xE9 sh\u0101ngx\u012Bn le.", "Jangan sedih lagi."], { pos: "adjektiva", emoji: "\u{1F494}", en: ["sad", "grieved"] }),
  w("h3_215", 3, "\u8D85\u5E02", "ch\u0101osh\xEC", ["supermarket"], ["\u8D85\u5E02\u4E1C\u897F\u4FBF\u5B9C\u3002", "Ch\u0101osh\xEC d\u014Dngxi pi\xE1nyi.", "Barang supermarket murah."], { pos: "nomina", emoji: "\u{1F6D2}", en: ["supermarket"] }),
  w("h3_216", 3, "\u4E16\u754C\u4E0A", "sh\xECji\xE8 sh\xE0ng", ["di dunia"], ["\u4E16\u754C\u4E0A\u6709\u5F88\u591A\u56FD\u5BB6\u3002", "Sh\xECji\xE8 sh\xE0ng y\u01D2u h\u011Bn du\u014D gu\xF3ji\u0101.", "Di dunia banyak negara."], { pos: "frasa", en: ["in the world"] }),
  w("h3_217", 3, "\u8EAB\u4F53", "sh\u0113nt\u01D0", ["badan"], ["\u953B\u70BC\u8EAB\u4F53\u3002", "Du\xE0nli\xE0n sh\u0113nt\u01D0.", "Latih tubuh."], { pos: "nomina", emoji: "\u{1F4AA}", en: ["body"] }),
  w("h3_218", 3, "\u6DF1", "sh\u0113n", ["dalam"], ["\u6CB3\u6C34\u5F88\u6DF1\u3002", "H\xE9 shu\u01D0 h\u011Bn sh\u0113n.", "Air sungainya dalam."], { pos: "adjektiva", emoji: "\u{1F30A}", imageKey: "Depth", en: ["deep"] }),
  w("h3_219", 3, "\u751F\u6C14", "sh\u0113ngq\xEC", ["marah"], ["\u522B\u751F\u6C14\u4E86\u3002", "Bi\xE9 sh\u0113ngq\xEC le.", "Jangan marah lagi."], { pos: "verba", emoji: "\u{1F620}", en: ["angry"] }),
  w("h3_220", 3, "\u751F\u65E5", "sh\u0113ngr\xEC", ["hari lahir"], ["\u751F\u65E5\u805A\u4F1A\u5F88\u5F00\u5FC3\u3002", "Sh\u0113ngr\xEC j\xF9hu\xEC h\u011Bn k\u0101ix\u012Bn.", "Pesta ulang tahun menyenangkan."], { pos: "nomina", emoji: "\u{1F382}", en: ["birthday"] }),
  w("h3_221", 3, "\u58F0\u97F3", "sh\u0113ngy\u012Bn", ["suara"], ["\u9E1F\u7684\u58F0\u97F3\u5F88\u597D\u542C\u3002", "Ni\u01CEo de sh\u0113ngy\u012Bn h\u011Bn h\u01CEot\u012Bng.", "Suara burung merdu."], { pos: "nomina", emoji: "\u{1F50A}", en: ["sound"] }),
  w("h3_222", 3, "\u4E16\u754C", "sh\xECji\xE8", ["dunia"], ["\u4E16\u754C\u5404\u5730\u3002", "Sh\xECji\xE8 g\xE8 d\xEC.", "Berbagai tempat di dunia."], { pos: "nomina", emoji: "\u{1F30D}", en: ["world"] }),
  w("h3_223", 3, "\u53D4\u53D4", "sh\u016Bshu", ["paman"], ["\u53D4\u53D4\u5F00\u8F66\u6765\u63A5\u6211\u3002", "Sh\u016Bshu k\u0101ich\u0113 l\xE1i ji\u0113 w\u01D2.", "Paman menjemputku dengan mobil."], { pos: "nomina", emoji: "\u{1F468}", en: ["uncle"] }),
  w("h3_224", 3, "\u8212\u670D", "sh\u016Bfu", ["nyaman"], ["\u8FD9\u6905\u5B50\u5750\u7740\u8212\u670D\u3002", "Zh\xE8 y\u01D0zi zu\xF2zhe sh\u016Bfu.", "Kursi ini nyaman diduduki."], { pos: "adjektiva", emoji: "\u{1F60C}", en: ["comfortable"] }),
  w("h3_225", 3, "\u5E08\u5085", "sh\u012Bfu", ["teknisi", "master"], ["\u5E08\u5085\u4FEE\u597D\u4E86\u8F66\u3002", "Sh\u012Bfu xi\u016B h\u01CEole ch\u0113.", "Mekanik memperbaiki mobil."], { pos: "nomina", emoji: "\u{1F9D1}\u200D\u{1F527}", en: ["master worker"] }),
  w("h3_226", 3, "\u7626", "sh\xF2u", ["kurus"], ["\u4ED6\u6BD4\u4EE5\u524D\u7626\u4E86\u3002", "T\u0101 b\u01D0 y\u01D0qi\xE1n sh\xF2u le.", "Dia lebih kurus dari dulu."], { pos: "adjektiva", emoji: "\u{1FAB6}", en: ["thin"] }),
  w("h3_227", 3, "\u6570", "sh\u01D4", ["menghitung"], ["\u5C0F\u5B69\u4F1A\u6570\u6570\u4E86\u3002", "Xi\u01CEoh\xE1i hu\xEC sh\u01D4 sh\xF9 le.", "Anak kecil sudah bisa berhitung."], { pos: "verba", en: ["count"] }),
  w("h3_228", 3, "\u6570\u5B66", "sh\xF9xu\xE9", ["matematika"], ["\u6570\u5B66\u4F5C\u4E1A\u5F88\u591A\u3002", "Sh\xF9xu\xE9 zu\xF2y\xE8 h\u011Bn du\u014D.", "PR matematika banyak."], { pos: "nomina", emoji: "\u{1F522}", en: ["math"] }),
  w("h3_229", 3, "\u5237\u7259", "shu\u0101 y\xE1", ["menggosok gigi"], ["\u65E9\u665A\u8981\u5237\u7259\u3002", "Z\u01CEo w\u01CEn y\xE0o shu\u0101 y\xE1.", "Pagi-malam gosok gigi."], { pos: "verba", emoji: "\u{1FAA5}", en: ["brush teeth"] }),
  w("h3_230", 3, "\u592A\u9633", "t\xE0iy\xE1ng", ["matahari"], ["\u592A\u9633\u51FA\u6765\u4E86\u3002", "T\xE0iy\xE1ng ch\u016Bl\xE1i le.", "Matahari terbit."], { pos: "nomina", emoji: "\u2600\uFE0F", en: ["sun"] }),
  w("h3_231", 3, "\u7279\u522B", "t\xE8bi\xE9", ["sangat khusus"], ["\u4ED6\u7684\u83DC\u7279\u522B\u597D\u5403\u3002", "T\u0101 de c\xE0i t\xE8bi\xE9 h\u01CEoch\u012B.", "Masakannya spesial enaknya."], { pos: "adverbia", en: ["especially"] }),
  w("h3_232", 3, "\u75BC", "t\xE9ng", ["sakit"], ["\u809A\u5B50\u75BC\u3002", "D\xF9zi t\xE9ng.", "Perut sakit."], { pos: "verba", emoji: "\u{1F915}", en: ["pain"] }),
  w("h3_233", 3, "\u63D0\u9AD8", "t\xEDg\u0101o", ["meningkat"], ["\u6210\u7EE9\u63D0\u9AD8\u4E86\u3002", "Ch\xE9ngj\xEC t\xEDg\u0101o le.", "Nilainya meningkat."], { pos: "verba", emoji: "\u{1F4C8}", en: ["raise", "improve"] }),
  w("h3_234", 3, "\u4F53\u80B2", "t\u01D0y\xF9", ["olahraga"], ["\u6211\u559C\u6B22\u4F53\u80B2\u8BFE\u3002", "W\u01D2 x\u01D0huan t\u01D0y\xF9 k\xE8.", "Aku suka pelajaran olahraga."], { pos: "nomina", emoji: "\u26BD", en: ["sports", "PE"] }),
  w("h3_235", 3, "\u751C", "ti\xE1n", ["manis"], ["\u8FD9\u4E2A\u897F\u74DC\u5F88\u751C\u3002", "Zh\xE8ge x\u012Bgu\u0101 h\u011Bn ti\xE1n.", "Semangka ini manis."], { pos: "adjektiva", emoji: "\u{1F36C}", imageKey: "Sweetness", en: ["sweet"] }),
  w("h3_236", 3, "\u6761", "ti\xE1o", ["(kata bantu panjang)"], ["\u4E00\u6761\u6CB3", "y\xEC ti\xE1o h\xE9", "satu sungai"], { pos: "kata bantu", en: ["measure (long objects)"] }),
  w("h3_237", 3, "\u8DF3\u821E", "ti\xE0o w\u01D4", ["menari"], ["\u5979\u4EEC\u8DF3\u821E\u8DF3\u5F97\u597D\u3002", "T\u0101men ti\xE0ow\u01D4 ti\xE0o de h\u01CEo.", "Mereka menari dengan baik."], { pos: "verba", emoji: "\u{1F483}", imageKey: "Dance", en: ["dance"] }),
  w("h3_238", 3, "\u540C", "t\xF3ng", ["sama"], ["\u540C\u9F84\u4EBA\u66F4\u5BB9\u6613\u4EA4\u6D41\u3002", "T\xF3ngl\xEDng r\xE9n g\xE8ng r\xF3ngy\xEC ji\u0101oli\xFA.", "Sesama usia mudah bergaul."], { pos: "adjektiva", en: ["same"] }),
  w("h3_239", 3, "\u540C\u610F", "t\xF3ngy\xEC", ["setuju"], ["\u6211\u540C\u610F\u4F60\u7684\u770B\u6CD5\u3002", "W\u01D2 t\xF3ngy\xEC n\u01D0 de k\xE0nf\u01CE.", "Aku setuju pendapatmu."], { pos: "verba", emoji: "\u{1F44D}", en: ["agree"] }),
  w("h3_240", 3, "\u5934\u53D1", "t\xF3ufa", ["rambut"], ["\u5979\u7684\u5934\u53D1\u5F88\u957F\u3002", "T\u0101 de t\xF3ufa h\u011Bn ch\xE1ng.", "Rambutnya panjang."], { pos: "nomina", emoji: "\u{1F487}", imageKey: "Hair", en: ["hair"] }),
  w("h3_241", 3, "\u7A81\u7136", "t\u016Br\xE1n", ["tiba-tiba"], ["\u7A81\u7136\u4E0B\u96E8\u4E86\u3002", "T\u016Br\xE1n xi\xE0 y\u01D4 le.", "Tiba-tiba hujan."], { pos: "adjektiva", emoji: "\u26A1", en: ["sudden"] }),
  w("h3_242", 3, "\u56FE\u4E66\u9986", "t\xFAsh\u016Bgu\u01CEn", ["perpustakaan"], ["\u56FE\u4E66\u9986\u5F88\u5B89\u9759\u3002", "T\xFAsh\u016Bgu\u01CEn h\u011Bn \u0101nj\xECng.", "Perpustakaan tenang."], { pos: "nomina", emoji: "\u{1F4DA}", imageKey: "Library", en: ["library"] }),
  w("h3_243", 3, "\u817F", "tu\u01D0", ["kaki (tungkai)"], ["\u8DD1\u6B65\u540E\u817F\u75BC\u3002", "P\u01CEob\xF9 h\xF2u tu\u01D0 t\xE9ng.", "Setelah lari kakinya sakit."], { pos: "nomina", emoji: "\u{1F9B5}", imageKey: "Human leg", en: ["leg"] }),
  w("h3_244", 3, "\u5B8C\u6210", "w\xE1nch\xE9ng", ["menyelesaikan"], ["\u4F5C\u4E1A\u5B8C\u6210\u4E86\u3002", "Zu\xF2y\xE8 w\xE1nch\xE9ng le.", "PR selesai."], { pos: "verba", emoji: "\u2714\uFE0F", en: ["complete"] }),
  w("h3_245", 3, "\u7897", "w\u01CEn", ["mangkuk"], ["\u7897\u91CC\u8FD8\u6709\u996D\u3002", "W\u01CEn l\u01D0 h\xE1i y\u01D2u f\xE0n.", "Masih ada nasi di mangkuk."], { pos: "nomina", emoji: "\u{1F963}", imageKey: "Bowl", en: ["bowl"] }),
  w("h3_246", 3, "\u4E07", "w\xE0n", ["sepuluh ribu"], ["\u8FD9\u4E2A\u5B57\u503C\u4E07\u91D1\u3002", "Zh\xE8ge z\xEC zh\xED w\xE0n j\u012Bn.", "Karakter ini sangat berharga."], { pos: "numeral", emoji: "\u{1F522}", en: ["ten thousand"] }),
  w("h3_247", 3, "\u5FD8\u8BB0", "w\xE0ngj\xEC", ["lupa"], ["\u522B\u5FD8\u4E86\u5E26\u94A5\u5319\u3002", "Bi\xE9 w\xE0ngj\xEC d\xE0i y\xE0oshi.", "Jangan lupa bawa kunci."], { pos: "verba", emoji: "\u{1F926}", en: ["forget"] }),
  w("h3_248", 3, "\u4E3A", "w\xE8i", ["untuk"], ["\u4E3A\u4F60\u9AD8\u5174\u3002", "W\xE8i n\u01D0 g\u0101ox\xECng.", "Senang untukmu."], { pos: "preposisi", en: ["for"] }),
  w("h3_249", 3, "\u4F4D", "w\xE8i", ["(kata bantu orang)"], ["\u4E00\u4F4D\u8001\u5E08", "y\xED w\xE8i l\u01CEosh\u012B", "seorang guru"], { pos: "kata bantu", en: ["polite measure for people"] }),
  w("h3_250", 3, "\u4F4D\u5B50", "w\xE8izi", ["tempat duduk"], ["\u4F4D\u5B50\u90FD\u6EE1\u4E86\u3002", "W\xE8izi d\u014Du m\u01CEn le.", "Tempat duduk penuh."], { pos: "nomina", emoji: "\u{1F4BA}", en: ["seat"] }),
  w("h3_251", 3, "\u6587\u5316", "w\xE9nhu\xE0", ["budaya"], ["\u4E2D\u56FD\u6587\u5316\u5386\u53F2\u60A0\u4E45\u3002", "Zh\u014Dnggu\xF3 w\xE9nhu\xE0 l\xECsh\u01D0 y\u014Duji\u01D4.", "Budaya Tiongkok bersejarah panjang."], { pos: "nomina", emoji: "\u{1F3AD}", imageKey: "Culture", en: ["culture"] }),
  w("h3_252", 3, "\u897F", "x\u012B", ["barat"], ["\u592A\u9633\u4ECE\u897F\u8FB9\u843D\u4E0B\u3002", "T\xE0iy\xE1ng c\xF3ng x\u012Bbi\u0101n lu\xF2xi\xE0.", "Matahari terbenam di barat."], { pos: "nomina", emoji: "\u{1F9ED}", en: ["west"] }),
  w("h3_253", 3, "\u6D17", "x\u01D0", ["mencuci"], ["\u6D17\u6FA1\u548C\u6D17\u8863\u670D\u3002", "X\u01D0z\u01CEo h\xE9 x\u01D0 y\u012Bfu.", "Mandi dan cuci baju."], { pos: "verba", emoji: "\u{1F9FC}", en: ["wash"] }),
  w("h3_254", 3, "\u6D17\u624B\u95F4", "x\u01D0sh\u01D2uji\u0101n", ["kamar mandi/toilet"], ["\u6D17\u624B\u95F4\u5728\u5DE6\u8FB9\u3002", "X\u01D0sh\u01D2uji\u0101n z\xE0i zu\u01D2bi\u0101n.", "Toiletnya di kiri."], { pos: "nomina", emoji: "\u{1F6BB}", en: ["restroom"] }),
  w("h3_255", 3, "\u6D17\u7167\u7247", "x\u01D0 zh\xE0opi\xE0n", ["mencetak foto"], ["\u53BB\u5E97\u91CC\u6D17\u7167\u7247\u3002", "Q\xF9 di\xE0n l\u01D0 x\u01D0 zh\xE0opi\xE0n.", "Cetak foto di toko."], { pos: "verba", emoji: "\u{1F5BC}\uFE0F", en: ["develop photos"] }),
  w("h3_256", 3, "\u4E60\u60EF", "x\xEDgu\xE0n", ["kebiasaan"], ["\u597D\u4E60\u60EF\u5F88\u91CD\u8981\u3002", "H\u01CEo x\xEDgu\xE0n h\u011Bn zh\xF2ngy\xE0o.", "Kebiasaan baik penting."], { pos: "nomina", emoji: "\u{1F501}", en: ["habit"] }),
  w("h3_257", 3, "\u590F\u5929", "xi\xE0ti\u0101n", ["musim panas"], ["\u590F\u5929\u6211\u5B66\u6E38\u6CF3\u3002", "Xi\xE0ti\u0101n w\u01D2 xu\xE9 y\xF3uy\u01D2ng.", "Musim panas aku belajar renang."], { pos: "nomina waktu", emoji: "\u{1F31E}", en: ["summer"] }),
  w("h3_258", 3, "\u5148\u751F", "xi\u0101nsheng", ["Tuan"], ["\u8FD9\u4F4D\u662F\u674E\u5148\u751F\u3002", "Zh\xE8 w\xE8i sh\xEC L\u01D0 xi\u0101nsheng.", "Ini Tuan Li."], { pos: "nomina", emoji: "\u{1F935}", en: ["Mr.", "sir"] }),
  w("h3_259", 3, "\u76F8\u4FE1", "xi\u0101ngx\xECn", ["percaya"], ["\u6211\u76F8\u4FE1\u4F60\u3002", "W\u01D2 xi\u0101ngx\xECn n\u01D0.", "Aku percaya kamu."], { pos: "verba", emoji: "\u{1F91D}", en: ["believe", "trust"] }),
  w("h3_260", 3, "\u9999\u8549", "xi\u0101ngji\u0101o", ["pisang"], ["\u4E70\u4E24\u6839\u9999\u8549\u3002", "M\u01CEi li\u01CEng g\u0113n xi\u0101ngji\u0101o.", "Beli dua tangkai pisang."], { pos: "nomina", emoji: "\u{1F34C}", en: ["banana"] }),
  w("h3_261", 3, "\u9999\u6C34", "xi\u0101ngshu\u01D0", ["parfum"], ["\u8FD9\u74F6\u9999\u6C34\u5F88\u597D\u95FB\u3002", "Zh\xE8 p\xEDng xi\u0101ngshu\u01D0 h\u011Bn h\u01CEo w\xE9n.", "Parfum ini wanginya enak."], { pos: "nomina", emoji: "\u{1F33A}", imageKey: "Perfume", en: ["perfume"] }),
  w("h3_262", 3, "\u76F8\u540C", "xi\u0101ngt\xF3ng", ["sama"], ["\u6211\u4EEC\u60F3\u6CD5\u76F8\u540C\u3002", "W\u01D2men xi\u01CEngf\u01CE xi\u0101ngt\xF3ng.", "Pikiran kami sama."], { pos: "adjektiva", en: ["identical"] }),
  w("h3_263", 3, "\u7BB1", "xi\u0101ng", ["peti", "kotak"], ["\u4E00\u7BB1\u82F9\u679C", "y\xEC xi\u0101ng p\xEDnggu\u01D2", "satu peti apel"], { pos: "kata bantu", en: ["box, suitcase"] }),
  w("h3_264", 3, "\u8B66\u5BDF", "j\u01D0ngch\xE1", ["polisi"], ["\u8B66\u5BDF\u5E2E\u52A9\u8FF7\u8DEF\u7684\u5B69\u5B50\u3002", "J\u01D0ngch\xE1 b\u0101ngzh\xF9 m\xEDl\xF9 de h\xE1izi.", "Polisi bantu anak yang tersesat."], { pos: "nomina", emoji: "\u{1F46E}", imageKey: "Police", en: ["police"] }),
  w("h3_265", 3, "\u5411\u524D", "xi\xE0ng qi\xE1n", ["ke depan"], ["\u5411\u524D\u770B\u3002", "Xi\xE0ng qi\xE1n k\xE0n.", "Lihat ke depan."], { pos: "arah", emoji: "\u23E9", en: ["forward"] }),
  w("h3_266", 3, "\u50CF", "xi\xE0ng", ["seperti"], ["\u4ED6\u50CF\u4ED6\u7238\u7238\u3002", "T\u0101 xi\xE0ng t\u0101 b\xE0ba.", "Dia mirip ayahnya."], { pos: "verba/preposisi", emoji: "\u{1FA9E}", en: ["resemble", "like"] }),
  w("h3_267", 3, "\u5C0F\u5FC3", "xi\u01CEox\u012Bn", ["hati-hati"], ["\u8DEF\u4E0A\u5C0F\u5FC3\u3002", "L\xF9 sh\xE0ng xi\u01CEox\u012Bn.", "Hati-hati di jalan."], { pos: "adjektiva/verba", emoji: "\u26A0\uFE0F", en: ["careful"] }),
  w("h3_268", 3, "\u6821\u957F", "xi\xE0ozh\u01CEng", ["kepala sekolah"], ["\u6821\u957F\u5F88\u548C\u853C\u3002", "Xi\xE0ozh\u01CEng h\u011Bn h\xE9\u2019\u01CEi.", "Kepala sekolahnya ramah."], { pos: "nomina", emoji: "\u{1F454}", imageKey: "Head teacher", en: ["principal"] }),
  w("h3_269", 3, "\u978B", "xi\xE9", ["sepatu"], ["\u4E70\u53CC\u65B0\u978B\u3002", "M\u01CEi shu\u0101ng x\u012Bn xi\xE9.", "Beli sepatu baru."], { pos: "nomina", emoji: "\u{1F45F}", en: ["shoe"] }),
  w("h3_270", 3, "\u5FC3", "x\u012Bn", ["hati"], ["\u4ED6\u5FC3\u5730\u5584\u826F\u3002", "T\u0101 x\u012Bn d\xEC sh\xE0nli\xE1ng.", "Hatinya baik."], { pos: "nomina", emoji: "\u2764\uFE0F", imageKey: "Heart", en: ["heart", "mind"] }),
  w("h3_271", 3, "\u65B0", "x\u012Bn", ["baru"], ["\u65B0\u4E66\u5F88\u597D\u95FB\u3002", "X\u012Bn sh\u016B h\u011Bn h\u01CEo w\xE9n.", "Buku baru aromanya enak."], { pos: "adjektiva", emoji: "\u{1F195}", en: ["new"] }),
  w("h3_272", 3, "\u65B0\u95FB", "x\u012Bnw\xE9n", ["berita"], ["\u6211\u6BCF\u5929\u770B\u65B0\u95FB\u3002", "W\u01D2 m\u011Biti\u0101n k\xE0n x\u012Bnw\xE9n.", "Aku menonton berita tiap hari."], { pos: "nomina", emoji: "\u{1F4FA}", imageKey: "News", en: ["news"] }),
  w("h3_273", 3, "\u59D3", "x\xECng", ["marga"], ["\u4F60\u59D3\u4EC0\u4E48\uFF1F", "N\u01D0 x\xECng sh\xE9nme?", "Marga kamu apa?"], { pos: "verba/nomina", en: ["surname"] }),
  w("h3_274", 3, "\u5468\u672B", "zh\u014Dum\xF2", ["akhir pekan"], ["\u5468\u672B\u53BB\u54EA\u91CC\u73A9\uFF1F", "Zh\u014Dum\xF2 q\xF9 n\u01CEl\u01D0 w\xE1n?", "Akhir pekan mau ke mana?"], { pos: "nomina waktu", emoji: "\u{1F389}", en: ["weekend"] }),
  w("h3_275", 3, "\u5E78\u8FD0", "x\xECngy\xF9n", ["beruntung"], ["\u4F60\u771F\u5E78\u8FD0\u3002", "N\u01D0 zh\u0113n x\xECngy\xF9n.", "Kamu beruntung sekali."], { pos: "adjektiva", emoji: "\u{1F340}", imageKey: "Luck", en: ["lucky", "fortune"] }),
  w("h3_276", 3, "\u5174\u8DA3", "x\xECngq\xF9", ["minat", "minat"], ["\u4ED6\u5BF9\u97F3\u4E50\u6709\u5174\u8DA3\u3002", "T\u0101 du\xEC y\u012Bnyu\xE8 y\u01D2u x\xECngq\xF9.", "Dia berminat musik."], { pos: "nomina", emoji: "\u{1F3AF}", imageKey: "Interest", en: ["interest"] }),
  w("h3_277", 3, "\u9009\u62E9", "xu\u01CEnz\xE9", ["memilih", "pilihan"], ["\u8FD9\u662F\u6211\u7684\u9009\u62E9\u3002", "Zh\xE8 sh\xEC w\u01D2 de xu\u01CEnz\xE9.", "Ini pilihanku."], { pos: "verba/nomina", emoji: "\u{1F500}", en: ["choose", "choice"] }),
  w("h3_278", 3, "\u96EA\u82B1", "xu\u011Bhu\u0101", ["kepingan salju"], ["\u96EA\u82B1\u5F88\u6F02\u4EAE\u3002", "Xu\u011Bhu\u0101 h\u011Bn pi\xE0oliang.", "Kepingan salju indah."], { pos: "nomina", emoji: "\u2744\uFE0F", imageKey: "Snow", en: ["snowflake"] }),
  w("h3_279", 3, "\u7259", "y\xE1", ["gigi"], ["\u7259\u75BC\u8981\u53BB\u770B\u533B\u751F\u3002", "Y\xE1 t\xE9ng y\xE0o q\xF9 k\xE0n y\u012Bsh\u0113ng.", "Sakit gigi harus ke dokter."], { pos: "nomina", emoji: "\u{1F9B7}", imageKey: "Tooth", en: ["tooth"] }),
  w("h3_280", 3, "\u989C\u8272", "y\xE1ns\xE8", ["warna"], ["\u7EA2\u8272\u662F\u6211\u559C\u6B22\u7684\u989C\u8272\u3002", "H\xF3ngs\xE8 sh\xEC w\u01D2 x\u01D0huan de y\xE1ns\xE8.", "Merah warna favoritku."], { pos: "nomina", emoji: "\u{1F3A8}", en: ["color"] }),
  w("h3_281", 3, "\u773C\u775B", "y\u01CEnjing", ["mata"], ["\u773C\u775B\u7D2F\u4E86\u5C31\u4F11\u606F\u3002", "Y\u01CEnjing l\xE8i le ji\xF9 xi\u016Bxi.", "Mata lelah ya istirahat."], { pos: "nomina", emoji: "\u{1F440}", en: ["eye"] }),
  w("h3_282", 3, "\u8981\u6C42", "y\u0101oqi\xFA", ["menuntut"], ["\u4ED6\u7684\u8981\u6C42\u4E0D\u9AD8\u3002", "T\u0101 de y\u0101oqi\xFA b\xF9 g\u0101o.", "Tuntutannya tidak tinggi."], { pos: "verba/nomina", en: ["demand"] }),
  w("h3_283", 3, "\u7237\u7237", "y\xE9ye", ["kakek"], ["\u7237\u7237\u8BB2\u6545\u4E8B\u3002", "Y\xE9ye ji\u01CEng g\xF9shi.", "Kakek bercerita."], { pos: "nomina", emoji: "\u{1F474}", en: ["grandpa"] }),
  w("h3_284", 3, "\u4E5F\u662F", "y\u011B sh\xEC", ["juga adalah"], ["\u6211\u4E5F\u662F\u5B66\u751F\u3002", "W\u01D2 y\u011B sh\xEC xu\xE9sheng.", "Aku juga pelajar."], { pos: "frasa", en: ["also is"] }),
  w("h3_285", 3, "\u4E00\u5B9A", "y\xEDd\xECng", ["pasti"], ["\u660E\u5929\u4E00\u5B9A\u6765\u3002", "M\xEDngti\u0101n y\xEDd\xECng l\xE1i.", "Besok pasti datang."], { pos: "adverbia", en: ["certainly"] }),
  w("h3_286", 3, "\u4E00\u8FB9", "y\xECbi\u0101n", ["sementara (dua kegiatan)"], ["\u4E00\u8FB9\u542C\u4E00\u8FB9\u5199\u3002", "Y\xECbi\u0101n t\u012Bng y\xECbi\u0101n xi\u011B.", "Dengar sambil menulis."], { pos: "adverbia", en: ["while doing"] }),
  w("h3_287", 3, "\u4E00\u822C", "y\xECb\u0101n", ["umumnya", "biasa"], ["\u4E00\u822C\u4EBA\u90FD\u4F1A\u540C\u610F\u3002", "Y\xECb\u0101n r\xE9n d\u014Du hu\xEC t\xF3ngy\xEC.", "Umumnya orang setuju."], { pos: "adjektiva", en: ["general", "ordinary"] }),
  w("h3_288", 3, "\u4E00\u8FB9\u513F", "y\xECbi\u0101nr", ["satu sisi"], ["\u7AD9\u5728\u4E00\u8FB9\u513F\u7B49\u3002", "Zh\xE0n z\xE0i y\xECbi\u0101nr d\u011Bng.", "Berdiri di sisi menunggu."], { pos: "nomina", en: ["one side"] }),
  w("h3_289", 3, "\u4E00\u8FB9\u4E00\u8FB9", "y\xECbi\u0101n y\xECbi\u0101n", ["sambil"], ["\u4ED6\u4E00\u8FB9\u5531\u6B4C\u4E00\u8FB9\u5F39\u7434\u3002", "T\u0101 y\xECbi\u0101n ch\xE0ngg\u0113 y\xECbi\u0101n t\xE1n q\xEDn.", "Dia bernyanyi sambil main piano."], { pos: "pola", en: ["while"] }),
  w("h3_290", 3, "\u8863\u670D", "y\u012Bfu", ["pakaian"], ["\u590F\u5929\u7A7F\u8584\u8863\u670D\u3002", "Xi\xE0ti\u0101n chu\u0101n b\xE1o y\u012Bfu.", "Musim panas pakai baju tipis."], { pos: "nomina", emoji: "\u{1F455}", en: ["clothes"] }),
  w("h3_291", 3, "\u4E00\u4F1A\u513F", "y\xEDhu\xECr", ["sebentar"], ["\u7B49\u4E00\u4F1A\u513F\u4ED6\u5C31\u6765\u3002", "D\u011Bng y\xEDhu\xECr t\u0101 ji\xF9 l\xE1i.", "Tunggu sebentar dia datang."], { pos: "nomina waktu", en: ["a while"] }),
  w("h3_292", 3, "\u4E00\u6837", "y\xEDy\xE0ng", ["sama"], ["\u6211\u4EEC\u4E00\u6837\u5927\u3002", "W\u01D2men y\xEDy\xE0ng d\xE0.", "Umur kami sama."], { pos: "adjektiva", en: ["same"] }),
  w("h3_293", 3, "\u4E00\u76F4", "y\xECzh\xED", ["terus"], ["\u4ED6\u4E00\u76F4\u5728\u7B49\u3002", "T\u0101 y\xECzh\xED z\xE0i d\u011Bng.", "Dia terus menunggu."], { pos: "adverbia", en: ["always"] }),
  w("h3_294", 3, "\u4EE5\u540E", "y\u01D0h\xF2u", ["setelah ini"], ["\u4EE5\u540E\u5E38\u8054\u7CFB\u3002", "Y\u01D0h\xF2u ch\xE1ng li\xE1nx\xEC.", "Ke depan sering hubungi."], { pos: "nomina waktu", en: ["after", "later"] }),
  w("h3_295", 3, "\u4EE5\u524D", "y\u01D0qi\xE1n", ["dulu"], ["\u4EE5\u524D\u8FD9\u91CC\u5F88\u5B89\u9759\u3002", "Y\u01D0qi\xE1n zh\xE8l\u01D0 h\u011Bn \u0101nj\xECng.", "Dulu sini sepi."], { pos: "nomina waktu", en: ["before", "ago"] }),
  w("h3_296", 3, "\u97F3\u4E50", "y\u012Bnyu\xE8", ["musik"], ["\u97F3\u4E50\u4F1A\u5F88\u597D\u542C\u3002", "Y\u012Bnyu\xE8 hu\xEC h\u011Bn h\u01CEot\u012Bng.", "Konsernya bagus."], { pos: "nomina", emoji: "\u{1F3BC}", en: ["music"] }),
  w("h3_297", 3, "\u94F6", "y\xEDn", ["perak"], ["\u94F6\u624B\u956F\u5F88\u6F02\u4EAE\u3002", "Y\xEDn sh\u01D2uzhu\xF3 h\u011Bn pi\xE0oliang.", "Gelang perak cantik."], { pos: "nomina", emoji: "\u{1F948}", imageKey: "Silver", en: ["silver"] }),
  w("h3_298", 3, "\u5E94\u8BE5", "y\u012Bngg\u0101i", ["seharusnya"], ["\u4F60\u5E94\u8BE5\u65E9\u70B9\u4F11\u606F\u3002", "N\u01D0 y\u012Bngg\u0101i z\u01CEodi\u01CEn xi\u016Bxi.", "Kamu sebaiknya istirahat lebih awal."], { pos: "verba modal", en: ["should"] }),
  w("h3_299", 3, "\u5F71\u54CD", "y\u01D0ngxi\u01CEng", ["mempengaruhi", "dampak"], ["\u5929\u6C14\u5F71\u54CD\u5FC3\u60C5\u3002", "Ti\u0101nq\xEC y\u01D0ngxi\u01CEng x\u012Bnq\xEDng.", "Cuaca mempengaruhi suasana hati."], { pos: "verba/nomina", emoji: "\u{1F310}", en: ["influence", "effect"] }),
  w("h3_300", 3, "\u7528", "y\xF2ng", ["memakai"], ["\u7528\u624B\u673A\u770B\u65B0\u95FB\u3002", "Y\xF2ng sh\u01D2uj\u012B k\xE0n x\u012Bnw\xE9n.", "Lihat berita pakai HP."], { pos: "verba", emoji: "\u{1F6E0}\uFE0F", en: ["use"] })
];

// src/services/chinese/dataset/toneFillers.ts
var FILLERS = [
  // ── a ──
  ["f_a1", "\u554A", "\u0101", "ah (seru)", "\u{1F62E}"],
  // ── ai ──
  ["f_ai1", "\u54C0", "\u0101i", "sedih / pedih", "\u{1F614}"],
  ["f_ai2", "\u6328", "\xE1i", "menanggung / dekat", "\u{1F9F1}"],
  ["f_ai3", "\u77EE", "\u01CEi", "pendek (badan)", "\u{1F4CF}"],
  // ── an ──
  ["f_an1", "\u5B89", "\u0101n", "tenang / aman", "\u{1F54A}\uFE0F"],
  // ── ba ──
  ["f_ba1", "\u516B", "b\u0101", "delapan", "8\uFE0F\u20E3"],
  ["f_ba2", "\u62D4", "b\xE1", "menarik keluar", "\u{1FA9D}"],
  ["f_ba3", "\u628A", "b\u01CE", "(kata bantu objek)", "\u{1F932}"],
  // ── bai ──
  ["f_bai1", "\u63B0", "b\u0101i", "mematahkan dengan tangan", "\u{1F93E}"],
  ["f_bai2", "\u767D", "b\xE1i", "putih", "\u26AA"],
  ["f_bai3", "\u6446", "b\u01CEi", "menata / mengibas", "\u{1FA91}"],
  ["f_bai4", "\u8D25", "b\xE0i", "kalah", "\u{1F3F3}\uFE0F"],
  // ── ban ──
  ["f_ban1", "\u822C", "b\u0101n", "seperti / macam", "\u{1F501}"],
  ["f_ban3", "\u677F", "b\u01CEn", "papan", "\u{1FAB5}"],
  ["f_ban4", "\u529E", "b\xE0n", "mengurus", "\u{1F4CB}"],
  // ── bang ──
  ["f_bang1", "\u5E2E", "b\u0101ng", "menolong", "\u{1F91D}"],
  ["f_bang3", "\u699C", "b\u01CEng", "papan peringkat", "\u{1F4CB}"],
  ["f_bang4", "\u68D2", "b\xE0ng", "hebat / tongkat", "\u{1F3CF}"],
  // ── bao ──
  ["f_bao1", "\u5305", "b\u0101o", "tas / membungkus", "\u{1F392}"],
  ["f_bao2", "\u8584", "b\xE1o", "tipis", "\u{1FAB6}"],
  ["f_bao3", "\u9971", "b\u01CEo", "kenyang", "\u{1F60B}"],
  ["f_bao4", "\u62B1", "b\xE0o", "memeluk", "\u{1FAC2}"],
  // ── bei ──
  ["f_bei1", "\u80CC (punggung: b\u0113i)", "b\u0113i", "memikul (di punggung)", "\u{1F392}"],
  ["f_bei3", "\u5317", "b\u011Bi", "utara", "\u{1F9ED}"],
  ["f_bei4", "\u88AB", "b\xE8i", "(partikel pasif)", "\u{1F6CF}\uFE0F"],
  // ── ben ──
  ["f_ben1", "\u5954", "b\u0113n", "berlari kencang", "\u{1F3C3}"],
  ["f_ben3", "\u672C", "b\u011Bn", "buku (kata bantu)", "\u{1F4D5}"],
  ["f_ben4", "\u7B28", "b\xE8n", "bodoh / kaku", "\u{1FAA8}"],
  // ── bi ──
  ["f_bi1", "\u903C", "b\u012B", "memaksa", "\u{1F624}"],
  ["f_bi2", "\u9F3B", "b\xED", "hidung", "\u{1F443}"],
  ["f_bi3", "\u7B14", "b\u01D0", "pena", "\u{1F58A}\uFE0F"],
  ["f_bi4", "\u5FC5", "b\xEC", "pasti / wajib", "\u2757"],
  // ── bian ──
  ["f_bian1", "\u7F16", "bi\u0101n", "menganyam / menyusun", "\u{1F9F6}"],
  ["f_bian3", "\u6241", "bi\u01CEn", "pipih", "\u{1F95E}"],
  ["f_bian4", "\u53D8", "bi\xE0n", "berubah", "\u{1F504}"],
  // ── biao ──
  ["f_biao1", "\u6807", "bi\u0101o", "tanda / label", "\u{1F3F7}\uFE0F"],
  ["f_biao3", "\u8868", "bi\u01CEo", "jam tangan / tabel", "\u231A"],
  // ── bie ──
  ["f_bie2", "\u522B", "bi\xE9", "jangan / lain", "\u270B"],
  // ── bin ──
  ["f_bin1", "\u5BBE", "b\u012Bn", "tamu", "\u{1F935}"],
  // ── bing ──
  ["f_bing1", "\u51B0", "b\u012Bng", "es", "\u{1F9CA}"],
  ["f_bing3", "\u997C", "b\u01D0ng", "kue pipih", "\u{1FAD3}"],
  // ── bo ──
  ["f_bo1", "\u62E8", "b\u014D", "memutar (dial)", "\u{1F4DE}"],
  ["f_bo2", "\u4F2F", "b\xF3", "paman (saudara ayah)", "\u{1F474}"],
  // ── bu ──
  ["f_bu3", "\u8865", "b\u01D4", "menambal / menyuplai", "\u{1FA79}"],
  ["f_bu4", "\u4E0D", "b\xF9", "tidak", "\u{1F6AB}"],
  // ── cai ──
  ["f_cai1", "\u731C", "c\u0101i", "menebak", "\u2753"],
  ["f_cai3", "\u8E29", "c\u01CEi", "menginjak", "\u{1F9B6}"],
  ["f_cai4", "\u83DC", "c\xE0i", "masakan / sayur", "\u{1F96C}"],
  // ── can ──
  ["f_can1", "\u53C2", "c\u0101n", "ikut serta", "\u{1F91D}"],
  ["f_can3", "\u60E8", "c\u01CEn", "mengerikan / tragis", "\u{1F62D}"],
  // ── cao ──
  ["f_cao2", "\u69FD", "c\xE1o", "palung / gerobak", "\u{1FAA3}"],
  ["f_cao3", "\u8349", "c\u01CEo", "rumput", "\u{1F33F}"],
  // ── ce ──
  ["f_ce4", "\u6D4B", "c\xE8", "mengukur", "\u{1F4CF}"],
  // ── cha ──
  ["f_cha1", "\u53C9", "ch\u0101", "garpu / menyematkan", "\u{1F374}"],
  ["f_cha2", "\u8336", "ch\xE1", "teh", "\u{1F375}"],
  ["f_cha3", "\u643D", "ch\xE1", "mengoles", "\u{1F9F4}"],
  ["f_cha4", "\u5DEE (kurang: ch\xE0)", "ch\xE0", "kurang / buruk", "\u{1F4C9}"],
  // ── chai ──
  ["f_chai1", "\u62C6", "ch\u0101i", "membongkar", "\u{1F527}"],
  // ── chan ──
  ["f_chan2", "\u7F20", "ch\xE1n", "melilit", "\u{1FAA2}"],
  ["f_chan3", "\u4EA7", "ch\u01CEn", "menghasilkan", "\u{1F3ED}"],
  // ── chang ──
  ["f_chang1", "\u957F (memanjang)", "ch\u0101ng", "sering (ch\xE1ng) / panjang", "\u{1F4CF}"],
  ["f_chang2", "\u5E38", "ch\xE1ng", "sering", "\u{1F501}"],
  ["f_chang3", "\u573A", "ch\u01CEng", "lapangan / tempat", "\u{1F3DF}\uFE0F"],
  // ── chao ──
  ["f_chao1", "\u6284", "ch\u0101o", "menyalin", "\u{1F4CB}"],
  ["f_chao2", "\u671D (menuju: ch\xE1o)", "ch\xE1o", "dinasti / menghadap", "\u{1F3DB}\uFE0F"],
  ["f_chao3", "\u5435", "ch\u01CEo", "ribut / berisik", "\u{1F4E2}"],
  // ── che ──
  ["f_che1", "\u8F66", "ch\u0113", "kendaraan", "\u{1F697}"],
  ["f_che4", "\u5F7B", "ch\xE8", "menyeluruh", "\u{1F48E}"],
  // ── chen ──
  ["f_chen1", "\u62BB", "ch\u0113n", "meregangkan", "\u{1F938}"],
  ["f_chen2", "\u6C89", "ch\xE9n", "tenggelam / berat", "\u2693"],
  // ── cheng ──
  ["f_cheng1", "\u79F0 (menimbang: ch\u0113ng)", "ch\u0113ng", "menimbang", "\u2696\uFE0F"],
  ["f_cheng2", "\u6210", "ch\xE9ng", "menjadi / sukses", "\u2705"],
  ["f_cheng3", "\u901E", "ch\u011Bng", "menunjuk-nunjuk", "\u{1F624}"],
  // ── chi ──
  ["f_chi1", "\u5403", "ch\u012B", "makan", "\u{1F35A}"],
  ["f_chi2", "\u6C60", "ch\xED", "kolam", "\u{1F3CA}"],
  ["f_chi3", "\u5C3A", "ch\u01D0", "penggaris", "\u{1F4CF}"],
  ["f_chi4", "\u7FC5", "ch\xEC", "sayap", "\u{1F98B}"],
  // ── chong ──
  ["f_chong1", "\u51B2", "ch\u014Dng", "menerjang / menyiram", "\u{1F30A}"],
  ["f_chong2", "\u866B", "ch\xF3ng", "serangga", "\u{1F41B}"],
  // ── chou ──
  ["f_chou1", "\u62BD", "ch\u014Du", "menarik keluar", "\u{1F6AC}"],
  ["f_chou2", "\u6101", "ch\xF3u", "cemas", "\u{1F61F}"],
  ["f_chou3", "\u4E11", "ch\u01D2u", "jelek", "\u{1F479}"],
  // ── chu ──
  ["f_chu1", "\u51FA", "ch\u016B", "keluar", "\u{1F4E4}"],
  ["f_chu2", "\u9504", "ch\xFA", "cangkul", "\u26CF\uFE0F"],
  ["f_chu3", "\u695A", "ch\u01D4", "jelas / rapi", "\u{1F48E}"],
  // ── chuan ──
  ["f_chuan1", "\u7A7F", "chu\u0101n", "memakai (pakaian)", "\u{1F455}"],
  ["f_chuan2", "\u8239", "chu\xE1n", "kapal", "\u{1F6A2}"],
  // ── chuang ──
  ["f_chuang1", "\u7A97", "chu\u0101ng", "jendela", "\u{1FA9F}"],
  ["f_chuang4", "\u521B", "chu\xE0ng", "menciptakan", "\u{1F4A1}"],
  // ── chui ──
  ["f_chui1", "\u5439", "chu\u012B", "meniup", "\u{1F32C}\uFE0F"],
  ["f_chui2", "\u9524", "chu\xED", "palu", "\u{1F528}"],
  // ── chun ──
  ["f_chun1", "\u6625", "ch\u016Bn", "musim semi", "\u{1F338}"],
  ["f_chun2", "\u5507", "ch\xFAn", "bibir", "\u{1F444}"],
  // ── ci ──
  ["f_ci1", "\u8BCD", "c\xED", "kata", "\u{1F524}"],
  ["f_ci2", "\u74F7", "c\xED", "porselen", "\u{1F3FA}"],
  // ── cong ──
  ["f_cong1", "\u806A", "c\u014Dng", "pintar / telinga tajam", "\u{1F9E0}"],
  ["f_cong2", "\u4ECE", "c\xF3ng", "dari", "\u27A1\uFE0F"],
  // ── cou ──
  ["f_cou4", "\u51D1", "c\xF2u", "mengumpulkan", "\u{1F9E9}"],
  // ── cu ──
  ["f_cu1", "\u7C97", "c\u016B", "tebal / kasar", "\u{1FAB5}"],
  // ── cui ──
  ["f_cui4", "\u8106", "cu\xEC", "renyah", "\u{1F36A}"],
  // ── cun ──
  ["f_cun1", "\u6751", "c\u016Bn", "desa", "\u{1F3D8}\uFE0F"],
  // ── cuo ──
  ["f_cuo1", "\u6413", "cu\u014D", "menggosok", "\u{1F932}"],
  ["f_cuo4", "\u9519", "cu\xF2", "salah", "\u274C"],
  // ── da ──
  ["f_da1", "\u642D", "d\u0101", "menumpang / memasang", "\u{1F695}"],
  ["f_da2", "\u8FBE", "d\xE1", "mencapai", "\u{1F3AF}"],
  ["f_da3", "\u6253", "d\u01CE", "memukul / memainkan", "\u{1F94A}"],
  ["f_da4", "\u5927", "d\xE0", "besar", "\u{1F418}"],
  // ── dai ──
  ["f_dai1", "\u5446", "d\u0101i", "terdiam / kaku", "\u{1F636}"],
  ["f_dai3", "\u6B79", "d\u01CEi", "jahat", "\u{1F608}"],
  ["f_dai4", "\u5E26", "d\xE0i", "membawa", "\u{1F392}"],
  // ── dan ──
  ["f_dan1", "\u5355", "d\u0101n", "tunggal", "1\uFE0F\u20E3"],
  ["f_dan4", "\u86CB", "d\xE0n", "telur", "\u{1F95A}"],
  // ── dang ──
  ["f_dang1", "\u5F53", "d\u0101ng", "menjadi / saat", "\u{1F550}"],
  ["f_dang3", "\u515A", "d\u01CEng", "partai", "\u{1F6A9}"],
  // ── dao ──
  ["f_dao1", "\u5200", "d\u0101o", "pisau", "\u{1F52A}"],
  ["f_dao2", "\u53E8", "d\u0101o", "mengoceh", "\u{1F4AC}"],
  ["f_dao3", "\u5C9B", "d\u01CEo", "pulau", "\u{1F3DD}\uFE0F"],
  ["f_dao4", "\u5230", "d\xE0o", "sampai", "\u{1F3C1}"],
  // ── de ──
  ["f_de2", "\u5F97 (memperoleh)", "d\xE9", "memperoleh", "\u{1F3C5}"],
  ["f_de5", "\u7684", "de", "(partikel milik)", "\u{1F517}"],
  // ── deng ──
  ["f_deng1", "\u767B", "d\u0113ng", "naik / mencatat", "\u{1FA9C}"],
  ["f_deng3", "\u7B49", "d\u011Bng", "menunggu", "\u23F3"],
  ["f_deng4", "\u77AA", "d\xE8ng", "melotot", "\u{1F440}"],
  // ── di ──
  ["f_di1", "\u4F4E", "d\u012B", "rendah", "\u2B07\uFE0F"],
  ["f_di2", "\u654C", "d\xED", "musuh", "\u2694\uFE0F"],
  ["f_di3", "\u5E95", "d\u01D0", "dasar", "\u{1F9F1}"],
  ["f_di4", "\u5730", "d\xEC", "tanah / bumi", "\u{1F30D}"],
  // ── dian ──
  ["f_dian1", "\u98A0", "di\u0101n", "terbalik / berguncang", "\u{1F300}"],
  ["f_dian3", "\u70B9", "di\u01CEn", "titik / pukul", "\u{1F550}"],
  // ── diao ──
  ["f_diao1", "\u96D5", "di\u0101o", "mengukir", "\u{1F5FF}"],
  ["f_diao4", "\u6389", "di\xE0o", "jatuh", "\u{1FA82}"],
  // ── ding ──
  ["f_ding1", "\u9489 (kata benda: d\u012Bng)", "d\u012Bng", "paku", "\u{1F4CC}"],
  ["f_ding3", "\u9876", "d\u01D0ng", "puncak", "\u{1F3D4}\uFE0F"],
  ["f_ding4", "\u8BA2", "d\xECng", "memesan / membooking", "\u{1F4C5}"],
  // ── diu ──
  ["f_diu1", "\u4E22", "di\u016B", "kehilangan", "\u{1FAE5}"],
  // ── dong ──
  ["f_dong1", "\u4E1C", "d\u014Dng", "timur", "\u{1F9ED}"],
  ["f_dong3", "\u61C2", "d\u01D2ng", "mengerti", "\u{1F4A1}"],
  ["f_dong4", "\u51BB", "d\xF2ng", "membeku", "\u{1F976}"],
  // ── dou ──
  ["f_dou1", "\u90FD (ibu kota: d\u016B)", "d\u016B", "ibu kota", "\u{1F3DB}\uFE0F"],
  ["f_dou3", "\u6296", "d\u01D2u", "gemetar", "\u{1FAE8}"],
  ["f_dou4", "\u8C46", "d\xF2u", "kacang", "\u{1FAD8}"],
  // ── du ──
  ["f_du1", "\u7763", "d\u016B", "mengawasi", "\u{1F441}\uFE0F"],
  ["f_du2", "\u6BD2", "d\xFA", "racun", "\u2620\uFE0F"],
  ["f_du3", "\u8D4C", "d\u01D4", "berjudi", "\u{1F3B2}"],
  ["f_du4", "\u5EA6", "d\xF9", "derajat / tingkat", "\u{1F321}\uFE0F"],
  // ── duan ──
  ["f_duan1", "\u7AEF", "du\u0101n", "ujung / tegak", "\u{1F4D0}"],
  ["f_duan3", "\u77ED", "du\u01CEn", "pendek", "\u{1F4CF}"],
  ["f_duan4", "\u65AD", "du\xE0n", "putus", "\u2702\uFE0F"],
  // ── dui ──
  ["f_dui1", "\u5806", "du\u012B", "tumpukan", "\u{1F4DA}"],
  ["f_dui4", "\u5BF9", "du\xEC", "benar", "\u2714\uFE0F"],
  // ── dun ──
  ["f_dun1", "\u5428", "d\u016Bn", "ton", "\u2696\uFE0F"],
  ["f_dun4", "\u987F", "d\xF9n", "kali (makan)", "\u{1F37D}\uFE0F"],
  // ── duo ──
  ["f_duo1", "\u591A", "du\u014D", "banyak", "\u2795"],
  ["f_duo2", "\u593A", "du\xF3", "merebut", "\u{1F947}"],
  ["f_duo3", "\u8EB2", "du\u01D2", "bersembunyi", "\u{1F648}"],
  // ── e ──
  ["f_e1", "\u6076 (jahat: \xE8)", "\xE8", "jahat", "\u{1F608}"],
  ["f_e2", "\u989D", "\xE9", "dahi / jumlah", "\u{1F642}"],
  ["f_e4", "\u997F", "\xE8", "lapar", "\u{1F37D}\uFE0F"],
  // ── en ──
  ["f_en1", "\u6069", "\u0113n", "budi", "\u{1F64F}"],
  // ── er ──
  ["f_er1", "\u800C", "\xE9r", "dan / namun", "\u{1F517}"],
  ["f_er2", "\u513F", "\xE9r", "anak", "\u{1F476}"],
  ["f_er3", "\u8033", "\u011Br", "telinga", "\u{1F442}"],
  ["f_er4", "\u4E8C", "\xE8r", "dua", "2\uFE0F\u20E3"],
  // ── fa ──
  ["f_fa1", "\u53D1", "f\u0101", "mengirim", "\u{1F4E8}"],
  ["f_fa2", "\u7F5A", "f\xE1", "menghukum", "\u2696\uFE0F"],
  // ── fan ──
  ["f_fan1", "\u7FFB", "f\u0101n", "membalik", "\u{1F4D6}"],
  ["f_fan2", "\u70E6", "f\xE1n", "kesal / repot", "\u{1F624}"],
  ["f_fan3", "\u53CD", "f\u01CEn", "berlawanan", "\u21A9\uFE0F"],
  ["f_fan4", "\u996D", "f\xE0n", "nasi / makanan", "\u{1F35A}"],
  // ── fang ──
  ["f_fang1", "\u65B9", "f\u0101ng", "persegi / arah", "\u2B1C"],
  ["f_fang2", "\u623F", "f\xE1ng", "rumah / ruangan", "\u{1F3E0}"],
  ["f_fang3", "\u8BBF", "f\u01CEng", "mengunjungi", "\u{1F6AA}"],
  ["f_fang4", "\u653E", "f\xE0ng", "meletakkan", "\u{1F4E5}"],
  // ── fei ──
  ["f_fei1", "\u98DE", "f\u0113i", "terbang", "\u2708\uFE0F"],
  ["f_fei2", "\u80A5", "f\xE9i", "gemuk (subur)", "\u{1F404}"],
  ["f_fei3", "\u532A", "f\u011Bi", "perampok", "\u{1F977}"],
  ["f_fei4", "\u8D39", "f\xE8i", "biaya", "\u{1F4B0}"],
  // ── fen ──
  ["f_fen1", "\u5206", "f\u0113n", "menit / membagi", "\u23F1\uFE0F"],
  ["f_fen2", "\u575F", "f\xE9n", "kuburan", "\u{1FAA6}"],
  ["f_fen3", "\u7C89", "f\u011Bn", "bubuk / merah muda", "\u{1F338}"],
  ["f_fen4", "\u4EFD", "f\xE8n", "porsi / bagian", "\u{1F4C4}"],
  // ── feng ──
  ["f_feng1", "\u98CE", "f\u0113ng", "angin", "\u{1F32C}\uFE0F"],
  ["f_feng2", "\u9022", "f\xE9ng", "bertemu", "\u{1F91D}"],
  ["f_feng3", "\u8BBD", "f\u011Bng", "menyindir", "\u{1F5E3}\uFE0F"],
  // ── fo ──
  ["f_fo2", "\u4F5B", "f\xF3", "Buddha", "\u{1F6D5}"],
  // ── fou ──
  ["f_fou3", "\u5426", "f\u01D2u", "menolak / tidak", "\u274C"],
  // ── fu ──
  ["f_fu1", "\u592B", "f\u016B", "suami", "\u{1F468}"],
  ["f_fu2", "\u798F", "f\xFA", "berkah / keberuntungan", "\u{1F9E7}"],
  ["f_fu3", "\u629A", "f\u01D4", "mengelus", "\u{1F932}"],
  ["f_fu4", "\u7236", "f\xF9", "ayah", "\u{1F468}"],
  // ── gai ──
  ["f_gai1", "\u8BE5", "g\u0101i", "harusnya", "\u2714\uFE0F"],
  ["f_gai3", "\u6539", "g\u01CEi", "mengubah", "\u{1F527}"],
  ["f_gai4", "\u76D6", "g\xE0i", "menutup / atap", "\u{1F3E0}"],
  // ── gan ──
  ["f_gan1", "\u5E72 (kering: g\u0101n)", "g\u0101n", "kering", "\u{1F3DC}\uFE0F"],
  ["f_gan3", "\u8D76", "g\u01CEn", "mengejar", "\u{1F3C3}"],
  ["f_gan4", "\u5E72 (melakukan: g\xE0n)", "g\xE0n", "bekerja / melakukan", "\u{1F528}"],
  // ── gang ──
  ["f_gang1", "\u94A2", "g\u0101ng", "baja", "\u{1F529}"],
  ["f_gang3", "\u5C97", "g\u01CEng", "pos jaga", "\u{1F6A7}"],
  // ── gao ──
  ["f_gao1", "\u9AD8", "g\u0101o", "tinggi", "\u{1F4D0}"],
  ["f_gao3", "\u641E", "g\u01CEo", "melakukan (kolokial)", "\u{1F6E0}\uFE0F"],
  ["f_gao4", "\u544A", "g\xE0o", "memberi tahu", "\u{1F4E2}"],
  // ── ge ──
  ["f_ge1", "\u54E5", "g\u0113", "kakak laki-laki", "\u{1F466}"],
  ["f_ge2", "\u683C", "g\xE9", "kotak / standar", "\u{1F532}"],
  ["f_ge4", "\u5404", "g\xE8", "masing-masing", "\u{1F522}"],
  // ── gei ──
  ["f_gei3", "\u7ED9", "g\u011Bi", "memberi", "\u{1F381}"],
  // ── gen ──
  ["f_gen1", "\u8DDF", "g\u0113n", "dengan / mengikuti", "\u{1F6B6}"],
  ["f_gen2", "\u54CF", "g\xE9n", "lucu (slang)", "\u{1F604}"],
  ["f_gen4", "\u4E98", "g\xE8n", "membentang", "\u{1F5FA}\uFE0F"],
  // ── geng ──
  ["f_geng1", "\u66F4 (jam malam)", "g\u0113ng", "jaga malam", "\u{1F319}"],
  ["f_geng4", "\u66F4", "g\xE8ng", "lebih", "\u{1F4C8}"],
  // ── gong ──
  ["f_gong1", "\u5DE5", "g\u014Dng", "kerja", "\u{1F528}"],
  ["f_gong3", "\u62F1", "g\u01D2ng", "melengkung", "\u{1F309}"],
  ["f_gong4", "\u5171", "g\xF2ng", "bersama / total", "\u{1F91D}"],
  // ── gou ──
  ["f_gou1", "\u6C9F", "g\u014Du", "parit", "\u{1F573}\uFE0F"],
  ["f_gou3", "\u72D7", "g\u01D2u", "anjing", "\u{1F415}"],
  ["f_gou4", "\u591F", "g\xF2u", "cukup", "\u2705"],
  // ── gu ──
  ["f_gu1", "\u59D1", "g\u016B", "bibi", "\u{1F469}"],
  ["f_gu2", "\u9AA8", "g\u01D4", "tulang", "\u{1F9B4}"],
  ["f_gu3", "\u53E4", "g\u01D4", "kuno", "\u{1F3FA}"],
  ["f_gu4", "\u6545", "g\xF9", "alasan / peristiwa", "\u{1F4D6}"],
  // ── gua ──
  ["f_gua1", "\u74DC", "gu\u0101", "melon", "\u{1F349}"],
  ["f_gua3", "\u5BE1", "gu\u01CE", "janda / sedikit", "\u{1FAB6}"],
  ["f_gua4", "\u6302", "gu\xE0", "menggantung", "\u{1FA9D}"],
  // ── guai ──
  ["f_guai1", "\u4E56", "gu\u0101i", "pintar (anak)", "\u{1F607}"],
  ["f_guai3", "\u62D0", "gu\u01CEi", "berbelok", "\u21A9\uFE0F"],
  // ── guan ──
  ["f_guan1", "\u5173", "gu\u0101n", "menutup / berhubungan", "\u{1F6AA}"],
  ["f_guan3", "\u7BA1", "gu\u01CEn", "pipa / mengatur", "\u{1F527}"],
  ["f_guan4", "\u704C", "gu\xE0n", "menyiram / menuang", "\u{1F4A7}"],
  // ── gui ──
  ["f_gui1", "\u5F52", "gu\u012B", "kembali", "\u{1F519}"],
  ["f_gui3", "\u8F68", "gu\u01D0", "rel", "\u{1F6E4}\uFE0F"],
  ["f_gui4", "\u67DC", "gu\xEC", "lemari", "\u{1F6AA}"],
  // ── gun ──
  ["f_gun3", "\u6EDA", "g\u01D4n", "menggelinding", "\u26BD"],
  // ── guo ──
  ["f_guo1", "\u9505", "gu\u014D", "panci", "\u{1F372}"],
  ["f_guo2", "\u56FD", "gu\xF3", "negara", "\u{1F3F3}\uFE0F"],
  ["f_guo3", "\u679C", "gu\u01D2", "buah / hasil", "\u{1F34E}"],
  ["f_guo4", "\u8FC7", "gu\xF2", "melewati", "\u27A1\uFE0F"],
  // ── ha ──
  ["f_ha1", "\u54C8", "h\u0101", "ha (tertawa)", "\u{1F604}"],
  // ── hai ──
  ["f_hai1", "\u54B3", "h\u0101i", "hai (seru)", "\u{1F44B}"],
  ["f_hai2", "\u8FD8 (masih: h\xE1i)", "h\xE1i", "masih", "\u{1F501}"],
  ["f_hai3", "\u6D77", "h\u01CEi", "laut", "\u{1F30A}"],
  ["f_hai4", "\u5BB3", "h\xE0i", "merugikan", "\u26A0\uFE0F"],
  // ── han ──
  ["f_han1", "\u9163", "h\u0101n", "terlelap pulas", "\u{1F634}"],
  ["f_han2", "\u542B", "h\xE1n", "memegang di mulut / mengandung", "\u{1F4A7}"],
  ["f_han3", "\u558A", "h\u01CEn", "berteriak", "\u{1F4E3}"],
  ["f_han4", "\u6C49", "h\xE0n", "Han (bahasa Mandarin)", "\u{1F236}"],
  // ── hang ──
  ["f_hang2", "\u822A", "h\xE1ng", "pelayaran / penerbangan", "\u2708\uFE0F"],
  ["f_hang4", "\u5DF7", "h\xE0ng", "gang", "\u{1F6E4}\uFE0F"],
  // ── hao ──
  ["f_hao1", "\u84BF", "h\u0101o", "sejenis rumput", "\u{1F33F}"],
  ["f_hao2", "\u6BEB", "h\xE1o", "sedikit sekali", "\u{1FAB6}"],
  ["f_hao3", "\u597D", "h\u01CEo", "baik", "\u{1F44D}"],
  ["f_hao4", "\u53F7", "h\xE0o", "nomor / tanggal", "\u{1F522}"],
  // ── he ──
  ["f_he1", "\u559D", "h\u0113", "minum", "\u{1F964}"],
  ["f_he2", "\u548C", "h\xE9", "dan", "\u2795"],
  ["f_he4", "\u8D3A", "h\xE8", "mengucapkan selamat", "\u{1F389}"],
  // ── hei ──
  ["f_hei1", "\u9ED1", "h\u0113i", "hitam", "\u26AB"],
  // ── hen ──
  ["f_hen2", "\u75D5", "h\xE9n", "bekas / jejak", "\u{1F463}"],
  ["f_hen3", "\u5F88", "h\u011Bn", "sangat", "\u{1F4AF}"],
  // ── heng ──
  ["f_heng1", "\u54FC", "h\u0113ng", "membibir / bersenandung", "\u{1F3B5}"],
  ["f_heng2", "\u6A2A", "h\xE9ng", "melintang", "\u27A1\uFE0F"],
  // ── hou ──
  ["f_hou2", "\u7334", "h\xF3u", "monyet", "\u{1F435}"],
  ["f_hou3", "\u543C", "h\u01D2u", "mengaum", "\u{1F981}"],
  ["f_hou4", "\u540E", "h\xF2u", "belakang / setelah", "\u{1F519}"],
  // ── hu ──
  ["f_hu1", "\u4E4E", "h\u016B", "partikel (hampir)", "\u2753"],
  ["f_hu2", "\u6E56", "h\xFA", "danau", "\u{1F3DE}\uFE0F"],
  ["f_hu3", "\u864E", "h\u01D4", "harimau", "\u{1F42F}"],
  ["f_hu4", "\u62A4", "h\xF9", "melindungi", "\u{1F6E1}\uFE0F"],
  // ── hua ──
  ["f_hua1", "\u82B1", "hu\u0101", "bunga", "\u{1F338}"],
  ["f_hua2", "\u534E", "hu\xE1", "gemilang / Tionghoa", "\u{1F1E8}\u{1F1F3}"],
  ["f_hua4", "\u753B", "hu\xE0", "melukis / gambar", "\u{1F3A8}"],
  // ── huai ──
  ["f_huai2", "\u6000", "hu\xE1i", "mendekap / rindu", "\u{1FAC2}"],
  ["f_huai4", "\u574F", "hu\xE0i", "rusak / buruk", "\u26A0\uFE0F"],
  // ── huan ──
  ["f_huan1", "\u6B22", "hu\u0101n", "gembira", "\u{1F604}"],
  ["f_huan2", "\u8FD8 (mengembalikan)", "hu\xE1n", "mengembalikan", "\u{1F519}"],
  ["f_huan3", "\u7F13", "hu\u01CEn", "pelan / menunda", "\u{1F422}"],
  // ── huang ──
  ["f_huang1", "\u8352", "hu\u0101ng", "liar / tandus", "\u{1F3DC}\uFE0F"],
  ["f_huang2", "\u9EC4", "hu\xE1ng", "kuning", "\u{1F7E1}"],
  ["f_huang3", "\u8C0E", "hu\u01CEng", "bohong", "\u{1F925}"],
  // ── hui ──
  ["f_hui1", "\u7070", "hu\u012B", "abu-abu", "\u{1F32B}\uFE0F"],
  ["f_hui2", "\u56DE", "hu\xED", "kembali", "\u21A9\uFE0F"],
  ["f_hui3", "\u6BC1", "hu\u01D0", "menghancurkan", "\u{1F4A5}"],
  ["f_hui4", "\u4F1A", "hu\xEC", "bisa / rapat", "\u{1F91D}"],
  // ── hun ──
  ["f_hun1", "\u660F", "h\u016Bn", "pingsan / gelap", "\u{1F4AB}"],
  ["f_hun2", "\u6D51", "h\xFAn", "keruh", "\u{1F30A}"],
  ["f_hun4", "\u6DF7", "h\xF9n", "mencampur", "\u{1F963}"],
  // ── huo ──
  ["f_huo1", "\u8C41", "hu\u014D", "terbuka lebar", "\u{1F573}\uFE0F"],
  ["f_huo2", "\u6D3B", "hu\xF3", "hidup", "\u{1F331}"],
  ["f_huo3", "\u706B", "hu\u01D2", "api", "\u{1F525}"],
  ["f_huo4", "\u8D27", "hu\xF2", "barang", "\u{1F4E6}"],
  // ── ji ──
  ["f_ji1", "\u673A", "j\u012B", "mesin", "\u2699\uFE0F"],
  ["f_ji2", "\u7EA7", "j\xED", "tingkat", "\u{1F4F6}"],
  ["f_ji3", "\u51E0", "j\u01D0", "berapa", "\u{1F522}"],
  ["f_ji4", "\u8BB0", "j\xEC", "mencatat / mengingat", "\u{1F4DD}"],
  // ── jia ──
  ["f_jia1", "\u5BB6", "ji\u0101", "rumah / keluarga", "\u{1F3E0}"],
  ["f_jia2", "\u5939", "ji\xE1", "menjepit", "\u{1F962}"],
  ["f_jia3", "\u5047", "ji\u01CE", "palsu / libur", "\u{1F3AD}"],
  ["f_jia4", "\u5AC1", "ji\xE0", "menikah (perempuan)", "\u{1F48D}"],
  // ── jian ──
  ["f_jian1", "\u95F4", "ji\u0101n", "ruang / antara", "\u{1F4D0}"],
  ["f_jian3", "\u526A", "ji\u01CEn", "menggunting", "\u2702\uFE0F"],
  ["f_jian4", "\u89C1", "ji\xE0n", "bertemu", "\u{1F440}"],
  // ── jiang ──
  ["f_jiang1", "\u6C5F", "ji\u0101ng", "sungai besar", "\u{1F30A}"],
  ["f_jiang3", "\u8BB2", "ji\u01CEng", "berbicara / mengajar", "\u{1F5E3}\uFE0F"],
  ["f_jiang4", "\u9171", "ji\xE0ng", "saus", "\u{1F36F}"],
  // ── jiao ──
  ["f_jiao1", "\u4EA4", "ji\u0101o", "menyerahkan / berhubungan", "\u{1F91D}"],
  ["f_jiao2", "\u56BC", "ji\xE1o", "mengunyah", "\u{1F36A}"],
  ["f_jiao3", "\u89D2", "ji\u01CEo", "sudut / uang kecil", "\u{1F4D0}"],
  ["f_jiao4", "\u53EB", "ji\xE0o", "bernama / memanggil", "\u{1F4E2}"],
  // ── jie ──
  ["f_jie1", "\u63A5", "ji\u0113", "menerima / menjemput", "\u{1F932}"],
  ["f_jie2", "\u8282", "ji\xE9", "hari raya / ruas", "\u{1F38B}"],
  ["f_jie3", "\u59D0", "ji\u011B", "kakak perempuan", "\u{1F469}"],
  ["f_jie4", "\u754C", "ji\xE8", "batas / dunia", "\u{1F30D}"],
  // ── jin ──
  ["f_jin1", "\u91D1", "j\u012Bn", "emas", "\u{1F947}"],
  ["f_jin3", "\u7D27", "j\u01D0n", "ketat", "\u{1F4CF}"],
  ["f_jin4", "\u8FDB", "j\xECn", "masuk / maju", "\u23E9"],
  // ── jing ──
  ["f_jing1", "\u4EAC", "j\u012Bng", "ibu kota", "\u{1F3EF}"],
  ["f_jing2", "\u9759", "j\xECng", "tenang", "\u{1F92B}"],
  ["f_jing3", "\u666F", "j\u01D0ng", "pemandangan", "\u{1F3DE}\uFE0F"],
  ["f_jing4", "\u51C0", "j\xECng", "bersih", "\u{1F9FC}"],
  // ── jiong ──
  ["f_jiong3", "\u70AF", "ji\u01D2ng", "berbinar (mata)", "\u{1F440}"],
  // ── jiu ──
  ["f_jiu1", "\u7A76", "ji\u016B", "menyelidiki", "\u{1F50D}"],
  ["f_jiu3", "\u9152", "ji\u01D4", "anggur / minuman beralkohol", "\u{1F376}"],
  ["f_jiu4", "\u65E7", "ji\xF9", "lama / bekas", "\u{1F570}\uFE0F"],
  // ── ju ──
  ["f_ju1", "\u62D8", "j\u016B", "menahan", "\u26D3\uFE0F"],
  ["f_ju2", "\u5C40", "j\xFA", "kantor / permainan", "\u{1F3E2}"],
  ["f_ju3", "\u4E3E", "j\u01D4", "mengangkat", "\u{1F3CB}\uFE0F"],
  ["f_ju4", "\u53E5", "j\xF9", "kalimat", "\u{1F4AC}"],
  // ── juan ──
  ["f_juan1", "\u5708 (lingkaran: qu\u0101n)", "qu\u0101n", "lingkaran", "\u2B55"],
  ["f_juan3", "\u5377", "ju\u01CEn", "menggulung", "\u{1F300}"],
  // ── jue ──
  ["f_jue2", "\u7EDD", "ju\xE9", "mutlak / memutus", "\u{1F6AB}"],
  // ── jun ──
  ["f_jun1", "\u519B", "j\u016Bn", "militer", "\u{1F396}\uFE0F"],
  ["f_jun4", "\u4FCA", "j\xF9n", "tampan", "\u{1F934}"],
  // ── ka ──
  ["f_ka1", "\u5580", "k\u0101", "krek (bunyi)", "\u{1F529}"],
  ["f_ka3", "\u5361", "k\u01CE", "kartu / macet", "\u{1F4B3}"],
  // ── kai ──
  ["f_kai1", "\u5F00", "k\u0101i", "membuka", "\u{1F6AA}"],
  ["f_kai3", "\u51EF", "k\u01CEi", "menang gemilang", "\u{1F3C6}"],
  // ── kan ──
  ["f_kan1", "\u770B (menjaga: k\u0101n)", "k\u0101n", "menjaga", "\u{1F440}"],
  ["f_kan3", "\u780D", "k\u01CEn", "menebang", "\u{1FA93}"],
  ["f_kan4", "\u770B", "k\xE0n", "melihat", "\u{1F440}"],
  // ── kang ──
  ["f_kang1", "\u5EB7", "k\u0101ng", "sehat", "\u{1F4AA}"],
  ["f_kang2", "\u625B", "k\xE1ng", "menggendong di bahu", "\u{1F3CB}\uFE0F"],
  // ── kao ──
  ["f_kao1", "\u6572 (k\u0101o \u2014 tidak umum)", "k\u0101o", "\u2014 (jarang)", "\u2753"],
  ["f_kao3", "\u8003", "k\u01CEo", "menguji", "\u{1F4DD}"],
  // ── ke ──
  ["f_ke1", "\u79D1", "k\u0113", "ilmu / bidang", "\u{1F52C}"],
  ["f_ke2", "\u58F3", "k\xE9", "cangkang", "\u{1F95C}"],
  ["f_ke3", "\u6E34", "k\u011B", "haus", "\u{1F975}"],
  ["f_ke4", "\u8BFE", "k\xE8", "pelajaran", "\u{1F4DA}"],
  // ── kei ──
  // (kēi jarang — tidak diisi)
  // ── ken ──
  ["f_ken3", "\u80AF", "k\u011Bn", "bersedia", "\u{1F646}"],
  ["f_ken4", "\u6839", "g\u0113n", "akar / tangkai", "\u{1F331}"],
  // ── keng ──
  ["f_keng1", "\u5751", "k\u0113ng", "lubang", "\u{1F573}\uFE0F"],
  // ── kong ──
  ["f_kong1", "\u7A7A", "k\u014Dng", "kosong / udara", "\u2B55"],
  ["f_kong3", "\u5B54", "k\u01D2ng", "lubang kecil", "\u{1F573}\uFE0F"],
  ["f_kong4", "\u63A7", "k\xF2ng", "mengendalikan", "\u{1F39B}\uFE0F"],
  // ── kou ──
  ["f_kou3", "\u53E3", "k\u01D2u", "mulut", "\u{1F444}"],
  ["f_kou4", "\u6263", "k\xF2u", "mengancing / memotong", "\u{1F518}"],
  // ── ku ──
  ["f_ku1", "\u54ED", "k\u016B", "menangis", "\u{1F62D}"],
  ["f_ku3", "\u82E6", "k\u01D4", "pahit", "\u{1F48A}"],
  ["f_ku4", "\u5E93", "k\xF9", "gudang", "\u{1F3E2}"],
  // ── kua ──
  ["f_kua1", "\u5938", "ku\u0101", "memuji", "\u{1F31F}"],
  ["f_kua3", "\u57AE", "ku\u01CE", "runtuh", "\u{1F3D7}\uFE0F"],
  ["f_kua4", "\u8DE8", "ku\xE0", "melangkahi", "\u{1F9B5}"],
  // ── kuai ──
  ["f_kuai3", "\u5757", "ku\xE0i", "yuan / keping", "\u{1F4B4}"],
  ["f_kuai4", "\u5FEB", "ku\xE0i", "cepat", "\u26A1"],
  // ── kuan ──
  ["f_kuan1", "\u5BBD", "ku\u0101n", "lebar", "\u2194\uFE0F"],
  ["f_kuan3", "\u6B3E", "ku\u01CEn", "jenis / dana", "\u{1F4B3}"],
  // ── kuang ──
  ["f_kuang1", "\u7B50", "ku\u0101ng", "keranjang", "\u{1F9FA}"],
  ["f_kuang2", "\u72C2", "ku\xE1ng", "liar", "\u{1F32A}\uFE0F"],
  // ── kui ──
  ["f_kui1", "\u4E8F", "ku\u012B", "rugi", "\u{1F4C9}"],
  ["f_kui2", "\u8475", "ku\xED", "bunga matahari", "\u{1F33B}"],
  // ── kun ──
  ["f_kun1", "\u6606", "k\u016Bn", "keturunan", "\u{1F9EC}"],
  ["f_kun4", "\u56F0", "k\xF9n", "mengantuk / sulit", "\u{1F634}"],
  // ── kuo ──
  ["f_kuo4", "\u9614", "ku\xF2", "luas", "\u{1F5FA}\uFE0F"],
  // ── la ──
  ["f_la1", "\u62C9", "l\u0101", "menarik", "\u{1FAA2}"],
  ["f_la2", "\u5587", "l\xE1", "terompet (\u5587\u53ED)", "\u{1F4E2}"],
  ["f_la3", "\u5587 (l\u01CE)", "l\u01CE", "\u2014 (varian)", "\u2753"],
  // ── lai ──
  ["f_lai2", "\u6765", "l\xE1i", "datang", "\u{1F44B}"],
  // ── lan ──
  ["f_lan2", "\u84DD", "l\xE1n", "biru", "\u{1F535}"],
  ["f_lan3", "\u61D2", "l\u01CEn", "malas", "\u{1F9A5}"],
  ["f_lan4", "\u70C2", "l\xE0n", "busuk / lembek", "\u{1F34C}"],
  // ── lang ──
  ["f_lang1", "\u72FC", "l\xE1ng", "serigala", "\u{1F43A}"],
  ["f_lang3", "\u6717", "l\u01CEng", "terang / lantang", "\u{1F31E}"],
  // ── lao ──
  ["f_lao1", "\u635E", "l\u0101o", "menjaring dari air", "\u{1F944}"],
  ["f_lao2", "\u52B3", "l\xE1o", "kerja / lelah", "\u{1F528}"],
  ["f_lao3", "\u8001", "l\u01CEo", "tua", "\u{1F474}"],
  // ── le ──
  ["f_le4", "\u4E50", "l\xE8", "gembira", "\u{1F604}"],
  // ── lei ──
  ["f_lei1", "\u52D2", "l\u0113i", "mengikat kuat", "\u{1FAA2}"],
  ["f_lei2", "\u96F7", "l\xE9i", "guntur", "\u26A1"],
  ["f_lei3", "\u7D2F", "l\u011Bi", "menumpuk", "\u{1F4DA}"],
  ["f_lei4", "\u7D2F (lelah)", "l\xE8i", "lelah", "\u{1F629}"],
  // ── leng ──
  ["f_leng2", "\u68F1", "l\xE9ng", "rusuk / sisi", "\u{1F4D0}"],
  ["f_leng3", "\u51B7", "l\u011Bng", "dingin", "\u2744\uFE0F"],
  // ── li ──
  ["f_li1", "\u68A8", "l\xED", "pir (l\xED)", "\u{1F350}"],
  ["f_li2", "\u79BB", "l\xED", "berpisah / jauh dari", "\u2194\uFE0F"],
  ["f_li3", "\u91CC", "l\u01D0", "di dalam", "\u{1F4E6}"],
  ["f_li4", "\u529B", "l\xEC", "kekuatan", "\u{1F4AA}"],
  // ── lia ──
  ["f_lia3", "\u4FE9", "li\u01CE", "berdua", "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}"],
  // ── lian ──
  ["f_lian2", "\u8FDE", "li\xE1n", "menghubungkan", "\u{1F517}"],
  ["f_lian3", "\u8138", "li\u01CEn", "wajah", "\u{1F60A}"],
  ["f_lian4", "\u7EC3", "li\xE0n", "berlatih", "\u{1F501}"],
  // ── liang ──
  ["f_liang2", "\u51C9", "li\xE1ng", "sejuk", "\u{1F343}"],
  ["f_liang3", "\u4E24", "li\u01CEng", "dua (kata bantu)", "2\uFE0F\u20E3"],
  ["f_liang4", "\u4EAE", "li\xE0ng", "terang", "\u{1F4A1}"],
  // ── liao ──
  ["f_liao1", "\u64A9", "li\u0101o", "mengangkat (rok)", "\u{1F457}"],
  ["f_liao2", "\u8FBD", "li\xE1o", "luas terbentang", "\u{1F5FA}\uFE0F"],
  ["f_liao3", "\u4E86 (mengerti)", "li\u01CEo", "menyelesaikan", "\u2705"],
  // ── lie ──
  ["f_lie3", "\u54A7", "li\u011B", "menyeringai", "\u{1F62C}"],
  ["f_lie4", "\u70C8", "li\xE8", "ganas / kuat", "\u{1F525}"],
  // ── lin ──
  ["f_lin2", "\u6797", "l\xEDn", "hutan", "\u{1F332}"],
  ["f_lin3", "\u51DB", "l\u01D0n", "dingin menusuk", "\u{1F976}"],
  // ── ling ──
  ["f_ling2", "\u7075", "l\xEDng", "cepat / roh", "\u{1F47B}"],
  ["f_ling3", "\u9886", "l\u01D0ng", "kerah / memimpin", "\u{1F454}"],
  ["f_ling4", "\u53E6", "l\xECng", "lain / terpisah", "\u2795"],
  // ── liu ──
  ["f_liu1", "\u6E9C", "li\u016B", "meluncur", "\u{1F6F7}"],
  ["f_liu2", "\u6D41", "li\xFA", "mengalir", "\u{1F30A}"],
  ["f_liu3", "\u67F3", "li\u01D4", "pohon willow", "\u{1F333}"],
  ["f_liu4", "\u516D", "li\xF9", "enam", "6\uFE0F\u20E3"],
  // ── long ──
  ["f_long2", "\u9F99", "l\xF3ng", "naga", "\u{1F409}"],
  ["f_long3", "\u62E2", "l\u01D2ng", "mengumpulkan", "\u{1F932}"],
  // ── lou ──
  ["f_lou1", "\u6402", "l\u014Du", "merangkul", "\u{1FAC2}"],
  ["f_lou2", "\u697C", "l\xF3u", "gedung / lantai", "\u{1F3E2}"],
  ["f_lou4", "\u6F0F", "l\xF2u", "bocor", "\u{1F4A7}"],
  // ── lu ──
  ["f_lu1", "\u64B8", "l\u016B", "mengelus", "\u{1F431}"],
  ["f_lu2", "\u7089", "l\xFA", "tungku", "\u{1F525}"],
  ["f_lu3", "\u864F", "l\u01D4", "menawan", "\u26D3\uFE0F"],
  ["f_lu4", "\u5F55", "l\xF9", "merekam", "\u{1F4FC}"],
  // ── luan ──
  ["f_luan2", "\u4E71", "lu\xE0n", "kacau", "\u{1F32A}\uFE0F"],
  // ── lun ──
  ["f_lun2", "\u8F6E", "l\xFAn", "roda / giliran", "\u{1F6DE}"],
  // ── luo ──
  ["f_luo1", "\u634B", "lu\u014D", "mengusap (rambut)", "\u{1F932}"],
  ["f_luo2", "\u7F57", "lu\xF3", "jaring / mengumpulkan", "\u{1F578}\uFE0F"],
  ["f_luo3", "\u88F8", "lu\u01D2", "telanjang", "\u{1FAE3}"],
  ["f_luo4", "\u843D", "lu\xF2", "jatuh", "\u{1F342}"],
  // ── ma ──
  ["f_ma1", "\u5988", "m\u0101", "ibu", "\u{1F469}"],
  ["f_ma2", "\u9EBB", "m\xE1", "binatang / kesemutan", "\u{1F33F}"],
  ["f_ma3", "\u9A6C", "m\u01CE", "kuda", "\u{1F40E}"],
  ["f_ma4", "\u9A82", "m\xE0", "mengoceh / memarahi", "\u{1F620}"],
  ["f_ma5", "\u5417", "ma", "(partikel tanya)", "\u2753"],
  // ── mai ──
  ["f_mai2", "\u57CB", "m\xE1i", "mengubur", "\u26B0\uFE0F"],
  ["f_mai3", "\u4E70", "m\u01CEi", "membeli", "\u{1F6D2}"],
  ["f_mai4", "\u5356", "m\xE0i", "menjual", "\u{1F3F7}\uFE0F"],
  // ── man ──
  ["f_man1", "\u7792", "m\xE1n", "menyembunyikan", "\u{1F92B}"],
  ["f_man2", "\u86EE", "m\xE1n", "kasar / sangat", "\u{1F624}"],
  ["f_man3", "\u6EE1", "m\u01CEn", "penuh", "\u{1F235}"],
  ["f_man4", "\u6162", "m\xE0n", "lambat", "\u{1F422}"],
  // ── mang ──
  ["f_mang2", "\u5FD9", "m\xE1ng", "sibuk", "\u{1F3C3}"],
  ["f_mang3", "\u83BD", "m\u01CEng", "tergesa", "\u{1F417}"],
  // ── mao ──
  ["f_mao1", "\u732B", "m\u0101o", "kucing", "\u{1F431}"],
  ["f_mao2", "\u6BDB", "m\xE1o", "rambut / bulu", "\u{1FAB6}"],
  ["f_mao3", "\u536F", "m\u01CEo", "titik kompas", "\u{1F9ED}"],
  ["f_mao4", "\u5E3D", "m\xE0o", "topi", "\u{1F3A9}"],
  // ── me ──
  ["f_me5", "\u4E48", "me", "(partikel)", "\u2753"],
  // ── mei ──
  ["f_mei2", "\u6CA1", "m\xE9i", "tidak ada", "\u{1F6AB}"],
  ["f_mei3", "\u6BCF", "m\u011Bi", "setiap", "\u{1F501}"],
  ["f_mei4", "\u59B9", "m\xE8i", "adik perempuan", "\u{1F467}"],
  // ── men ──
  ["f_men1", "\u95F7 (menyesak)", "m\u0113n", "pengap", "\u{1F635}"],
  ["f_men2", "\u95E8", "m\xE9n", "pintu", "\u{1F6AA}"],
  // ── meng ──
  ["f_meng1", "\u8499", "m\u0113ng", "menipu / tertutup", "\u{1F32B}\uFE0F"],
  ["f_meng2", "\u840C", "m\xE9ng", "tunas / menggemaskan", "\u{1F331}"],
  ["f_meng3", "\u731B", "m\u011Bng", "ganas", "\u{1F406}"],
  // ── mi ──
  ["f_mi1", "\u772F", "m\u012B", "menyipit", "\u{1F60C}"],
  ["f_mi2", "\u8FF7", "m\xED", "tersesat / penggemar", "\u{1F9ED}"],
  ["f_mi3", "\u7C73", "m\u01D0", "beras / meter", "\u{1F35A}"],
  ["f_mi4", "\u5BC6", "m\xEC", "rapat / rahasia", "\u{1F512}"],
  // ── mian ──
  ["f_mian2", "\u68C9", "mi\xE1n", "kapas", "\u{1F9F5}"],
  ["f_mian3", "\u514D", "mi\u01CEn", "bebas dari / menghindar", "\u{1F193}"],
  ["f_mian4", "\u9762", "mi\xE0n", "wajah / mie", "\u{1F35C}"],
  // ── miao ──
  ["f_miao1", "\u55B5", "mi\u0101o", "meong", "\u{1F431}"],
  ["f_miao2", "\u82D7", "mi\xE1o", "bibit tanaman", "\u{1F331}"],
  ["f_miao3", "\u79D2", "mi\u01CEo", "detik", "\u23F1\uFE0F"],
  ["f_miao4", "\u5E99", "mi\xE0o", "kuil", "\u{1F6D5}"],
  // ── mie ──
  ["f_mie1", "\u54A9", "mi\u0113", "mbeek (kambing)", "\u{1F411}"],
  ["f_mie4", "\u706D", "mi\xE8", "memadamkan", "\u{1F9EF}"],
  // ── min ──
  ["f_min2", "\u6C11", "m\xEDn", "rakyat", "\u{1F465}"],
  ["f_min3", "\u654F", "m\u01D0n", "cepat / peka", "\u26A1"],
  // ── ming ──
  ["f_ming2", "\u660E", "m\xEDng", "terang / mengerti", "\u{1F4A1}"],
  ["f_ming3", "\u94ED", "m\u01D0ng", "mengukir kenang", "\u{1F5FF}"],
  // ── mo ──
  ["f_mo1", "\u6478", "m\u014D", "meraba", "\u{1F932}"],
  ["f_mo2", "\u6A21", "m\xF3", "model / meniru", "\u{1F5A8}\uFE0F"],
  ["f_mo3", "\u62B9", "m\u01D2", "mengoles", "\u{1F9F4}"],
  ["f_mo4", "\u672B", "m\xF2", "ujung / akhir", "\u{1F51A}"],
  // ── mou ──
  ["f_mou2", "\u8C0B", "m\xF3u", "merencanakan", "\u{1F9E0}"],
  ["f_mou3", "\u67D0", "m\u01D2u", "suatu / seseorang", "\u2753"],
  // ── mu ──
  ["f_mu2", "\u6A21 (pola: m\xFA)", "m\xFA", "pola / model", "\u{1F4D0}"],
  ["f_mu3", "\u6BCD", "m\u01D4", "ibu", "\u{1F469}"],
  ["f_mu4", "\u6728", "m\xF9", "kayu", "\u{1FAB5}"],
  // ── nai ──
  ["f_nai2", "\u5976", "n\u01CEi", "susu", "\u{1F95B}"],
  ["f_nai3", "\u4E43", "n\u01CEi", "ialah / justru", "\u27A1\uFE0F"],
  ["f_nai4", "\u8010", "n\xE0i", "tahan (sabaran)", "\u{1F9D8}"],
  // ── nan ──
  ["f_nan2", "\u96BE", "n\xE1n", "sulit", "\u{1F9E9}"],
  ["f_nan3", "\u8D67", "n\u01CEn", "merah malu", "\u{1F633}"],
  ["f_nan4", "\u96BE (musibah: n\xE0n)", "n\xE0n", "musibah", "\u{1F32A}\uFE0F"],
  // ── nao ──
  ["f_nao2", "\u6320", "n\xE1o", "menggaruk", "\u{1F91A}"],
  ["f_nao3", "\u8111", "n\u01CEo", "otak", "\u{1F9E0}"],
  ["f_nao4", "\u95F9", "n\xE0o", "ribut", "\u{1F4E2}"],
  // ── ne ──
  ["f_ne5", "\u5462", "ne", "(partikel tanya)", "\u2753"],
  // ── nei ──
  ["f_nei4", "\u5185", "n\xE8i", "dalam", "\u{1F512}"],
  // ── nen ──
  ["f_nen4", "\u5AE9", "n\xE8n", "muda / lembut", "\u{1F331}"],
  // ── neng ──
  ["f_neng2", "\u80FD", "n\xE9ng", "dapat / mampu", "\u{1F4AA}"],
  // ── ni ──
  ["f_ni2", "\u6CE5", "n\xED", "lumpur", "\u{1F7E4}"],
  ["f_ni3", "\u4F60", "n\u01D0", "kamu", "\u{1F44B}"],
  ["f_ni4", "\u817B", "n\xEC", "muak / berminyak", "\u{1F635}"],
  // ── nian ──
  ["f_nian2", "\u5E74", "ni\xE1n", "tahun", "\u{1F5D3}\uFE0F"],
  ["f_nian3", "\u637B", "ni\u01CEn", "memutar (jari)", "\u{1F90F}"],
  ["f_nian4", "\u5FF5", "ni\xE0n", "membaca / mengenang", "\u{1F4D6}"],
  // ── niang ──
  ["f_niang2", "\u5A18", "ni\xE1ng", "ibu", "\u{1F469}"],
  ["f_niang4", "\u917F", "ni\xE0ng", "meracik (minuman)", "\u{1F376}"],
  // ── niao ──
  ["f_niao3", "\u9E1F", "ni\u01CEo", "burung", "\u{1F426}"],
  ["f_niao4", "\u5C3F", "ni\xE0o", "kencing", "\u{1F6BD}"],
  // ── nie ──
  ["f_nie4", "\u634F", "ni\u0113", "mencubit / mencekam", "\u{1F90F}"],
  // ── ning ──
  ["f_ning2", "\u5B81", "n\xEDng", "tenang", "\u{1F54A}\uFE0F"],
  ["f_ning3", "\u62E7", "n\u01D0ng", "memutar (keran)", "\u{1F6B0}"],
  ["f_ning4", "\u5B81 (memilih: n\xECng)", "n\xECng", "lebih memilih", "\u2696\uFE0F"],
  // ── niu ──
  ["f_niu2", "\u725B", "ni\xFA", "sapi", "\u{1F404}"],
  ["f_niu3", "\u626D", "ni\u01D4", "memutar / terkilir", "\u{1FA79}"],
  // ── nong ──
  ["f_nong2", "\u519C", "n\xF3ng", "petani / pertanian", "\u{1F33E}"],
  ["f_nong4", "\u5F04", "n\xF2ng", "mengurus / bermain", "\u{1F527}"],
  // ── nou ──
  // (nòu tidak umum — tidak diisi)
  // ── nu ──
  ["f_nu2", "\u5974", "n\xFA", "budak", "\u26D3\uFE0F"],
  ["f_nu3", "\u52AA", "n\u01D4", "berusaha", "\u{1F4AA}"],
  ["f_nu4", "\u6012", "n\xF9", "marah", "\u{1F621}"],
  // ── nuan ──
  ["f_nuan3", "\u6696", "nu\u01CEn", "hangat", "\u{1F525}"],
  // ── nuo ──
  ["f_nuo2", "\u632A", "nu\xF3", "menggeser", "\u2194\uFE0F"],
  ["f_nuo4", "\u7CEF", "nu\xF2", "ketan / lembek", "\u{1F35A}"],
  // ── o ──
  ["f_o1", "\u54E6", "\u014D", "oh", "\u{1F62E}"],
  ["f_o2", "\u54E6 (o)", "\xF3", "oh (paham)", "\u{1F4A1}"],
  // ── ou ──
  ["f_ou1", "\u533A (\u014Du)", "\u014Du", "wilayah (juga \u014Du)", "\u{1F5FA}\uFE0F"],
  ["f_ou3", "\u5076", "\u01D2u", "patung / kebetulan", "\u{1F3AD}"],
  // ── pa ──
  ["f_pa1", "\u8DB4", "p\u0101", "merangkak / telungkup", "\u{1F93E}"],
  ["f_pa2", "\u722C", "p\xE1", "memanjat", "\u{1F9D7}"],
  ["f_pa4", "\u6015", "p\xE0", "takut", "\u{1F628}"],
  // ── pai ──
  ["f_pai1", "\u62CD", "p\u0101i", "memukul / memotret", "\u{1F4F7}"],
  ["f_pai2", "\u6392", "p\xE1i", "baris / mengatur", "\u{1F9FE}"],
  ["f_pai3", "\u724C", "p\u01CEi", "kartu / papan nama", "\u{1F0CF}"],
  ["f_pai4", "\u6D3E", "p\xE0i", "mengutus / gaya", "\u{1F9D1}\u200D\u{1F4BC}"],
  // ── pan ──
  ["f_pan1", "\u6500", "p\u0101n", "memanjat", "\u{1F9D7}"],
  ["f_pan2", "\u76D8", "p\xE1n", "piring / piringan", "\u{1F37D}\uFE0F"],
  ["f_pan4", "\u5224", "p\xE0n", "memutuskan", "\u2696\uFE0F"],
  // ── pang ──
  ["f_pang1", "\u65C1", "p\xE1ng", "samping", "\u2194\uFE0F"],
  ["f_pang2", "\u5E9E", "p\xE1ng", "raksasa", "\u{1F40B}"],
  ["f_pang4", "\u80D6", "p\xE0ng", "gemuk", "\u{1F437}"],
  // ── pao ──
  ["f_pao1", "\u629B", "p\u0101o", "melempar", "\u{1F94F}"],
  ["f_pao2", "\u5228", "p\xE1o", "mengikis", "\u{1FA9A}"],
  ["f_pao3", "\u8DD1", "p\u01CEo", "berlari", "\u{1F3C3}"],
  ["f_pao4", "\u6CE1", "p\xE0o", "merendam / gelembung", "\u{1FAE7}"],
  // ── pei ──
  ["f_pei1", "\u5478", "p\u0113i", "pyah (meludah)", "\u{1F624}"],
  ["f_pei2", "\u966A", "p\xE9i", "menemani", "\u{1F91D}"],
  ["f_pei4", "\u914D", "p\xE8i", "memasangkan", "\u{1F9E9}"],
  // ── pen ──
  ["f_pen2", "\u76C6", "p\xE9n", "bak mandi", "\u{1FAA3}"],
  // ── peng ──
  ["f_peng1", "\u62A8", "p\u0113ng", "mengkritik", "\u{1F4E3}"],
  ["f_peng2", "\u670B", "p\xE9ng", "teman", "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}"],
  ["f_peng3", "\u6367", "p\u011Bng", "menyandera / mengapit", "\u{1F932}"],
  // ── pi ──
  ["f_pi1", "\u6279", "p\u012B", "mengkritik / angkatan", "\u{1F4CB}"],
  ["f_pi2", "\u76AE", "p\xED", "kulit", "\u{1F9E4}"],
  ["f_pi3", "\u5288", "p\u01D0", "membelah", "\u{1FA93}"],
  ["f_pi4", "\u5C41", "p\xEC", "kentut", "\u{1F4A8}"],
  // ── pian ──
  ["f_pian1", "\u7BC7", "pi\u0101n", "artikel (kata bantu)", "\u{1F4C4}"],
  ["f_pian2", "\u4FBF (murah: pi\xE1n)", "pi\xE1n", "murah (pi\xE1nyi)", "\u{1F3F7}\uFE0F"],
  ["f_pian4", "\u9A97", "pi\xE0n", "menipu", "\u{1F925}"],
  // ── piao ──
  ["f_piao1", "\u98D8", "pi\u0101o", "melayang", "\u{1FA81}"],
  ["f_piao3", "\u6F02", "pi\u01CEo", "mencuci (bleaching)", "\u{1F9FA}"],
  ["f_piao4", "\u7968", "pi\xE0o", "tiket", "\u{1F39F}\uFE0F"],
  // ── pie ──
  ["f_pie1", "\u6487", "pi\u0113", "membuang / goresan", "\u{1F944}"],
  ["f_pie3", "\u82E4", "pi\u011B", "sejenis sayur", "\u{1F96C}"],
  // ── pin ──
  ["f_pin1", "\u62FC", "p\u012Bn", "menyusun / bersaing", "\u{1F9E9}"],
  ["f_pin2", "\u8D2B", "p\xEDn", "miskin", "\u{1FA99}"],
  ["f_pin3", "\u54C1", "p\u01D0n", "produk / mengecap", "\u{1F4E6}"],
  // ── ping ──
  ["f_ping2", "\u5E73", "p\xEDng", "datar / damai", "\u2796"],
  ["f_ping3", "\u8BC4", "p\u01D0ng", "menilai", "\u2B50"],
  // ── po ──
  ["f_po1", "\u5761", "p\u014D", "lereng", "\u26F0\uFE0F"],
  ["f_po2", "\u5A46", "p\xF3", "nenek / mertua", "\u{1F475}"],
  ["f_po3", "\u53F5", "p\u01D2", "tidak mungkin", "\u{1F6AB}"],
  ["f_po4", "\u7834", "p\xF2", "pecah / rusak", "\u{1F4A5}"],
  // ── pou ──
  ["f_pou1", "\u5256", "p\u014Du", "membedah", "\u{1F52C}"],
  // ── pu ──
  ["f_pu1", "\u6251", "p\u016B", "melompat menyerbu", "\u{1F43E}"],
  ["f_pu2", "\u4EC6", "p\xFA", "pelayan", "\u{1F935}"],
  ["f_pu3", "\u6734", "p\u01D4", "sederhana", "\u{1FAB5}"],
  ["f_pu4", "\u94FA (toko: p\xF9)", "p\xF9", "toko / tempat tidur", "\u{1F3EA}"],
  // ── qi ──
  ["f_qi1", "\u4E03", "q\u012B", "tujuh", "7\uFE0F\u20E3"],
  ["f_qi2", "\u65D7", "q\xED", "bendera", "\u{1F6A9}"],
  ["f_qi3", "\u8D77", "q\u01D0", "bangkit / mulai", "\u{1F680}"],
  ["f_qi4", "\u6C7D", "q\xEC", "uap / bensin", "\u{1F4A8}"],
  // ── qia ──
  ["f_qia1", "\u6390", "qi\u0101", "mencubit", "\u{1F90F}"],
  ["f_qia4", "\u6070", "qi\xE0", "tepat", "\u{1F3AF}"],
  // ── qian ──
  ["f_qian1", "\u5343", "qi\u0101n", "seribu", "\u{1F522}"],
  ["f_qian2", "\u94B1", "qi\xE1n", "uang", "\u{1F4B0}"],
  ["f_qian3", "\u6D45", "qi\u01CEn", "dangkal", "\u{1F30A}"],
  ["f_qian4", "\u6B20", "qi\xE0n", "berhutang", "\u{1F4B3}"],
  // ── qiang ──
  ["f_qiang1", "\u67AA", "qi\u0101ng", "senapan", "\u{1F52B}"],
  ["f_qiang2", "\u5899", "qi\xE1ng", "dinding", "\u{1F9F1}"],
  ["f_qiang3", "\u62A2", "qi\u01CEng", "merebut", "\u{1F947}"],
  // ── qiao ──
  ["f_qiao1", "\u6572", "qi\u0101o", "mengetuk", "\u{1F6AA}"],
  ["f_qiao2", "\u6865", "qi\xE1o", "jembatan", "\u{1F309}"],
  ["f_qiao3", "\u5DE7", "qi\u01CEo", "kebetulan / cekatan", "\u{1F939}"],
  // ── qie ──
  ["f_qie1", "\u5207 (memotong: qi\u0113)", "qi\u0113", "memotong", "\u{1F52A}"],
  ["f_qie3", "\u4E14", "qi\u011B", "dan juga", "\u2795"],
  ["f_qie4", "\u5207", "qi\xE8", "penuh perhatian", "\u{1F497}"],
  // ── qin ──
  ["f_qin1", "\u4EB2", "q\u012Bn", "dekat / mencium", "\u{1F48B}"],
  ["f_qin2", "\u52E4", "q\xEDn", "rajin", "\u{1F528}"],
  // ── qing ──
  ["f_qing1", "\u9752", "q\u012Bng", "hijau muda", "\u{1F33F}"],
  ["f_qing2", "\u60C5", "q\xEDng", "perasaan", "\u{1F49E}"],
  ["f_qing3", "\u8BF7", "q\u01D0ng", "silakan / mengundang", "\u{1F647}"],
  // ── qiong ──
  ["f_qiong2", "\u7A77", "qi\xF3ng", "miskin", "\u{1FA99}"],
  // ── qiu ──
  ["f_qiu1", "\u79CB", "qi\u016B", "musim gugur", "\u{1F342}"],
  ["f_qiu2", "\u56DA", "qi\xFA", "tahanan", "\u26D3\uFE0F"],
  // ── qu ──
  ["f_qu1", "\u533A", "q\u016B", "wilayah", "\u{1F5FA}\uFE0F"],
  ["f_qu2", "\u6E20", "q\xFA", "saluran air", "\u{1F4A7}"],
  ["f_qu3", "\u5A36", "q\u01D4", "menikah (laki-laki)", "\u{1F48D}"],
  ["f_qu4", "\u8DA3", "q\xF9", "menarik / lucu", "\u{1F389}"],
  // ── quan ──
  ["f_quan1", "\u5708", "qu\u0101n", "lingkaran", "\u2B55"],
  ["f_quan2", "\u5168", "qu\xE1n", "lengkap / semua", "\u{1F4AF}"],
  ["f_quan3", "\u72AC", "qu\u01CEn", "anjing (formal)", "\u{1F415}"],
  ["f_quan4", "\u529D", "qu\xE0n", "menasihati", "\u{1F5E3}\uFE0F"],
  // ── que ──
  ["f_que1", "\u7F3A", "qu\u0113", "kurang / bolong", "\u{1F9E9}"],
  ["f_que4", "\u5374", "qu\xE8", "namun", "\u21A9\uFE0F"],
  // ── qun ──
  ["f_qun2", "\u88D9", "q\xFAn", "rok", "\u{1F457}"],
  // ── ran ──
  ["f_ran2", "\u7136", "r\xE1n", "benar / alami", "\u{1F33F}"],
  ["f_ran3", "\u67D3", "r\u01CEn", "mewarnai", "\u{1F3A8}"],
  // ── rang ──
  ["f_rang2", "\u56B7 (r\u0101ng)", "r\u0101ng", "berteriak pelan", "\u{1F4E2}"],
  ["f_rang3", "\u56B7", "r\u01CEng", "berteriak", "\u{1F4E2}"],
  ["f_rang4", "\u8BA9", "r\xE0ng", "membiarkan", "\u{1F645}"],
  // ── rao ──
  ["f_rao2", "\u9976", "r\xE1o", "memaafkan / berlimpah", "\u{1F54A}\uFE0F"],
  ["f_rao3", "\u6270", "r\u01CEo", "mengganggu", "\u{1F4F5}"],
  // ── re ──
  ["f_re3", "\u60F9", "r\u011B", "menimbulkan / mengganggu", "\u26A0\uFE0F"],
  ["f_re4", "\u70ED", "r\xE8", "panas", "\u{1F525}"],
  // ── ren ──
  ["f_ren2", "\u4EBA", "r\xE9n", "orang", "\u{1F9CD}"],
  ["f_ren3", "\u5FCD", "r\u011Bn", "menahan diri", "\u{1F9D8}"],
  ["f_ren4", "\u8BA4", "r\xE8n", "mengenali", "\u{1F440}"],
  // ── reng ──
  ["f_reng1", "\u6254", "r\u0113ng", "membuang", "\u{1F5D1}\uFE0F"],
  // ── ri ──
  ["f_ri4", "\u65E5", "r\xEC", "hari / matahari", "\u2600\uFE0F"],
  // ── rong ──
  ["f_rong2", "\u5BB9", "r\xF3ng", "muka / memuat", "\u{1F60A}"],
  ["f_rong3", "\u5197", "r\u01D2ng", "bertele-tele", "\u{1F4C4}"],
  // ── rou ──
  ["f_rou2", "\u67D4", "r\xF3u", "lembut", "\u{1FAB6}"],
  ["f_rou4", "\u8089", "r\xF2u", "daging", "\u{1F969}"],
  // ── ru ──
  ["f_ru2", "\u5982", "r\xFA", "seperti", "\u{1FA9E}"],
  ["f_ru3", "\u8FB1", "r\u01D4", "menghina", "\u{1F616}"],
  ["f_ru4", "\u5165", "r\xF9", "masuk", "\u{1F4E5}"],
  // ── ruan ──
  ["f_ruan3", "\u8F6F", "ru\u01CEn", "lunak", "\u{1FAB6}"],
  // ── rui ──
  ["f_rui3", "\u854A", "ru\u01D0", "putik bunga", "\u{1F338}"],
  ["f_rui4", "\u745E", "ru\xEC", "beruntung", "\u{1F340}"],
  // ── run ──
  ["f_run4", "\u6DA6", "r\xF9n", "halus / melembap", "\u{1F4A7}"],
  // ── ruo ──
  ["f_ruo4", "\u82E5", "ru\xF2", "seperti / jika", "\u{1FA9E}"],
  // ── sa ──
  ["f_sa1", "\u6492", "s\u0101", "menabur", "\u{1F9C2}"],
  ["f_sa3", "\u6D12", "s\u01CE", "menyiram", "\u{1F6BF}"],
  ["f_sa4", "\u5345", "s\xE0", "tiga puluh", "\u{1F522}"],
  // ── sai ──
  ["f_sai1", "\u816E", "s\u0101i", "pipi", "\u{1F60A}"],
  ["f_sai4", "\u8D5B", "s\xE0i", "lomba", "\u{1F3C6}"],
  // ── san ──
  ["f_san1", "\u4E09", "s\u0101n", "tiga", "3\uFE0F\u20E3"],
  ["f_san3", "\u6563 (longgar)", "s\u01CEn", "longgar", "\u{1FAA2}"],
  ["f_san4", "\u6563 (menyebar)", "s\xE0n", "menyebar", "\u{1F4A8}"],
  // ── sang ──
  ["f_sang1", "\u6851", "s\u0101ng", "pohon murbei", "\u{1F33F}"],
  ["f_sang3", "\u55D3", "s\u01CEng", "tenggorokan", "\u{1F5E3}\uFE0F"],
  // ── sao ──
  ["f_sao1", "\u6414", "s\u0101o", "menggaruk", "\u{1F91A}"],
  ["f_sao3", "\u626B", "s\u01CEo", "menyapu", "\u{1F9F9}"],
  // ── se ──
  ["f_se4", "\u8272", "s\xE8", "warna", "\u{1F3A8}"],
  // ── sen ──
  ["f_sen1", "\u68EE", "s\u0113n", "hutan lebat", "\u{1F332}"],
  // ── seng ──
  ["f_seng1", "\u50E7", "s\u0113ng", "biarawan", "\u{1F9D8}"],
  // ── sha ──
  ["f_sha1", "\u6740", "sh\u0101", "membunuh", "\u2694\uFE0F"],
  ["f_sha2", "\u5565", "sh\xE1", "apa (kolokial)", "\u2753"],
  ["f_sha3", "\u50BB", "sh\u01CE", "bodoh / polos", "\u{1F92A}"],
  ["f_sha4", "\u53A6 (gedung: sh\xE0)", "sh\xE0", "gedung besar", "\u{1F3E2}"],
  // ── shai ──
  ["f_shai1", "\u7B5B", "sh\u0101i", "mengayak", "\u{1F944}"],
  ["f_shai4", "\u6652", "sh\xE0i", "menjemur", "\u{1F31E}"],
  // ── shan ──
  ["f_shan1", "\u5C71", "sh\u0101n", "gunung", "\u26F0\uFE0F"],
  ["f_shan3", "\u95EA", "sh\u01CEn", "berkilat / menghindar", "\u26A1"],
  ["f_shan4", "\u6247 (kipas: sh\xE0n)", "sh\xE0n", "kipas", "\u{1FAAD}"],
  // ── shang ──
  ["f_shang1", "\u4F24", "sh\u0101ng", "cedera", "\u{1FA79}"],
  ["f_shang3", "\u664C", "sh\u01CEng", "siang singkat", "\u{1F324}\uFE0F"],
  ["f_shang4", "\u4E0A", "sh\xE0ng", "atas", "\u2B06\uFE0F"],
  // ── shao ──
  ["f_shao1", "\u70E7", "sh\u0101o", "membakar", "\u{1F525}"],
  ["f_shao2", "\u52FA", "sh\xE1o", "sendok", "\u{1F944}"],
  ["f_shao3", "\u5C11", "sh\u01CEo", "sedikit", "\u2796"],
  // ── she ──
  ["f_she1", "\u5962", "sh\u0113", "boros / mewah", "\u{1F48E}"],
  ["f_she2", "\u86C7", "sh\xE9", "ular", "\u{1F40D}"],
  ["f_she3", "\u820D", "sh\u011B", "melepas / gubuk", "\u{1F3DA}\uFE0F"],
  ["f_she4", "\u793E", "sh\xE8", "masyarakat / organisasi", "\u{1F465}"],
  // ── shei ──
  ["f_shei2", "\u8C01", "sh\xE9i", "siapa", "\u2753"],
  // ── shen ──
  ["f_shen1", "\u6DF1", "sh\u0113n", "dalam", "\u{1F30A}"],
  ["f_shen2", "\u795E", "sh\xE9n", "tuhan / semangat", "\u2728"],
  ["f_shen3", "\u6C88", "sh\u011Bn", "nama marga", "\u59D3\u6C0F"],
  // ── sheng ──
  ["f_sheng1", "\u751F", "sh\u0113ng", "lahir / hidup", "\u{1F331}"],
  ["f_sheng2", "\u7EF3", "sh\xE9ng", "tali", "\u{1FAA2}"],
  // ── shi ──
  ["f_shi1", "\u5E08", "sh\u012B", "guru / ahli", "\u{1F9D1}\u200D\u{1F3EB}"],
  ["f_shi2", "\u5341", "sh\xED", "sepuluh", "\u{1F51F}"],
  ["f_shi3", "\u53F2", "sh\u01D0", "sejarah", "\u{1F3DB}\uFE0F"],
  ["f_shi4", "\u662F", "sh\xEC", "adalah", "\u{1F7F0}"],
  // ── shou ──
  ["f_shou1", "\u6536", "sh\u014Du", "menerima", "\u{1F4E5}"],
  ["f_shou3", "\u624B", "sh\u01D2u", "tangan", "\u{1F91A}"],
  ["f_shou4", "\u5BFF", "sh\xF2u", "panjang umur", "\u{1F382}"],
  // ── shu ──
  ["f_shu1", "\u4E66", "sh\u016B", "buku", "\u{1F4D6}"],
  ["f_shu2", "\u719F", "sh\xFA", "matang / akrab", "\u{1F352}"],
  ["f_shu3", "\u6691", "sh\u01D4", "panas (musim)", "\u{1F31E}"],
  ["f_shu4", "\u6811", "sh\xF9", "pohon", "\u{1F333}"],
  // ── shua ──
  ["f_shua1", "\u5237", "shu\u0101", "menyikat", "\u{1FAA5}"],
  ["f_shua3", "\u800D", "shu\u01CE", "bermain / mengakali", "\u{1F0CF}"],
  // ── shuai ──
  ["f_shuai1", "\u8870", "shu\u0101i", "melemah", "\u{1F4C9}"],
  ["f_shuai3", "\u7529", "shu\u01CEi", "mengibaskan", "\u{1F93E}"],
  ["f_shuai4", "\u7387", "shu\xE0i", "garis / rasio", "\u{1F4CA}"],
  // ── shuan ──
  ["f_shuan1", "\u6813", "shu\u0101n", "selak", "\u{1F512}"],
  ["f_shuan4", "\u6DAE", "shu\xE0n", "merendam (makanan)", "\u{1F372}"],
  // ── shuang ──
  ["f_shuang1", "\u53CC", "shu\u0101ng", "pasang", "\u{1F9E6}"],
  ["f_shuang3", "\u723D", "shu\u01CEng", "segar", "\u{1F32C}\uFE0F"],
  // ── shui ──
  ["f_shui2", "\u6C34", "shu\u01D0", "air", "\u{1F4A7}"],
  ["f_shui4", "\u7761", "shu\xEC", "tidur", "\u{1F634}"],
  // ── shun ──
  ["f_shun3", "\u542E", "sh\u01D4n", "menyusu", "\u{1F37C}"],
  ["f_shun4", "\u987A", "sh\xF9n", "lancar / mengikuti", "\u{1F6E4}\uFE0F"],
  // ── shuo ──
  ["f_shuo1", "\u8BF4", "shu\u014D", "berbicara", "\u{1F5E3}\uFE0F"],
  ["f_shuo4", "\u7855", "shu\xF2", "besar / gemilang", "\u{1F393}"],
  // ── si ──
  ["f_si1", "\u601D", "s\u012B", "berpikir / merindukan", "\u{1F4AD}"],
  ["f_si3", "\u6B7B", "s\u01D0", "mati", "\u{1F480}"],
  ["f_si4", "\u56DB", "s\xEC", "empat", "4\uFE0F\u20E3"],
  // ── song ──
  ["f_song1", "\u677E", "s\u014Dng", "pinus / longgar", "\u{1F332}"],
  ["f_song3", "\u8038", "s\u01D2ng", "menjulang", "\u{1F5FC}"],
  ["f_song4", "\u9001", "s\xF2ng", "mengantar / memberi", "\u{1F381}"],
  // ── su ──
  ["f_su1", "\u82CF", "s\u016B", "bangkit / sembuh", "\u{1F331}"],
  ["f_su2", "\u4FD7", "s\xFA", "umum / kampungan", "\u{1F465}"],
  ["f_su4", "\u901F", "s\xF9", "cepat / kecepatan", "\u26A1"],
  // ── suan ──
  ["f_suan1", "\u9178", "su\u0101n", "asam", "\u{1F34B}"],
  ["f_suan4", "\u7B97", "su\xE0n", "menghitung", "\u{1F9EE}"],
  // ── sui ──
  ["f_sui1", "\u867D", "su\u012B", "walaupun", "\u21A9\uFE0F"],
  ["f_sui2", "\u968F", "su\xED", "mengikuti", "\u{1F6B6}"],
  ["f_sui3", "\u9AD3", "su\u01D0", "sumsum tulang", "\u{1F9B4}"],
  ["f_sui4", "\u5C81", "su\xEC", "tahun (umur)", "\u{1F382}"],
  // ── sun ──
  ["f_sun1", "\u5B59", "s\u016Bn", "cucu", "\u{1F476}"],
  ["f_sun3", "\u635F", "s\u01D4n", "rusak / rugi", "\u{1F4C9}"],
  // ── suo ──
  ["f_suo1", "\u7F29", "su\u014D", "menyusut", "\u{1F4C9}"],
  ["f_suo3", "\u6240", "su\u01D2", "tempat / (partikel)", "\u{1F3E2}"],
  ["f_suo4", "\u9501", "su\xF2", "kunci", "\u{1F512}"],
  // ── ta ──
  ["f_ta1", "\u4ED6", "t\u0101", "dia (LK)", "\u{1F468}"],
  ["f_ta3", "\u5854", "t\u01CE", "menara", "\u{1F5FC}"],
  ["f_ta4", "\u8E0F", "t\xE0", "menginjak", "\u{1F9B6}"],
  // ── tai ──
  ["f_tai1", "\u53F0", "t\xE1i", "meja / stasiun", "\u{1F4FA}"],
  ["f_tai2", "\u62AC", "t\xE1i", "mengangkat", "\u{1F3CB}\uFE0F"],
  ["f_tai4", "\u592A", "t\xE0i", "terlalu / sangat", "\u{1F4AF}"],
  // ── tan ──
  ["f_tan1", "\u8D2A", "t\u0101n", "tamak", "\u{1F911}"],
  ["f_tan2", "\u8C08", "t\xE1n", "berbicara", "\u{1F4AC}"],
  ["f_tan3", "\u6BEF", "t\u01CEn", "karpet", "\u{1F9F6}"],
  ["f_tan4", "\u53F9", "t\xE0n", "mengeluh", "\u{1F62E}\u200D\u{1F4A8}"],
  // ── tang ──
  ["f_tang1", "\u6C64", "t\u0101ng", "sup", "\u{1F372}"],
  ["f_tang2", "\u7CD6", "t\xE1ng", "gula / permen", "\u{1F36C}"],
  ["f_tang3", "\u8EBA", "t\u01CEng", "berbaring", "\u{1F6CC}"],
  ["f_tang4", "\u70EB", "t\xE0ng", "panas menyengat", "\u2668\uFE0F"],
  // ── tao ──
  ["f_tao1", "\u638F", "t\u0101o", "mengeluarkan (saku)", "\u{1F932}"],
  ["f_tao2", "\u9003", "t\xE1o", "kabur", "\u{1F3C3}"],
  ["f_tao3", "\u8404", "t\u01CEo", "anggur (\u8461\u8404)", "\u{1F347}"],
  ["f_tao4", "\u5957", "t\xE0o", "rangka / sarung", "\u{1F9E4}"],
  // ── te ──
  ["f_te4", "\u7279", "t\xE8", "istimewa", "\u2B50"],
  // ── teng ──
  ["f_teng2", "\u75BC (sakit)", "t\xE9ng", "sakit", "\u{1F915}"],
  // ── ti ──
  ["f_ti1", "\u68AF", "t\u012B", "tangga", "\u{1FA9C}"],
  ["f_ti2", "\u63D0", "t\xED", "mengangkat / menyebut", "\u{1F3CB}\uFE0F"],
  ["f_ti3", "\u4F53", "t\u01D0", "tubuh", "\u{1F9CD}"],
  ["f_ti4", "\u66FF", "t\xEC", "menggantikan", "\u{1F501}"],
  // ── tian ──
  ["f_tian1", "\u5929", "ti\u0101n", "langit / hari", "\u{1F324}\uFE0F"],
  ["f_tian2", "\u7530", "ti\xE1n", "sawah", "\u{1F33E}"],
  ["f_tian3", "\u8214", "ti\u01CEn", "menjilat", "\u{1F445}"],
  // ── tiao ──
  ["f_tiao1", "\u6311", "ti\u0101o", "memilih / mengangkat", "\u{1F93E}"],
  ["f_tiao2", "\u6761", "ti\xE1o", "garis / kata bantu", "\u{1F4CF}"],
  ["f_tiao3", "\u7A95", "ti\u01CEo", "anggun (jarang)", "\u{1F483}"],
  ["f_tiao4", "\u8DF3", "ti\xE0o", "melompat", "\u{1F998}"],
  // ── tie ──
  ["f_tie1", "\u8D34", "ti\u0113", "menempel", "\u{1F4CE}"],
  ["f_tie3", "\u94C1", "ti\u011B", "besi", "\u{1F529}"],
  // ── ting ──
  ["f_ting1", "\u542C", "t\u012Bng", "mendengar", "\u{1F442}"],
  ["f_ting2", "\u505C", "t\xEDng", "berhenti", "\u{1F6D1}"],
  ["f_ting3", "\u8247", "t\u01D0ng", "perahu kecil", "\u{1F6A4}"],
  // ── tong ──
  ["f_tong1", "\u901A", "t\u014Dng", "lancar / menghubungkan", "\u{1F6E4}\uFE0F"],
  ["f_tong2", "\u540C", "t\xF3ng", "sama", "\u{1F7F0}"],
  ["f_tong3", "\u6876", "t\u01D2ng", "ember", "\u{1FAA3}"],
  ["f_tong4", "\u75DB", "t\xF2ng", "sakit", "\u{1F915}"],
  // ── tou ──
  ["f_tou1", "\u5077", "t\u014Du", "mencuri", "\u{1F977}"],
  ["f_tou2", "\u5934", "t\xF3u", "kepala", "\u{1F9E0}"],
  // ── tu ──
  ["f_tu1", "\u79C3", "t\u016B", "botak", "\u{1F9D1}\u200D\u{1F9B2}"],
  ["f_tu2", "\u56FE", "t\xFA", "gambar / peta", "\u{1F5FA}\uFE0F"],
  ["f_tu3", "\u5410", "t\u01D4", "muntah / meludah", "\u{1F92E}"],
  ["f_tu4", "\u5154", "t\xF9", "kelinci", "\u{1F430}"],
  // ── tuan ──
  ["f_tuan2", "\u56E2", "tu\xE1n", "kelompok / bulat", "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}"],
  // ── tui ──
  ["f_tui1", "\u63A8", "tu\u012B", "mendorong", "\u{1FAF8}"],
  ["f_tui2", "\u817F", "tu\u01D0", "kaki", "\u{1F9B5}"],
  ["f_tui4", "\u9000", "tu\xEC", "mundur / kembalikan", "\u{1F519}"],
  // ── tun ──
  ["f_tun1", "\u541E", "t\u016Bn", "menelan", "\u{1F444}"],
  ["f_tun2", "\u81C0", "t\xFAn", "pinggul", "\u{1F351}"],
  // ── tuo ──
  ["f_tuo1", "\u62D6", "tu\u014D", "menyeret", "\u{1F9F9}"],
  ["f_tuo2", "\u9A7C", "tu\xF3", "unta", "\u{1F42A}"],
  ["f_tuo3", "\u692D", "tu\u01D2", "oval", "\u{1F95A}"],
  // ── wa ──
  ["f_wa1", "\u6316", "w\u0101", "menggali", "\u26CF\uFE0F"],
  ["f_wa2", "\u5A03", "w\xE1", "bayi / anak", "\u{1F476}"],
  ["f_wa3", "\u74E6", "w\u01CE", "genteng", "\u{1F3E0}"],
  ["f_wa4", "\u889C", "w\xE0", "kaus kaki", "\u{1F9E6}"],
  // ── wai ──
  ["f_wai1", "\u6B6A", "w\u0101i", "miring", "\u{1F974}"],
  ["f_wai4", "\u5916", "w\xE0i", "luar", "\u{1F30D}"],
  // ── wan ──
  ["f_wan1", "\u5F2F", "w\u0101n", "tikung / melengkung", "\u{1F319}"],
  ["f_wan2", "\u73A9", "w\xE1n", "bermain", "\u{1F3B2}"],
  ["f_wan3", "\u665A", "w\u01CEn", "malam", "\u{1F303}"],
  ["f_wan4", "\u4E07", "w\xE0n", "sepuluh ribu", "\u{1F522}"],
  // ── wang ──
  ["f_wang1", "\u6C6A", "w\u0101ng", "genangan", "\u{1F4A7}"],
  ["f_wang2", "\u738B", "w\xE1ng", "raja", "\u{1F451}"],
  ["f_wang3", "\u7F51", "w\u01CEng", "jaring / internet", "\u{1F578}\uFE0F"],
  ["f_wang4", "\u5FD8", "w\xE0ng", "lupa", "\u{1F926}"],
  // ── wei ──
  ["f_wei1", "\u5A01", "w\u0113i", "wibawa", "\u{1F981}"],
  ["f_wei2", "\u56F4", "w\xE9i", "melingkar / sekitar", "\u2B55"],
  ["f_wei3", "\u4F1F", "w\u011Bi", "agung", "\u{1F3D4}\uFE0F"],
  ["f_wei4", "\u4F4D", "w\xE8i", "tempat / (kata bantu)", "\u{1F4BA}"],
  // ── wen ──
  ["f_wen1", "\u6E29", "w\u0113n", "hangat / suhu", "\u{1F321}\uFE0F"],
  ["f_wen2", "\u6587", "w\xE9n", "tulisan / budaya", "\u{1F4DC}"],
  ["f_wen3", "\u7A33", "w\u011Bn", "stabil", "\u2696\uFE0F"],
  ["f_wen4", "\u95EE", "w\xE8n", "bertanya", "\u2753"],
  // ── weng ──
  ["f_weng1", "\u7FC1", "w\u0113ng", "kakek / tua", "\u{1F474}"],
  // ── wo ──
  ["f_wo1", "\u6DA1", "w\u014D", "pusaran", "\u{1F300}"],
  ["f_wo3", "\u6211", "w\u01D2", "saya", "\u{1F64B}"],
  ["f_wo4", "\u5367", "w\xF2", "berbaring", "\u{1F6CC}"],
  // ── wu ──
  ["f_wu1", "\u5C4B", "w\u016B", "rumah / kamar", "\u{1F3E0}"],
  ["f_wu2", "\u65E0", "w\xFA", "tanpa / tidak ada", "\u{1F6AB}"],
  ["f_wu3", "\u4E94", "w\u01D4", "lima", "5\uFE0F\u20E3"],
  ["f_wu4", "\u8BEF", "w\xF9", "salah / kesalahan", "\u274C"],
  // ── xi ──
  ["f_xi1", "\u897F", "x\u012B", "barat", "\u{1F9ED}"],
  ["f_xi2", "\u5E2D", "x\xED", "tikar / kursi", "\u{1FA91}"],
  ["f_xi3", "\u6D17", "x\u01D0", "mencuci", "\u{1F9FC}"],
  ["f_xi4", "\u620F", "x\xEC", "drama / permainan", "\u{1F3AD}"],
  // ── xia ──
  ["f_xia1", "\u867E", "xi\u0101", "udang", "\u{1F990}"],
  ["f_xia2", "\u4FA0", "xi\xE1", "ksatria", "\u2694\uFE0F"],
  ["f_xia4", "\u4E0B", "xi\xE0", "bawah / turun", "\u2B07\uFE0F"],
  // ── xian ──
  ["f_xian1", "\u5148", "xi\u0101n", "dulu / pertama", "\u{1F947}"],
  ["f_xian2", "\u95F2", "xi\xE1n", "senggang", "\u2615"],
  ["f_xian3", "\u663E", "xi\u01CEn", "terlihat jelas", "\u{1F50D}"],
  ["f_xian4", "\u73B0", "xi\xE0n", "sekarang / tunjukkan", "\u{1F4CD}"],
  // ── xiang ──
  ["f_xiang1", "\u9999", "xi\u0101ng", "wangi", "\u{1F338}"],
  ["f_xiang2", "\u7BB1", "xi\u0101ng", "kotak", "\u{1F4E6}"],
  ["f_xiang3", "\u60F3", "xi\u01CEng", "ingin / berpikir", "\u{1F4AD}"],
  ["f_xiang4", "\u5411", "xi\xE0ng", "arah / ke arah", "\u{1F9ED}"],
  // ── xiao ──
  ["f_xiao1", "\u524A", "xi\u0101o", "mengupas", "\u{1F52A}"],
  ["f_xiao2", "\u6DC6", "xi\xE1o", "mencampur (bingung)", "\u{1F300}"],
  ["f_xiao3", "\u5C0F", "xi\u01CEo", "kecil", "\u{1F42D}"],
  ["f_xiao4", "\u7B11", "xi\xE0o", "tertawa", "\u{1F604}"],
  // ── xie ──
  ["f_xie1", "\u4E9B", "xi\u0113", "beberapa", "\u{1F522}"],
  ["f_xie2", "\u978B", "xi\xE9", "sepatu", "\u{1F45F}"],
  ["f_xie3", "\u5199", "xi\u011B", "menulis", "\u270D\uFE0F"],
  ["f_xie4", "\u87F9", "xi\xE8", "kepiting", "\u{1F980}"],
  // ── xin ──
  ["f_xin1", "\u65B0", "x\u012Bn", "baru", "\u{1F195}"],
  ["f_xin4", "\u4FE1", "x\xECn", "surat / percaya", "\u2709\uFE0F"],
  // ── xing ──
  ["f_xing1", "\u661F", "x\u012Bng", "bintang", "\u2B50"],
  ["f_xing2", "\u884C (boleh: x\xEDng)", "x\xEDng", "boleh / jalan", "\u{1F6B6}"],
  ["f_xing3", "\u9192", "x\u01D0ng", "bangun / sadar", "\u23F0"],
  ["f_xing4", "\u59D3", "x\xECng", "marga", "\u59D3\u6C0F"],
  // ── xiong ──
  ["f_xiong1", "\u5144", "xi\u014Dng", "kakak (formal)", "\u{1F468}"],
  ["f_xiong2", "\u718A", "xi\xF3ng", "beruang", "\u{1F43B}"],
  // ── xiu ──
  ["f_xiu1", "\u4F11", "xi\u016B", "istirahat", "\u{1F3D6}\uFE0F"],
  ["f_xiu3", "\u673D", "xi\u01D4", "lapuk", "\u{1FAB5}"],
  ["f_xiu4", "\u79C0", "xi\xF9", "elegan / unggul", "\u{1F338}"],
  // ── xu ──
  ["f_xu1", "\u9700", "x\u016B", "membutuhkan", "\u{1F198}"],
  ["f_xu2", "\u5F90", "x\xFA", "perlahan", "\u{1F422}"],
  ["f_xu3", "\u8BB8", "x\u01D4", "mengizinkan", "\u2705"],
  ["f_xu4", "\u5E8F", "x\xF9", "urutan", "\u{1F522}"],
  // ── xuan ──
  ["f_xuan1", "\u5BA3", "xu\u0101n", "mengumumkan", "\u{1F4E2}"],
  ["f_xuan2", "\u60AC", "xu\xE1n", "menggantung", "\u{1FA9D}"],
  ["f_xuan3", "\u9009", "xu\u01CEn", "memilih", "\u{1F500}"],
  // ── xue ──
  ["f_xue1", "\u524A (pisau: xu\u0113)", "xu\u0113", "memotong tipis", "\u{1F52A}"],
  ["f_xue2", "\u5B66", "xu\xE9", "belajar", "\u{1F4DA}"],
  ["f_xue3", "\u96EA", "xu\u011B", "salju", "\u2744\uFE0F"],
  ["f_xue4", "\u8840", "xu\xE8", "darah", "\u{1FA78}"],
  // ── xun ──
  ["f_xun1", "\u52CB", "x\u016Bn", "jasa kebesaran", "\u{1F396}\uFE0F"],
  ["f_xun2", "\u5BFB", "x\xFAn", "mencari", "\u{1F50E}"],
  ["f_xun4", "\u8BAF", "x\xF9n", "berita / sinyal", "\u{1F4E1}"],
  // ── ya ──
  ["f_ya1", "\u538B", "y\u0101", "menekan", "\u{1FAF8}"],
  ["f_ya2", "\u7259", "y\xE1", "gigi", "\u{1F9B7}"],
  ["f_ya3", "\u96C5", "y\u01CE", "elegan", "\u{1F9A2}"],
  ["f_ya4", "\u4E9A", "y\xE0", "Asia / kedua", "\u{1F30F}"],
  // ── yan ──
  ["f_yan1", "\u70DF", "y\u0101n", "asap / rokok", "\u{1F6AC}"],
  ["f_yan2", "\u76D0", "y\xE1n", "garam", "\u{1F9C2}"],
  ["f_yan3", "\u773C", "y\u01CEn", "mata", "\u{1F441}\uFE0F"],
  ["f_yan4", "\u5BB4", "y\xE0n", "pesta", "\u{1F389}"],
  // ── yang ──
  ["f_yang1", "\u592E", "y\u0101ng", "tengah", "\u{1F3AF}"],
  ["f_yang2", "\u7F8A", "y\xE1ng", "kambing", "\u{1F410}"],
  ["f_yang3", "\u6C27", "y\u01CEng", "oksigen", "\u{1F4A8}"],
  ["f_yang4", "\u6837", "y\xE0ng", "bentuk / macam", "\u{1F9E9}"],
  // ── yao ──
  ["f_yao1", "\u9080", "y\u0101o", "mengundang", "\u{1F48C}"],
  ["f_yao2", "\u6447", "y\xE1o", "menggoyang", "\u{1F32A}\uFE0F"],
  ["f_yao3", "\u54AC", "y\u01CEo", "menggigit", "\u{1F9B7}"],
  ["f_yao4", "\u94A5", "y\xE0o", "kunci (\u94A5\u5319)", "\u{1F511}"],
  // ── ye ──
  ["f_ye1", "\u6930", "y\u0113", "kelapa", "\u{1F965}"],
  ["f_ye2", "\u7237", "y\xE9", "kakek", "\u{1F474}"],
  ["f_ye3", "\u4E5F", "y\u011B", "juga", "\u2795"],
  ["f_ye4", "\u53F6", "y\xE8", "daun", "\u{1F343}"],
  // ── yi ──
  ["f_yi1", "\u4E00", "y\u012B", "satu", "1\uFE0F\u20E3"],
  ["f_yi2", "\u79FB", "y\xED", "menggeser / pindah", "\u2194\uFE0F"],
  ["f_yi3", "\u6905", "y\u01D0", "kursi", "\u{1FA91}"],
  ["f_yi4", "\u4EBF", "y\xEC", "seratus juta", "\u{1F522}"],
  // ── yin ──
  ["f_yin1", "\u56E0", "y\u012Bn", "karena / sebab", "\u27A1\uFE0F"],
  ["f_yin2", "\u94F6", "y\xEDn", "perak", "\u{1F948}"],
  ["f_yin3", "\u5F15", "y\u01D0n", "menarik / memimpin", "\u{1F9F2}"],
  ["f_yin4", "\u5370", "y\xECn", "mencetak", "\u{1F5A8}\uFE0F"],
  // ── ying ──
  ["f_ying1", "\u82F1", "y\u012Bng", "Inggris / gagah", "\u{1F1EC}\u{1F1E7}"],
  ["f_ying2", "\u8D62", "y\xEDng", "menang", "\u{1F3C6}"],
  ["f_ying3", "\u5F71", "y\u01D0ng", "bayangan / film", "\u{1F3AC}"],
  ["f_ying4", "\u5E94 (menjawab: y\xECng)", "y\xECng", "menjawab", "\u21A9\uFE0F"],
  // ── yo ──
  ["f_yo1", "\u54DF", "y\u014D", "yo (seru)", "\u{1F44B}"],
  // ── yong ──
  ["f_yong1", "\u62E5", "y\u014Dng", "merangkul", "\u{1FAC2}"],
  ["f_yong2", "\u7528", "y\xF2ng", "memakai", "\u{1F6E0}\uFE0F"],
  ["f_yong4", "\u6D8C", "y\u01D2ng", "membubung", "\u{1F30A}"],
  // ── you ──
  ["f_you1", "\u4F18", "y\u014Du", "unggul", "\u{1F947}"],
  ["f_you2", "\u6CB9", "y\xF3u", "minyak", "\u{1F6E2}\uFE0F"],
  ["f_you3", "\u53CB", "y\u01D2u", "teman", "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}"],
  ["f_you4", "\u53C8", "y\xF2u", "lagi / sekali lagi", "\u{1F501}"],
  // ── yu ──
  ["f_yu1", "\u6DE4", "y\u016B", "sedimen", "\u{1F7E4}"],
  ["f_yu2", "\u9C7C", "y\xFA", "ikan", "\u{1F41F}"],
  ["f_yu3", "\u96E8", "y\u01D4", "hujan", "\u{1F327}\uFE0F"],
  ["f_yu4", "\u7389", "y\xF9", "batu giok", "\u{1F48E}"],
  // ── yuan ──
  ["f_yuan1", "\u51A4", "yu\u0101n", "salah tuduh", "\u{1F614}"],
  ["f_yuan2", "\u5143", "yu\xE1n", "yuan / bulat", "\u{1F4B4}"],
  ["f_yuan3", "\u8FDC", "yu\u01CEn", "jauh", "\u{1F6E3}\uFE0F"],
  ["f_yuan4", "\u613F", "yu\xE0n", "berharap / bersedia", "\u{1F320}"],
  // ── yue ──
  ["f_yue1", "\u7EA6", "yu\u0113", "janji / kira-kira", "\u{1F4C5}"],
  ["f_yue4", "\u6708", "yu\xE8", "bulan", "\u{1F319}"],
  // ── yun ──
  ["f_yun1", "\u6655", "y\u016Bn", "pusing", "\u{1F4AB}"],
  ["f_yun2", "\u4E91", "y\xFAn", "awan", "\u2601\uFE0F"],
  ["f_yun4", "\u8FD0", "y\xF9n", "untung / mengangkut", "\u{1F69A}"],
  // ── za ──
  ["f_za1", "\u624E", "z\u0101", "mengikat / menyematkan", "\u{1FAA2}"],
  ["f_za2", "\u7838", "z\xE1", "menghantam", "\u{1F528}"],
  // ── zai ──
  ["f_zai1", "\u707E", "z\u0101i", "bencana", "\u{1F32A}\uFE0F"],
  ["f_zai3", "\u5BB0", "z\u01CEi", "menyembelih", "\u{1F52A}"],
  ["f_zai4", "\u5728", "z\xE0i", "di / sedang", "\u{1F4CD}"],
  // ── zan ──
  ["f_zan1", "\u7C2A", "z\u0101n", "cunduk", "\u{1F48D}"],
  ["f_zan2", "\u54B1", "z\xE1n", "kita", "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}"],
  ["f_zan4", "\u8D5E", "z\xE0n", "memuji / suka", "\u{1F44D}"],
  // ── zang ──
  ["f_zang1", "\u810F (kotor: z\u0101ng)", "z\u0101ng", "kotor", "\u{1F9FC}"],
  ["f_zang4", "\u810F (organ: z\xE0ng)", "z\xE0ng", "organ tubuh", "\u{1FAC0}"],
  // ── zao ──
  ["f_zao1", "\u906D", "z\u0101o", "mengalami", "\u{1F631}"],
  ["f_zao2", "\u51FF", "z\xE1o", "mengebor", "\u26CF\uFE0F"],
  ["f_zao3", "\u67A3", "z\u01CEo", "kurma", "\u{1FAD8}"],
  ["f_zao4", "\u7682", "z\xE0o", "sabun", "\u{1F9FC}"],
  // ── ze ──
  ["f_ze2", "\u5219", "z\xE9", "aturan / maka", "\u{1F4CF}"],
  // ── zei ──
  ["f_zei2", "\u8D3C", "z\xE9i", "pencuri", "\u{1F977}"],
  // ── zen ──
  ["f_zen3", "\u600E", "z\u011Bn", "bagaimana", "\u2753"],
  // ── zeng ──
  ["f_zeng1", "\u589E", "z\u0113ng", "menambah", "\u{1F4C8}"],
  ["f_zeng4", "\u8D60", "z\xE8ng", "memberi hadiah", "\u{1F381}"],
  // ── zha ──
  ["f_zha1", "\u624E (menusuk: zh\u0101)", "zh\u0101", "menusuk", "\u{1F4CC}"],
  ["f_zha2", "\u95F8", "zh\xE1", "pintu air", "\u{1F6A7}"],
  ["f_zha3", "\u7728", "zh\u01CE", "berkedip", "\u{1F441}\uFE0F"],
  ["f_zha4", "\u69A8", "zh\xE0", "memeras", "\u{1F9C3}"],
  // ── zhai ──
  ["f_zhai1", "\u6458", "zh\u0101i", "memetik", "\u{1F352}"],
  ["f_zhai2", "\u5B85", "zh\xE1i", "rumah tinggal", "\u{1F3E0}"],
  ["f_zhai3", "\u7A84", "zh\u01CEi", "sempit", "\u{1F4CF}"],
  // ── zhan ──
  ["f_zhan1", "\u6CBE", "zh\u0101n", "terkena", "\u{1F4A7}"],
  ["f_zhan2", "\u76CF", "zh\u01CEn", "lampu (kata bantu)", "\u{1F4A1}"],
  ["f_zhan3", "\u65A9", "zh\u01CEn", "menebas", "\u2694\uFE0F"],
  ["f_zhan4", "\u7AD9", "zh\xE0n", "stasiun / berdiri", "\u{1F689}"],
  // ── zhang ──
  ["f_zhang1", "\u5F20", "zh\u0101ng", "(kata bantu datar)", "\u{1F4C4}"],
  ["f_zhang3", "\u957F (kepala: zh\u01CEng)", "zh\u01CEng", "tumbuh / kepala", "\u{1F4CF}"],
  ["f_zhang4", "\u8D26", "zh\xE0ng", "tagihan", "\u{1F9FE}"],
  // ── zhao ──
  ["f_zhao1", "\u62DB", "zh\u0101o", "mengundang / gerakan", "\u{1F44B}"],
  ["f_zhao2", "\u7740 (menyala: zh\xE1o)", "zh\xE1o", "menyala / kena", "\u{1F525}"],
  ["f_zhao3", "\u627E", "zh\u01CEo", "mencari", "\u{1F50E}"],
  ["f_zhao4", "\u7167", "zh\xE0o", "foto / sesuai", "\u{1F4F7}"],
  // ── zhe ──
  ["f_zhe1", "\u6298", "zh\xE9", "melipat / diskon", "\u{1F3F7}\uFE0F"],
  ["f_zhe5", "\u7740 (sedang: zhe)", "zhe", "(partikel sedang)", "\u{1F501}"],
  // ── zhen ──
  ["f_zhen1", "\u771F", "zh\u0113n", "benar / sungguh", "\u{1F4AF}"],
  ["f_zhen3", "\u8BCA", "zh\u011Bn", "memeriksa (dokter)", "\u{1FA7A}"],
  ["f_zhen4", "\u9635", "zh\xE8n", "gelombang / formasi", "\u{1F32C}\uFE0F"],
  // ── zheng ──
  ["f_zheng1", "\u4E89", "zh\u0113ng", "berebut", "\u{1F947}"],
  ["f_zheng3", "\u6574", "zh\u011Bng", "utuh / tepat", "\u{1F9EE}"],
  ["f_zheng4", "\u8BC1", "zh\xE8ng", "bukti / sertifikat", "\u{1FAAA}"],
  // ── zhi ──
  ["f_zhi1", "\u4E4B", "zh\u012B", "(partikel milik klasik)", "\u{1F517}"],
  ["f_zhi2", "\u76F4", "zh\xED", "lurus / terus", "\u{1F4CF}"],
  ["f_zhi3", "\u7EB8", "zh\u01D0", "kertas", "\u{1F4C4}"],
  ["f_zhi4", "\u81F3", "zh\xEC", "sampai", "\u{1F3C1}"],
  // ── zhong ──
  ["f_zhong1", "\u4E2D", "zh\u014Dng", "tengah", "\u{1F3AF}"],
  ["f_zhong3", "\u79CD (jenis: zh\u01D2ng)", "zh\u01D2ng", "jenis / benih", "\u{1F331}"],
  ["f_zhong4", "\u91CD (berat: zh\xF2ng)", "zh\xF2ng", "berat", "\u{1F3CB}\uFE0F"],
  // ── zhou ──
  ["f_zhou1", "\u5468", "zh\u014Du", "pekan / keliling", "\u{1F4C6}"],
  ["f_zhou2", "\u8F74", "zh\xF3u", "poros", "\u2699\uFE0F"],
  ["f_zhou3", "\u8098", "zh\u01D2u", "siku", "\u{1F4AA}"],
  ["f_zhou4", "\u76B1", "zh\xF2u", "kerut", "\u{1F474}"],
  // ── zhu ──
  ["f_zhu1", "\u732A", "zh\u016B", "babi", "\u{1F437}"],
  ["f_zhu2", "\u7AF9", "zh\xFA", "bambu", "\u{1F38D}"],
  ["f_zhu3", "\u716E", "zh\u01D4", "merebus", "\u{1F372}"],
  ["f_zhu4", "\u4F4F", "zh\xF9", "tinggal", "\u{1F3D8}\uFE0F"],
  // ── zhua ──
  ["f_zhua1", "\u6293", "zhu\u0101", "meraih / mencengkeram", "\u{1F90F}"],
  // ── zhuai ──
  ["f_zhuai3", "\u62FD (zhu\u01CEi)", "zhu\u01CEi", "mengibas / gaya kampung", "\u{1F93E}"],
  // ── zhuan ──
  ["f_zhuan1", "\u4E13", "zhu\u0101n", "khusus / fokus", "\u{1F3AF}"],
  ["f_zhuan3", "\u8F6C (berputar: zhu\u01CEn)", "zhu\u01CEn", "berputar", "\u{1F504}"],
  ["f_zhuan4", "\u8F6C (memutar: zhu\xE0n)", "zhu\xE0n", "memutar", "\u{1F504}"],
  // ── zhuang ──
  ["f_zhuang1", "\u88C5", "zhu\u0101ng", "memasang / berpura-pura", "\u{1F4E6}"],
  ["f_zhuang4", "\u58EE", "zhu\xE0ng", "kuat / gagah", "\u{1F4AA}"],
  // ── zhui ──
  ["f_zhui1", "\u8FFD", "zhu\u012B", "mengejar", "\u{1F3C3}"],
  ["f_zhui4", "\u5760", "zhu\xEC", "jatuh", "\u{1FA82}"],
  // ── zhun ──
  ["f_zhun3", "\u51C6", "zh\u01D4n", "tepat / mengizinkan", "\u{1F3AF}"],
  // ── zhuo ──
  ["f_zhuo1", "\u684C", "zhu\u014D", "meja", "\u{1FAB5}"],
  ["f_zhuo2", "\u6D4A", "zhu\xF3", "keruh", "\u{1F30A}"],
  // ── zi ──
  ["f_zi1", "\u8D44", "z\u012B", "modal / pengalaman", "\u{1F4B0}"],
  ["f_zi3", "\u5B50", "z\u01D0", "anak / benih", "\u{1F476}"],
  ["f_zi4", "\u81EA", "z\xEC", "sendiri", "\u{1F933}"],
  // ── zong ──
  ["f_zong1", "\u5B97", "z\u014Dng", "klan / utama", "\u{1F3DB}\uFE0F"],
  ["f_zong3", "\u603B", "z\u01D2ng", "total / selalu", "\u{1F9EE}"],
  // ── zou ──
  ["f_zou1", "\u90B9", "z\u014Du", "nama marga", "\u59D3\u6C0F"],
  ["f_zou3", "\u8D70", "z\u01D2u", "berjalan", "\u{1F6B6}"],
  // ── zu ──
  ["f_zu1", "\u79DF", "z\u016B", "menyewa", "\u{1F511}"],
  ["f_zu2", "\u65CF", "z\xFA", "suku / kelompok", "\u{1F465}"],
  ["f_zu3", "\u963B", "z\u01D4", "menghalangi", "\u{1F6A7}"],
  // ── zuan ──
  ["f_zuan1", "\u94BB (mengebor)", "zu\u0101n", "mengebor", "\u26CF\uFE0F"],
  ["f_zuan4", "\u94BB (batu: zu\xE0n)", "zu\xE0n", "bor / permata", "\u{1F48E}"],
  // ── zui ──
  ["f_zui3", "\u5634", "zu\u01D0", "mulut", "\u{1F444}"],
  ["f_zui4", "\u6700", "zu\xEC", "paling", "\u{1F947}"],
  // ── zun ──
  ["f_zun1", "\u5C0A", "z\u016Bn", "menghormati", "\u{1F64F}"],
  // ── zuo ──
  ["f_zuo1", "\u4F5C", "zu\u014D", "membuat (zu\xF2)", "\u{1F528}"],
  ["f_zuo3", "\u5DE6", "zu\u01D2", "kiri", "\u2B05\uFE0F"],
  ["f_zuo4", "\u5750", "zu\xF2", "duduk", "\u{1FA91}"]
];
function buildToneFillers() {
  return FILLERS.map(
    ([id, hanzi, pinyin, arti, emoji, imageKey]) => w(id, 1, hanzi, pinyin, [arti], null, {
      pos: "di luar HSK",
      emoji: emoji || "\u{1F202}\uFE0F",
      imageKey
    })
  ).map((word) => ({ ...word, hskLevel: 0 }));
}

// src/services/chinese/dataset/index.ts
var FULL_HSK_DATASET = [
  ...HSK1_WORDS,
  ...HSK2_WORDS,
  ...HSK3_WORDS,
  ...buildToneFillers()
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FULL_HSK_DATASET,
  HSK1_WORDS,
  HSK2_WORDS,
  HSK3_WORDS,
  buildToneFillers
});
