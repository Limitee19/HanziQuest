// ankiTranslation.ts
// Penerjemah arti Inggris → Indonesia untuk kartu hasil impor .apkg.
// Karakter Hanzi, Pinyin (latin bertanda), dan struktur HTML TIDAK diubah —
// hanya teks Inggris yang diterjemahkan berdasarkan kamus bawaan (offline).

/** Kamus frasa (dicek duluan, longest-first) */
const PHRASE_DICTIONARY: Record<string, string> = {
  // Frasa Dan ungkapan umum di deck HSK
  'how are you': 'apa kabar',
  'nice to meet you': 'senang berkenalan',
  'thank you': 'terima kasih',
  'thanks a lot': 'banyak terima kasih',
  'excuse me': 'permisi',
  'im sorry': 'maaf',
  "i'm sorry": 'maaf',
  'good morning': 'selamat pagi',
  'good afternoon': 'selamat siang',
  'good evening': 'selamat malam',
  'good night': 'selamat tidur',
  'see you': 'sampai jumpa',
  'goodbye': 'selamat tinggal',
  'by the way': 'ngomong-ngomong',
  'of course': 'tentu saja',
  'a little': 'sedikit',
  'a lot': 'banyak',
  'very much': 'sangat banyak',
  'not at all': 'tidak sama sekali',
  'a bit': 'sedikit',
  'each other': 'saling',
  'for example': 'misalnya',
  'for instance': 'misalnya',
  'in front of': 'di depan',
  'in the middle': 'di tengah',
  'next to': 'di sebelah',
  'because of': 'karena',
  'so that': 'agar',
  'in order to': 'untuk',
  'have to': 'harus',
  'must not': 'tidak boleh',
  'dont have': 'tidak punya',
  "don't have": 'tidak punya',
  'there is': 'ada',
  'there are': 'ada',
  'how many': 'berapa',
  'how much': 'berapa',
  'what time': 'jam berapa',
  'which one': 'yang mana',
  'every day': 'setiap hari',
  'every week': 'setiap minggu',
  'every month': 'setiap bulan',
  'every year': 'setiap tahun',
  'last week': 'minggu lalu',
  'next week': 'minggu depan',
  'last year': 'tahun lalu',
  'next year': 'tahun depan',
  'this year': 'tahun ini',
  'this week': 'minggu ini',
  'right now': 'sekarang',
  'a while': 'sebentar',
  'a moment': 'sebentar',
  'together with': 'bersama',
  'as well': 'juga',
  'too much': 'terlalu banyak',
  'no problem': 'tidak masalah',
  'be careful': 'hati-hati',
  'take care': 'hati-hati',
  'welcome': 'selamat datang',
  'please': 'silakan',
  'happy birthday': 'selamat ulang tahun',
  'new year': 'tahun baru',
  'middle school': 'sekolah menengah',
  'high school': 'sekolah menengah atas',
  'primary school': 'sekolah dasar',
  'university student': 'mahasiswa',
  'college student': 'mahasiswa',
  'phone number': 'nomor telepon',
  'cell phone': 'ponsel',
  'mobile phone': 'ponsel',
  'computer': 'komputer',
  'television': 'televisi',
  'air conditioning': 'AC',
  'public bus': 'bus',
  'taxi': 'taksi',
  'train station': 'stasiun kereta',
  'bus station': 'terminal bus',
  'airport': 'bandara',
  // Frasa penutup jurang terjemahan (hasil impor lama masih campur)
  'years old': 'tahun',
  'at once': 'langsung',
  'right away': 'segera',
  'with regard to': 'mengenai',
  'in regard to': 'mengenai',
  'as regards': 'mengenai',
  "i'm going to": 'saya akan',
  'i am going to': 'saya akan',
  'going to': 'akan',
  'break up': 'putus',
  'even if': 'bahkan jika',
  'even though': 'meskipun',
  'want to': 'ingin',
  'has to': 'harus',
  'had to': 'harus',
  'a lot of': 'banyak',
  'lots of': 'banyak',
  'kind of': 'agak',
  'used to': 'biasa',
  'supposed to': 'seharusnya',
  'about to': 'hampir',
  'have got': 'punya',
  'such as': 'seperti',
  'as soon as': 'segera setelah',
  'as well as': 'serta',
};

/** Kamus kata tunggal Dan kata kerja umum */
const WORD_DICTIONARY: Record<string, string> = {
  // Kata ganti Dan dasar
  i: 'saya', me: 'saya', my: 'saya', mine: 'milik saya',
  you: 'kamu', your: 'kamu', yours: 'milikmu',
  he: 'dia (laki-laki)', him: 'dia (laki-laki)', his: 'miliknya (lk)',
  she: 'dia (perempuan)', her: 'dia (perempuan)', hers: 'miliknya (pr)',
  it: 'itu', its: 'miliknya',
  we: 'kami', us: 'kami', our: 'milik kami',
  they: 'mereka', them: 'mereka', their: 'milik mereka',
  this: 'ini', that: 'itu', these: 'ini', those: 'itu',
  here: 'di sini', there: 'di sana',
  who: 'siapa', what: 'apa', where: 'di mana', when: 'kapan', why: 'mengapa', how: 'bagaimana',
  yes: 'ya', no: 'tidak', not: 'tidak', nope: 'tidak',
  and: 'dan', or: 'atau', but: 'tetapi', if: 'jika', because: 'karena',
  so: 'jadi', also: 'juga', too: 'juga', very: 'sangat', really: 'benar-benar',
  all: 'semua', some: 'beberapa', any: 'apa pun', few: 'sedikit', many: 'banyak', much: 'banyak',
  more: 'lebih', most: 'paling', less: 'kurang', least: 'paling sedikit',
  now: 'sekarang', then: 'lalu', today: 'hari ini', tomorrow: 'besok', yesterday: 'kemarin',
  always: 'selalu', never: 'tidak pernah', often: 'sering', sometimes: 'kadang-kadang',
  again: 'lagi', still: 'masih', already: 'sudah', yet: 'belum', just: 'baru saja',
  // Kata kerja umum (bentuk dasar + umum)
  is: 'adalah', are: 'adalah', am: 'adalah', was: 'adalah (lampau)', were: 'adalah (lampau)',
  be: 'menjadi', been: 'telah', being: 'sedang',
  have: 'punya', has: 'punya', had: 'punya (lampau)',
  do: 'melakukan', does: 'melakukan', did: 'melakukan (lampau)', done: 'selesai',
  can: 'bisa', could: 'dapat', will: 'akan', would: 'akan', shall: 'akan', should: 'sebaiknya',
  may: 'boleh', might: 'mungkin', must: 'harus',
  go: 'pergi', goes: 'pergi', went: 'pergi (lampau)', gone: 'pergi',
  come: 'datang', comes: 'datang', came: 'datang (lampau)',
  eat: 'makan', eats: 'makan', ate: 'makan (lampau)', eaten: 'makan',
  drink: 'minum', drinks: 'minum', drank: 'minum (lampau)',
  see: 'melihat', sees: 'melihat', saw: 'melihat (lampau)', seen: 'melihat',
  look: 'melihat', looks: 'melihat', looked: 'melihat',
  watch: 'menonton', watched: 'menonton',
  listen: 'mendengarkan', listened: 'mendengarkan', hear: 'mendengar', heard: 'mendengar',
  speak: 'berbicara', speaks: 'berbicara', spoke: 'berbicara', talk: 'berbicara', talked: 'berbicara',
  say: 'berkata', said: 'berkata', tell: 'memberi tahu', told: 'memberi tahu',
  read: 'membaca', reads: 'membaca', write: 'menulis', wrote: 'menulis', written: 'menulis',
  learn: 'belajar', learns: 'belajar', learned: 'belajar', learnt: 'belajar', study: 'belajar', studied: 'belajar',
  teach: 'mengajar', taught: 'mengajar', teacher: 'guru', student: 'murid',
  work: 'bekerja', works: 'bekerja', worked: 'bekerja', job: 'pekerjaan',
  play: 'bermain', played: 'bermain', game: 'permainan',
  buy: 'membeli', bought: 'membeli', sell: 'menjual', sold: 'menjual',
  give: 'memberi', gave: 'memberi', given: 'memberi', take: 'mengambil', took: 'mengambil', taken: 'mengambil',
  make: 'membuat', made: 'membuat', build: 'membangun', built: 'membangun',
  know: 'tahu', knows: 'tahu', knew: 'tahu', known: 'tahu',
  think: 'pikir', thought: 'pikir', feel: 'merasa', felt: 'merasa',
  want: 'ingin', wants: 'ingin', wanted: 'ingin', need: 'butuh', needs: 'butuh', needed: 'butuh',
  like: 'suka', likes: 'suka', loved: 'menyukai', love: 'menyukai', loves: 'menyukai',
  hate: 'benci', hope: 'berharap', wish: 'berharap',
  sleep: 'tidur', slept: 'tidur', wake: 'bangun', woke: 'bangun', rest: 'istirahat',
  live: 'tinggal', lives: 'tinggal', lived: 'tinggal', stay: 'tinggal', stayed: 'tinggal',
  walk: 'berjalan', walked: 'berjalan', run: 'berlari', ran: 'berlari',
  sit: 'duduk', stand: 'berdiri', stood: 'berdiri',
  open: 'buka', opened: 'membuka', close: 'tutup', closed: 'menutup',
  start: 'mulai', started: 'mulai', begin: 'mulai', began: 'mulai', finish: 'selesai', finished: 'selesai', end: 'akhir',
  help: 'membantu', helped: 'membantu', use: 'menggunakan', used: 'menggunakan',
  find: 'menemukan', found: 'menemukan', lose: 'kehilangan', lost: 'kehilangan',
  wait: 'menunggu', waited: 'menunggu', meet: 'bertemu', met: 'bertemu',
  ask: 'bertanya', asked: 'bertanya', answer: 'menjawab', answered: 'menjawab', reply: 'membalas',
  call: 'menelepon', called: 'menelepon', phone: 'telepon',
  send: 'mengirim', sent: 'mengirim', receive: 'menerima', get: 'mendapat', got: 'mendapat', gotten: 'mendapat',
  put: 'meletakkan', bring: 'membawa', brought: 'membawa', carry: 'membawa',
  return: 'kembali', returned: 'kembali', change: 'mengubah', changed: 'mengubah',
  try: 'mencoba', tried: 'mencoba', practice: 'berlatih', practiced: 'berlatih',
  remember: 'ingat', forget: 'lupa', forgot: 'lupa', forgotten: 'lupa',
  understand: 'mengerti', understood: 'mengerti', explain: 'menjelaskan', explained: 'menjelaskan',
  sing: 'menyanyi', sang: 'menyanyi', dance: 'menari', draw: 'menggambar', drew: 'menggambar',
  swim: 'berenang', fly: 'terbang', drive: 'menyetir', drove: 'menyetir', ride: 'naik', rode: 'naik',
  travel: 'bepergian', traveled: 'bepergian', visit: 'mengunjungi', visited: 'mengunjungi',
  arrive: 'tiba', arrived: 'tiba', leave: 'pergi', left: 'pergi (lampau)', enter: 'masuk', exit: 'keluar',
  wear: 'memakai', wore: 'memakai', wash: 'mencuci', clean: 'membersihkan', cook: 'memasak', cooked: 'memasak',
  // Kata benda umum
  time: 'waktu', year: 'tahun', month: 'bulan', week: 'minggu', day: 'hari', hour: 'jam', minute: 'menit', second: 'detik',
  morning: 'pagi', afternoon: 'siang', evening: 'malam', night: 'malam', midnight: 'tengah malam',
  today_: 'hari ini', monday: 'Senin', tuesday: 'Selasa', wednesday: 'Rabu', thursday: 'Kamis',
  friday: 'Jumat', saturday: 'Sabtu', sunday: 'Minggu',
  person: 'orang', people: 'orang-orang', man: 'pria', woman: 'wanita', men: 'pria', women: 'wanita',
  friend: 'teman', friends: 'teman-teman', family: 'keluarga', mother: 'ibu', father: 'ayah', mom: 'ibu', dad: 'ayah',
  brother: 'kakak/adik laki-laki', sister: 'kakak/adik perempuan', son: 'anak laki-laki', daughter: 'anak perempuan',
  child: 'anak', children: 'anak-anak', kid: 'anak', baby: 'bayi', parent: 'orang tua', parents: 'orang tua',
  home: 'rumah', house: 'rumah', room: 'kamar', school: 'sekolah', class: 'kelas', classroom: 'ruang kelas',
  office: 'kantor', hospital: 'rumah sakit', store: 'toko', shop: 'toko', market: 'pasar', restaurant: 'restoran',
  hotel: 'hotel', bank: 'bank', church: 'gereja', city: 'kota', town: 'kota kecil', country: 'negara', village: 'desa',
  water: 'air', food: 'makanan', rice: 'nasi', tea: 'teh', coffee: 'kopi', milk: 'susu', beer: 'bir', wine: 'anggur',
  bread: 'roti', egg: 'telur', eggs: 'telur', meat: 'daging', fish: 'ikan', chicken: 'ayam', fruit: 'buah',
  apple: 'apel', banana: 'pisang', orange: 'jeruk', vegetable: 'sayur', soup: 'sup', sugar: 'gula', salt: 'garam',
  book: 'buku', books: 'buku-buku', pen: 'pulpen', pencil: 'pensil', paper: 'kertas', letter: 'surat',
  word: 'kata', words: 'kata-kata', sentence: 'kalimat', question: 'pertanyaan', name: 'nama',
  language: 'bahasa', chinese: 'bahasa Mandarin', english: 'bahasa Inggris', character: ' karakter Hanzi',
  money: 'uang', price: 'harga', dollar: 'dolar', yuan: 'yuan',
  car: 'mobil', bus: 'bus', train: 'kereta', plane: 'pesawat', bicycle: 'sepeda', bike: 'sepeda', boat: 'perahu', ship: 'kapal',
  road: 'jalan', street: 'jalan', way: 'jalan', door: 'pintu', window: 'jendela', table: 'meja', chair: 'kursi',
  bed: 'tempat tidur', bag: 'tas', clothes: 'pakaian', shirt: 'kemeja', shoes: 'sepatu', hat: 'topi',
  phone_: 'telepon', key: 'kunci', picture: 'gambar', photo: 'foto', movie: 'film', music: 'musik', song: 'lagu',
  dog: 'anjing', cat: 'kucing', bird: 'burung', tree: 'pohon', flower: 'bunga', mountain: 'gunung', river: 'sungai',
  sea: 'laut', sky: 'langit', sun: 'matahari', moon: 'bulan (satelit)', star: 'bintang', rain: 'hujan', snow: 'salju',
  wind: 'angin', weather: 'cuaca', fire: 'api', air: 'udara', earth: 'bumi',
  hand: 'tangan', head: 'kepala', eye: 'mata', eyes: 'mata', ear: 'telinga', nose: 'hidung', mouth: 'mulut',
  foot: 'kaki', feet: 'kaki', face: 'wajah', hair: 'rambut', heart: 'jantung', body: 'tubuh',
  life: 'hidup', world: 'dunia', thing: 'hal', things: 'hal-hal', something: 'sesuatu', nothing: 'tidak ada apa-apa',
  everything: 'segalanya', everyone: 'semua orang', somebody: 'seseorang', nobody: 'tidak seorang pun',
  place: 'tempat', reason: 'alasan', problem: 'masalah', question_: 'pertanyaan', idea: 'ide',
  number: 'angka', half: 'setengah', quarter: 'seperempat', hundred: 'ratus', thousand: 'ribu', million: 'juta',
  one: 'satu', two: 'dua', three: 'tiga', four: 'empat', five: 'lima', six: 'enam', seven: 'tujuh',
  eight: 'delapan', nine: 'sembilan', ten: 'sepuluh', eleven: 'sebelas', twelve: 'dua belas',
  twenty: 'dua puluh', thirty: 'tiga puluh', fifty: 'lima puluh', first: 'pertama', second_: 'kedua', third: 'ketiga',
  zero: 'nol',
  big: 'besar', small: 'kecil', little: 'kecil', long: 'panjang', short: 'pendek', tall: 'tinggi',
  new: 'baru', old: 'tua/lama', young: 'muda', good: 'baik', bad: 'buruk', great: 'hebat',
  hot: 'panas', cold: 'dingin', warm: 'hangat', cool: 'sejuk', fast: 'cepat', quick: 'cepat', slow: 'lambat',
  easy: 'mudah', difficult: 'sulit', hard: 'sulit', simple: 'sederhana', important: 'penting',
  beautiful: 'cantik', pretty: 'cantik', handsome: 'tampan', happy: 'senang', sad: 'sedih', angry: 'marah',
  tired: 'lelah', hungry: 'lapar', thirsty: 'haus', sick: 'sakit', healthy: 'sehat', busy: 'sibuk', free: 'bebas',
  right: 'benar', wrong: 'salah', true: 'benar', false: 'salah', same: 'sama', different: 'berbeda',
  high: 'tinggi', low: 'rendah', cheap: 'murah', expensive: 'mahal', rich: 'kaya', poor: 'miskin',
  early: 'pagi/awal', late: 'terlambat', ready: 'siap', open_: 'buka', closed_: 'tutup', full: 'penuh', empty: 'kosong',
  white: 'putih', black: 'hitam', red: 'merah', blue: 'biru', green: 'hijau', yellow: 'kuning',
  other: 'lain', others: 'yang lain', another: 'yang lain', such: 'seperti', only: 'hanya', own: 'sendiri',
  about: 'tentang', against: 'melawan', between: 'antara', among: 'di antara', before: 'sebelum', after: 'setelah',
  during: 'selama', since: 'sejak', until: 'sampai', while: 'sementara', near: 'dekat', far: 'jauh',
  inside: 'di dalam', outside: 'di luar', above: 'di atas', below: 'di bawah', under: 'di bawah', over: 'di atas',
  with: 'dengan', without: 'tanpa', from: 'dari', to: 'ke', at: 'di', in: 'di', on: 'di', of: 'dari',
  please_: 'silakan', thanks: 'terima kasih', hello: 'halo', hi: 'hai', hey: 'hei',
  mr: 'Tuan', mrs: 'Nyonya', ms: 'Nona', sir: 'Tuan', sir_: 'Tuan', madam: 'Nyonya',
  doctor: 'dokter', driver: 'sopir', farmer: 'petani', worker: 'pekerja', manager: 'manajer',
  police: 'polisi', soldier: 'tentara', nurse: 'perawat', lawyer: 'pengacara', engineer: 'insinyur',
  husband: 'suami', wife: 'istri', grandpa: 'kakek', grandma: 'nenek', grandfather: 'kakek', grandmother: 'nenek',
  birthday: 'ulang tahun', holiday: 'liburan', vacation: 'liburan', trip: 'perjalanan', journey: 'perjalanan',
  test: 'ujian', exam: 'ujian', lesson: 'pelajaran', homework: 'pekerjaan rumah', subject: 'mata pelajaran',
  history: 'sejarah', math: 'matematika', science: 'sains', art: 'seni', sport: 'olahraga', sports: 'olahraga',
  ball: 'bola', basketball: 'basket', football: 'sepak bola', swimming: 'berenang', running: 'berlari',
  news: 'berita', story: 'cerita', stories: 'cerita-cerita', dream: 'mimpi', plan: 'rencana', future: 'masa depan',
  past: 'masa lalu', present: 'hadiah/kini', gift: 'hadiah', present_: 'hadiah',
  sound: 'suara', voice: 'suara', noise: 'kebisingan', color: 'warna', light: 'cahaya', dark: 'gelap',
  night_: 'malam', dream_: 'mimpi',
  // Kontraksi Dan kata kerja bantu (paling sering menyisakan Inggris di kartu impor)
  "don't": 'tidak', "doesn't": 'tidak', "didn't": 'tidak', "won't": 'tidak akan',
  "can't": 'tidak bisa', cannot: 'tidak bisa', "isn't": 'bukan', "aren't": 'bukan',
  "wasn't": 'tidak', "weren't": 'tidak', "hasn't": 'belum', "haven't": 'belum',
  "hadn't": 'belum', "couldn't": 'tidak dapat', "shouldn't": 'tidak sebaiknya',
  "wouldn't": 'tidak akan', "mustn't": 'tidak boleh',
  "it's": 'itu', "that's": 'itu', "what's": 'apa', "there's": 'ada',
  "he's": 'dia', "she's": 'dia', "i'm": 'saya', "you're": 'kamu', "we're": 'kami',
  "they're": 'mereka', "i've": 'saya telah', "we've": 'kami telah', "they've": 'mereka telah',
  "i'll": 'saya akan', "you'll": 'kamu akan', "he'll": 'dia akan', "she'll": 'dia akan',
  "we'll": 'kami akan', "they'll": 'mereka akan',
  // Adverbia Dan kata fungsi yang sering muncul di glosarium HSK
  once: 'sekali', twice: 'dua kali', age: 'usia', even: 'bahkan', ever: 'pernah',
  perhaps: 'mungkin', together: 'bersama', toward: 'ke arah', towards: 'ke arah',
  upon: 'di atas', within: 'di dalam', whether: 'apakah', though: 'meskipun',
  although: 'walaupun', however: 'namun', therefore: 'oleh karena itu',
  instead: 'sebagai gantinya', rather: 'cukup', quite: 'cukup', almost: 'hampir',
  enough: 'cukup', else: 'lain', several: 'beberapa', both: 'keduanya',
  which: 'yang mana', whose: 'milik siapa', regard: 'perhatian', regarding: 'mengenai',
  soon: 'segera', later: 'nanti', usually: 'biasanya', normally: 'biasanya',
  rarely: 'jarang', seldom: 'jarang', immediately: 'segera', suddenly: 'tiba-tiba',
  quickly: 'dengan cepat', slowly: 'dengan perlahan', everywhere: 'di mana-mana',
  anywhere: 'di mana saja', somewhere: 'di suatu tempat',
  // ── Penutup sisa glosarium/kalimat HSK yang masih lolos (audit DB 2026-09) ──
  'commutes': 'berangkat kerja', 'commute': 'berangkat kerja', 'on foot': 'jalan kaki',
  'disassembling': 'membongkar', 'fingernails': 'kuku', 'overcoat': 'mantel',
  'smiling': 'tersenyum', 'strawberries': 'stroberi', 'wristwatch': 'jam tangan',
  'pedestrians': 'pejalan kaki', 'entrance': 'pintu masuk',
  'passport': 'paspor', 'climbing': 'mendaki', 'sunrise': 'matahari terbit',
  'talking': 'berbicara', 'walking': 'berjalan',
  'waiting': 'menunggu', 'watching': 'menonton', 'studying': 'belajar',
  'supermarket': 'supermarket', 'phone number': 'nomor telepon',
  'library': 'perpustakaan',
};

const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
const PINYIN_TONE_REGEX = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

/** Normalisasi kunci frasa: lowercase, buang tanda baca ganda */
function normalizePhrase(s: string): string {
  return s.toLowerCase().replace(/[^a-z\s']/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Bangun peta lookup gabungan (frasa dulu, lalu kata) */
const LOOKUP: { key: string; value: string; isPhrase: boolean }[] = [
  ...Object.entries(PHRASE_DICTIONARY).map(([k, v]) => ({ key: normalizePhrase(k), value: v, isPhrase: true })),
  ...Object.entries(WORD_DICTIONARY).map(([k, v]) => ({ key: k.toLowerCase().replace(/_$/, ''), value: v, isPhrase: false })),
].sort((a, b) => b.key.length - a.key.length);

/**
 * Menerjemahkan satu segmen teks polos (tanpa tag HTML).
 * Mengembalikan teks asli jika segmen mengandung Hanzi/Pinyin (kemungkinan konten China)
 * ATAU tidak ada kata Inggris yang dikenali.
 */
function translateTextSegment(segment: string): string {
  if (!segment || CJK_REGEX.test(segment)) return segment;
  // Jangan terjemahkan segmen yang berisi pinyin bertanda (konten China)
  if (PINYIN_TONE_REGEX.test(segment)) return segment;
  // Jangan terjemahkan URL / email
  if (/https?:\/\/|www\.|@/.test(segment)) return segment;

  let result = segment;
  let translated = false;

  for (const entry of LOOKUP) {
    if (entry.isPhrase) {
      const regex = new RegExp(`(?<![a-zA-Z])${entry.key.replace(/ /g, '\\s+')}(?![a-zA-Z])`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, entry.value);
        translated = true;
      }
    } else {
      const regex = new RegExp(`(?<![a-zA-Z'])${entry.key}(?![a-zA-Z'])`, 'gi');
      if (regex.test(result)) {
        // Pertahankan kapitalisasi awal
        result = result.replace(regex, (match) => {
          const isCap = match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase();
          const out = entry.value;
          return isCap ? out.charAt(0).toUpperCase() + out.slice(1) : out;
        });
        translated = true;
      }
    }
  }

  return translated ? result : segment;
}

/**
 * Menerjemahkan konten kartu (boleh berisi HTML).
 * Tag HTML, atribut, dan konten di dalam tag TIDAK disentuh.
 * Hanzi Dan pinyin tidak pernah diubah.
 */
export function translateCardContentToIndonesian(html: string): string {
  if (!html) return html;
  // Pisahkan tag HTML dari teks polos
  return html.replace(/([^<]+)|(<[^>]*>)/g, (_match, text, tag) => {
    if (tag) return tag;
    return translateTextSegment(text);
  });
}

// ── Perbaikan kartu lama: arti tercampur Indonesia–Inggris ─────────────────
//
// Kartu hasil impor dengan versi kamus lama menyimpan fragmen rusak seperti
// "di once", "dengan regard ke", "Saya adalah going ke …". Daftar berikut
// memperbaiki persis fragmen-f ragmen itu saat kartu dibaca (import baru tidak
// lagi menghasilkannya).

const FRAGMENT_REPAIRS: [RegExp, string][] = [
  [/\badalah going ke\b/gi, 'akan'],
  [/\bgoing ke\b/gi, 'akan'],
  [/\bgoing to\b/gi, 'akan'],
  [/\bdi once\b/gi, 'langsung'],
  [/\bat once\b/gi, 'langsung'],
  [/\bdengan regard ke\b/gi, 'mengenai'],
  [/\bregard ke\b/gi, 'mengenai'],
  [/\bwith regard to\b/gi, 'mengenai'],
  [/\bbreak up\b/gi, 'putus'],
  [/\byears old\b/gi, 'tahun'],
  [/\bdon't\b/gi, 'tidak'],
  [/\bdoesn't\b/gi, 'tidak'],
  [/\bdidn't\b/gi, 'tidak'],
  [/\bwon't\b/gi, 'tidak akan'],
  [/\bcan't\b/gi, 'tidak bisa'],
  [/\bcannot\b/gi, 'tidak bisa'],
  [/\bisn't\b/gi, 'bukan'],
  [/\baren't\b/gi, 'bukan'],
  [/\bwasn't\b/gi, 'tidak'],
  [/\bweren't\b/gi, 'tidak'],
  [/\bit's\b/gi, 'itu'],
  [/\bthat's\b/gi, 'itu'],
  [/\bhe's\b/gi, 'dia'],
  [/\bshe's\b/gi, 'dia'],
  [/\bi'm\b/gi, 'saya'],
  [/\byou're\b/gi, 'kamu'],
  [/\bwe're\b/gi, 'kami'],
  [/\bthey're\b/gi, 'mereka'],
  [/\bi've\b/gi, 'saya telah'],
  [/\bi'll\b/gi, 'saya akan'],
];

/**
 * Kata/fragmen Inggris umum yang TIDAK boleh tersisa di kartu (pemicu perbaikan).
 * Mencakup kontraksi, sisa frasa kamus lama, dan kata kerja/benda HSK yang
 * sering tertinggal setelah terjemahan parsial.
 */
function textNeedsRepair(plain: string): boolean {
  return /\b(going ke|going to|di once|dengan regard|regard ke|break up|years old|once|regard|age|don't|doesn't|didn't|won't|can't|isn't|aren't|wasn't|weren't|it's|that's|he's|she's|i'm|you're|we're|they're|i've|i'll|\w+'s|let's|o'clock)\b/i.test(plain)
    || /\b(commutes?|disassembling|fingernails|overcoat|pedestrians|passport|climbing|sunrise|walking|waiting|watching|studying|smiling|supermarket|library|station|airport|hotel|restaurant|superlative)\b/i.test(plain);
}

/** Terapkan semua perbaikan fragmen pada satu segmen teks (pertahankan kapital). */
function repairSegment(segment: string): string {
  let out = segment;
  for (const [re, replacement] of FRAGMENT_REPAIRS) {
    out = out.replace(re, (match) => {
      const isCap = match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase();
      return isCap ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
    });
  }
  // Kata Inggris yang tersisa diterjemahkan oleh kamus utama
  return translateTextSegment(out);
}

/**
 * Perbaiki konten kartu (boleh berisi HTML) yang artinya masih tercampur
 * Indonesia–Inggris akibat impor dengan kamus lama. Cukup murah untuk dipanggil
 * setiap kali kartu dibaca: konten yang bersih dilewati tanpa diubah.
 */
export function repairMixedTranslation(html: string): string {
  if (!html || !textNeedsRepair(html.replace(/<[^>]*>/g, ' '))) return html;
  return html.replace(/([^<]+)|(<[^>]*>)/g, (_match, text, tag) => {
    if (tag) return tag;
    if (!text || CJK_REGEX.test(text) || PINYIN_TONE_REGEX.test(text)) return text;
    if (!textNeedsRepair(text)) return text;
    return repairSegment(text);
  });
}

/**
 * Menerjemahkan nama deck: hanya jika tidak mengandung Hanzi/pinyin.
 * cth: "HSK 1 Vocabulary" → "HSK 1 Kosakata"
 */
export function translateDeckNameToIndonesian(name: string): string {
  const COMMON_DECK_WORDS: Record<string, string> = {
    vocabulary: 'Kosakata', vocab: 'Kosakata', words: 'Kata-kata', grammar: 'Tata Bahasa',
    sentences: 'Kalimat', characters: 'Karakter Hanzi', hanzi: 'Karakter Hanzi',
    listening: 'Menyimak', speaking: 'Berbicara', reading: 'Membaca', writing: 'Menulis',
    beginner: 'Pemula', elementary: 'Dasar', intermediate: 'Menengah', advanced: 'Lanjutan',
    standard: 'Standar', course: 'Kursus', lesson: 'Pelajaran', level: 'Level', test: 'Ujian',
    practice: 'Latihan', review: 'Ulangan', deck: 'Dek',
  };
  if (!name || CJK_REGEX.test(name) || PINYIN_TONE_REGEX.test(name)) return name;
  let out = name;
  for (const [en, id] of Object.entries(COMMON_DECK_WORDS)) {
    out = out.replace(new RegExp(`\\b${en}\\b`, 'gi'), id);
  }
  return out;
}