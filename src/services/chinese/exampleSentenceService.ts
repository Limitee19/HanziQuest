/**
 * exampleSentenceService.ts
 * Menyediakan 1 contoh kalimat berkualitas tinggi (Hanzi, Pinyin, dan Terjemahan Indonesia)
 * untuk setiap kosakata yang dipelajari pada sesi latihan kartu pintar / SRS.
 * Semua kalimat contoh adalah kalimat sederhana, alami, dan dapat didengarkan.
 */

import { FULL_HSK_DATASET } from './dataset';

export interface ExampleSentence {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

/**
 * Peta contoh kalimat kurasi — kalimat sederhana, alami, satu ide, mudah dimengerti.
 */
const CURATED_SENTENCES: Record<string, ExampleSentence> = {
  // ── PRONOMINA ─────────────────────────────────────────
  '我': { hanzi: '我是学生。', pinyin: 'Wǒ shì xuésheng.', meaning: 'Saya adalah pelajar.' },
  '你': { hanzi: '你好吗？', pinyin: 'Nǐ hǎo ma?', meaning: 'Apa kabarmu?' },
  '他': { hanzi: '他是我的老师。', pinyin: 'Tā shì wǒ de lǎoshī.', meaning: 'Dia adalah guruku.' },
  '她': { hanzi: '她叫小红。', pinyin: 'Tā jiào Xiǎohóng.', meaning: 'Namanya Xiaohong.' },
  '它': { hanzi: '那只猫，它很可爱。', pinyin: 'Nà zhī māo, tā hěn kě\'ài.', meaning: 'Kucing itu sangat lucu.' },
  '我们': { hanzi: '我们一起去吃饭。', pinyin: 'Wǒmen yìqǐ qù chīfàn.', meaning: 'Kita pergi makan bersama.' },
  '你们': { hanzi: '你们都是学生吗？', pinyin: 'Nǐmen dōu shì xuésheng ma?', meaning: 'Apakah kalian semua pelajar?' },
  '他们': { hanzi: '他们都在学汉语。', pinyin: 'Tāmen dōu zài xué Hànyǔ.', meaning: 'Mereka semua sedang belajar Mandarin.' },
  '她们': { hanzi: '她们下课了。', pinyin: 'Tāmen xiàkè le.', meaning: 'Mereka (perempuan) sudah selesai kelas.' },
  '它们': { hanzi: '那两只猫，它们都很可爱。', pinyin: 'Nà liǎng zhī māo, tāmen dōu hěn kě\'ài.', meaning: 'Dua kucing itu, keduanya sangat lucu.' },
  '您': { hanzi: '您好，请坐。', pinyin: 'Nín hǎo, qǐng zuò.', meaning: 'Selamat datang, silakan duduk.' },

  // ── DEMONSTRATIVA ──────────────────────────────────────
  '这': { hanzi: '这是我的书。', pinyin: 'Zhè shì wǒ de shū.', meaning: 'Ini adalah bukuku.' },
  '这个': { hanzi: '这个苹果很甜。', pinyin: 'Zhège píngguǒ hěn tián.', meaning: 'Apel ini sangat manis.' },
  '这些': { hanzi: '这些衣服都很漂亮。', pinyin: 'Zhèxiē yīfu dōu hěn piàoliang.', meaning: 'Semua baju ini sangat cantik.' },
  '这儿': { hanzi: '请坐在这儿。', pinyin: 'Qǐng zuò zài zhèr.', meaning: 'Silakan duduk di sini.' },
  '这里': { hanzi: '我住在这里。', pinyin: 'Wǒ zhù zài zhèlǐ.', meaning: 'Saya tinggal di sini.' },
  '这边': { hanzi: '请往这边走。', pinyin: 'Qǐng wǎng zhèbiān zǒu.', meaning: 'Silakan berjalan ke arah sini.' },
  '那': { hanzi: '那是什么？', pinyin: 'Nà shì shénme?', meaning: 'Itu apa?' },
  '那个': { hanzi: '那个人是谁？', pinyin: 'Nàge rén shì shuí?', meaning: 'Siapa orang itu?' },
  '那些': { hanzi: '那些书是我的。', pinyin: 'Nàxiē shū shì wǒ de.', meaning: 'Buku-buku itu adalah milikku.' },
  '那边': { hanzi: '厕所在那边。', pinyin: 'Cèsuǒ zài nàbiān.', meaning: 'Toilet ada di sana.' },
  '那里': { hanzi: '他住在那里。', pinyin: 'Tā zhù zài nàlǐ.', meaning: 'Dia tinggal di sana.' },
  '那儿': { hanzi: '那儿有一家餐馆。', pinyin: 'Nàr yǒu yī jiā cānguǎn.', meaning: 'Di sana ada sebuah restoran.' },
  '哪': { hanzi: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', meaning: 'Kamu orang negara mana?' },
  '哪个': { hanzi: '哪个是你的？', pinyin: 'Nǎge shì nǐ de?', meaning: 'Yang mana punyamu?' },
  '哪里': { hanzi: '洗手间在哪里？', pinyin: 'Xǐshǒujiān zài nǎlǐ?', meaning: 'Di mana toilet?' },
  '哪儿': { hanzi: '你去哪儿？', pinyin: 'Nǐ qù nǎr?', meaning: 'Kamu mau pergi ke mana?' },
  '哪些': { hanzi: '你喜欢哪些水果？', pinyin: 'Nǐ xǐhuan nǎxiē shuǐguǒ?', meaning: 'Kamu suka buah-buahan yang mana saja?' },

  // ── KELUARGA ───────────────────────────────────────────
  '爸爸': { hanzi: '爸爸在工作。', pinyin: 'Bàba zài gōngzuò.', meaning: 'Ayah sedang bekerja.' },
  '妈妈': { hanzi: '妈妈在做饭。', pinyin: 'Māma zài zuò fàn.', meaning: 'Ibu sedang memasak.' },
  '哥哥': { hanzi: '我哥哥很高。', pinyin: 'Wǒ gēge hěn gāo.', meaning: 'Kakak laki-lakiku sangat tinggi.' },
  '姐姐': { hanzi: '姐姐喜欢唱歌。', pinyin: 'Jiějie xǐhuan chànggē.', meaning: 'Kakak perempuan suka bernyanyi.' },
  '弟弟': { hanzi: '弟弟在玩。', pinyin: 'Dìdi zài wán.', meaning: 'Adik laki-laki sedang bermain.' },
  '妹妹': { hanzi: '妹妹很可爱。', pinyin: 'Mèimei hěn kě\'ài.', meaning: 'Adik perempuan sangat lucu.' },
  '儿子': { hanzi: '他有一个儿子。', pinyin: 'Tā yǒu yī gè érzi.', meaning: 'Dia punya satu anak laki-laki.' },
  '女儿': { hanzi: '她女儿很聪明。', pinyin: 'Tā nǚ\'ér hěn cōngming.', meaning: 'Anak perempuannya sangat cerdas.' },
  '孩子': { hanzi: '孩子们在玩。', pinyin: 'Háizimen zài wán.', meaning: 'Anak-anak sedang bermain.' },
  '家人': { hanzi: '我家人都很好。', pinyin: 'Wǒ jiārén dōu hěn hǎo.', meaning: 'Keluargaku semua baik-baik.' },
  '男朋友': { hanzi: '她有男朋友了。', pinyin: 'Tā yǒu nánpéngyou le.', meaning: 'Dia sudah punya pacar.' },
  '女朋友': { hanzi: '他的女朋友很漂亮。', pinyin: 'Tā de nǚpéngyou hěn piàoliang.', meaning: 'Pacar perempuannya sangat cantik.' },
  '朋友': { hanzi: '他是我的好朋友。', pinyin: 'Tā shì wǒ de hǎo péngyou.', meaning: 'Dia adalah teman baikku.' },
  '同学': { hanzi: '我们是同学。', pinyin: 'Wǒmen shì tóngxué.', meaning: 'Kami adalah teman sekelas.' },

  // ── KATA KERJA SEHARI-HARI ─────────────────────────────
  '爱': { hanzi: '我爱我的家人。', pinyin: 'Wǒ ài wǒ de jiārén.', meaning: 'Saya mencintai keluargaku.' },
  '吃': { hanzi: '我们一起吃饭吧。', pinyin: 'Wǒmen yìqǐ chīfàn ba.', meaning: 'Ayo kita makan bersama.' },
  '喝': { hanzi: '我每天喝茶。', pinyin: 'Wǒ měitiān hē chá.', meaning: 'Saya minum teh setiap hari.' },
  '看': { hanzi: '我在看书。', pinyin: 'Wǒ zài kàn shū.', meaning: 'Saya sedang membaca buku.' },
  '听': { hanzi: '我喜欢听音乐。', pinyin: 'Wǒ xǐhuan tīng yīnyuè.', meaning: 'Saya suka mendengarkan musik.' },
  '说': { hanzi: '他会说汉语。', pinyin: 'Tā huì shuō Hànyǔ.', meaning: 'Dia bisa berbicara Mandarin.' },
  '说话': { hanzi: '请不要说话。', pinyin: 'Qǐng bú yào shuōhuà.', meaning: 'Tolong jangan berbicara.' },
  '写': { hanzi: '我在写作业。', pinyin: 'Wǒ zài xiě zuòyè.', meaning: 'Saya sedang mengerjakan PR.' },
  '读': { hanzi: '她每天读书。', pinyin: 'Tā měitiān dúshū.', meaning: 'Dia membaca buku setiap hari.' },
  '读书': { hanzi: '孩子在读书。', pinyin: 'Háizi zài dúshū.', meaning: 'Anak sedang membaca buku.' },
  '买': { hanzi: '我去买水果。', pinyin: 'Wǒ qù mǎi shuǐguǒ.', meaning: 'Saya pergi membeli buah.' },
  '卖': { hanzi: '他卖苹果。', pinyin: 'Tā mài píngguǒ.', meaning: 'Dia menjual apel.' },
  '学': { hanzi: '我学汉语。', pinyin: 'Wǒ xué Hànyǔ.', meaning: 'Saya belajar bahasa Mandarin.' },
  '学习': { hanzi: '她每天学习。', pinyin: 'Tā měitiān xuéxí.', meaning: 'Dia belajar setiap hari.' },
  '工作': { hanzi: '爸爸每天去工作。', pinyin: 'Bàba měitiān qù gōngzuò.', meaning: 'Ayah pergi bekerja setiap hari.' },
  '住': { hanzi: '我住在北京。', pinyin: 'Wǒ zhù zài Běijīng.', meaning: 'Saya tinggal di Beijing.' },
  '来': { hanzi: '他来了。', pinyin: 'Tā lái le.', meaning: 'Dia sudah datang.' },
  '去': { hanzi: '我去学校。', pinyin: 'Wǒ qù xuéxiào.', meaning: 'Saya pergi ke sekolah.' },
  '回': { hanzi: '我明天回家。', pinyin: 'Wǒ míngtiān huí jiā.', meaning: 'Saya pulang ke rumah besok.' },
  '叫': { hanzi: '我叫小明。', pinyin: 'Wǒ jiào Xiǎomíng.', meaning: 'Nama saya Xiaoming.' },
  '开': { hanzi: '请开门。', pinyin: 'Qǐng kāi mén.', meaning: 'Tolong buka pintunya.' },
  '开车': { hanzi: '爸爸会开车。', pinyin: 'Bàba huì kāichē.', meaning: 'Ayah bisa mengemudi.' },
  '找': { hanzi: '我找不到钱包。', pinyin: 'Wǒ zhǎo bu dào qiánbāo.', meaning: 'Saya tidak bisa menemukan dompet.' },
  '问': { hanzi: '我想问一个问题。', pinyin: 'Wǒ xiǎng wèn yī gè wèntí.', meaning: 'Saya ingin menanyakan satu pertanyaan.' },
  '见': { hanzi: '明天见！', pinyin: 'Míngtiān jiàn!', meaning: 'Sampai jumpa besok!' },
  '认识': { hanzi: '很高兴认识你。', pinyin: 'Hěn gāoxìng rènshi nǐ.', meaning: 'Senang berkenalan denganmu.' },
  '知道': { hanzi: '我不知道。', pinyin: 'Wǒ bù zhīdào.', meaning: 'Saya tidak tahu.' },
  '觉得': { hanzi: '我觉得很累。', pinyin: 'Wǒ juéde hěn lèi.', meaning: 'Saya merasa sangat lelah.' },
  '喜欢': { hanzi: '我喜欢吃苹果。', pinyin: 'Wǒ xǐhuan chī píngguǒ.', meaning: 'Saya suka makan apel.' },
  '想': { hanzi: '我想吃火锅。', pinyin: 'Wǒ xiǎng chī huǒguō.', meaning: 'Saya ingin makan hotpot.' },
  '有': { hanzi: '我有一只猫。', pinyin: 'Wǒ yǒu yī zhī māo.', meaning: 'Saya punya seekor kucing.' },
  '是': { hanzi: '我是中国人。', pinyin: 'Wǒ shì Zhōngguórén.', meaning: 'Saya orang Tiongkok.' },
  '在': { hanzi: '他在家。', pinyin: 'Tā zài jiā.', meaning: 'Dia ada di rumah.' },
  '睡': { hanzi: '孩子睡了。', pinyin: 'Háizi shuì le.', meaning: 'Anak sudah tidur.' },
  '睡觉': { hanzi: '我要去睡觉了。', pinyin: 'Wǒ yào qù shuìjiào le.', meaning: 'Saya mau pergi tidur.' },
  '起床': { hanzi: '我每天六点起床。', pinyin: 'Wǒ měitiān liù diǎn qǐchuáng.', meaning: 'Saya bangun tidur jam 6 setiap hari.' },
  '坐': { hanzi: '请坐。', pinyin: 'Qǐng zuò.', meaning: 'Silakan duduk.' },
  '打电话': { hanzi: '我给妈妈打电话。', pinyin: 'Wǒ gěi māma dǎ diànhuà.', meaning: 'Saya menelepon ibu.' },
  '上班': { hanzi: '爸爸去上班了。', pinyin: 'Bàba qù shàngbān le.', meaning: 'Ayah sudah pergi bekerja.' },
  '下班': { hanzi: '妈妈下班回来了。', pinyin: 'Māma xiàbān huí lái le.', meaning: 'Ibu sudah pulang dari kerja.' },
  '上课': { hanzi: '我们要上课了。', pinyin: 'Wǒmen yào shàngkè le.', meaning: 'Kita akan mulai kelas.' },
  '下课': { hanzi: '下课了，我们走吧。', pinyin: 'Xiàkè le, wǒmen zǒu ba.', meaning: 'Kelas sudah selesai, ayo kita pergi.' },
  '上学': { hanzi: '孩子去上学了。', pinyin: 'Háizi qù shàngxué le.', meaning: 'Anak sudah pergi ke sekolah.' },
  '看病': { hanzi: '我去医院看病。', pinyin: 'Wǒ qù yīyuàn kànbìng.', meaning: 'Saya pergi ke rumah sakit berobat.' },
  '生病': { hanzi: '她生病了，在家休息。', pinyin: 'Tā shēngbìng le, zài jiā xiūxi.', meaning: 'Dia sakit, beristirahat di rumah.' },
  '看见': { hanzi: '我看见他了。', pinyin: 'Wǒ kànjiàn tā le.', meaning: 'Saya sudah melihatnya.' },
  '听见': { hanzi: '你听见了吗？', pinyin: 'Nǐ tīngjiàn le ma?', meaning: 'Apakah kamu mendengarnya?' },
  '做': { hanzi: '我在做作业。', pinyin: 'Wǒ zài zuò zuòyè.', meaning: 'Saya sedang mengerjakan PR.' },
  '做饭': { hanzi: '妈妈在做饭。', pinyin: 'Māma zài zuòfàn.', meaning: 'Ibu sedang memasak.' },
  '玩': { hanzi: '孩子们在玩。', pinyin: 'Háizimen zài wán.', meaning: 'Anak-anak sedang bermain.' },
  '唱': { hanzi: '她喜欢唱歌。', pinyin: 'Tā xǐhuan chàng gē.', meaning: 'Dia suka bernyanyi.' },
  '穿': { hanzi: '今天冷，多穿衣服。', pinyin: 'Jīntiān lěng, duō chuān yīfu.', meaning: 'Hari ini dingin, kenakan baju lebih banyak.' },
  '给': { hanzi: '我给你一本书。', pinyin: 'Wǒ gěi nǐ yī běn shū.', meaning: 'Saya memberikanmu sebuah buku.' },
  '请': { hanzi: '请进！', pinyin: 'Qǐng jìn!', meaning: 'Silakan masuk!' },
  '下': { hanzi: '外面下雨了。', pinyin: 'Wàimiàn xià yǔ le.', meaning: 'Di luar sudah hujan.' },
  '下雨': { hanzi: '今天下雨，带伞吧。', pinyin: 'Jīntiān xià yǔ, dài sǎn ba.', meaning: 'Hari ini hujan, bawa payung ya.' },
  '忙': { hanzi: '我最近很忙。', pinyin: 'Wǒ zuìjìn hěn máng.', meaning: 'Saya belakangan ini sangat sibuk.' },
  '没有': { hanzi: '我没有钱。', pinyin: 'Wǒ méiyǒu qián.', meaning: 'Saya tidak punya uang.' },
  '没': { hanzi: '他没来。', pinyin: 'Tā méi lái.', meaning: 'Dia tidak datang.' },
  '没事': { hanzi: '没事，不用担心。', pinyin: 'Méi shì, bú yòng dānxīn.', meaning: 'Tidak apa-apa, tidak perlu khawatir.' },

  // ── TEMPAT & LOKASI ────────────────────────────────────
  '家': { hanzi: '我家在学校旁边。', pinyin: 'Wǒ jiā zài xuéxiào pángbiān.', meaning: 'Rumahku ada di sebelah sekolah.' },
  '学校': { hanzi: '学校很大。', pinyin: 'Xuéxiào hěn dà.', meaning: 'Sekolahnya sangat besar.' },
  '医院': { hanzi: '医院在哪里？', pinyin: 'Yīyuàn zài nǎlǐ?', meaning: 'Di mana rumah sakit?' },
  '书店': { hanzi: '书店里有很多书。', pinyin: 'Shūdiàn lǐ yǒu hěn duō shū.', meaning: 'Di toko buku ada banyak buku.' },
  '商店': { hanzi: '商店开门了吗？', pinyin: 'Shāngdiàn kāimén le ma?', meaning: 'Apakah toko sudah buka?' },
  '饭店': { hanzi: '那家饭店很有名。', pinyin: 'Nà jiā fàndiàn hěn yǒumíng.', meaning: 'Restoran itu sangat terkenal.' },
  '电影院': { hanzi: '电影院在哪里？', pinyin: 'Diànyǐngyuàn zài nǎlǐ?', meaning: 'Di mana bioskop?' },
  '北京': { hanzi: '北京是中国的首都。', pinyin: 'Běijīng shì Zhōngguó de shǒudū.', meaning: 'Beijing adalah ibu kota Tiongkok.' },
  '中国': { hanzi: '中国很大。', pinyin: 'Zhōngguó hěn dà.', meaning: 'Tiongkok sangat luas.' },
  '超市': { hanzi: '我去超市买东西。', pinyin: 'Wǒ qù chāoshì mǎi dōngxi.', meaning: 'Saya pergi ke supermarket membeli barang.' },
  '房间': { hanzi: '我的房间很干净。', pinyin: 'Wǒ de fángjiān hěn gānjìng.', meaning: 'Kamarku sangat bersih.' },
  '后面': { hanzi: '学校在后面。', pinyin: 'Xuéxiào zài hòumiàn.', meaning: 'Sekolah ada di belakang.' },
  '里面': { hanzi: '包里面有什么？', pinyin: 'Bāo lǐmiàn yǒu shénme?', meaning: 'Di dalam tas ada apa?' },
  '前': { hanzi: '请走到前面来。', pinyin: 'Qǐng zǒu dào qiánmiàn lái.', meaning: 'Silakan maju ke depan.' },
  '边': { hanzi: '学校旁边有公园。', pinyin: 'Xuéxiào pángbiān yǒu gōngyuán.', meaning: 'Di sebelah sekolah ada taman.' },

  // ── MAKANAN & MINUMAN ──────────────────────────────────
  '茶': { hanzi: '我每天喝茶。', pinyin: 'Wǒ měitiān hē chá.', meaning: 'Saya minum teh setiap hari.' },
  '米饭': { hanzi: '我想吃米饭。', pinyin: 'Wǒ xiǎng chī mǐfàn.', meaning: 'Saya ingin makan nasi.' },
  '面包': { hanzi: '早上我吃面包。', pinyin: 'Zǎoshang wǒ chī miànbāo.', meaning: 'Pagi-pagi saya makan roti.' },
  '面条儿': { hanzi: '我喜欢吃面条儿。', pinyin: 'Wǒ xǐhuan chī miàntiáor.', meaning: 'Saya suka makan mie.' },
  '鸡蛋': { hanzi: '鸡蛋很好吃。', pinyin: 'Jīdàn hěn hǎochī.', meaning: 'Telur sangat enak.' },
  '牛奶': { hanzi: '孩子喜欢喝牛奶。', pinyin: 'Háizi xǐhuan hē niúnǎi.', meaning: 'Anak suka minum susu.' },
  '水果': { hanzi: '我喜欢吃水果。', pinyin: 'Wǒ xǐhuan chī shuǐguǒ.', meaning: 'Saya suka makan buah.' },
  '水': { hanzi: '请给我一杯水。', pinyin: 'Qǐng gěi wǒ yī bēi shuǐ.', meaning: 'Tolong beri saya segelas air.' },
  '苹果': { hanzi: '苹果很甜。', pinyin: 'Píngguǒ hěn tián.', meaning: 'Apelnya sangat manis.' },
  '菜': { hanzi: '今天的菜很好吃。', pinyin: 'Jīntiān de cài hěn hǎochī.', meaning: 'Masakan hari ini sangat enak.' },
  '饭': { hanzi: '饭做好了，来吃吧。', pinyin: 'Fàn zuò hǎo le, lái chī ba.', meaning: 'Makanan sudah siap, ayo makan.' },
  '午饭': { hanzi: '我们去吃午饭。', pinyin: 'Wǒmen qù chī wǔfàn.', meaning: 'Kita pergi makan siang.' },
  '晚饭': { hanzi: '晚饭吃什么？', pinyin: 'Wǎnfàn chī shénme?', meaning: 'Makan malam mau makan apa?' },
  '早饭': { hanzi: '你吃早饭了吗？', pinyin: 'Nǐ chī zǎofàn le ma?', meaning: 'Apakah kamu sudah sarapan?' },
  '包子': { hanzi: '我喜欢吃包子。', pinyin: 'Wǒ xǐhuan chī bāozi.', meaning: 'Saya suka makan bakpao.' },
  '饺子': { hanzi: '我们一起包饺子吧。', pinyin: 'Wǒmen yìqǐ bāo jiǎozi ba.', meaning: 'Ayo kita bungkus pangsit bersama.' },

  // ── BENDA SEHARI-HARI ──────────────────────────────────
  '书': { hanzi: '这本书很好看。', pinyin: 'Zhè běn shū hěn hǎokàn.', meaning: 'Buku ini sangat menarik.' },
  '手机': { hanzi: '我的手机没电了。', pinyin: 'Wǒ de shǒujī méi diàn le.', meaning: 'Ponselku sudah kehabisan baterai.' },
  '电脑': { hanzi: '电脑放在桌子上。', pinyin: 'Diànnǎo fàng zài zhuōzi shàng.', meaning: 'Komputer diletakkan di atas meja.' },
  '电话': { hanzi: '电话号码是多少？', pinyin: 'Diànhuà hàomǎ shì duōshao?', meaning: 'Berapa nomor teleponnya?' },
  '电视': { hanzi: '晚上我看电视。', pinyin: 'Wǎnshang wǒ kàn diànshì.', meaning: 'Malam hari saya menonton TV.' },
  '电影': { hanzi: '这部电影很好看。', pinyin: 'Zhè bù diànyǐng hěn hǎokàn.', meaning: 'Film ini sangat bagus.' },
  '桌子': { hanzi: '书放在桌子上。', pinyin: 'Shū fàng zài zhuōzi shàng.', meaning: 'Buku diletakkan di atas meja.' },
  '椅子': { hanzi: '请坐在椅子上。', pinyin: 'Qǐng zuò zài yǐzi shàng.', meaning: 'Silakan duduk di kursi.' },
  '杯子': { hanzi: '这个杯子很干净。', pinyin: 'Zhège bēizi hěn gānjìng.', meaning: 'Gelas ini sangat bersih.' },
  '衣服': { hanzi: '这件衣服很好看。', pinyin: 'Zhè jiàn yīfu hěn hǎokàn.', meaning: 'Baju ini sangat bagus.' },
  '出租车': { hanzi: '我坐出租车去机场。', pinyin: 'Wǒ zuò chūzūchē qù jīchǎng.', meaning: 'Saya naik taksi ke bandara.' },
  '火车': { hanzi: '我坐火车去北京。', pinyin: 'Wǒ zuò huǒchē qù Běijīng.', meaning: 'Saya naik kereta ke Beijing.' },
  '飞机': { hanzi: '飞机要起飞了。', pinyin: 'Fēijī yào qǐfēi le.', meaning: 'Pesawat akan segera lepas landas.' },
  '钱': { hanzi: '这个多少钱？', pinyin: 'Zhège duōshao qián?', meaning: 'Ini berapa harganya?' },

  // ── BILANGAN & WAKTU ───────────────────────────────────
  '一': { hanzi: '我有一只猫。', pinyin: 'Wǒ yǒu yī zhī māo.', meaning: 'Saya punya satu ekor kucing.' },
  '二': { hanzi: '这里有二个人。', pinyin: 'Zhèlǐ yǒu èr gè rén.', meaning: 'Di sini ada dua orang.' },
  '三': { hanzi: '我有三本书。', pinyin: 'Wǒ yǒu sān běn shū.', meaning: 'Saya punya tiga buku.' },
  '四': { hanzi: '桌子上有四个苹果。', pinyin: 'Zhuōzi shàng yǒu sì gè píngguǒ.', meaning: 'Di atas meja ada empat apel.' },
  '五': { hanzi: '我今年五岁。', pinyin: 'Wǒ jīnnián wǔ suì.', meaning: 'Saya tahun ini berumur lima tahun.' },
  '六': { hanzi: '今天六号。', pinyin: 'Jīntiān liù hào.', meaning: 'Hari ini tanggal enam.' },
  '七': { hanzi: '一个星期有七天。', pinyin: 'Yī gè xīngqī yǒu qī tiān.', meaning: 'Satu minggu ada tujuh hari.' },
  '八': { hanzi: '我八点去上班。', pinyin: 'Wǒ bā diǎn qù shàngbān.', meaning: 'Saya pergi bekerja jam delapan.' },
  '九': { hanzi: '现在九点了。', pinyin: 'Xiànzài jiǔ diǎn le.', meaning: 'Sekarang sudah jam sembilan.' },
  '十': { hanzi: '这里有十个学生。', pinyin: 'Zhèlǐ yǒu shí gè xuésheng.', meaning: 'Di sini ada sepuluh pelajar.' },
  '百': { hanzi: '这本书一百块。', pinyin: 'Zhè běn shū yī bǎi kuài.', meaning: 'Buku ini seratus yuan.' },
  '千': { hanzi: '这件衣服一千块。', pinyin: 'Zhè jiàn yīfu yī qiān kuài.', meaning: 'Baju ini seribu yuan.' },
  '零': { hanzi: '今天是零下五度。', pinyin: 'Jīntiān shì líng xià wǔ dù.', meaning: 'Hari ini minus lima derajat.' },
  '两': { hanzi: '我有两个苹果。', pinyin: 'Wǒ yǒu liǎng gè píngguǒ.', meaning: 'Saya punya dua buah apel.' },
  '今天': { hanzi: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', meaning: 'Cuaca hari ini sangat bagus.' },
  '昨天': { hanzi: '昨天我去了商店。', pinyin: 'Zuótiān wǒ qù le shāngdiàn.', meaning: 'Kemarin saya pergi ke toko.' },
  '明天': { hanzi: '明天我去北京。', pinyin: 'Míngtiān wǒ qù Běijīng.', meaning: 'Besok saya pergi ke Beijing.' },
  '今年': { hanzi: '今年我二十岁。', pinyin: 'Jīnnián wǒ èrshí suì.', meaning: 'Tahun ini saya berumur dua puluh tahun.' },
  '去年': { hanzi: '去年我去了中国。', pinyin: 'Qùnián wǒ qù le Zhōngguó.', meaning: 'Tahun lalu saya pergi ke Tiongkok.' },
  '明年': { hanzi: '明年我要去北京。', pinyin: 'Míngnián wǒ yào qù Běijīng.', meaning: 'Tahun depan saya akan pergi ke Beijing.' },
  '现在': { hanzi: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?', meaning: 'Sekarang jam berapa?' },
  '时候': { hanzi: '你什么时候来？', pinyin: 'Nǐ shénme shíhou lái?', meaning: 'Kapan kamu akan datang?' },
  '时间': { hanzi: '没有时间了。', pinyin: 'Méiyǒu shíjiān le.', meaning: 'Sudah tidak ada waktu lagi.' },
  '早上': { hanzi: '早上好！', pinyin: 'Zǎoshang hǎo!', meaning: 'Selamat pagi!' },
  '上午': { hanzi: '上午我在学习。', pinyin: 'Shàngwǔ wǒ zài xuéxí.', meaning: 'Pagi hari saya sedang belajar.' },
  '中午': { hanzi: '中午我们吃饭吧。', pinyin: 'Zhōngwǔ wǒmen chīfàn ba.', meaning: 'Siang hari kita makan siang ya.' },
  '下午': { hanzi: '下午我去图书馆。', pinyin: 'Xiàwǔ wǒ qù túshūguǎn.', meaning: 'Sore hari saya pergi ke perpustakaan.' },
  '晚上': { hanzi: '晚上我看电视。', pinyin: 'Wǎnshang wǒ kàn diànshì.', meaning: 'Malam hari saya menonton TV.' },
  '白天': { hanzi: '白天我去上班。', pinyin: 'Báitiān wǒ qù shàngbān.', meaning: 'Pada siang hari saya pergi bekerja.' },
  '晚': { hanzi: '对不起，我来晚了。', pinyin: 'Duìbuqǐ, wǒ lái wǎn le.', meaning: 'Maaf, saya terlambat datang.' },
  '星期': { hanzi: '这个星期我很忙。', pinyin: 'Zhège xīngqī wǒ hěn máng.', meaning: 'Minggu ini saya sangat sibuk.' },
  '星期天': { hanzi: '星期天我在家休息。', pinyin: 'Xīngqītiān wǒ zài jiā xiūxi.', meaning: 'Hari Minggu saya beristirahat di rumah.' },
  '星期日': { hanzi: '星期日你有空吗？', pinyin: 'Xīngqīrì nǐ yǒu kòng ma?', meaning: 'Hari Minggu apakah kamu punya waktu luang?' },
  '月': { hanzi: '这个月很忙。', pinyin: 'Zhège yuè hěn máng.', meaning: 'Bulan ini sangat sibuk.' },
  '年': { hanzi: '明年我去中国。', pinyin: 'Míngnián wǒ qù Zhōngguó.', meaning: 'Tahun depan saya pergi ke Tiongkok.' },
  '天': { hanzi: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', meaning: 'Cuaca hari ini sangat bagus.' },
  '点': { hanzi: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?', meaning: 'Sekarang jam berapa?' },
  '分': { hanzi: '我等了你三十分。', pinyin: 'Wǒ děng le nǐ sānshí fēn.', meaning: 'Saya menunggumu tiga puluh menit.' },
  '分钟': { hanzi: '等我五分钟。', pinyin: 'Děng wǒ wǔ fēnzhōng.', meaning: 'Tunggu saya lima menit.' },
  '小时': { hanzi: '我学习了两个小时。', pinyin: 'Wǒ xuéxí le liǎng gè xiǎoshí.', meaning: 'Saya sudah belajar selama dua jam.' },
  '岁': { hanzi: '你今年几岁？', pinyin: 'Nǐ jīnnián jǐ suì?', meaning: 'Tahun ini kamu berumur berapa?' },
  '日': { hanzi: '今天是几号几日？', pinyin: 'Jīntiān shì jǐ hào jǐ rì?', meaning: 'Hari ini tanggal berapa?' },

  // ── KATA SIFAT ─────────────────────────────────────────
  '大': { hanzi: '这个苹果很大。', pinyin: 'Zhège píngguǒ hěn dà.', meaning: 'Apel ini sangat besar.' },
  '小': { hanzi: '这只猫很小。', pinyin: 'Zhè zhī māo hěn xiǎo.', meaning: 'Kucing ini sangat kecil.' },
  '多': { hanzi: '今天人很多。', pinyin: 'Jīntiān rén hěn duō.', meaning: 'Hari ini orang sangat banyak.' },
  '少': { hanzi: '这里人很少。', pinyin: 'Zhèlǐ rén hěn shǎo.', meaning: 'Di sini orangnya sangat sedikit.' },
  '好': { hanzi: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', meaning: 'Cuaca hari ini sangat bagus.' },
  '好吃': { hanzi: '这个菜很好吃。', pinyin: 'Zhège cài hěn hǎochī.', meaning: 'Masakan ini sangat enak.' },
  '好看': { hanzi: '这本书很好看。', pinyin: 'Zhè běn shū hěn hǎokàn.', meaning: 'Buku ini sangat bagus.' },
  '好听': { hanzi: '这首歌很好听。', pinyin: 'Zhè shǒu gē hěn hǎotīng.', meaning: 'Lagu ini sangat merdu.' },
  '好玩儿': { hanzi: '这个游戏很好玩儿。', pinyin: 'Zhège yóuxì hěn hǎowánr.', meaning: 'Permainan ini sangat menyenangkan.' },
  '新': { hanzi: '这是我的新书。', pinyin: 'Zhè shì wǒ de xīn shū.', meaning: 'Ini adalah buku baruku.' },
  '热': { hanzi: '今天天气很热。', pinyin: 'Jīntiān tiānqì hěn rè.', meaning: 'Cuaca hari ini sangat panas.' },
  '冷': { hanzi: '冬天很冷。', pinyin: 'Dōngtiān hěn lěng.', meaning: 'Musim dingin sangat dingin.' },
  '高兴': { hanzi: '见到你很高兴。', pinyin: 'Jiàndào nǐ hěn gāoxìng.', meaning: 'Senang bertemu denganmu.' },
  '非常': { hanzi: '我非常喜欢这里。', pinyin: 'Wǒ fēicháng xǐhuan zhèlǐ.', meaning: 'Saya sangat suka tempat ini.' },
  '很': { hanzi: '她很漂亮。', pinyin: 'Tā hěn piàoliang.', meaning: 'Dia sangat cantik.' },
  '太': { hanzi: '这个太贵了。', pinyin: 'Zhège tài guì le.', meaning: 'Ini terlalu mahal.' },
  '贵': { hanzi: '这个手机太贵了。', pinyin: 'Zhège shǒujī tài guì le.', meaning: 'Ponsel ini terlalu mahal.' },
  '便宜': { hanzi: '这里的菜很便宜。', pinyin: 'Zhèlǐ de cài hěn piányí.', meaning: 'Masakan di sini sangat murah.' },
  '漂亮': { hanzi: '这件衣服很漂亮。', pinyin: 'Zhè jiàn yīfu hěn piàoliang.', meaning: 'Baju ini sangat cantik.' },
  '对': { hanzi: '你说得对。', pinyin: 'Nǐ shuō de duì.', meaning: 'Yang kamu katakan itu benar.' },
  '男': { hanzi: '他是男学生。', pinyin: 'Tā shì nán xuésheng.', meaning: 'Dia adalah pelajar laki-laki.' },
  '女': { hanzi: '她是女老师。', pinyin: 'Tā shì nǚ lǎoshī.', meaning: 'Dia adalah guru perempuan.' },

  // ── KATA KETERANGAN & PARTIKEL ─────────────────────────
  '不': { hanzi: '我不喝咖啡。', pinyin: 'Wǒ bù hē kāfēi.', meaning: 'Saya tidak minum kopi.' },
  '都': { hanzi: '我们都是学生。', pinyin: 'Wǒmen dōu shì xuésheng.', meaning: 'Kami semua adalah pelajar.' },
  '也': { hanzi: '他也是老师。', pinyin: 'Tā yě shì lǎoshī.', meaning: 'Dia juga adalah guru.' },
  '就': { hanzi: '我就是这里的老师。', pinyin: 'Wǒ jiù shì zhèlǐ de lǎoshī.', meaning: 'Saya inilah guru di sini.' },
  '还': { hanzi: '我还没吃饭。', pinyin: 'Wǒ hái méi chīfàn.', meaning: 'Saya belum makan.' },
  '再': { hanzi: '请再说一遍。', pinyin: 'Qǐng zài shuō yī biàn.', meaning: 'Tolong ulangi sekali lagi.' },
  '正在': { hanzi: '他正在睡觉。', pinyin: 'Tā zhèngzài shuìjiào.', meaning: 'Dia sedang tidur.' },
  '了': { hanzi: '下雨了。', pinyin: 'Xià yǔ le.', meaning: 'Sudah hujan.' },
  '的': { hanzi: '这是我的书。', pinyin: 'Zhè shì wǒ de shū.', meaning: 'Ini adalah buku saya.' },
  '吗': { hanzi: '你好吗？', pinyin: 'Nǐ hǎo ma?', meaning: 'Apa kabarmu?' },
  '呢': { hanzi: '你呢？', pinyin: 'Nǐ ne?', meaning: 'Kalau kamu?' },
  '吧': { hanzi: '我们走吧。', pinyin: 'Wǒmen zǒu ba.', meaning: 'Ayo kita pergi.' },

  // ── KATA TANYA ─────────────────────────────────────────
  '什么': { hanzi: '这是什么？', pinyin: 'Zhè shì shénme?', meaning: 'Ini apa?' },
  '谁': { hanzi: '那是谁？', pinyin: 'Nà shì shuí?', meaning: 'Itu siapa?' },
  '几': { hanzi: '你家有几个人？', pinyin: 'Nǐ jiā yǒu jǐ gè rén?', meaning: 'Di rumahmu ada berapa orang?' },
  '多少': { hanzi: '这个多少钱？', pinyin: 'Zhège duōshao qián?', meaning: 'Ini berapa harganya?' },
  '怎么': { hanzi: '这个怎么说？', pinyin: 'Zhège zěnme shuō?', meaning: 'Ini bagaimana mengatakannya?' },
  '怎么样': { hanzi: '你怎么样？', pinyin: 'Nǐ zěnmeyàng?', meaning: 'Bagaimana keadaanmu?' },
  '为什么': { hanzi: '你为什么哭？', pinyin: 'Nǐ wèishénme kū?', meaning: 'Kenapa kamu menangis?' },
  '号': { hanzi: '今天几号？', pinyin: 'Jīntiān jǐ hào?', meaning: 'Sekarang tanggal berapa?' },
  '请问': { hanzi: '请问洗手间在哪里？', pinyin: 'Qǐngwèn xǐshǒujiān zài nǎlǐ?', meaning: 'Permisi, di mana toilet?' },

  // ── UCAPAN & SALAM ─────────────────────────────────────
  '你好': { hanzi: '你好，我叫小明。', pinyin: 'Nǐ hǎo, wǒ jiào Xiǎomíng.', meaning: 'Halo, nama saya Xiaoming.' },
  '谢谢': { hanzi: '谢谢你的帮忙。', pinyin: 'Xièxie nǐ de bāngmáng.', meaning: 'Terima kasih atas bantuanmu.' },
  '不客气': { hanzi: '谢谢！不客气，这是应该的。', pinyin: 'Xièxie! Bú kèqi, zhè shì yīnggāi de.', meaning: 'Terima kasih! Jangan sungkan, ini sudah seharusnya.' },
  '对不起': { hanzi: '对不起，我来晚了。', pinyin: 'Duìbuqǐ, wǒ lái wǎn le.', meaning: 'Maaf, saya terlambat datang.' },
  '没关系': { hanzi: '没关系，没事的。', pinyin: 'Méi guānxi, méi shì de.', meaning: 'Tidak apa-apa, tidak masalah.' },
  '再见': { hanzi: '明天见，再见！', pinyin: 'Míngtiān jiàn, zàijiàn!', meaning: 'Sampai jumpa besok, selamat tinggal!' },
  '喂': { hanzi: '喂，你好，是小明吗？', pinyin: 'Wèi, nǐ hǎo, shì Xiǎomíng ma?', meaning: 'Halo, apakah ini Xiaoming?' },

  // ── PROFESI & MANUSIA ──────────────────────────────────
  '老师': { hanzi: '老师讲课很好。', pinyin: 'Lǎoshī jiǎngkè hěn hǎo.', meaning: 'Cara mengajar gurunya sangat bagus.' },
  '学生': { hanzi: '我是学生。', pinyin: 'Wǒ shì xuésheng.', meaning: 'Saya adalah pelajar.' },
  '医生': { hanzi: '他是医生。', pinyin: 'Tā shì yīshēng.', meaning: 'Dia adalah dokter.' },
  '人': { hanzi: '这里有很多人。', pinyin: 'Zhèlǐ yǒu hěn duō rén.', meaning: 'Di sini ada banyak orang.' },
  '小朋友': { hanzi: '小朋友们在玩。', pinyin: 'Xiǎopéngyǒumen zài wán.', meaning: 'Anak-anak kecil sedang bermain.' },
  '大家': { hanzi: '大家好！', pinyin: 'Dàjiā hǎo!', meaning: 'Halo semuanya!' },
  '先生': { hanzi: '这位先生是我的朋友。', pinyin: 'Zhè wèi xiānsheng shì wǒ de péngyou.', meaning: 'Bapak ini adalah temanku.' },
  '女士': { hanzi: '那位女士是我的老师。', pinyin: 'Nà wèi nǚshì shì wǒ de lǎoshī.', meaning: 'Ibu itu adalah guruku.' },

  // ── PENDIDIKAN ─────────────────────────────────────────
  '大学': { hanzi: '他去大学了。', pinyin: 'Tā qù dàxué le.', meaning: 'Dia sudah pergi ke universitas.' },
  '大学生': { hanzi: '她是大学生。', pinyin: 'Tā shì dàxuéshēng.', meaning: 'Dia adalah mahasiswi.' },
  '小学': { hanzi: '我在小学读书。', pinyin: 'Wǒ zài xiǎoxué dúshū.', meaning: 'Saya bersekolah di SD.' },
  '小学生': { hanzi: '他是小学生。', pinyin: 'Tā shì xiǎoxuéshēng.', meaning: 'Dia adalah murid SD.' },
  '中学': { hanzi: '她在中学读书。', pinyin: 'Tā zài zhōngxué dúshū.', meaning: 'Dia bersekolah di SMP/SMA.' },
  '中学生': { hanzi: '他是中学生。', pinyin: 'Tā shì zhōngxuéshēng.', meaning: 'Dia adalah pelajar SMP/SMA.' },
  '汉语': { hanzi: '我在学汉语。', pinyin: 'Wǒ zài xué Hànyǔ.', meaning: 'Saya sedang belajar bahasa Mandarin.' },
  '汉字': { hanzi: '汉字很难写。', pinyin: 'Hànzì hěn nán xiě.', meaning: 'Menulis karakter Hanzi sangat sulit.' },
  '中文': { hanzi: '你会说中文吗？', pinyin: 'Nǐ huì shuō Zhōngwén ma?', meaning: 'Apakah kamu bisa berbicara bahasa Mandarin?' },
  '课': { hanzi: '今天有几节课？', pinyin: 'Jīntiān yǒu jǐ jié kè?', meaning: 'Hari ini ada berapa pelajaran?' },
  '名字': { hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzì?', meaning: 'Siapa namamu?' },
  '字': { hanzi: '这个字怎么写？', pinyin: 'Zhège zì zěnme xiě?', meaning: 'Karakter ini bagaimana cara menulisnya?' },

  // ── HEWAN ──────────────────────────────────────────────
  '猫': { hanzi: '我家有一只猫。', pinyin: 'Wǒ jiā yǒu yī zhī māo.', meaning: 'Di rumahku ada seekor kucing.' },
  '狗': { hanzi: '那只狗很可爱。', pinyin: 'Nà zhī gǒu hěn kě\'ài.', meaning: 'Anjing itu sangat lucu.' },

  // ── CUACA & ALAM ───────────────────────────────────────
  '天气': { hanzi: '今天天气怎么样？', pinyin: 'Jīntiān tiānqì zěnmeyàng?', meaning: 'Bagaimana cuaca hari ini?' },
  '雨': { hanzi: '外面在下雨。', pinyin: 'Wàimiàn zài xià yǔ.', meaning: 'Di luar sedang hujan.' },
  '雪': { hanzi: '今天下雪了。', pinyin: 'Jīntiān xià xuě le.', meaning: 'Hari ini turun salju.' },

  // ── ARAH & POSISI ──────────────────────────────────────
  '外': { hanzi: '外面很冷，快进来吧。', pinyin: 'Wàimiàn hěn lěng, kuài jìn lái ba.', meaning: 'Di luar sangat dingin, cepat masuk ya.' },
  '外边': { hanzi: '外边有人在等你。', pinyin: 'Wàibiān yǒu rén zài děng nǐ.', meaning: 'Di luar ada orang yang menunggumu.' },
  '上': { hanzi: '书在桌子上。', pinyin: 'Shū zài zhuōzi shàng.', meaning: 'Buku ada di atas meja.' },
  '里': { hanzi: '猫在屋子里。', pinyin: 'Māo zài wūzi lǐ.', meaning: 'Kucing ada di dalam rumah.' },

  // ── MODAL & KEMAMPUAN ──────────────────────────────────
  '会': { hanzi: '我会说汉语。', pinyin: 'Wǒ huì shuō Hànyǔ.', meaning: 'Saya bisa berbicara Mandarin.' },
  '能': { hanzi: '我能帮你吗？', pinyin: 'Wǒ néng bāng nǐ ma?', meaning: 'Bolehkah saya membantumu?' },
  '可以': { hanzi: '我可以进来吗？', pinyin: 'Wǒ kěyǐ jìnlái ma?', meaning: 'Bolehkah saya masuk?' },
  '要': { hanzi: '我要一杯茶。', pinyin: 'Wǒ yào yī bēi chá.', meaning: 'Saya mau secangkir teh.' },
  '不要': { hanzi: '不要说话。', pinyin: 'Bú yào shuōhuà.', meaning: 'Jangan berbicara.' },

  // ── KONJUNGSI & LAINNYA ────────────────────────────────
  '和': { hanzi: '我和妈妈去超市。', pinyin: 'Wǒ hé māma qù chāoshì.', meaning: 'Saya dan ibu pergi ke supermarket.' },
  '还是': { hanzi: '你喝茶还是喝水？', pinyin: 'Nǐ hē chá háishì hē shuǐ?', meaning: 'Kamu minum teh atau air?' },
  '或者': { hanzi: '你去，或者他去都可以。', pinyin: 'Nǐ qù, huòzhě tā qù dōu kěyǐ.', meaning: 'Kamu pergi atau dia pergi, keduanya bisa.' },
  '到': { hanzi: '我到家了。', pinyin: 'Wǒ dào jiā le.', meaning: 'Saya sudah sampai di rumah.' },
  '从': { hanzi: '我从学校来。', pinyin: 'Wǒ cóng xuéxiào lái.', meaning: 'Saya datang dari sekolah.' },
  '关系': { hanzi: '没关系，没事的。', pinyin: 'Méi guānxi, méi shì de.', meaning: 'Tidak apa-apa.' },
  '事': { hanzi: '你有什么事？', pinyin: 'Nǐ yǒu shénme shì?', meaning: 'Ada urusan apa?' },
  '口': { hanzi: '请用嘴巴说，别用手。', pinyin: 'Qǐng yòng zuǐba shuō, bié yòng shǒu.', meaning: 'Tolong katakan dengan mulut, jangan dengan tangan.' },
  '歌': { hanzi: '这首歌很好听。', pinyin: 'Zhè shǒu gē hěn hǎotīng.', meaning: 'Lagu ini sangat merdu.' },
  '国': { hanzi: '他来自哪个国？', pinyin: 'Tā lái zì nǎge guó?', meaning: 'Dia datang dari negara mana?' },
  '东西': { hanzi: '你买什么东西？', pinyin: 'Nǐ mǎi shénme dōngxi?', meaning: 'Kamu membeli barang apa?' },
  '们': { hanzi: '同学们，上课了。', pinyin: 'Tóngxuémen, shàngkè le.', meaning: 'Teman-teman, kelas dimulai.' },

  // ── KATA PENGGOLONG (KATA BANTU NUMERALIA) ──────────────
  '个': { hanzi: '我买了一个苹果。', pinyin: 'Wǒ mǎi le yī gè píngguǒ.', meaning: 'Saya membeli satu buah apel.' },
  '本': { hanzi: '这本书很好看。', pinyin: 'Zhè běn shū hěn hǎokàn.', meaning: 'Buku ini sangat bagus.' },
  '块': { hanzi: '这个苹果三块钱。', pinyin: 'Zhège píngguǒ sān kuài qián.', meaning: 'Apel ini harganya tiga yuan.' },
  '元': { hanzi: '这件衣服一百元。', pinyin: 'Zhè jiàn yīfu yī bǎi yuán.', meaning: 'Baju ini harganya seratus yuan.' },
  '件': { hanzi: '我买了一件新衣服。', pinyin: 'Wǒ mǎi le yī jiàn xīn yīfu.', meaning: 'Saya membeli satu helai baju baru.' },
  '些': { hanzi: '我买了一些水果。', pinyin: 'Wǒ mǎi le yīxiē shuǐguǒ.', meaning: 'Saya membeli beberapa buah.' },

  // ── TAMBAHAN HSK 1 ─────────────────────────────────────
  '休息': { hanzi: '我想休息一下。', pinyin: 'Wǒ xiǎng xiūxi yīxià.', meaning: 'Saya ingin beristirahat sejenak.' },
  '一下': { hanzi: '请等一下。', pinyin: 'Qǐng děng yīxià.', meaning: 'Tolong tunggu sebentar.' },
  '一点儿': { hanzi: '再吃一点儿吧。', pinyin: 'Zài chī yīdiǎnr ba.', meaning: 'Makan lagi sedikit ya.' },
  '一半': { hanzi: '我只吃了一半。', pinyin: 'Wǒ zhǐ chī le yībàn.', meaning: 'Saya hanya makan separuhnya.' },
  '一些': { hanzi: '我买了一些苹果。', pinyin: 'Wǒ mǎi le yīxiē píngguǒ.', meaning: 'Saya membeli beberapa apel.' },
  '有的': { hanzi: '有的人喜欢音乐。', pinyin: 'Yǒude rén xǐhuan yīnyuè.', meaning: 'Ada orang yang suka musik.' },
  '有些': { hanzi: '有些学生喜欢画画。', pinyin: 'Yǒuxiē xuésheng xǐhuan huàhuà.', meaning: 'Ada beberapa pelajar yang suka melukis.' },
  '有点儿': { hanzi: '今天有点儿冷。', pinyin: 'Jīntiān yǒudiǎnr lěng.', meaning: 'Hari ini agak dingin.' },
  '只': { hanzi: '我只有一本书。', pinyin: 'Wǒ zhǐ yǒu yī běn shū.', meaning: 'Saya hanya punya satu buku.' },
  '真': { hanzi: '你真厉害！', pinyin: 'Nǐ zhēn lìhai!', meaning: 'Kamu benar-benar hebat!' },
  '早': { hanzi: '早上好，来得不早不晚！', pinyin: 'Zǎoshang hǎo, lái de bù zǎo bù wǎn!', meaning: 'Selamat pagi, datang tidak terlalu awal tidak terlambat!' },
  '病': { hanzi: '他生病了，在医院。', pinyin: 'Tā shēngbìng le, zài yīyuàn.', meaning: 'Dia sakit, ada di rumah sakit.' },
  '半': { hanzi: '我等了你半个小时。', pinyin: 'Wǒ děng le nǐ bàn gè xiǎoshí.', meaning: 'Saya menunggumu setengah jam.' },

  // ── KATA TAMBAHAN (bukan duplikat) ──────────────────────
  '公司': { hanzi: '爸爸在公司工作。', pinyin: 'Bàba zài gōngsī gōngzuò.', meaning: 'Ayah bekerja di perusahaan.' },
  '店': { hanzi: '那家店很有名。', pinyin: 'Nà jiā diàn hěn yǒumíng.', meaning: 'Toko itu sangat terkenal.' },
  '打车': { hanzi: '我们打车去吧。', pinyin: 'Wǒmen dǎchē qù ba.', meaning: 'Ayo kita naik taksi.' },
  '上网': { hanzi: '他在上网。', pinyin: 'Tā zài shàngwǎng.', meaning: 'Dia sedang berselancar di internet.' },
  '商场': { hanzi: '我去商场买衣服。', pinyin: 'Wǒ qù shāngchǎng mǎi yīfu.', meaning: 'Saya pergi ke mal membeli baju.' },
  '出来': { hanzi: '太阳出来了。', pinyin: 'Tàiyáng chūlái le.', meaning: 'Matahari sudah keluar (terbit).' },
  '出去': { hanzi: '我们出去走走吧。', pinyin: 'Wǒmen chūqù zǒuzǒu ba.', meaning: 'Ayo kita keluar jalan-jalan.' },
  '错': { hanzi: '对不起，我说错了。', pinyin: 'Duìbuqǐ, wǒ shuō cuò le.', meaning: 'Maaf, saya salah bicara.' },
  '问题': { hanzi: '我有一个问题。', pinyin: 'Wǒ yǒu yī gè wèntí.', meaning: 'Saya punya satu pertanyaan.' },
};

// Build index dari FULL_HSK_DATASET
const datasetSentenceMap = new Map<string, ExampleSentence>();
for (const word of FULL_HSK_DATASET) {
  if (word.exampleSentences && word.exampleSentences.length > 0) {
    const ex = word.exampleSentences[0];
    if (ex && ex.hanzi && ex.meaning) {
      datasetSentenceMap.set(word.hanzi, {
        hanzi: ex.hanzi,
        pinyin: ex.pinyin,
        meaning: ex.meaning,
      });
    }
  }
}

/**
 * Generator kalimat alami sederhana berdasarkan kelas kata (pos).
 * Digunakan jika kata tidak ada di kamus maupun dataset.
 */
function generateSimpleSentence(
  hanzi: string,
  meaningIndo: string,
  pinyin: string
): ExampleSentence {
  const safeMeaning = meaningIndo
    ? meaningIndo.split(';')[0].split('/')[0].split('，')[0].trim()
    : hanzi;
  const safePinyin = pinyin ? pinyin.trim() : hanzi;

  // Template kalimat alami sederhana (4 variasi bergilir)
  const templates: ExampleSentence[] = [
    {
      hanzi: `我喜欢${hanzi}。`,
      pinyin: `Wǒ xǐhuan ${safePinyin}.`,
      meaning: `Saya suka ${safeMeaning}.`,
    },
    {
      hanzi: `这个${hanzi}很好。`,
      pinyin: `Zhège ${safePinyin} hěn hǎo.`,
      meaning: `${safeMeaning} ini sangat bagus.`,
    },
    {
      hanzi: `我在学${hanzi}。`,
      pinyin: `Wǒ zài xué ${safePinyin}.`,
      meaning: `Saya sedang mempelajari ${safeMeaning}.`,
    },
    {
      hanzi: `${hanzi}很重要。`,
      pinyin: `${safePinyin} hěn zhòngyào.`,
      meaning: `${safeMeaning} sangat penting.`,
    },
  ];

  // Pilih template berdasarkan jumlah karakter (deterministik, bukan random)
  const idx = hanzi.length % templates.length;
  return templates[idx];
}

/**
 * Dapatkan 1 contoh kalimat lengkap (Hanzi, Pinyin, dan Terjemahan Indonesia)
 * untuk kosakata yang sedang dipelajari.
 */
export function getWordExampleSentence(
  hanzi: string,
  meaningIndo?: string,
  pinyin?: string
): ExampleSentence {
  if (!hanzi) {
    return {
      hanzi: '学而时习之，不亦说乎？',
      pinyin: 'Xué ér shí xí zhī, bù yì yuè hū?',
      meaning: 'Belajar dan senantiasa mengulangnya, bukankah itu menyenangkan?',
    };
  }

  // 1. Cek kamus kalimat kurasi utama (prioritas tertinggi)
  if (CURATED_SENTENCES[hanzi]) {
    return CURATED_SENTENCES[hanzi];
  }

  // 2. Cek dataset HSK lengkap (HSK 1–3 dari file dataset)
  if (datasetSentenceMap.has(hanzi)) {
    return datasetSentenceMap.get(hanzi)!;
  }

  // 3. Fallback: kalimat alami sederhana yang kontekstual
  return generateSimpleSentence(
    hanzi,
    meaningIndo ?? hanzi,
    pinyin ?? hanzi
  );
}
