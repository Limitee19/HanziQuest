import { w, ChineseWord } from './types';

/**
 * Pengisi slot nada (tone fillers) — karakter perwakilan untuk sel nada yang
 * secara linguistik valid tetapi tidak tercakup kosakata HSK 1–3.
 * Ditandai "di luar HSK" agar pengguna tahu konteksnya.
 * Format tuple: [id, hanzi, pinyin, arti-ID, emoji?, imageKey?]
 */
type Filler = [id: string, hanzi: string, pinyin: string, arti: string, emoji?: string, imageKey?: string];

const FILLERS: Filler[] = [
  // ── a ──
  ['f_a1', '啊', 'ā', 'ah (seru)', '😮'],
  // ── ai ──
  ['f_ai1', '哀', 'āi', 'sedih / pedih', '😔'],
  ['f_ai2', '挨', 'ái', 'menanggung / dekat', '🧱'],
  ['f_ai3', '矮', 'ǎi', 'pendek (badan)', '📏'],
  // ── an ──
  ['f_an1', '安', 'ān', 'tenang / aman', '🕊️'],
  // ── ba ──
  ['f_ba1', '八', 'bā', 'delapan', '8️⃣'],
  ['f_ba2', '拔', 'bá', 'menarik keluar', '🪝'],
  ['f_ba3', '把', 'bǎ', '(kata bantu objek)', '🤲'],
  // ── bai ──
  ['f_bai1', '掰', 'bāi', 'mematahkan dengan tangan', '🤾'],
  ['f_bai2', '白', 'bái', 'putih', '⚪'],
  ['f_bai3', '摆', 'bǎi', 'menata / mengibas', '🪑'],
  ['f_bai4', '败', 'bài', 'kalah', '🏳️'],
  // ── ban ──
  ['f_ban1', '般', 'bān', 'seperti / macam', '🔁'],
  ['f_ban3', '板', 'bǎn', 'papan', '🪵'],
  ['f_ban4', '办', 'bàn', 'mengurus', '📋'],
  // ── bang ──
  ['f_bang1', '帮', 'bāng', 'menolong', '🤝'],
  ['f_bang3', '榜', 'bǎng', 'papan peringkat', '📋'],
  ['f_bang4', '棒', 'bàng', 'hebat / tongkat', '🏏'],
  // ── bao ──
  ['f_bao1', '包', 'bāo', 'tas / membungkus', '🎒'],
  ['f_bao2', '薄', 'báo', 'tipis', '🪶'],
  ['f_bao3', '饱', 'bǎo', 'kenyang', '😋'],
  ['f_bao4', '抱', 'bào', 'memeluk', '🫂'],
  // ── bei ──
  ['f_bei1', '背', 'bēi', 'memikul (di punggung)', '🎒'],
  ['f_bei3', '北', 'běi', 'utara', '🧭'],
  ['f_bei4', '被', 'bèi', '(partikel pasif)', '🛏️'],
  // ── ben ──
  ['f_ben1', '奔', 'bēn', 'berlari kencang', '🏃'],
  ['f_ben3', '本', 'běn', 'buku (kata bantu)', '📕'],
  ['f_ben4', '笨', 'bèn', 'bodoh / kaku', '🪨'],
  // ── bi ──
  ['f_bi1', '逼', 'bī', 'memaksa', '😤'],
  ['f_bi2', '鼻', 'bí', 'hidung', '👃'],
  ['f_bi3', '笔', 'bǐ', 'pena', '🖊️'],
  ['f_bi4', '必', 'bì', 'pasti / wajib', '❗'],
  // ── bian ──
  ['f_bian1', '编', 'biān', 'menganyam / menyusun', '🧶'],
  ['f_bian3', '扁', 'biǎn', 'pipih', '🥞'],
  ['f_bian4', '变', 'biàn', 'berubah', '🔄'],
  // ── biao ──
  ['f_biao1', '标', 'biāo', 'tanda / label', '🏷️'],
  ['f_biao3', '表', 'biǎo', 'jam tangan / tabel', '⌚'],
  // ── bie ──
  ['f_bie2', '别', 'bié', 'jangan / lain', '✋'],
  // ── bin ──
  ['f_bin1', '宾', 'bīn', 'tamu', '🤵'],
  // ── bing ──
  ['f_bing1', '冰', 'bīng', 'es', '🧊'],
  ['f_bing3', '饼', 'bǐng', 'kue pipih', '🫓'],
  // ── bo ──
  ['f_bo1', '拨', 'bō', 'memutar (dial)', '📞'],
  ['f_bo2', '伯', 'bó', 'paman (saudara ayah)', '👴'],
  // ── bu ──
  ['f_bu3', '补', 'bǔ', 'menambal / menyuplai', '🩹'],
  ['f_bu4', '不', 'bù', 'tidak', '🚫'],
  // ── cai ──
  ['f_cai1', '猜', 'cāi', 'menebak', '❓'],
  ['f_cai3', '踩', 'cǎi', 'menginjak', '🦶'],
  ['f_cai4', '菜', 'cài', 'masakan / sayur', '🥬'],
  // ── can ──
  ['f_can1', '参', 'cān', 'ikut serta', '🤝'],
  ['f_can3', '惨', 'cǎn', 'mengerikan / tragis', '😭'],
  // ── cao ──
  ['f_cao2', '槽', 'cáo', 'palung / gerobak', '🪣'],
  ['f_cao3', '草', 'cǎo', 'rumput', '🌿'],
  // ── ce ──
  ['f_ce4', '测', 'cè', 'mengukur', '📏'],
  // ── cha ──
  ['f_cha1', '叉', 'chā', 'garpu / menyematkan', '🍴'],
  ['f_cha2', '茶', 'chá', 'teh', '🍵'],
  ['f_cha3', '搽', 'chá', 'mengoles', '🧴'],
  ['f_cha4', '差', 'chà', 'kurang / buruk', '📉'],
  // ── chai ──
  ['f_chai1', '拆', 'chāi', 'membongkar', '🔧'],
  // ── chan ──
  ['f_chan2', '缠', 'chán', 'melilit', '🪢'],
  ['f_chan3', '产', 'chǎn', 'menghasilkan', '🏭'],
  // ── chang ──
  ['f_chang1', '长', 'chāng', 'sering (cháng) / panjang', '📏'],
  ['f_chang2', '常', 'cháng', 'sering', '🔁'],
  ['f_chang3', '场', 'chǎng', 'lapangan / tempat', '🏟️'],
  // ── chao ──
  ['f_chao1', '抄', 'chāo', 'menyalin', '📋'],
  ['f_chao2', '朝', 'cháo', 'dinasti / menghadap', '🏛️'],
  ['f_chao3', '吵', 'chǎo', 'ribut / berisik', '📢'],
  // ── che ──
  ['f_che1', '车', 'chē', 'kendaraan', '🚗'],
  ['f_che4', '彻', 'chè', 'menyeluruh', '💎'],
  // ── chen ──
  ['f_chen1', '抻', 'chēn', 'meregangkan', '🤸'],
  ['f_chen2', '沉', 'chén', 'tenggelam / berat', '⚓'],
  // ── cheng ──
  ['f_cheng1', '称', 'chēng', 'menimbang', '⚖️'],
  ['f_cheng2', '成', 'chéng', 'menjadi / sukses', '✅'],
  ['f_cheng3', '逞', 'chěng', 'menunjuk-nunjuk', '😤'],
  // ── chi ──
  ['f_chi1', '吃', 'chī', 'makan', '🍚'],
  ['f_chi2', '池', 'chí', 'kolam', '🏊'],
  ['f_chi3', '尺', 'chǐ', 'penggaris', '📏'],
  ['f_chi4', '翅', 'chì', 'sayap', '🦋'],
  // ── chong ──
  ['f_chong1', '冲', 'chōng', 'menerjang / menyiram', '🌊'],
  ['f_chong2', '虫', 'chóng', 'serangga', '🐛'],
  // ── chou ──
  ['f_chou1', '抽', 'chōu', 'menarik keluar', '🚬'],
  ['f_chou2', '愁', 'chóu', 'cemas', '😟'],
  ['f_chou3', '丑', 'chǒu', 'jelek', '👹'],
  // ── chu ──
  ['f_chu1', '出', 'chū', 'keluar', '📤'],
  ['f_chu2', '锄', 'chú', 'cangkul', '⛏️'],
  ['f_chu3', '楚', 'chǔ', 'jelas / rapi', '💎'],
  // ── chuan ──
  ['f_chuan1', '穿', 'chuān', 'memakai (pakaian)', '👕'],
  ['f_chuan2', '船', 'chuán', 'kapal', '🚢'],
  // ── chuang ──
  ['f_chuang1', '窗', 'chuāng', 'jendela', '🪟'],
  ['f_chuang4', '创', 'chuàng', 'menciptakan', '💡'],
  // ── chui ──
  ['f_chui1', '吹', 'chuī', 'meniup', '🌬️'],
  ['f_chui2', '锤', 'chuí', 'palu', '🔨'],
  // ── chun ──
  ['f_chun1', '春', 'chūn', 'musim semi', '🌸'],
  ['f_chun2', '唇', 'chún', 'bibir', '👄'],
  // ── ci ──
  ['f_ci1', '词', 'cí', 'kata', '🔤'],
  ['f_ci2', '瓷', 'cí', 'porselen', '🏺'],
  // ── cong ──
  ['f_cong1', '聪', 'cōng', 'pintar / telinga tajam', '🧠'],
  ['f_cong2', '从', 'cóng', 'dari', '➡️'],
  // ── cou ──
  ['f_cou4', '凑', 'còu', 'mengumpulkan', '🧩'],
  // ── cu ──
  ['f_cu1', '粗', 'cū', 'tebal / kasar', '🪵'],
  // ── cui ──
  ['f_cui4', '脆', 'cuì', 'renyah', '🍪'],
  // ── cun ──
  ['f_cun1', '村', 'cūn', 'desa', '🏘️'],
  // ── cuo ──
  ['f_cuo1', '搓', 'cuō', 'menggosok', '🤲'],
  ['f_cuo4', '错', 'cuò', 'salah', '❌'],
  // ── da ──
  ['f_da1', '搭', 'dā', 'menumpang / memasang', '🚕'],
  ['f_da2', '达', 'dá', 'mencapai', '🎯'],
  ['f_da3', '打', 'dǎ', 'memukul / memainkan', '🥊'],
  ['f_da4', '大', 'dà', 'besar', '🐘'],
  // ── dai ──
  ['f_dai1', '呆', 'dāi', 'terdiam / kaku', '😶'],
  ['f_dai3', '歹', 'dǎi', 'jahat', '😈'],
  ['f_dai4', '带', 'dài', 'membawa', '🎒'],
  // ── dan ──
  ['f_dan1', '单', 'dān', 'tunggal', '1️⃣'],
  ['f_dan4', '蛋', 'dàn', 'telur', '🥚'],
  // ── dang ──
  ['f_dang1', '当', 'dāng', 'menjadi / saat', '🕐'],
  ['f_dang3', '党', 'dǎng', 'partai', '🚩'],
  // ── dao ──
  ['f_dao1', '刀', 'dāo', 'pisau', '🔪'],
  ['f_dao2', '叨', 'dāo', 'mengoceh', '💬'],
  ['f_dao3', '岛', 'dǎo', 'pulau', '🏝️'],
  ['f_dao4', '到', 'dào', 'sampai', '🏁'],
  // ── de ──
  ['f_de2', '得', 'dé', 'memperoleh', '🏅'],
  ['f_de5', '的', 'de', '(partikel milik)', '🔗'],
  // ── deng ──
  ['f_deng1', '登', 'dēng', 'naik / mencatat', '🪜'],
  ['f_deng3', '等', 'děng', 'menunggu', '⏳'],
  ['f_deng4', '瞪', 'dèng', 'melotot', '👀'],
  // ── di ──
  ['f_di1', '低', 'dī', 'rendah', '⬇️'],
  ['f_di2', '敌', 'dí', 'musuh', '⚔️'],
  ['f_di3', '底', 'dǐ', 'dasar', '🧱'],
  ['f_di4', '地', 'dì', 'tanah / bumi', '🌍'],
  // ── dian ──
  ['f_dian1', '颠', 'diān', 'terbalik / berguncang', '🌀'],
  ['f_dian3', '点', 'diǎn', 'titik / pukul', '🕐'],
  // ── diao ──
  ['f_diao1', '雕', 'diāo', 'mengukir', '🗿'],
  ['f_diao4', '掉', 'diào', 'jatuh', '🪂'],
  // ── ding ──
  ['f_ding1', '钉', 'dīng', 'paku', '📌'],
  ['f_ding3', '顶', 'dǐng', 'puncak', '🏔️'],
  ['f_ding4', '订', 'dìng', 'memesan / membooking', '📅'],
  // ── diu ──
  ['f_diu1', '丢', 'diū', 'kehilangan', '🫥'],
  // ── dong ──
  ['f_dong1', '东', 'dōng', 'timur', '🧭'],
  ['f_dong3', '懂', 'dǒng', 'mengerti', '💡'],
  ['f_dong4', '冻', 'dòng', 'membeku', '🥶'],
  // ── dou ──
  ['f_dou1', '都', 'dū', 'ibu kota', '🏛️'],
  ['f_dou3', '抖', 'dǒu', 'gemetar', '🫨'],
  ['f_dou4', '豆', 'dòu', 'kacang', '🫘'],
  // ── du ──
  ['f_du1', '督', 'dū', 'mengawasi', '👁️'],
  ['f_du2', '毒', 'dú', 'racun', '☠️'],
  ['f_du3', '赌', 'dǔ', 'berjudi', '🎲'],
  ['f_du4', '度', 'dù', 'derajat / tingkat', '🌡️'],
  // ── duan ──
  ['f_duan1', '端', 'duān', 'ujung / tegak', '📐'],
  ['f_duan3', '短', 'duǎn', 'pendek', '📏'],
  ['f_duan4', '断', 'duàn', 'putus', '✂️'],
  // ── dui ──
  ['f_dui1', '堆', 'duī', 'tumpukan', '📚'],
  ['f_dui4', '对', 'duì', 'benar', '✔️'],
  // ── dun ──
  ['f_dun1', '吨', 'dūn', 'ton', '⚖️'],
  ['f_dun4', '顿', 'dùn', 'kali (makan)', '🍽️'],
  // ── duo ──
  ['f_duo1', '多', 'duō', 'banyak', '➕'],
  ['f_duo2', '夺', 'duó', 'merebut', '🥇'],
  ['f_duo3', '躲', 'duǒ', 'bersembunyi', '🙈'],
  // ── e ──
  ['f_e1', '恶', 'è', 'jahat', '😈'],
  ['f_e2', '额', 'é', 'dahi / jumlah', '🙂'],
  ['f_e4', '饿', 'è', 'lapar', '🍽️'],
  // ── en ──
  ['f_en1', '恩', 'ēn', 'budi', '🙏'],
  // ── er ──
  ['f_er1', '而', 'ér', 'dan / namun', '🔗'],
  ['f_er2', '儿', 'ér', 'anak', '👶'],
  ['f_er3', '耳', 'ěr', 'telinga', '👂'],
  ['f_er4', '二', 'èr', 'dua', '2️⃣'],
  // ── fa ──
  ['f_fa1', '发', 'fā', 'mengirim', '📨'],
  ['f_fa2', '罚', 'fá', 'menghukum', '⚖️'],
  // ── fan ──
  ['f_fan1', '翻', 'fān', 'membalik', '📖'],
  ['f_fan2', '烦', 'fán', 'kesal / repot', '😤'],
  ['f_fan3', '反', 'fǎn', 'berlawanan', '↩️'],
  ['f_fan4', '饭', 'fàn', 'nasi / makanan', '🍚'],
  // ── fang ──
  ['f_fang1', '方', 'fāng', 'persegi / arah', '⬜'],
  ['f_fang2', '房', 'fáng', 'rumah / ruangan', '🏠'],
  ['f_fang3', '访', 'fǎng', 'mengunjungi', '🚪'],
  ['f_fang4', '放', 'fàng', 'meletakkan', '📥'],
  // ── fei ──
  ['f_fei1', '飞', 'fēi', 'terbang', '✈️'],
  ['f_fei2', '肥', 'féi', 'gemuk (subur)', '🐄'],
  ['f_fei3', '匪', 'fěi', 'perampok', '🥷'],
  ['f_fei4', '费', 'fèi', 'biaya', '💰'],
  // ── fen ──
  ['f_fen1', '分', 'fēn', 'menit / membagi', '⏱️'],
  ['f_fen2', '坟', 'fén', 'kuburan', '🪦'],
  ['f_fen3', '粉', 'fěn', 'bubuk / merah muda', '🌸'],
  ['f_fen4', '份', 'fèn', 'porsi / bagian', '📄'],
  // ── feng ──
  ['f_feng1', '风', 'fēng', 'angin', '🌬️'],
  ['f_feng2', '逢', 'féng', 'bertemu', '🤝'],
  ['f_feng3', '讽', 'fěng', 'menyindir', '🗣️'],
  // ── fo ──
  ['f_fo2', '佛', 'fó', 'Buddha', '🛕'],
  // ── fou ──
  ['f_fou3', '否', 'fǒu', 'menolak / tidak', '❌'],
  // ── fu ──
  ['f_fu1', '夫', 'fū', 'suami', '👨'],
  ['f_fu2', '福', 'fú', 'berkah / keberuntungan', '🧧'],
  ['f_fu3', '抚', 'fǔ', 'mengelus', '🤲'],
  ['f_fu4', '父', 'fù', 'ayah', '👨'],
  // ── gai ──
  ['f_gai1', '该', 'gāi', 'harusnya', '✔️'],
  ['f_gai3', '改', 'gǎi', 'mengubah', '🔧'],
  ['f_gai4', '盖', 'gài', 'menutup / atap', '🏠'],
  // ── gan ──
  ['f_gan1', '干', 'gān', 'kering', '🏜️'],
  ['f_gan3', '赶', 'gǎn', 'mengejar', '🏃'],
  ['f_gan4', '干', 'gàn', 'bekerja / melakukan', '🔨'],
  // ── gang ──
  ['f_gang1', '钢', 'gāng', 'baja', '🔩'],
  ['f_gang3', '岗', 'gǎng', 'pos jaga', '🚧'],
  // ── gao ──
  ['f_gao1', '高', 'gāo', 'tinggi', '📐'],
  ['f_gao3', '搞', 'gǎo', 'melakukan (kolokial)', '🛠️'],
  ['f_gao4', '告', 'gào', 'memberi tahu', '📢'],
  // ── ge ──
  ['f_ge1', '哥', 'gē', 'kakak laki-laki', '👦'],
  ['f_ge2', '格', 'gé', 'kotak / standar', '🔲'],
  ['f_ge4', '各', 'gè', 'masing-masing', '🔢'],
  // ── gei ──
  ['f_gei3', '给', 'gěi', 'memberi', '🎁'],
  // ── gen ──
  ['f_gen1', '跟', 'gēn', 'dengan / mengikuti', '🚶'],
  ['f_gen2', '哏', 'gén', 'lucu (slang)', '😄'],
  ['f_gen4', '亘', 'gèn', 'membentang', '🗺️'],
  // ── geng ──
  ['f_geng1', '更', 'gēng', 'jaga malam', '🌙'],
  ['f_geng4', '更', 'gèng', 'lebih', '📈'],
  // ── gong ──
  ['f_gong1', '工', 'gōng', 'kerja', '🔨'],
  ['f_gong3', '拱', 'gǒng', 'melengkung', '🌉'],
  ['f_gong4', '共', 'gòng', 'bersama / total', '🤝'],
  // ── gou ──
  ['f_gou1', '沟', 'gōu', 'parit', '🕳️'],
  ['f_gou3', '狗', 'gǒu', 'anjing', '🐕'],
  ['f_gou4', '够', 'gòu', 'cukup', '✅'],
  // ── gu ──
  ['f_gu1', '姑', 'gū', 'bibi', '👩'],
  ['f_gu2', '骨', 'gǔ', 'tulang', '🦴'],
  ['f_gu3', '古', 'gǔ', 'kuno', '🏺'],
  ['f_gu4', '故', 'gù', 'alasan / peristiwa', '📖'],
  // ── gua ──
  ['f_gua1', '瓜', 'guā', 'melon', '🍉'],
  ['f_gua3', '寡', 'guǎ', 'janda / sedikit', '🪶'],
  ['f_gua4', '挂', 'guà', 'menggantung', '🪝'],
  // ── guai ──
  ['f_guai1', '乖', 'guāi', 'pintar (anak)', '😇'],
  ['f_guai3', '拐', 'guǎi', 'berbelok', '↩️'],
  // ── guan ──
  ['f_guan1', '关', 'guān', 'menutup / berhubungan', '🚪'],
  ['f_guan3', '管', 'guǎn', 'pipa / mengatur', '🔧'],
  ['f_guan4', '灌', 'guàn', 'menyiram / menuang', '💧'],
  // ── gui ──
  ['f_gui1', '归', 'guī', 'kembali', '🔙'],
  ['f_gui3', '轨', 'guǐ', 'rel', '🛤️'],
  ['f_gui4', '柜', 'guì', 'lemari', '🚪'],
  // ── gun ──
  ['f_gun3', '滚', 'gǔn', 'menggelinding', '⚽'],
  // ── guo ──
  ['f_guo1', '锅', 'guō', 'panci', '🍲'],
  ['f_guo2', '国', 'guó', 'negara', '🏳️'],
  ['f_guo3', '果', 'guǒ', 'buah / hasil', '🍎'],
  ['f_guo4', '过', 'guò', 'melewati', '➡️'],
  // ── ha ──
  ['f_ha1', '哈', 'hā', 'ha (tertawa)', '😄'],
  // ── hai ──
  ['f_hai1', '咳', 'hāi', 'hai (seru)', '👋'],
  ['f_hai2', '还', 'hái', 'masih', '🔁'],
  ['f_hai3', '海', 'hǎi', 'laut', '🌊'],
  ['f_hai4', '害', 'hài', 'merugikan', '⚠️'],
  // ── han ──
  ['f_han1', '酣', 'hān', 'terlelap pulas', '😴'],
  ['f_han2', '含', 'hán', 'memegang di mulut / mengandung', '💧'],
  ['f_han3', '喊', 'hǎn', 'berteriak', '📣'],
  ['f_han4', '汉', 'hàn', 'Han (bahasa Mandarin)', '🈶'],
  // ── hang ──
  ['f_hang2', '航', 'háng', 'pelayaran / penerbangan', '✈️'],
  ['f_hang4', '巷', 'hàng', 'gang', '🛤️'],
  // ── hao ──
  ['f_hao1', '蒿', 'hāo', 'sejenis rumput', '🌿'],
  ['f_hao2', '毫', 'háo', 'sedikit sekali', '🪶'],
  ['f_hao3', '好', 'hǎo', 'baik', '👍'],
  ['f_hao4', '号', 'hào', 'nomor / tanggal', '🔢'],
  // ── he ──
  ['f_he1', '喝', 'hē', 'minum', '🥤'],
  ['f_he2', '和', 'hé', 'dan', '➕'],
  ['f_he4', '贺', 'hè', 'mengucapkan selamat', '🎉'],
  // ── hei ──
  ['f_hei1', '黑', 'hēi', 'hitam', '⚫'],
  // ── hen ──
  ['f_hen2', '痕', 'hén', 'bekas / jejak', '👣'],
  ['f_hen3', '很', 'hěn', 'sangat', '💯'],
  // ── heng ──
  ['f_heng1', '哼', 'hēng', 'membibir / bersenandung', '🎵'],
  ['f_heng2', '横', 'héng', 'melintang', '➡️'],
  // ── hou ──
  ['f_hou2', '猴', 'hóu', 'monyet', '🐵'],
  ['f_hou3', '吼', 'hǒu', 'mengaum', '🦁'],
  ['f_hou4', '后', 'hòu', 'belakang / setelah', '🔙'],
  // ── hu ──
  ['f_hu1', '乎', 'hū', 'partikel (hampir)', '❓'],
  ['f_hu2', '湖', 'hú', 'danau', '🏞️'],
  ['f_hu3', '虎', 'hǔ', 'harimau', '🐯'],
  ['f_hu4', '护', 'hù', 'melindungi', '🛡️'],
  // ── hua ──
  ['f_hua1', '花', 'huā', 'bunga', '🌸'],
  ['f_hua2', '华', 'huá', 'gemilang / Tionghoa', '🇨🇳'],
  ['f_hua4', '画', 'huà', 'melukis / gambar', '🎨'],
  // ── huai ──
  ['f_huai2', '怀', 'huái', 'mendekap / rindu', '🫂'],
  ['f_huai4', '坏', 'huài', 'rusak / buruk', '⚠️'],
  // ── huan ──
  ['f_huan1', '欢', 'huān', 'gembira', '😄'],
  ['f_huan2', '还', 'huán', 'mengembalikan', '🔙'],
  ['f_huan3', '缓', 'huǎn', 'pelan / menunda', '🐢'],
  // ── huang ──
  ['f_huang1', '荒', 'huāng', 'liar / tandus', '🏜️'],
  ['f_huang2', '黄', 'huáng', 'kuning', '🟡'],
  ['f_huang3', '谎', 'huǎng', 'bohong', '🤥'],
  // ── hui ──
  ['f_hui1', '灰', 'huī', 'abu-abu', '🌫️'],
  ['f_hui2', '回', 'huí', 'kembali', '↩️'],
  ['f_hui3', '毁', 'huǐ', 'menghancurkan', '💥'],
  ['f_hui4', '会', 'huì', 'bisa / rapat', '🤝'],
  // ── hun ──
  ['f_hun1', '昏', 'hūn', 'pingsan / gelap', '💫'],
  ['f_hun2', '浑', 'hún', 'keruh', '🌊'],
  ['f_hun4', '混', 'hùn', 'mencampur', '🥣'],
  // ── huo ──
  ['f_huo1', '豁', 'huō', 'terbuka lebar', '🕳️'],
  ['f_huo2', '活', 'huó', 'hidup', '🌱'],
  ['f_huo3', '火', 'huǒ', 'api', '🔥'],
  ['f_huo4', '货', 'huò', 'barang', '📦'],
  // ── ji ──
  ['f_ji1', '机', 'jī', 'mesin', '⚙️'],
  ['f_ji2', '级', 'jí', 'tingkat', '📶'],
  ['f_ji3', '几', 'jǐ', 'berapa', '🔢'],
  ['f_ji4', '记', 'jì', 'mencatat / mengingat', '📝'],
  // ── jia ──
  ['f_jia1', '家', 'jiā', 'rumah / keluarga', '🏠'],
  ['f_jia2', '夹', 'jiá', 'menjepit', '🥢'],
  ['f_jia3', '假', 'jiǎ', 'palsu / libur', '🎭'],
  ['f_jia4', '嫁', 'jià', 'menikah (perempuan)', '💍'],
  // ── jian ──
  ['f_jian1', '间', 'jiān', 'ruang / antara', '📐'],
  ['f_jian3', '剪', 'jiǎn', 'menggunting', '✂️'],
  ['f_jian4', '见', 'jiàn', 'bertemu', '👀'],
  // ── jiang ──
  ['f_jiang1', '江', 'jiāng', 'sungai besar', '🌊'],
  ['f_jiang3', '讲', 'jiǎng', 'berbicara / mengajar', '🗣️'],
  ['f_jiang4', '酱', 'jiàng', 'saus', '🍯'],
  // ── jiao ──
  ['f_jiao1', '交', 'jiāo', 'menyerahkan / berhubungan', '🤝'],
  ['f_jiao2', '嚼', 'jiáo', 'mengunyah', '🍪'],
  ['f_jiao3', '角', 'jiǎo', 'sudut / uang kecil', '📐'],
  ['f_jiao4', '叫', 'jiào', 'bernama / memanggil', '📢'],
  // ── jie ──
  ['f_jie1', '接', 'jiē', 'menerima / menjemput', '🤲'],
  ['f_jie2', '节', 'jié', 'hari raya / ruas', '🎋'],
  ['f_jie3', '姐', 'jiě', 'kakak perempuan', '👩'],
  ['f_jie4', '界', 'jiè', 'batas / dunia', '🌍'],
  // ── jin ──
  ['f_jin1', '金', 'jīn', 'emas', '🥇'],
  ['f_jin3', '紧', 'jǐn', 'ketat', '📏'],
  ['f_jin4', '进', 'jìn', 'masuk / maju', '⏩'],
  // ── jing ──
  ['f_jing1', '京', 'jīng', 'ibu kota', '🏯'],
  ['f_jing2', '静', 'jìng', 'tenang', '🤫'],
  ['f_jing3', '景', 'jǐng', 'pemandangan', '🏞️'],
  ['f_jing4', '净', 'jìng', 'bersih', '🧼'],
  // ── jiong ──
  ['f_jiong3', '炯', 'jiǒng', 'berbinar (mata)', '👀'],
  // ── jiu ──
  ['f_jiu1', '究', 'jiū', 'menyelidiki', '🔍'],
  ['f_jiu3', '酒', 'jiǔ', 'anggur / minuman beralkohol', '🍶'],
  ['f_jiu4', '旧', 'jiù', 'lama / bekas', '🕰️'],
  // ── ju ──
  ['f_ju1', '拘', 'jū', 'menahan', '⛓️'],
  ['f_ju2', '局', 'jú', 'kantor / permainan', '🏢'],
  ['f_ju3', '举', 'jǔ', 'mengangkat', '🏋️'],
  ['f_ju4', '句', 'jù', 'kalimat', '💬'],
  // ── juan ──
  ['f_juan1', '圈', 'quān', 'lingkaran', '⭕'],
  ['f_juan3', '卷', 'juǎn', 'menggulung', '🌀'],
  // ── jue ──
  ['f_jue2', '绝', 'jué', 'mutlak / memutus', '🚫'],
  // ── jun ──
  ['f_jun1', '军', 'jūn', 'militer', '🎖️'],
  ['f_jun4', '俊', 'jùn', 'tampan', '🤴'],
  // ── ka ──
  ['f_ka1', '喀', 'kā', 'krek (bunyi)', '🔩'],
  ['f_ka3', '卡', 'kǎ', 'kartu / macet', '💳'],
  // ── kai ──
  ['f_kai1', '开', 'kāi', 'membuka', '🚪'],
  ['f_kai3', '凯', 'kǎi', 'menang gemilang', '🏆'],
  // ── kan ──
  ['f_kan1', '看', 'kān', 'menjaga', '👀'],
  ['f_kan3', '砍', 'kǎn', 'menebang', '🪓'],
  ['f_kan4', '看', 'kàn', 'melihat', '👀'],
  // ── kang ──
  ['f_kang1', '康', 'kāng', 'sehat', '💪'],
  ['f_kang2', '扛', 'káng', 'menggendong di bahu', '🏋️'],
  // ── kao ──
  ['f_kao3', '考', 'kǎo', 'menguji', '📝'],
  // ── ke ──
  ['f_ke1', '科', 'kē', 'ilmu / bidang', '🔬'],
  ['f_ke2', '壳', 'ké', 'cangkang', '🥜'],
  ['f_ke3', '渴', 'kě', 'haus', '🥵'],
  ['f_ke4', '课', 'kè', 'pelajaran', '📚'],
  // ── kei ──
  // (kēi jarang — tidak diisi)
  // ── ken ──
  ['f_ken3', '肯', 'kěn', 'bersedia', '🙆'],
  ['f_ken4', '根', 'gēn', 'akar / tangkai', '🌱'],
  // ── keng ──
  ['f_keng1', '坑', 'kēng', 'lubang', '🕳️'],
  // ── kong ──
  ['f_kong1', '空', 'kōng', 'kosong / udara', '⭕'],
  ['f_kong3', '孔', 'kǒng', 'lubang kecil', '🕳️'],
  ['f_kong4', '控', 'kòng', 'mengendalikan', '🎛️'],
  // ── kou ──
  ['f_kou3', '口', 'kǒu', 'mulut', '👄'],
  ['f_kou4', '扣', 'kòu', 'mengancing / memotong', '🔘'],
  // ── ku ──
  ['f_ku1', '哭', 'kū', 'menangis', '😭'],
  ['f_ku3', '苦', 'kǔ', 'pahit', '💊'],
  ['f_ku4', '库', 'kù', 'gudang', '🏢'],
  // ── kua ──
  ['f_kua1', '夸', 'kuā', 'memuji', '🌟'],
  ['f_kua3', '垮', 'kuǎ', 'runtuh', '🏗️'],
  ['f_kua4', '跨', 'kuà', 'melangkahi', '🦵'],
  // ── kuai ──
  ['f_kuai3', '块', 'kuài', 'yuan / keping', '💴'],
  ['f_kuai4', '快', 'kuài', 'cepat', '⚡'],
  // ── kuan ──
  ['f_kuan1', '宽', 'kuān', 'lebar', '↔️'],
  ['f_kuan3', '款', 'kuǎn', 'jenis / dana', '💳'],
  // ── kuang ──
  ['f_kuang1', '筐', 'kuāng', 'keranjang', '🧺'],
  ['f_kuang2', '狂', 'kuáng', 'liar', '🌪️'],
  // ── kui ──
  ['f_kui1', '亏', 'kuī', 'rugi', '📉'],
  ['f_kui2', '葵', 'kuí', 'bunga matahari', '🌻'],
  // ── kun ──
  ['f_kun1', '昆', 'kūn', 'keturunan', '🧬'],
  ['f_kun4', '困', 'kùn', 'mengantuk / sulit', '😴'],
  // ── kuo ──
  ['f_kuo4', '阔', 'kuò', 'luas', '🗺️'],
  // ── la ──
  ['f_la1', '拉', 'lā', 'menarik', '🪢'],
  ['f_la2', '喇', 'lá', 'terompet (喇叭)', '📢'],
  ['f_la3', '喇', 'lǎ', '— (varian)', '❓'],
  // ── lai ──
  ['f_lai2', '来', 'lái', 'datang', '👋'],
  // ── lan ──
  ['f_lan2', '蓝', 'lán', 'biru', '🔵'],
  ['f_lan3', '懒', 'lǎn', 'malas', '🦥'],
  ['f_lan4', '烂', 'làn', 'busuk / lembek', '🍌'],
  // ── lang ──
  ['f_lang1', '狼', 'láng', 'serigala', '🐺'],
  ['f_lang3', '朗', 'lǎng', 'terang / lantang', '🌞'],
  // ── lao ──
  ['f_lao1', '捞', 'lāo', 'menjaring dari air', '🥄'],
  ['f_lao2', '劳', 'láo', 'kerja / lelah', '🔨'],
  ['f_lao3', '老', 'lǎo', 'tua', '👴'],
  // ── le ──
  ['f_le4', '乐', 'lè', 'gembira', '😄'],
  // ── lei ──
  ['f_lei1', '勒', 'lēi', 'mengikat kuat', '🪢'],
  ['f_lei2', '雷', 'léi', 'guntur', '⚡'],
  ['f_lei3', '累', 'lěi', 'menumpuk', '📚'],
  ['f_lei4', '累', 'lèi', 'lelah', '😩'],
  // ── leng ──
  ['f_leng2', '棱', 'léng', 'rusuk / sisi', '📐'],
  ['f_leng3', '冷', 'lěng', 'dingin', '❄️'],
  // ── li ──
  ['f_li1', '梨', 'lí', 'pir (lí)', '🍐'],
  ['f_li2', '离', 'lí', 'berpisah / jauh dari', '↔️'],
  ['f_li3', '里', 'lǐ', 'di dalam', '📦'],
  ['f_li4', '力', 'lì', 'kekuatan', '💪'],
  // ── lia ──
  ['f_lia3', '俩', 'liǎ', 'berdua', '🧑‍🤝‍🧑'],
  // ── lian ──
  ['f_lian2', '连', 'lián', 'menghubungkan', '🔗'],
  ['f_lian3', '脸', 'liǎn', 'wajah', '😊'],
  ['f_lian4', '练', 'liàn', 'berlatih', '🔁'],
  // ── liang ──
  ['f_liang2', '凉', 'liáng', 'sejuk', '🍃'],
  ['f_liang3', '两', 'liǎng', 'dua (kata bantu)', '2️⃣'],
  ['f_liang4', '亮', 'liàng', 'terang', '💡'],
  // ── liao ──
  ['f_liao1', '撩', 'liāo', 'mengangkat (rok)', '👗'],
  ['f_liao2', '辽', 'liáo', 'luas terbentang', '🗺️'],
  ['f_liao3', '了', 'liǎo', 'menyelesaikan', '✅'],
  // ── lie ──
  ['f_lie3', '咧', 'liě', 'menyeringai', '😬'],
  ['f_lie4', '烈', 'liè', 'ganas / kuat', '🔥'],
  // ── lin ──
  ['f_lin2', '林', 'lín', 'hutan', '🌲'],
  ['f_lin3', '凛', 'lǐn', 'dingin menusuk', '🥶'],
  // ── ling ──
  ['f_ling2', '灵', 'líng', 'cepat / roh', '👻'],
  ['f_ling3', '领', 'lǐng', 'kerah / memimpin', '👔'],
  ['f_ling4', '另', 'lìng', 'lain / terpisah', '➕'],
  // ── liu ──
  ['f_liu1', '溜', 'liū', 'meluncur', '🛷'],
  ['f_liu2', '流', 'liú', 'mengalir', '🌊'],
  ['f_liu3', '柳', 'liǔ', 'pohon willow', '🌳'],
  ['f_liu4', '六', 'liù', 'enam', '6️⃣'],
  // ── long ──
  ['f_long2', '龙', 'lóng', 'naga', '🐉'],
  ['f_long3', '拢', 'lǒng', 'mengumpulkan', '🤲'],
  // ── lou ──
  ['f_lou1', '搂', 'lōu', 'merangkul', '🫂'],
  ['f_lou2', '楼', 'lóu', 'gedung / lantai', '🏢'],
  ['f_lou4', '漏', 'lòu', 'bocor', '💧'],
  // ── lu ──
  ['f_lu1', '撸', 'lū', 'mengelus', '🐱'],
  ['f_lu2', '炉', 'lú', 'tungku', '🔥'],
  ['f_lu3', '虏', 'lǔ', 'menawan', '⛓️'],
  ['f_lu4', '录', 'lù', 'merekam', '📼'],
  // ── luan ──
  ['f_luan2', '乱', 'luàn', 'kacau', '🌪️'],
  // ── lun ──
  ['f_lun2', '轮', 'lún', 'roda / giliran', '🛞'],
  // ── luo ──
  ['f_luo1', '捋', 'luō', 'mengusap (rambut)', '🤲'],
  ['f_luo2', '罗', 'luó', 'jaring / mengumpulkan', '🕸️'],
  ['f_luo3', '裸', 'luǒ', 'telanjang', '🫣'],
  ['f_luo4', '落', 'luò', 'jatuh', '🍂'],
  // ── ma ──
  ['f_ma1', '妈', 'mā', 'ibu', '👩'],
  ['f_ma2', '麻', 'má', 'binatang / kesemutan', '🌿'],
  ['f_ma3', '马', 'mǎ', 'kuda', '🐎'],
  ['f_ma4', '骂', 'mà', 'mengoceh / memarahi', '😠'],
  ['f_ma5', '吗', 'ma', '(partikel tanya)', '❓'],
  // ── mai ──
  ['f_mai2', '埋', 'mái', 'mengubur', '⚰️'],
  ['f_mai3', '买', 'mǎi', 'membeli', '🛒'],
  ['f_mai4', '卖', 'mài', 'menjual', '🏷️'],
  // ── man ──
  ['f_man1', '瞒', 'mán', 'menyembunyikan', '🤫'],
  ['f_man2', '蛮', 'mán', 'kasar / sangat', '😤'],
  ['f_man3', '满', 'mǎn', 'penuh', '🈵'],
  ['f_man4', '慢', 'màn', 'lambat', '🐢'],
  // ── mang ──
  ['f_mang2', '忙', 'máng', 'sibuk', '🏃'],
  ['f_mang3', '莽', 'mǎng', 'tergesa', '🐗'],
  // ── mao ──
  ['f_mao1', '猫', 'māo', 'kucing', '🐱'],
  ['f_mao2', '毛', 'máo', 'rambut / bulu', '🪶'],
  ['f_mao3', '卯', 'mǎo', 'titik kompas', '🧭'],
  ['f_mao4', '帽', 'mào', 'topi', '🎩'],
  // ── me ──
  ['f_me5', '么', 'me', '(partikel)', '❓'],
  // ── mei ──
  ['f_mei2', '没', 'méi', 'tidak ada', '🚫'],
  ['f_mei3', '每', 'měi', 'setiap', '🔁'],
  ['f_mei4', '妹', 'mèi', 'adik perempuan', '👧'],
  // ── men ──
  ['f_men1', '闷', 'mēn', 'pengap', '😵'],
  ['f_men2', '门', 'mén', 'pintu', '🚪'],
  // ── meng ──
  ['f_meng1', '蒙', 'mēng', 'menipu / tertutup', '🌫️'],
  ['f_meng2', '萌', 'méng', 'tunas / menggemaskan', '🌱'],
  ['f_meng3', '猛', 'měng', 'ganas', '🐆'],
  // ── mi ──
  ['f_mi1', '眯', 'mī', 'menyipit', '😌'],
  ['f_mi2', '迷', 'mí', 'tersesat / penggemar', '🧭'],
  ['f_mi3', '米', 'mǐ', 'beras / meter', '🍚'],
  ['f_mi4', '密', 'mì', 'rapat / rahasia', '🔒'],
  // ── mian ──
  ['f_mian2', '棉', 'mián', 'kapas', '🧵'],
  ['f_mian3', '免', 'miǎn', 'bebas dari / menghindar', '🆓'],
  ['f_mian4', '面', 'miàn', 'wajah / mie', '🍜'],
  // ── miao ──
  ['f_miao1', '喵', 'miāo', 'meong', '🐱'],
  ['f_miao2', '苗', 'miáo', 'bibit tanaman', '🌱'],
  ['f_miao3', '秒', 'miǎo', 'detik', '⏱️'],
  ['f_miao4', '庙', 'miào', 'kuil', '🛕'],
  // ── mie ──
  ['f_mie1', '咩', 'miē', 'mbeek (kambing)', '🐑'],
  ['f_mie4', '灭', 'miè', 'memadamkan', '🧯'],
  // ── min ──
  ['f_min2', '民', 'mín', 'rakyat', '👥'],
  ['f_min3', '敏', 'mǐn', 'cepat / peka', '⚡'],
  // ── ming ──
  ['f_ming2', '明', 'míng', 'terang / mengerti', '💡'],
  ['f_ming3', '铭', 'mǐng', 'mengukir kenang', '🗿'],
  // ── mo ──
  ['f_mo1', '摸', 'mō', 'meraba', '🤲'],
  ['f_mo2', '模', 'mó', 'model / meniru', '🖨️'],
  ['f_mo3', '抹', 'mǒ', 'mengoles', '🧴'],
  ['f_mo4', '末', 'mò', 'ujung / akhir', '🔚'],
  // ── mou ──
  ['f_mou2', '谋', 'móu', 'merencanakan', '🧠'],
  ['f_mou3', '某', 'mǒu', 'suatu / seseorang', '❓'],
  // ── mu ──
  ['f_mu2', '模', 'mú', 'pola / model', '📐'],
  ['f_mu3', '母', 'mǔ', 'ibu', '👩'],
  ['f_mu4', '木', 'mù', 'kayu', '🪵'],
  // ── nai ──
  ['f_nai2', '奶', 'nǎi', 'susu', '🥛'],
  ['f_nai3', '乃', 'nǎi', 'ialah / justru', '➡️'],
  ['f_nai4', '耐', 'nài', 'tahan (sabaran)', '🧘'],
  // ── nan ──
  ['f_nan2', '难', 'nán', 'sulit', '🧩'],
  ['f_nan3', '赧', 'nǎn', 'merah malu', '😳'],
  ['f_nan4', '难', 'nàn', 'musibah', '🌪️'],
  // ── nao ──
  ['f_nao2', '挠', 'náo', 'menggaruk', '🤚'],
  ['f_nao3', '脑', 'nǎo', 'otak', '🧠'],
  ['f_nao4', '闹', 'nào', 'ribut', '📢'],
  // ── ne ──
  ['f_ne5', '呢', 'ne', '(partikel tanya)', '❓'],
  // ── nei ──
  ['f_nei4', '内', 'nèi', 'dalam', '🔒'],
  // ── nen ──
  ['f_nen4', '嫩', 'nèn', 'muda / lembut', '🌱'],
  // ── neng ──
  ['f_neng2', '能', 'néng', 'dapat / mampu', '💪'],
  // ── ni ──
  ['f_ni2', '泥', 'ní', 'lumpur', '🟤'],
  ['f_ni3', '你', 'nǐ', 'kamu', '👋'],
  ['f_ni4', '腻', 'nì', 'muak / berminyak', '😵'],
  // ── nian ──
  ['f_nian2', '年', 'nián', 'tahun', '🗓️'],
  ['f_nian3', '捻', 'niǎn', 'memutar (jari)', '🤏'],
  ['f_nian4', '念', 'niàn', 'membaca / mengenang', '📖'],
  // ── niang ──
  ['f_niang2', '娘', 'niáng', 'ibu', '👩'],
  ['f_niang4', '酿', 'niàng', 'meracik (minuman)', '🍶'],
  // ── niao ──
  ['f_niao3', '鸟', 'niǎo', 'burung', '🐦'],
  ['f_niao4', '尿', 'niào', 'kencing', '🚽'],
  // ── nie ──
  ['f_nie4', '捏', 'niē', 'mencubit / mencekam', '🤏'],
  // ── ning ──
  ['f_ning2', '宁', 'níng', 'tenang', '🕊️'],
  ['f_ning3', '拧', 'nǐng', 'memutar (keran)', '🚰'],
  ['f_ning4', '宁', 'nìng', 'lebih memilih', '⚖️'],
  // ── niu ──
  ['f_niu2', '牛', 'niú', 'sapi', '🐄'],
  ['f_niu3', '扭', 'niǔ', 'memutar / terkilir', '🩹'],
  // ── nong ──
  ['f_nong2', '农', 'nóng', 'petani / pertanian', '🌾'],
  ['f_nong4', '弄', 'nòng', 'mengurus / bermain', '🔧'],
  // ── nou ──
  // (nòu tidak umum — tidak diisi)
  // ── nu ──
  ['f_nu2', '奴', 'nú', 'budak', '⛓️'],
  ['f_nu3', '努', 'nǔ', 'berusaha', '💪'],
  ['f_nu4', '怒', 'nù', 'marah', '😡'],
  // ── nuan ──
  ['f_nuan3', '暖', 'nuǎn', 'hangat', '🔥'],
  // ── nuo ──
  ['f_nuo2', '挪', 'nuó', 'menggeser', '↔️'],
  ['f_nuo4', '糯', 'nuò', 'ketan / lembek', '🍚'],
  // ── o ──
  ['f_o1', '哦', 'ō', 'oh', '😮'],
  ['f_o2', '哦', 'ó', 'oh (paham)', '💡'],
  // ── ou ──
  ['f_ou1', '区', 'ōu', 'wilayah (juga ōu)', '🗺️'],
  ['f_ou3', '偶', 'ǒu', 'patung / kebetulan', '🎭'],
  // ── pa ──
  ['f_pa1', '趴', 'pā', 'merangkak / telungkup', '🤾'],
  ['f_pa2', '爬', 'pá', 'memanjat', '🧗'],
  ['f_pa4', '怕', 'pà', 'takut', '😨'],
  // ── pai ──
  ['f_pai1', '拍', 'pāi', 'memukul / memotret', '📷'],
  ['f_pai2', '排', 'pái', 'baris / mengatur', '🧾'],
  ['f_pai3', '牌', 'pǎi', 'kartu / papan nama', '🃏'],
  ['f_pai4', '派', 'pài', 'mengutus / gaya', '🧑‍💼'],
  // ── pan ──
  ['f_pan1', '攀', 'pān', 'memanjat', '🧗'],
  ['f_pan2', '盘', 'pán', 'piring / piringan', '🍽️'],
  ['f_pan4', '判', 'pàn', 'memutuskan', '⚖️'],
  // ── pang ──
  ['f_pang1', '旁', 'páng', 'samping', '↔️'],
  ['f_pang2', '庞', 'páng', 'raksasa', '🐋'],
  ['f_pang4', '胖', 'pàng', 'gemuk', '🐷'],
  // ── pao ──
  ['f_pao1', '抛', 'pāo', 'melempar', '🥏'],
  ['f_pao2', '刨', 'páo', 'mengikis', '🪚'],
  ['f_pao3', '跑', 'pǎo', 'berlari', '🏃'],
  ['f_pao4', '泡', 'pào', 'merendam / gelembung', '🫧'],
  // ── pei ──
  ['f_pei1', '呸', 'pēi', 'pyah (meludah)', '😤'],
  ['f_pei2', '陪', 'péi', 'menemani', '🤝'],
  ['f_pei4', '配', 'pèi', 'memasangkan', '🧩'],
  // ── pen ──
  ['f_pen2', '盆', 'pén', 'bak mandi', '🪣'],
  // ── peng ──
  ['f_peng1', '抨', 'pēng', 'mengkritik', '📣'],
  ['f_peng2', '朋', 'péng', 'teman', '🧑‍🤝‍🧑'],
  ['f_peng3', '捧', 'pěng', 'menyandera / mengapit', '🤲'],
  // ── pi ──
  ['f_pi1', '批', 'pī', 'mengkritik / angkatan', '📋'],
  ['f_pi2', '皮', 'pí', 'kulit', '🧤'],
  ['f_pi3', '劈', 'pǐ', 'membelah', '🪓'],
  ['f_pi4', '屁', 'pì', 'kentut', '💨'],
  // ── pian ──
  ['f_pian1', '篇', 'piān', 'artikel (kata bantu)', '📄'],
  ['f_pian2', '便', 'pián', 'murah (piányi)', '🏷️'],
  ['f_pian4', '骗', 'piàn', 'menipu', '🤥'],
  // ── piao ──
  ['f_piao1', '飘', 'piāo', 'melayang', '🪁'],
  ['f_piao3', '漂', 'piǎo', 'mencuci (bleaching)', '🧺'],
  ['f_piao4', '票', 'piào', 'tiket', '🎟️'],
  // ── pie ──
  ['f_pie1', '撇', 'piē', 'membuang / goresan', '🥄'],
  ['f_pie3', '苤', 'piě', 'sejenis sayur', '🥬'],
  // ── pin ──
  ['f_pin1', '拼', 'pīn', 'menyusun / bersaing', '🧩'],
  ['f_pin2', '贫', 'pín', 'miskin', '🪙'],
  ['f_pin3', '品', 'pǐn', 'produk / mengecap', '📦'],
  // ── ping ──
  ['f_ping2', '平', 'píng', 'datar / damai', '➖'],
  ['f_ping3', '评', 'pǐng', 'menilai', '⭐'],
  // ── po ──
  ['f_po1', '坡', 'pō', 'lereng', '⛰️'],
  ['f_po2', '婆', 'pó', 'nenek / mertua', '👵'],
  ['f_po3', '叵', 'pǒ', 'tidak mungkin', '🚫'],
  ['f_po4', '破', 'pò', 'pecah / rusak', '💥'],
  // ── pou ──
  ['f_pou1', '剖', 'pōu', 'membedah', '🔬'],
  // ── pu ──
  ['f_pu1', '扑', 'pū', 'melompat menyerbu', '🐾'],
  ['f_pu2', '仆', 'pú', 'pelayan', '🤵'],
  ['f_pu3', '朴', 'pǔ', 'sederhana', '🪵'],
  ['f_pu4', '铺', 'pù', 'toko / tempat tidur', '🏪'],
  // ── qi ──
  ['f_qi1', '七', 'qī', 'tujuh', '7️⃣'],
  ['f_qi2', '旗', 'qí', 'bendera', '🚩'],
  ['f_qi3', '起', 'qǐ', 'bangkit / mulai', '🚀'],
  ['f_qi4', '汽', 'qì', 'uap / bensin', '💨'],
  // ── qia ──
  ['f_qia1', '掐', 'qiā', 'mencubit', '🤏'],
  ['f_qia4', '恰', 'qià', 'tepat', '🎯'],
  // ── qian ──
  ['f_qian1', '千', 'qiān', 'seribu', '🔢'],
  ['f_qian2', '钱', 'qián', 'uang', '💰'],
  ['f_qian3', '浅', 'qiǎn', 'dangkal', '🌊'],
  ['f_qian4', '欠', 'qiàn', 'berhutang', '💳'],
  // ── qiang ──
  ['f_qiang1', '枪', 'qiāng', 'senapan', '🔫'],
  ['f_qiang2', '墙', 'qiáng', 'dinding', '🧱'],
  ['f_qiang3', '抢', 'qiǎng', 'merebut', '🥇'],
  // ── qiao ──
  ['f_qiao1', '敲', 'qiāo', 'mengetuk', '🚪'],
  ['f_qiao2', '桥', 'qiáo', 'jembatan', '🌉'],
  ['f_qiao3', '巧', 'qiǎo', 'kebetulan / cekatan', '🤹'],
  // ── qie ──
  ['f_qie1', '切', 'qiē', 'memotong', '🔪'],
  ['f_qie3', '且', 'qiě', 'dan juga', '➕'],
  ['f_qie4', '切', 'qiè', 'penuh perhatian', '💗'],
  // ── qin ──
  ['f_qin1', '亲', 'qīn', 'dekat / mencium', '💋'],
  ['f_qin2', '勤', 'qín', 'rajin', '🔨'],
  // ── qing ──
  ['f_qing1', '青', 'qīng', 'hijau muda', '🌿'],
  ['f_qing2', '情', 'qíng', 'perasaan', '💞'],
  ['f_qing3', '请', 'qǐng', 'silakan / mengundang', '🙇'],
  // ── qiong ──
  ['f_qiong2', '穷', 'qióng', 'miskin', '🪙'],
  // ── qiu ──
  ['f_qiu1', '秋', 'qiū', 'musim gugur', '🍂'],
  ['f_qiu2', '囚', 'qiú', 'tahanan', '⛓️'],
  // ── qu ──
  ['f_qu1', '区', 'qū', 'wilayah', '🗺️'],
  ['f_qu2', '渠', 'qú', 'saluran air', '💧'],
  ['f_qu3', '娶', 'qǔ', 'menikah (laki-laki)', '💍'],
  ['f_qu4', '趣', 'qù', 'menarik / lucu', '🎉'],
  // ── quan ──
  ['f_quan1', '圈', 'quān', 'lingkaran', '⭕'],
  ['f_quan2', '全', 'quán', 'lengkap / semua', '💯'],
  ['f_quan3', '犬', 'quǎn', 'anjing (formal)', '🐕'],
  ['f_quan4', '劝', 'quàn', 'menasihati', '🗣️'],
  // ── que ──
  ['f_que1', '缺', 'quē', 'kurang / bolong', '🧩'],
  ['f_que4', '却', 'què', 'namun', '↩️'],
  // ── qun ──
  ['f_qun2', '裙', 'qún', 'rok', '👗'],
  // ── ran ──
  ['f_ran2', '然', 'rán', 'benar / alami', '🌿'],
  ['f_ran3', '染', 'rǎn', 'mewarnai', '🎨'],
  // ── rang ──
  ['f_rang2', '嚷', 'rāng', 'berteriak pelan', '📢'],
  ['f_rang3', '嚷', 'rǎng', 'berteriak', '📢'],
  ['f_rang4', '让', 'ràng', 'membiarkan', '🙅'],
  // ── rao ──
  ['f_rao2', '饶', 'ráo', 'memaafkan / berlimpah', '🕊️'],
  ['f_rao3', '扰', 'rǎo', 'mengganggu', '📵'],
  // ── re ──
  ['f_re3', '惹', 'rě', 'menimbulkan / mengganggu', '⚠️'],
  ['f_re4', '热', 'rè', 'panas', '🔥'],
  // ── ren ──
  ['f_ren2', '人', 'rén', 'orang', '🧍'],
  ['f_ren3', '忍', 'rěn', 'menahan diri', '🧘'],
  ['f_ren4', '认', 'rèn', 'mengenali', '👀'],
  // ── reng ──
  ['f_reng1', '扔', 'rēng', 'membuang', '🗑️'],
  // ── ri ──
  ['f_ri4', '日', 'rì', 'hari / matahari', '☀️'],
  // ── rong ──
  ['f_rong2', '容', 'róng', 'muka / memuat', '😊'],
  ['f_rong3', '冗', 'rǒng', 'bertele-tele', '📄'],
  // ── rou ──
  ['f_rou2', '柔', 'róu', 'lembut', '🪶'],
  ['f_rou4', '肉', 'ròu', 'daging', '🥩'],
  // ── ru ──
  ['f_ru2', '如', 'rú', 'seperti', '🪞'],
  ['f_ru3', '辱', 'rǔ', 'menghina', '😖'],
  ['f_ru4', '入', 'rù', 'masuk', '📥'],
  // ── ruan ──
  ['f_ruan3', '软', 'ruǎn', 'lunak', '🪶'],
  // ── rui ──
  ['f_rui3', '蕊', 'ruǐ', 'putik bunga', '🌸'],
  ['f_rui4', '瑞', 'ruì', 'beruntung', '🍀'],
  // ── run ──
  ['f_run4', '润', 'rùn', 'halus / melembap', '💧'],
  // ── ruo ──
  ['f_ruo4', '若', 'ruò', 'seperti / jika', '🪞'],
  // ── sa ──
  ['f_sa1', '撒', 'sā', 'menabur', '🧂'],
  ['f_sa3', '洒', 'sǎ', 'menyiram', '🚿'],
  ['f_sa4', '卅', 'sà', 'tiga puluh', '🔢'],
  // ── sai ──
  ['f_sai1', '腮', 'sāi', 'pipi', '😊'],
  ['f_sai4', '赛', 'sài', 'lomba', '🏆'],
  // ── san ──
  ['f_san1', '三', 'sān', 'tiga', '3️⃣'],
  ['f_san3', '散', 'sǎn', 'longgar', '🪢'],
  ['f_san4', '散', 'sàn', 'menyebar', '💨'],
  // ── sang ──
  ['f_sang1', '桑', 'sāng', 'pohon murbei', '🌿'],
  ['f_sang3', '嗓', 'sǎng', 'tenggorokan', '🗣️'],
  // ── sao ──
  ['f_sao1', '搔', 'sāo', 'menggaruk', '🤚'],
  ['f_sao3', '扫', 'sǎo', 'menyapu', '🧹'],
  // ── se ──
  ['f_se4', '色', 'sè', 'warna', '🎨'],
  // ── sen ──
  ['f_sen1', '森', 'sēn', 'hutan lebat', '🌲'],
  // ── seng ──
  ['f_seng1', '僧', 'sēng', 'biarawan', '🧘'],
  // ── sha ──
  ['f_sha1', '杀', 'shā', 'membunuh', '⚔️'],
  ['f_sha2', '啥', 'shá', 'apa (kolokial)', '❓'],
  ['f_sha3', '傻', 'shǎ', 'bodoh / polos', '🤪'],
  ['f_sha4', '厦', 'shà', 'gedung besar', '🏢'],
  // ── shai ──
  ['f_shai1', '筛', 'shāi', 'mengayak', '🥄'],
  ['f_shai4', '晒', 'shài', 'menjemur', '🌞'],
  // ── shan ──
  ['f_shan1', '山', 'shān', 'gunung', '⛰️'],
  ['f_shan3', '闪', 'shǎn', 'berkilat / menghindar', '⚡'],
  ['f_shan4', '扇', 'shàn', 'kipas', '🪭'],
  // ── shang ──
  ['f_shang1', '伤', 'shāng', 'cedera', '🩹'],
  ['f_shang3', '晌', 'shǎng', 'siang singkat', '🌤️'],
  ['f_shang4', '上', 'shàng', 'atas', '⬆️'],
  // ── shao ──
  ['f_shao1', '烧', 'shāo', 'membakar', '🔥'],
  ['f_shao2', '勺', 'sháo', 'sendok', '🥄'],
  ['f_shao3', '少', 'shǎo', 'sedikit', '➖'],
  // ── she ──
  ['f_she1', '奢', 'shē', 'boros / mewah', '💎'],
  ['f_she2', '蛇', 'shé', 'ular', '🐍'],
  ['f_she3', '舍', 'shě', 'melepas / gubuk', '🏚️'],
  ['f_she4', '社', 'shè', 'masyarakat / organisasi', '👥'],
  // ── shei ──
  ['f_shei2', '谁', 'shéi', 'siapa', '❓'],
  // ── shen ──
  ['f_shen1', '深', 'shēn', 'dalam', '🌊'],
  ['f_shen2', '神', 'shén', 'tuhan / semangat', '✨'],
  ['f_shen3', '沈', 'shěn', 'nama marga', '姓氏'],
  // ── sheng ──
  ['f_sheng1', '生', 'shēng', 'lahir / hidup', '🌱'],
  ['f_sheng2', '绳', 'shéng', 'tali', '🪢'],
  // ── shi ──
  ['f_shi1', '师', 'shī', 'guru / ahli', '🧑‍🏫'],
  ['f_shi2', '十', 'shí', 'sepuluh', '🔟'],
  ['f_shi3', '史', 'shǐ', 'sejarah', '🏛️'],
  ['f_shi4', '是', 'shì', 'adalah', '🟰'],
  // ── shou ──
  ['f_shou1', '收', 'shōu', 'menerima', '📥'],
  ['f_shou3', '手', 'shǒu', 'tangan', '🤚'],
  ['f_shou4', '寿', 'shòu', 'panjang umur', '🎂'],
  // ── shu ──
  ['f_shu1', '书', 'shū', 'buku', '📖'],
  ['f_shu2', '熟', 'shú', 'matang / akrab', '🍒'],
  ['f_shu3', '暑', 'shǔ', 'panas (musim)', '🌞'],
  ['f_shu4', '树', 'shù', 'pohon', '🌳'],
  // ── shua ──
  ['f_shua1', '刷', 'shuā', 'menyikat', '🪥'],
  ['f_shua3', '耍', 'shuǎ', 'bermain / mengakali', '🃏'],
  // ── shuai ──
  ['f_shuai1', '衰', 'shuāi', 'melemah', '📉'],
  ['f_shuai3', '甩', 'shuǎi', 'mengibaskan', '🤾'],
  ['f_shuai4', '率', 'shuài', 'garis / rasio', '📊'],
  // ── shuan ──
  ['f_shuan1', '栓', 'shuān', 'selak', '🔒'],
  ['f_shuan4', '涮', 'shuàn', 'merendam (makanan)', '🍲'],
  // ── shuang ──
  ['f_shuang1', '双', 'shuāng', 'pasang', '🧦'],
  ['f_shuang3', '爽', 'shuǎng', 'segar', '🌬️'],
  // ── shui ──
  ['f_shui2', '水', 'shuǐ', 'air', '💧'],
  ['f_shui4', '睡', 'shuì', 'tidur', '😴'],
  // ── shun ──
  ['f_shun3', '吮', 'shǔn', 'menyusu', '🍼'],
  ['f_shun4', '顺', 'shùn', 'lancar / mengikuti', '🛤️'],
  // ── shuo ──
  ['f_shuo1', '说', 'shuō', 'berbicara', '🗣️'],
  ['f_shuo4', '硕', 'shuò', 'besar / gemilang', '🎓'],
  // ── si ──
  ['f_si1', '思', 'sī', 'berpikir / merindukan', '💭'],
  ['f_si3', '死', 'sǐ', 'mati', '💀'],
  ['f_si4', '四', 'sì', 'empat', '4️⃣'],
  // ── song ──
  ['f_song1', '松', 'sōng', 'pinus / longgar', '🌲'],
  ['f_song3', '耸', 'sǒng', 'menjulang', '🗼'],
  ['f_song4', '送', 'sòng', 'mengantar / memberi', '🎁'],
  // ── su ──
  ['f_su1', '苏', 'sū', 'bangkit / sembuh', '🌱'],
  ['f_su2', '俗', 'sú', 'umum / kampungan', '👥'],
  ['f_su4', '速', 'sù', 'cepat / kecepatan', '⚡'],
  // ── suan ──
  ['f_suan1', '酸', 'suān', 'asam', '🍋'],
  ['f_suan4', '算', 'suàn', 'menghitung', '🧮'],
  // ── sui ──
  ['f_sui1', '虽', 'suī', 'walaupun', '↩️'],
  ['f_sui2', '随', 'suí', 'mengikuti', '🚶'],
  ['f_sui3', '髓', 'suǐ', 'sumsum tulang', '🦴'],
  ['f_sui4', '岁', 'suì', 'tahun (umur)', '🎂'],
  // ── sun ──
  ['f_sun1', '孙', 'sūn', 'cucu', '👶'],
  ['f_sun3', '损', 'sǔn', 'rusak / rugi', '📉'],
  // ── suo ──
  ['f_suo1', '缩', 'suō', 'menyusut', '📉'],
  ['f_suo3', '所', 'suǒ', 'tempat / (partikel)', '🏢'],
  ['f_suo4', '锁', 'suò', 'kunci', '🔒'],
  // ── ta ──
  ['f_ta1', '他', 'tā', 'dia (LK)', '👨'],
  ['f_ta3', '塔', 'tǎ', 'menara', '🗼'],
  ['f_ta4', '踏', 'tà', 'menginjak', '🦶'],
  // ── tai ──
  ['f_tai1', '台', 'tái', 'meja / stasiun', '📺'],
  ['f_tai2', '抬', 'tái', 'mengangkat', '🏋️'],
  ['f_tai4', '太', 'tài', 'terlalu / sangat', '💯'],
  // ── tan ──
  ['f_tan1', '贪', 'tān', 'tamak', '🤑'],
  ['f_tan2', '谈', 'tán', 'berbicara', '💬'],
  ['f_tan3', '毯', 'tǎn', 'karpet', '🧶'],
  ['f_tan4', '叹', 'tàn', 'mengeluh', '😮‍💨'],
  // ── tang ──
  ['f_tang1', '汤', 'tāng', 'sup', '🍲'],
  ['f_tang2', '糖', 'táng', 'gula / permen', '🍬'],
  ['f_tang3', '躺', 'tǎng', 'berbaring', '🛌'],
  ['f_tang4', '烫', 'tàng', 'panas menyengat', '♨️'],
  // ── tao ──
  ['f_tao1', '掏', 'tāo', 'mengeluarkan (saku)', '🤲'],
  ['f_tao2', '逃', 'táo', 'kabur', '🏃'],
  ['f_tao3', '萄', 'tǎo', 'anggur (葡萄)', '🍇'],
  ['f_tao4', '套', 'tào', 'rangka / sarung', '🧤'],
  // ── te ──
  ['f_te4', '特', 'tè', 'istimewa', '⭐'],
  // ── teng ──
  ['f_teng2', '疼', 'téng', 'sakit', '🤕'],
  // ── ti ──
  ['f_ti1', '梯', 'tī', 'tangga', '🪜'],
  ['f_ti2', '提', 'tí', 'mengangkat / menyebut', '🏋️'],
  ['f_ti3', '体', 'tǐ', 'tubuh', '🧍'],
  ['f_ti4', '替', 'tì', 'menggantikan', '🔁'],
  // ── tian ──
  ['f_tian1', '天', 'tiān', 'langit / hari', '🌤️'],
  ['f_tian2', '田', 'tián', 'sawah', '🌾'],
  ['f_tian3', '舔', 'tiǎn', 'menjilat', '👅'],
  // ── tiao ──
  ['f_tiao1', '挑', 'tiāo', 'memilih / mengangkat', '🤾'],
  ['f_tiao2', '条', 'tiáo', 'garis / kata bantu', '📏'],
  ['f_tiao3', '窕', 'tiǎo', 'anggun (jarang)', '💃'],
  ['f_tiao4', '跳', 'tiào', 'melompat', '🦘'],
  // ── tie ──
  ['f_tie1', '贴', 'tiē', 'menempel', '📎'],
  ['f_tie3', '铁', 'tiě', 'besi', '🔩'],
  // ── ting ──
  ['f_ting1', '听', 'tīng', 'mendengar', '👂'],
  ['f_ting2', '停', 'tíng', 'berhenti', '🛑'],
  ['f_ting3', '艇', 'tǐng', 'perahu kecil', '🚤'],
  // ── tong ──
  ['f_tong1', '通', 'tōng', 'lancar / menghubungkan', '🛤️'],
  ['f_tong2', '同', 'tóng', 'sama', '🟰'],
  ['f_tong3', '桶', 'tǒng', 'ember', '🪣'],
  ['f_tong4', '痛', 'tòng', 'sakit', '🤕'],
  // ── tou ──
  ['f_tou1', '偷', 'tōu', 'mencuri', '🥷'],
  ['f_tou2', '头', 'tóu', 'kepala', '🧠'],
  // ── tu ──
  ['f_tu1', '秃', 'tū', 'botak', '🧑‍🦲'],
  ['f_tu2', '图', 'tú', 'gambar / peta', '🗺️'],
  ['f_tu3', '吐', 'tǔ', 'muntah / meludah', '🤮'],
  ['f_tu4', '兔', 'tù', 'kelinci', '🐰'],
  // ── tuan ──
  ['f_tuan2', '团', 'tuán', 'kelompok / bulat', '🧑‍🤝‍🧑'],
  // ── tui ──
  ['f_tui1', '推', 'tuī', 'mendorong', '🫸'],
  ['f_tui2', '腿', 'tuǐ', 'kaki', '🦵'],
  ['f_tui4', '退', 'tuì', 'mundur / kembalikan', '🔙'],
  // ── tun ──
  ['f_tun1', '吞', 'tūn', 'menelan', '👄'],
  ['f_tun2', '臀', 'tún', 'pinggul', '🍑'],
  // ── tuo ──
  ['f_tuo1', '拖', 'tuō', 'menyeret', '🧹'],
  ['f_tuo2', '驼', 'tuó', 'unta', '🐪'],
  ['f_tuo3', '椭', 'tuǒ', 'oval', '🥚'],
  // ── wa ──
  ['f_wa1', '挖', 'wā', 'menggali', '⛏️'],
  ['f_wa2', '娃', 'wá', 'bayi / anak', '👶'],
  ['f_wa3', '瓦', 'wǎ', 'genteng', '🏠'],
  ['f_wa4', '袜', 'wà', 'kaus kaki', '🧦'],
  // ── wai ──
  ['f_wai1', '歪', 'wāi', 'miring', '🥴'],
  ['f_wai4', '外', 'wài', 'luar', '🌍'],
  // ── wan ──
  ['f_wan1', '弯', 'wān', 'tikung / melengkung', '🌙'],
  ['f_wan2', '玩', 'wán', 'bermain', '🎲'],
  ['f_wan3', '晚', 'wǎn', 'malam', '🌃'],
  ['f_wan4', '万', 'wàn', 'sepuluh ribu', '🔢'],
  // ── wang ──
  ['f_wang1', '汪', 'wāng', 'genangan', '💧'],
  ['f_wang2', '王', 'wáng', 'raja', '👑'],
  ['f_wang3', '网', 'wǎng', 'jaring / internet', '🕸️'],
  ['f_wang4', '忘', 'wàng', 'lupa', '🤦'],
  // ── wei ──
  ['f_wei1', '威', 'wēi', 'wibawa', '🦁'],
  ['f_wei2', '围', 'wéi', 'melingkar / sekitar', '⭕'],
  ['f_wei3', '伟', 'wěi', 'agung', '🏔️'],
  ['f_wei4', '位', 'wèi', 'tempat / (kata bantu)', '💺'],
  // ── wen ──
  ['f_wen1', '温', 'wēn', 'hangat / suhu', '🌡️'],
  ['f_wen2', '文', 'wén', 'tulisan / budaya', '📜'],
  ['f_wen3', '稳', 'wěn', 'stabil', '⚖️'],
  ['f_wen4', '问', 'wèn', 'bertanya', '❓'],
  // ── weng ──
  ['f_weng1', '翁', 'wēng', 'kakek / tua', '👴'],
  // ── wo ──
  ['f_wo1', '涡', 'wō', 'pusaran', '🌀'],
  ['f_wo3', '我', 'wǒ', 'saya', '🙋'],
  ['f_wo4', '卧', 'wò', 'berbaring', '🛌'],
  // ── wu ──
  ['f_wu1', '屋', 'wū', 'rumah / kamar', '🏠'],
  ['f_wu2', '无', 'wú', 'tanpa / tidak ada', '🚫'],
  ['f_wu3', '五', 'wǔ', 'lima', '5️⃣'],
  ['f_wu4', '误', 'wù', 'salah / kesalahan', '❌'],
  // ── xi ──
  ['f_xi1', '西', 'xī', 'barat', '🧭'],
  ['f_xi2', '席', 'xí', 'tikar / kursi', '🪑'],
  ['f_xi3', '洗', 'xǐ', 'mencuci', '🧼'],
  ['f_xi4', '戏', 'xì', 'drama / permainan', '🎭'],
  // ── xia ──
  ['f_xia1', '虾', 'xiā', 'udang', '🦐'],
  ['f_xia2', '侠', 'xiá', 'ksatria', '⚔️'],
  ['f_xia4', '下', 'xià', 'bawah / turun', '⬇️'],
  // ── xian ──
  ['f_xian1', '先', 'xiān', 'dulu / pertama', '🥇'],
  ['f_xian2', '闲', 'xián', 'senggang', '☕'],
  ['f_xian3', '显', 'xiǎn', 'terlihat jelas', '🔍'],
  ['f_xian4', '现', 'xiàn', 'sekarang / tunjukkan', '📍'],
  // ── xiang ──
  ['f_xiang1', '香', 'xiāng', 'wangi', '🌸'],
  ['f_xiang2', '箱', 'xiāng', 'kotak', '📦'],
  ['f_xiang3', '想', 'xiǎng', 'ingin / berpikir', '💭'],
  ['f_xiang4', '向', 'xiàng', 'arah / ke arah', '🧭'],
  // ── xiao ──
  ['f_xiao1', '削', 'xiāo', 'mengupas', '🔪'],
  ['f_xiao2', '淆', 'xiáo', 'mencampur (bingung)', '🌀'],
  ['f_xiao3', '小', 'xiǎo', 'kecil', '🐭'],
  ['f_xiao4', '笑', 'xiào', 'tertawa', '😄'],
  // ── xie ──
  ['f_xie1', '些', 'xiē', 'beberapa', '🔢'],
  ['f_xie2', '鞋', 'xié', 'sepatu', '👟'],
  ['f_xie3', '写', 'xiě', 'menulis', '✍️'],
  ['f_xie4', '蟹', 'xiè', 'kepiting', '🦀'],
  // ── xin ──
  ['f_xin1', '新', 'xīn', 'baru', '🆕'],
  ['f_xin4', '信', 'xìn', 'surat / percaya', '✉️'],
  // ── xing ──
  ['f_xing1', '星', 'xīng', 'bintang', '⭐'],
  ['f_xing2', '行', 'xíng', 'boleh / jalan', '🚶'],
  ['f_xing3', '醒', 'xǐng', 'bangun / sadar', '⏰'],
  ['f_xing4', '姓', 'xìng', 'marga', '姓氏'],
  // ── xiong ──
  ['f_xiong1', '兄', 'xiōng', 'kakak (formal)', '👨'],
  ['f_xiong2', '熊', 'xióng', 'beruang', '🐻'],
  // ── xiu ──
  ['f_xiu1', '休', 'xiū', 'istirahat', '🏖️'],
  ['f_xiu3', '朽', 'xiǔ', 'lapuk', '🪵'],
  ['f_xiu4', '秀', 'xiù', 'elegan / unggul', '🌸'],
  // ── xu ──
  ['f_xu1', '需', 'xū', 'membutuhkan', '🆘'],
  ['f_xu2', '徐', 'xú', 'perlahan', '🐢'],
  ['f_xu3', '许', 'xǔ', 'mengizinkan', '✅'],
  ['f_xu4', '序', 'xù', 'urutan', '🔢'],
  // ── xuan ──
  ['f_xuan1', '宣', 'xuān', 'mengumumkan', '📢'],
  ['f_xuan2', '悬', 'xuán', 'menggantung', '🪝'],
  ['f_xuan3', '选', 'xuǎn', 'memilih', '🔀'],
  // ── xue ──
  ['f_xue1', '削', 'xuē', 'memotong tipis', '🔪'],
  ['f_xue2', '学', 'xué', 'belajar', '📚'],
  ['f_xue3', '雪', 'xuě', 'salju', '❄️'],
  ['f_xue4', '血', 'xuè', 'darah', '🩸'],
  // ── xun ──
  ['f_xun1', '勋', 'xūn', 'jasa kebesaran', '🎖️'],
  ['f_xun2', '寻', 'xún', 'mencari', '🔎'],
  ['f_xun4', '讯', 'xùn', 'berita / sinyal', '📡'],
  // ── ya ──
  ['f_ya1', '压', 'yā', 'menekan', '🫸'],
  ['f_ya2', '牙', 'yá', 'gigi', '🦷'],
  ['f_ya3', '雅', 'yǎ', 'elegan', '🦢'],
  ['f_ya4', '亚', 'yà', 'Asia / kedua', '🌏'],
  // ── yan ──
  ['f_yan1', '烟', 'yān', 'asap / rokok', '🚬'],
  ['f_yan2', '盐', 'yán', 'garam', '🧂'],
  ['f_yan3', '眼', 'yǎn', 'mata', '👁️'],
  ['f_yan4', '宴', 'yàn', 'pesta', '🎉'],
  // ── yang ──
  ['f_yang1', '央', 'yāng', 'tengah', '🎯'],
  ['f_yang2', '羊', 'yáng', 'kambing', '🐐'],
  ['f_yang3', '氧', 'yǎng', 'oksigen', '💨'],
  ['f_yang4', '样', 'yàng', 'bentuk / macam', '🧩'],
  // ── yao ──
  ['f_yao1', '邀', 'yāo', 'mengundang', '💌'],
  ['f_yao2', '摇', 'yáo', 'menggoyang', '🌪️'],
  ['f_yao3', '咬', 'yǎo', 'menggigit', '🦷'],
  ['f_yao4', '钥', 'yào', 'kunci (钥匙)', '🔑'],
  // ── ye ──
  ['f_ye1', '椰', 'yē', 'kelapa', '🥥'],
  ['f_ye2', '爷', 'yé', 'kakek', '👴'],
  ['f_ye3', '也', 'yě', 'juga', '➕'],
  ['f_ye4', '叶', 'yè', 'daun', '🍃'],
  // ── yi ──
  ['f_yi1', '一', 'yī', 'satu', '1️⃣'],
  ['f_yi2', '移', 'yí', 'menggeser / pindah', '↔️'],
  ['f_yi3', '椅', 'yǐ', 'kursi', '🪑'],
  ['f_yi4', '亿', 'yì', 'seratus juta', '🔢'],
  // ── yin ──
  ['f_yin1', '因', 'yīn', 'karena / sebab', '➡️'],
  ['f_yin2', '银', 'yín', 'perak', '🥈'],
  ['f_yin3', '引', 'yǐn', 'menarik / memimpin', '🧲'],
  ['f_yin4', '印', 'yìn', 'mencetak', '🖨️'],
  // ── ying ──
  ['f_ying1', '英', 'yīng', 'Inggris / gagah', '🇬🇧'],
  ['f_ying2', '赢', 'yíng', 'menang', '🏆'],
  ['f_ying3', '影', 'yǐng', 'bayangan / film', '🎬'],
  ['f_ying4', '应', 'yìng', 'menjawab', '↩️'],
  // ── yo ──
  ['f_yo1', '哟', 'yō', 'yo (seru)', '👋'],
  // ── yong ──
  ['f_yong1', '拥', 'yōng', 'merangkul', '🫂'],
  ['f_yong2', '用', 'yòng', 'memakai', '🛠️'],
  ['f_yong4', '涌', 'yǒng', 'membubung', '🌊'],
  // ── you ──
  ['f_you1', '优', 'yōu', 'unggul', '🥇'],
  ['f_you2', '油', 'yóu', 'minyak', '🛢️'],
  ['f_you3', '友', 'yǒu', 'teman', '🧑‍🤝‍🧑'],
  ['f_you4', '又', 'yòu', 'lagi / sekali lagi', '🔁'],
  // ── yu ──
  ['f_yu1', '淤', 'yū', 'sedimen', '🟤'],
  ['f_yu2', '鱼', 'yú', 'ikan', '🐟'],
  ['f_yu3', '雨', 'yǔ', 'hujan', '🌧️'],
  ['f_yu4', '玉', 'yù', 'batu giok', '💎'],
  // ── yuan ──
  ['f_yuan1', '冤', 'yuān', 'salah tuduh', '😔'],
  ['f_yuan2', '元', 'yuán', 'yuan / bulat', '💴'],
  ['f_yuan3', '远', 'yuǎn', 'jauh', '🛣️'],
  ['f_yuan4', '愿', 'yuàn', 'berharap / bersedia', '🌠'],
  // ── yue ──
  ['f_yue1', '约', 'yuē', 'janji / kira-kira', '📅'],
  ['f_yue4', '月', 'yuè', 'bulan', '🌙'],
  // ── yun ──
  ['f_yun1', '晕', 'yūn', 'pusing', '💫'],
  ['f_yun2', '云', 'yún', 'awan', '☁️'],
  ['f_yun4', '运', 'yùn', 'untung / mengangkut', '🚚'],
  // ── za ──
  ['f_za1', '扎', 'zā', 'mengikat / menyematkan', '🪢'],
  ['f_za2', '砸', 'zá', 'menghantam', '🔨'],
  // ── zai ──
  ['f_zai1', '灾', 'zāi', 'bencana', '🌪️'],
  ['f_zai3', '宰', 'zǎi', 'menyembelih', '🔪'],
  ['f_zai4', '在', 'zài', 'di / sedang', '📍'],
  // ── zan ──
  ['f_zan1', '簪', 'zān', 'cunduk', '💍'],
  ['f_zan2', '咱', 'zán', 'kita', '🧑‍🤝‍🧑'],
  ['f_zan4', '赞', 'zàn', 'memuji / suka', '👍'],
  // ── zang ──
  ['f_zang1', '脏', 'zāng', 'kotor', '🧼'],
  ['f_zang4', '脏', 'zàng', 'organ tubuh', '🫀'],
  // ── zao ──
  ['f_zao1', '遭', 'zāo', 'mengalami', '😱'],
  ['f_zao2', '凿', 'záo', 'mengebor', '⛏️'],
  ['f_zao3', '枣', 'zǎo', 'kurma', '🫘'],
  ['f_zao4', '皂', 'zào', 'sabun', '🧼'],
  // ── ze ──
  ['f_ze2', '则', 'zé', 'aturan / maka', '📏'],
  // ── zei ──
  ['f_zei2', '贼', 'zéi', 'pencuri', '🥷'],
  // ── zen ──
  ['f_zen3', '怎', 'zěn', 'bagaimana', '❓'],
  // ── zeng ──
  ['f_zeng1', '增', 'zēng', 'menambah', '📈'],
  ['f_zeng4', '赠', 'zèng', 'memberi hadiah', '🎁'],
  // ── zha ──
  ['f_zha1', '扎', 'zhā', 'menusuk', '📌'],
  ['f_zha2', '闸', 'zhá', 'pintu air', '🚧'],
  ['f_zha3', '眨', 'zhǎ', 'berkedip', '👁️'],
  ['f_zha4', '榨', 'zhà', 'memeras', '🧃'],
  // ── zhai ──
  ['f_zhai1', '摘', 'zhāi', 'memetik', '🍒'],
  ['f_zhai2', '宅', 'zhái', 'rumah tinggal', '🏠'],
  ['f_zhai3', '窄', 'zhǎi', 'sempit', '📏'],
  // ── zhan ──
  ['f_zhan1', '沾', 'zhān', 'terkena', '💧'],
  ['f_zhan2', '盏', 'zhǎn', 'lampu (kata bantu)', '💡'],
  ['f_zhan3', '斩', 'zhǎn', 'menebas', '⚔️'],
  ['f_zhan4', '站', 'zhàn', 'stasiun / berdiri', '🚉'],
  // ── zhang ──
  ['f_zhang1', '张', 'zhāng', '(kata bantu datar)', '📄'],
  ['f_zhang3', '长', 'zhǎng', 'tumbuh / kepala', '📏'],
  ['f_zhang4', '账', 'zhàng', 'tagihan', '🧾'],
  // ── zhao ──
  ['f_zhao1', '招', 'zhāo', 'mengundang / gerakan', '👋'],
  ['f_zhao2', '着', 'zháo', 'menyala / kena', '🔥'],
  ['f_zhao3', '找', 'zhǎo', 'mencari', '🔎'],
  ['f_zhao4', '照', 'zhào', 'foto / sesuai', '📷'],
  // ── zhe ──
  ['f_zhe1', '折', 'zhé', 'melipat / diskon', '🏷️'],
  ['f_zhe5', '着', 'zhe', '(partikel sedang)', '🔁'],
  // ── zhen ──
  ['f_zhen1', '真', 'zhēn', 'benar / sungguh', '💯'],
  ['f_zhen3', '诊', 'zhěn', 'memeriksa (dokter)', '🩺'],
  ['f_zhen4', '阵', 'zhèn', 'gelombang / formasi', '🌬️'],
  // ── zheng ──
  ['f_zheng1', '争', 'zhēng', 'berebut', '🥇'],
  ['f_zheng3', '整', 'zhěng', 'utuh / tepat', '🧮'],
  ['f_zheng4', '证', 'zhèng', 'bukti / sertifikat', '🪪'],
  // ── zhi ──
  ['f_zhi1', '之', 'zhī', '(partikel milik klasik)', '🔗'],
  ['f_zhi2', '直', 'zhí', 'lurus / terus', '📏'],
  ['f_zhi3', '纸', 'zhǐ', 'kertas', '📄'],
  ['f_zhi4', '至', 'zhì', 'sampai', '🏁'],
  // ── zhong ──
  ['f_zhong1', '中', 'zhōng', 'tengah', '🎯'],
  ['f_zhong3', '种', 'zhǒng', 'jenis / benih', '🌱'],
  ['f_zhong4', '重', 'zhòng', 'berat', '🏋️'],
  // ── zhou ──
  ['f_zhou1', '周', 'zhōu', 'pekan / keliling', '📆'],
  ['f_zhou2', '轴', 'zhóu', 'poros', '⚙️'],
  ['f_zhou3', '肘', 'zhǒu', 'siku', '💪'],
  ['f_zhou4', '皱', 'zhòu', 'kerut', '👴'],
  // ── zhu ──
  ['f_zhu1', '猪', 'zhū', 'babi', '🐷'],
  ['f_zhu2', '竹', 'zhú', 'bambu', '🎍'],
  ['f_zhu3', '煮', 'zhǔ', 'merebus', '🍲'],
  ['f_zhu4', '住', 'zhù', 'tinggal', '🏘️'],
  // ── zhua ──
  ['f_zhua1', '抓', 'zhuā', 'meraih / mencengkeram', '🤏'],
  // ── zhuai ──
  ['f_zhuai3', '拽', 'zhuǎi', 'mengibas / gaya kampung', '🤾'],
  // ── zhuan ──
  ['f_zhuan1', '专', 'zhuān', 'khusus / fokus', '🎯'],
  ['f_zhuan3', '转', 'zhuǎn', 'berputar', '🔄'],
  ['f_zhuan4', '转', 'zhuàn', 'memutar', '🔄'],
  // ── zhuang ──
  ['f_zhuang1', '装', 'zhuāng', 'memasang / berpura-pura', '📦'],
  ['f_zhuang4', '壮', 'zhuàng', 'kuat / gagah', '💪'],
  // ── zhui ──
  ['f_zhui1', '追', 'zhuī', 'mengejar', '🏃'],
  ['f_zhui4', '坠', 'zhuì', 'jatuh', '🪂'],
  // ── zhun ──
  ['f_zhun3', '准', 'zhǔn', 'tepat / mengizinkan', '🎯'],
  // ── zhuo ──
  ['f_zhuo1', '桌', 'zhuō', 'meja', '🪵'],
  ['f_zhuo2', '浊', 'zhuó', 'keruh', '🌊'],
  // ── zi ──
  ['f_zi1', '资', 'zī', 'modal / pengalaman', '💰'],
  ['f_zi3', '子', 'zǐ', 'anak / benih', '👶'],
  ['f_zi4', '自', 'zì', 'sendiri', '🤳'],
  // ── zong ──
  ['f_zong1', '宗', 'zōng', 'klan / utama', '🏛️'],
  ['f_zong3', '总', 'zǒng', 'total / selalu', '🧮'],
  // ── zou ──
  ['f_zou1', '邹', 'zōu', 'nama marga', '姓氏'],
  ['f_zou3', '走', 'zǒu', 'berjalan', '🚶'],
  // ── zu ──
  ['f_zu1', '租', 'zū', 'menyewa', '🔑'],
  ['f_zu2', '族', 'zú', 'suku / kelompok', '👥'],
  ['f_zu3', '阻', 'zǔ', 'menghalangi', '🚧'],
  // ── zuan ──
  ['f_zuan1', '钻', 'zuān', 'mengebor', '⛏️'],
  ['f_zuan4', '钻', 'zuàn', 'bor / permata', '💎'],
  // ── zui ──
  ['f_zui3', '嘴', 'zuǐ', 'mulut', '👄'],
  ['f_zui4', '最', 'zuì', 'paling', '🥇'],
  // ── zun ──
  ['f_zun1', '尊', 'zūn', 'menghormati', '🙏'],
  // ── zuo ──
  ['f_zuo1', '作', 'zuō', 'membuat (zuò)', '🔨'],
  ['f_zuo3', '左', 'zuǒ', 'kiri', '⬅️'],
  ['f_zuo4', '坐', 'zuò', 'duduk', '🪑'],
];

/**
 * Kejujuran linguistik: nada valid per suku kata (format tanpa nada).
 * Suku kata yang tidak tercantum dianggap semua 4 nada valid.
 * Sumber: chart suku kata Mandarin standar (pinyin table).
 */
export const MANDARIN_VALID_TONES: Record<string, (1 | 2 | 3 | 4)[]> = {
  ben: [1, 3, 4],       // bēn/běn/bèn — tidak ada nada 2
  bang: [1, 4],         // bāng/bàng
  kei: [1],
  den: [4],
  dia: [3],
  eng: [1],
  yo: [1],
  o: [1, 2],
  chua: [4],
  rua: [2],
  nou: [2],
  nue: [4],
  lue: [4],
  run: [4],
  sen: [1],
  reng: [1],
  shei: [2],
  zhei: [4],
  gei: [2, 3],
};

/**
 * Mengubah daftar filler tuple menjadi ChineseWord penuh (hskLevel 0 = di luar HSK).
 */
export function buildToneFillers(): ChineseWord[] {
  return FILLERS.map(([id, hanzi, pinyin, arti, emoji, imageKey]) =>
    w(id, 1, hanzi, pinyin, [arti], null, {
      pos: 'di luar HSK',
      emoji: emoji || '🈂️',
      imageKey,
    })
  ).map((word) => ({ ...word, hskLevel: 0 }));
}
