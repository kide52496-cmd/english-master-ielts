export const ieltsBands = [
  { band: '5.0', emoji: '🟢', label: 'Band 5.0', color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-300', desc: 'Giao tiếp cơ bản, hiểu chủ đề quen thuộc, còn nhiều lỗi ngữ pháp.' },
  { band: '5.5', emoji: '🔵', label: 'Band 5.5', color: 'from-blue-400 to-cyan-500',    bgColor: 'bg-blue-50 dark:bg-blue-900/20',   borderColor: 'border-blue-300',  desc: 'Xử lý được nhiều chủ đề hơn, ít lỗi hơn, từ vựng rộng hơn.' },
  { band: '6.0', emoji: '🟣', label: 'Band 6.0', color: 'from-purple-400 to-indigo-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-300', desc: 'Sử dụng tiếng Anh tốt trong học thuật và công việc, lỗi không nhiều.' },
]

export const ieltsSkills = [
  { id: 'listening',  name: 'Listening',   nameVi: 'Nghe',       emoji: '🎧', color: 'from-blue-400 to-cyan-500',    total: 16 },
  { id: 'reading',    name: 'Reading',     nameVi: 'Đọc',        emoji: '📖', color: 'from-green-400 to-emerald-500', total: 18 },
  { id: 'writing',    name: 'Writing',     nameVi: 'Viết',       emoji: '✍️', color: 'from-amber-400 to-orange-500',  total: 8 },
  { id: 'speaking',   name: 'Speaking',    nameVi: 'Nói',        emoji: '🎤', color: 'from-red-400 to-pink-500',      total: 36 },
  { id: 'vocabulary', name: 'Vocabulary',  nameVi: 'Từ Vựng',    emoji: '📚', color: 'from-purple-400 to-indigo-500', total: 149 },
]

export const readinessChecklist = [
  { id: 'c1', text: 'Tôi biết format của IELTS (4 skills, thời gian từng phần)',       category: 'Chuẩn bị' },
  { id: 'c2', text: 'Tôi đã luyện quản lý thời gian cho Reading (60 phút / 3 sections)', category: 'Chuẩn bị' },
  { id: 'c3', text: 'Tôi có vốn từ học thuật tối thiểu 500 từ',                          category: 'Từ vựng' },
  { id: 'c4', text: 'Tôi nắm vững các cấu trúc ngữ pháp căn bản (tenses, conditionals)', category: 'Ngữ pháp' },
  { id: 'c5', text: 'Tôi có thể nghe liên tục 20 phút và trả lời câu hỏi',               category: 'Listening' },
  { id: 'c6', text: 'Tôi đọc và hiểu đoạn văn 300 từ trong vòng 15 phút',               category: 'Reading' },
  { id: 'c7', text: 'Tôi viết được Task 1 ít nhất 150 từ với cấu trúc rõ ràng',          category: 'Writing' },
  { id: 'c8', text: 'Tôi viết được Task 2 ít nhất 250 từ với luận điểm mạch lạc',        category: 'Writing' },
  { id: 'c9', text: 'Tôi nói liên tục 1–2 phút về một chủ đề mà không dừng lâu',         category: 'Speaking' },
  { id: 'c10', text: 'Tôi đã làm ít nhất một bài mock test IELTS đầy đủ',                 category: 'Chuẩn bị' },
]

export const ieltsVocabulary = [
  // ── education ──────────────────────────────────────────────────────────
  { word: 'allocate',     vi: 'phân bổ',              pronunciation: '/ˈæl.ə.keɪt/',       example: 'The government will allocate more funds to public education.',          collocation: 'allocate resources / budget / time',           topic: 'education' },
  { word: 'curriculum',   vi: 'chương trình học',     pronunciation: '/kəˈrɪk.jʊ.ləm/',    example: 'The school updated its curriculum to include digital literacy.',         collocation: 'national curriculum / school curriculum',      topic: 'education' },
  { word: 'literacy',     vi: 'khả năng đọc viết',   pronunciation: '/ˈlɪt.ər.ə.si/',     example: 'Improving adult literacy is a priority for developing nations.',         collocation: 'digital literacy / financial literacy',        topic: 'education' },
  { word: 'facilitate',   vi: 'tạo điều kiện',       pronunciation: '/fəˈsɪl.ɪ.teɪt/',    example: 'Technology can facilitate collaborative learning in classrooms.',         collocation: 'facilitate learning / facilitate access',      topic: 'education' },
  { word: 'mandatory',    vi: 'bắt buộc',            pronunciation: '/ˈmæn.də.tər.i/',    example: 'Attendance at safety training is mandatory for all new staff.',           collocation: 'mandatory education / mandatory training',     topic: 'education' },
  { word: 'scholarship',  vi: 'học bổng',            pronunciation: '/ˈskɒl.ə.ʃɪp/',     example: 'She received a full scholarship to study abroad.',                       collocation: 'merit scholarship / scholarship programme',    topic: 'education' },
  { word: 'assessment',   vi: 'đánh giá',            pronunciation: '/əˈses.mənt/',        example: 'Continuous assessment gives a more accurate picture of student progress.', collocation: 'formal assessment / ongoing assessment',       topic: 'education' },
  { word: 'pedagogy',     vi: 'phương pháp sư phạm', pronunciation: '/ˈped.ə.ɡɒdʒ.i/',   example: 'Modern pedagogy emphasises student-centred approaches.',                 collocation: 'effective pedagogy / digital pedagogy',        topic: 'education' },

  // ── environment ────────────────────────────────────────────────────────
  { word: 'sustainability', vi: 'sự bền vững',       pronunciation: '/səˌsteɪ.nəˈbɪl.ɪ.ti/', example: 'Corporate sustainability has become a major business priority.',          collocation: 'environmental sustainability / promote sustainability', topic: 'environment' },
  { word: 'emission',       vi: 'khí thải',          pronunciation: '/ɪˈmɪʃ.ən/',            example: 'Countries must reduce their carbon emissions by 2030.',                   collocation: 'carbon emission / greenhouse gas emission',              topic: 'environment' },
  { word: 'biodiversity',   vi: 'đa dạng sinh học',  pronunciation: '/ˌbaɪ.əʊ.daɪˈvɜː.sɪ.ti/', example: 'Deforestation threatens the biodiversity of tropical rainforests.',   collocation: 'protect biodiversity / loss of biodiversity',            topic: 'environment' },
  { word: 'renewable',      vi: 'có thể tái tạo',    pronunciation: '/rɪˈnjuː.ə.bəl/',       example: 'Renewable energy sources like solar power are growing rapidly.',           collocation: 'renewable energy / renewable resources',                topic: 'environment' },
  { word: 'conservation',   vi: 'bảo tồn',           pronunciation: '/ˌkɒn.səˈveɪ.ʃən/',    example: 'Conservation efforts have helped save many endangered species.',            collocation: 'wildlife conservation / water conservation',            topic: 'environment' },
  { word: 'contamination',  vi: 'sự ô nhiễm',        pronunciation: '/kənˌtæm.ɪˈneɪ.ʃən/',  example: 'Soil contamination from industrial waste is a serious health risk.',       collocation: 'soil contamination / water contamination',              topic: 'environment' },
  { word: 'mitigation',     vi: 'giảm thiểu',        pronunciation: '/ˌmɪt.ɪˈɡeɪ.ʃən/',    example: 'Climate change mitigation requires global cooperation.',                   collocation: 'climate mitigation / risk mitigation',                  topic: 'environment' },
  { word: 'ecosystem',      vi: 'hệ sinh thái',      pronunciation: '/ˈiː.kəʊ.sɪs.təm/',    example: 'Coral reefs are among the most fragile ecosystems on Earth.',              collocation: 'marine ecosystem / fragile ecosystem',                  topic: 'environment' },

  // ── technology ─────────────────────────────────────────────────────────
  { word: 'innovation',    vi: 'sự đổi mới, sáng tạo', pronunciation: '/ˌɪn.əˈveɪ.ʃən/',   example: 'Technological innovation is transforming every industry.',               collocation: 'technological innovation / drive innovation',   topic: 'technology' },
  { word: 'algorithm',     vi: 'thuật toán',            pronunciation: '/ˈæl.ɡə.rɪ.ðəm/',  example: 'Social media algorithms decide what content users see.',                 collocation: 'search algorithm / recommendation algorithm',   topic: 'technology' },
  { word: 'automation',    vi: 'tự động hóa',           pronunciation: '/ˌɔː.təˈmeɪ.ʃən/', example: 'Factory automation has replaced millions of manual jobs.',               collocation: 'industrial automation / home automation',       topic: 'technology' },
  { word: 'surveillance',  vi: 'giám sát',              pronunciation: '/səˈveɪ.ləns/',     example: 'Mass surveillance raises serious concerns about privacy.',               collocation: 'digital surveillance / mass surveillance',      topic: 'technology' },
  { word: 'infrastructure',vi: 'cơ sở hạ tầng',        pronunciation: '/ˈɪn.frəˌstrʌk.tʃər/', example: 'A strong digital infrastructure is essential for economic growth.',   collocation: 'digital infrastructure / critical infrastructure', topic: 'technology' },
  { word: 'obsolete',      vi: 'lỗi thời',              pronunciation: '/ˌɒb.səˈliːt/',     example: 'Rapid technological change makes many skills obsolete quickly.',         collocation: 'become obsolete / render obsolete',             topic: 'technology' },
  { word: 'proliferation', vi: 'sự phổ biến rộng rãi', pronunciation: '/prəˌlɪf.əˈreɪ.ʃən/', example: 'The proliferation of smartphones has changed how we communicate.',   collocation: 'rapid proliferation / nuclear proliferation',   topic: 'technology' },
  { word: 'interface',     vi: 'giao diện',             pronunciation: '/ˈɪn.tə.feɪs/',     example: 'A user-friendly interface is crucial for app adoption.',                collocation: 'user interface / digital interface',            topic: 'technology' },

  // ── health ─────────────────────────────────────────────────────────────
  { word: 'chronic',       vi: 'mãn tính',              pronunciation: '/ˈkrɒn.ɪk/',        example: 'Chronic stress can lead to serious cardiovascular disease.',            collocation: 'chronic disease / chronic pain / chronic condition', topic: 'health' },
  { word: 'epidemic',      vi: 'dịch bệnh',             pronunciation: '/ˌep.ɪˈdem.ɪk/',    example: 'Obesity has become an epidemic in many developed countries.',           collocation: 'global epidemic / obesity epidemic',                 topic: 'health' },
  { word: 'nutrition',     vi: 'dinh dưỡng',            pronunciation: '/njuːˈtrɪʃ.ən/',    example: 'Good nutrition is essential for healthy child development.',             collocation: 'good nutrition / balanced nutrition',                topic: 'health' },
  { word: 'prevention',    vi: 'phòng ngừa',            pronunciation: '/prɪˈven.ʃən/',     example: 'Disease prevention is more cost-effective than treatment.',             collocation: 'disease prevention / crime prevention',              topic: 'health' },
  { word: 'diagnosis',     vi: 'chẩn đoán',             pronunciation: '/ˌdaɪ.əɡˈnəʊ.sɪs/', example: 'Early diagnosis significantly improves treatment outcomes.',           collocation: 'early diagnosis / correct diagnosis',                topic: 'health' },
  { word: 'rehabilitation', vi: 'phục hồi chức năng',  pronunciation: '/ˌriː.həˌbɪl.ɪˈteɪ.ʃən/', example: 'Rehabilitation programmes help patients regain their independence.', collocation: 'rehabilitation programme / physical rehabilitation', topic: 'health' },
  { word: 'mortality',     vi: 'tỷ lệ tử vong',         pronunciation: '/mɔːˈtæl.ɪ.ti/',    example: 'Infant mortality rates have fallen dramatically in recent decades.',    collocation: 'infant mortality / mortality rate',                  topic: 'health' },
  { word: 'sedentary',     vi: 'ít vận động',           pronunciation: '/ˈsed.ən.tər.i/',    example: 'A sedentary lifestyle increases the risk of diabetes and heart disease.', collocation: 'sedentary lifestyle / sedentary job',               topic: 'health' },

  // ── work ───────────────────────────────────────────────────────────────
  { word: 'productivity',  vi: 'năng suất',             pronunciation: '/ˌprɒd.ʌkˈtɪv.ɪ.ti/', example: 'Flexible working hours can boost employee productivity significantly.', collocation: 'increase productivity / workplace productivity',  topic: 'work' },
  { word: 'entrepreneur',  vi: 'doanh nhân, khởi nghiệp', pronunciation: '/ˌɒn.trə.prəˈnɜːr/', example: 'Young entrepreneurs are creating innovative solutions to social problems.', collocation: 'social entrepreneur / successful entrepreneur',   topic: 'work' },
  { word: 'redundancy',    vi: 'dôi dư lao động',       pronunciation: '/rɪˈdʌn.dən.si/',    example: 'The factory closure resulted in over 500 redundancies.',               collocation: 'face redundancy / voluntary redundancy',         topic: 'work' },
  { word: 'outsourcing',   vi: 'thuê ngoài',            pronunciation: '/ˈaʊt.sɔː.sɪŋ/',    example: 'Many companies outsource customer service to reduce operating costs.',  collocation: 'business outsourcing / offshore outsourcing',    topic: 'work' },
  { word: 'collaboration', vi: 'cộng tác, hợp tác',    pronunciation: '/kəˌlæb.əˈreɪ.ʃən/', example: 'Effective collaboration between departments improves project outcomes.',  collocation: 'cross-team collaboration / global collaboration', topic: 'work' },
  { word: 'inequality',    vi: 'sự bất bình đẳng',     pronunciation: '/ˌɪn.ɪˈkwɒl.ɪ.ti/', example: 'The gender pay gap reflects deep-rooted workplace inequality.',         collocation: 'income inequality / gender inequality',          topic: 'work' },
  { word: 'incentive',     vi: 'khuyến khích, động lực', pronunciation: '/ɪnˈsen.tɪv/',     example: 'Financial incentives are often used to motivate high performance.',    collocation: 'financial incentive / tax incentive',            topic: 'work' },
  { word: 'hierarchical',  vi: 'có thứ bậc',            pronunciation: '/ˌhaɪ.əˈrɑː.kɪ.kəl/', example: 'Flat structures are replacing traditional hierarchical organisations.', collocation: 'hierarchical structure / hierarchical management', topic: 'work' },

  // ── society ────────────────────────────────────────────────────────────
  { word: 'demographic',   vi: 'nhân khẩu học',         pronunciation: '/ˌdem.əˈɡræf.ɪk/',  example: 'Demographic changes will put pressure on pension systems.',            collocation: 'demographic shift / demographic data',          topic: 'society' },
  { word: 'urbanisation',  vi: 'đô thị hóa',            pronunciation: '/ˌɜː.bə.naɪˈzeɪ.ʃən/', example: 'Rapid urbanisation has led to overcrowding in many Asian cities.',   collocation: 'rapid urbanisation / urban growth',             topic: 'society' },
  { word: 'migration',     vi: 'di cư',                 pronunciation: '/maɪˈɡreɪ.ʃən/',    example: 'Economic migration has shaped the populations of many Western nations.', collocation: 'mass migration / economic migration',           topic: 'society' },
  { word: 'disparity',     vi: 'sự chênh lệch',         pronunciation: '/dɪˈspær.ɪ.ti/',    example: 'There is a significant disparity between rural and urban incomes.',     collocation: 'wealth disparity / income disparity',           topic: 'society' },
  { word: 'cohesion',      vi: 'sự gắn kết',            pronunciation: '/kəʊˈhiː.ʒən/',     example: 'Community cohesion is essential for a peaceful, functioning society.',  collocation: 'social cohesion / community cohesion',          topic: 'society' },
  { word: 'discrimination', vi: 'phân biệt đối xử',    pronunciation: '/dɪˌskrɪm.ɪˈneɪ.ʃən/', example: 'Discrimination in the workplace is illegal in most countries.',      collocation: 'racial discrimination / age discrimination',    topic: 'society' },
  { word: 'welfare',       vi: 'phúc lợi xã hội',       pronunciation: '/ˈwel.feər/',        example: 'The welfare system provides financial support for unemployed citizens.', collocation: 'social welfare / child welfare / welfare state', topic: 'society' },
  { word: 'integration',   vi: 'hội nhập',              pronunciation: '/ˌɪn.tɪˈɡreɪ.ʃən/', example: 'Successful integration of immigrants benefits the whole economy.',      collocation: 'social integration / cultural integration',     topic: 'society' },

  // ── culture ────────────────────────────────────────────────────────────
  { word: 'heritage',      vi: 'di sản',                pronunciation: '/ˈher.ɪ.tɪdʒ/',     example: 'UNESCO works to protect the world\'s cultural and natural heritage.',  collocation: 'cultural heritage / world heritage',           topic: 'culture' },
  { word: 'indigenous',    vi: 'bản địa, bản xứ',       pronunciation: '/ɪnˈdɪdʒ.ɪ.nəs/',   example: 'Indigenous communities often have deep knowledge of their environment.', collocation: 'indigenous people / indigenous culture',        topic: 'culture' },
  { word: 'globalisation', vi: 'toàn cầu hóa',          pronunciation: '/ˌɡləʊ.bəl.aɪˈzeɪ.ʃən/', example: 'Globalisation has spread Western cultural values worldwide.',        collocation: 'economic globalisation / cultural globalisation', topic: 'culture' },
  { word: 'assimilation',  vi: 'đồng hóa',              pronunciation: '/əˌsɪm.ɪˈleɪ.ʃən/', example: 'Cultural assimilation can threaten minority languages and traditions.', collocation: 'cultural assimilation / forced assimilation',   topic: 'culture' },
  { word: 'preservation',  vi: 'bảo tồn, gìn giữ',     pronunciation: '/ˌprez.əˈveɪ.ʃən/', example: 'Preservation of traditional arts requires government support.',         collocation: 'cultural preservation / heritage preservation', topic: 'culture' },
  { word: 'contemporary',  vi: 'đương đại, hiện đại',   pronunciation: '/kənˈtem.pər.ər.i/', example: 'Contemporary art often reflects the social issues of our time.',       collocation: 'contemporary art / contemporary society',       topic: 'culture' },
  { word: 'ritual',        vi: 'nghi lễ, phong tục',    pronunciation: '/ˈrɪtʃ.u.əl/',      example: 'Wedding rituals vary dramatically between different cultures.',          collocation: 'cultural ritual / religious ritual',            topic: 'culture' },
  { word: 'identity',      vi: 'bản sắc, danh tính',    pronunciation: '/aɪˈden.tɪ.ti/',    example: 'Language is central to national and cultural identity.',                collocation: 'cultural identity / national identity',         topic: 'culture' },

  // ── media ──────────────────────────────────────────────────────────────
  { word: 'misinformation', vi: 'thông tin sai lệch',  pronunciation: '/ˌmɪs.ɪn.fəˈmeɪ.ʃən/', example: 'Social media has accelerated the spread of misinformation.',        collocation: 'spread misinformation / combat misinformation', topic: 'media' },
  { word: 'censorship',    vi: 'kiểm duyệt',           pronunciation: '/ˈsen.sə.ʃɪp/',     example: 'Press censorship undermines democracy and public accountability.',      collocation: 'government censorship / internet censorship',   topic: 'media' },
  { word: 'credibility',   vi: 'độ tin cậy',           pronunciation: '/ˌkred.ɪˈbɪl.ɪ.ti/', example: 'Journalists must maintain credibility by verifying their sources.',   collocation: 'news credibility / source credibility',         topic: 'media' },
  { word: 'propaganda',    vi: 'tuyên truyền',         pronunciation: '/ˌprɒp.əˈɡæn.də/', example: 'State propaganda shapes public opinion in authoritarian regimes.',       collocation: 'political propaganda / state propaganda',       topic: 'media' },
  { word: 'circulation',   vi: 'lưu hành, phát hành', pronunciation: '/ˌsɜː.kjʊˈleɪ.ʃən/', example: 'Newspaper circulation has declined sharply in the digital age.',      collocation: 'newspaper circulation / online circulation',    topic: 'media' },
  { word: 'engagement',    vi: 'sự tương tác',         pronunciation: '/ɪnˈɡeɪdʒ.mənt/',  example: 'High engagement rates indicate that content resonates with audiences.',  collocation: 'audience engagement / social media engagement', topic: 'media' },
  { word: 'journalism',    vi: 'báo chí',              pronunciation: '/ˈdʒɜː.nə.lɪ.z.əm/', example: 'Investigative journalism plays a vital role in holding power to account.', collocation: 'investigative journalism / quality journalism', topic: 'media' },
  { word: 'influencer',    vi: 'người có ảnh hưởng',   pronunciation: '/ˈɪn.flu.ən.sər/',  example: 'Social media influencers now shape consumer behaviour worldwide.',       collocation: 'social media influencer / brand influencer',    topic: 'media' },

  // ── education (extra) ──────────────────────────────────────────────────────
  { word: 'accreditation', vi: 'công nhận, cấp phép',  pronunciation: '/əˌkred.ɪˈteɪ.ʃən/', example: 'The university gained full accreditation from the national board.',     collocation: 'full accreditation / accreditation process',    topic: 'education' },
  { word: 'tuition',       vi: 'học phí / dạy kèm',    pronunciation: '/tjuːˈɪʃ.ən/',       example: 'Rising tuition fees are making higher education less accessible.',        collocation: 'tuition fee / private tuition',                 topic: 'education' },
  { word: 'dissertation',  vi: 'luận văn',              pronunciation: '/ˌdɪs.əˈteɪ.ʃən/',  example: 'She spent two years researching her doctoral dissertation.',              collocation: 'write a dissertation / dissertation topic',     topic: 'education' },
  { word: 'apprenticeship',vi: 'học nghề, thực tập',   pronunciation: '/əˈpren.tɪs.ʃɪp/',   example: 'Apprenticeships offer a practical alternative to university education.',   collocation: 'complete an apprenticeship / trade apprenticeship', topic: 'education' },
  { word: 'interdisciplinary', vi: 'liên ngành',        pronunciation: '/ˌɪn.tə.dɪˈsɪp.lɪ.ner.i/', example: 'Climate change requires an interdisciplinary approach combining science and economics.', collocation: 'interdisciplinary research / interdisciplinary approach', topic: 'education' },
  { word: 'enrolment',     vi: 'ghi danh, nhập học',   pronunciation: '/ɪnˈrəʊl.mənt/',     example: 'University enrolment has increased significantly over the past decade.',   collocation: 'student enrolment / school enrolment',          topic: 'education' },
  { word: 'critical thinking', vi: 'tư duy phản biện', pronunciation: '/ˈkrɪt.ɪ.kəl ˈθɪŋk.ɪŋ/', example: 'Critical thinking skills are essential for academic success.',        collocation: 'develop critical thinking / critical thinking skills', topic: 'education' },
  { word: 'academic integrity', vi: 'liêm chính học thuật', pronunciation: '/ˌæk.əˈdem.ɪk ɪnˈteɡ.rɪ.ti/', example: 'Plagiarism is a serious violation of academic integrity.',    collocation: 'uphold academic integrity / breach of academic integrity', topic: 'education' },

  // ── environment (extra) ───────────────────────────────────────────────────
  { word: 'deforestation', vi: 'phá rừng',              pronunciation: '/ˌdiː.fɒr.ɪˈsteɪ.ʃən/', example: 'Deforestation in the Amazon has accelerated at an alarming rate.',   collocation: 'halt deforestation / illegal deforestation',    topic: 'environment' },
  { word: 'carbon footprint', vi: 'lượng khí thải carbon cá nhân', pronunciation: '/ˈkɑː.bən ˈfʊt.prɪnt/', example: 'Flying long distances significantly increases your carbon footprint.', collocation: 'reduce carbon footprint / measure carbon footprint', topic: 'environment' },
  { word: 'biodegradable', vi: 'có thể phân hủy sinh học', pronunciation: '/ˌbaɪ.əʊ.dɪˈɡreɪ.də.bəl/', example: 'Replacing plastic with biodegradable materials reduces landfill waste.', collocation: 'biodegradable packaging / biodegradable waste', topic: 'environment' },
  { word: 'drought',        vi: 'hạn hán',               pronunciation: '/draʊt/',             example: 'Prolonged drought has devastated crops in the region.',                 collocation: 'severe drought / drought conditions',           topic: 'environment' },
  { word: 'habitat',        vi: 'môi trường sống',        pronunciation: '/ˈhæb.ɪ.tæt/',       example: 'Urban expansion is destroying the natural habitat of many species.',     collocation: 'natural habitat / habitat destruction / habitat loss', topic: 'environment' },
  { word: 'reforestation',  vi: 'tái trồng rừng',         pronunciation: '/ˌriː.fɒr.ɪˈsteɪ.ʃən/', example: 'Reforestation programmes can help offset carbon emissions.',          collocation: 'reforestation programme / mass reforestation',  topic: 'environment' },
  { word: 'landfill',       vi: 'bãi chôn lấp rác',       pronunciation: '/ˈlænd.fɪl/',         example: 'Millions of tonnes of plastic end up in landfill sites every year.',     collocation: 'landfill site / landfill waste',                topic: 'environment' },
  { word: 'greenhouse gas', vi: 'khí nhà kính',           pronunciation: '/ˈɡriːn.haʊs ɡæs/',   example: 'Reducing greenhouse gas emissions is the key challenge of our century.', collocation: 'greenhouse gas emissions / greenhouse effect',  topic: 'environment' },

  // ── technology (extra) ────────────────────────────────────────────────────
  { word: 'cybersecurity',  vi: 'an ninh mạng',           pronunciation: '/ˈsaɪ.bə.sɪˌkjʊə.rɪ.ti/', example: 'Companies invest heavily in cybersecurity to protect customer data.',  collocation: 'cybersecurity threat / cybersecurity breach',   topic: 'technology' },
  { word: 'artificial intelligence', vi: 'trí tuệ nhân tạo', pronunciation: '/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns/', example: 'Artificial intelligence is transforming the healthcare industry.', collocation: 'AI technology / AI-powered / artificial intelligence system', topic: 'technology' },
  { word: 'encryption',     vi: 'mã hóa',                 pronunciation: '/ɪnˈkrɪp.ʃən/',      example: 'End-to-end encryption ensures that messages remain private.',           collocation: 'data encryption / encryption key',              topic: 'technology' },
  { word: 'bandwidth',      vi: 'băng thông',              pronunciation: '/ˈbænd.wɪdθ/',        example: 'Streaming high-definition video requires significant bandwidth.',        collocation: 'broadband bandwidth / limited bandwidth',       topic: 'technology' },
  { word: 'prototype',      vi: 'nguyên mẫu, thử nghiệm', pronunciation: '/ˈprəʊ.tə.taɪp/',    example: 'Engineers built a prototype to test the new electric vehicle design.',    collocation: 'develop a prototype / working prototype',       topic: 'technology' },
  { word: 'digitisation',   vi: 'số hóa',                  pronunciation: '/ˌdɪdʒ.ɪ.taɪˈzeɪ.ʃən/', example: 'The digitisation of public records has improved access to information.', collocation: 'digitisation process / rapid digitisation',    topic: 'technology' },
  { word: 'data privacy',   vi: 'quyền riêng tư dữ liệu', pronunciation: '/ˈdeɪ.tə ˈprɪv.ə.si/', example: 'New regulations aim to strengthen data privacy for consumers.',        collocation: 'data privacy law / data privacy rights',        topic: 'technology' },
  { word: 'machine learning', vi: 'học máy',               pronunciation: '/məˈʃiːn ˈlɜː.nɪŋ/', example: 'Machine learning enables computers to improve through experience.',      collocation: 'machine learning algorithm / machine learning model', topic: 'technology' },

  // ── health (extra) ────────────────────────────────────────────────────────
  { word: 'vaccination',    vi: 'tiêm phòng',              pronunciation: '/ˌvæk.sɪˈneɪ.ʃən/', example: 'Mass vaccination campaigns have eradicated several deadly diseases.',    collocation: 'vaccination programme / childhood vaccination',  topic: 'health' },
  { word: 'obesity',        vi: 'béo phì',                 pronunciation: '/əʊˈbiː.sɪ.ti/',     example: 'Childhood obesity is linked to poor diet and insufficient exercise.',    collocation: 'childhood obesity / obesity epidemic',          topic: 'health' },
  { word: 'pharmaceutical', vi: 'dược phẩm',               pronunciation: '/ˌfɑː.məˈsuː.tɪ.kəl/', example: 'The pharmaceutical industry spends billions on drug research.',       collocation: 'pharmaceutical company / pharmaceutical drugs', topic: 'health' },
  { word: 'antibiotic',     vi: 'kháng sinh',              pronunciation: '/ˌæn.tiˈbaɪ.ɒt.ɪk/', example: 'Antibiotic resistance is one of the greatest threats to global health.', collocation: 'antibiotic resistance / prescribe antibiotics', topic: 'health' },
  { word: 'cardiovascular', vi: 'tim mạch',                pronunciation: '/ˌkɑː.di.əʊˈvæs.kjʊ.lə/', example: 'Regular exercise significantly reduces the risk of cardiovascular disease.', collocation: 'cardiovascular disease / cardiovascular health', topic: 'health' },
  { word: 'pandemic',       vi: 'đại dịch',                pronunciation: '/pænˈdem.ɪk/',        example: 'The COVID-19 pandemic exposed major weaknesses in global health systems.', collocation: 'global pandemic / pandemic response',          topic: 'health' },
  { word: 'mental wellbeing', vi: 'sức khỏe tâm thần',    pronunciation: '/ˈmen.təl ˈwel.biː.ɪŋ/', example: 'Employers are increasingly prioritising employee mental wellbeing.',    collocation: 'mental wellbeing support / promote mental wellbeing', topic: 'health' },
  { word: 'preventable',    vi: 'có thể phòng ngừa',       pronunciation: '/prɪˈvent.ə.bəl/',    example: 'Many deaths from non-communicable diseases are preventable.',           collocation: 'preventable disease / preventable death',       topic: 'health' },

  // ── work (extra) ──────────────────────────────────────────────────────────
  { word: 'burnout',        vi: 'kiệt sức (công việc)',    pronunciation: '/ˈbɜːn.aʊt/',         example: 'High workloads and long hours are leading to widespread burnout.',       collocation: 'employee burnout / prevent burnout',            topic: 'work' },
  { word: 'remote working', vi: 'làm việc từ xa',          pronunciation: '/rɪˈməʊt ˈwɜː.kɪŋ/', example: 'Remote working became the norm for millions during the pandemic.',       collocation: 'remote working policy / full-time remote working', topic: 'work' },
  { word: 'compensation',   vi: 'thù lao, bồi thường',     pronunciation: '/ˌkɒm.penˈseɪ.ʃən/', example: 'The company offered financial compensation to affected employees.',       collocation: 'financial compensation / compensation package',  topic: 'work' },
  { word: 'appraisal',      vi: 'đánh giá hiệu suất',      pronunciation: '/əˈpreɪ.zəl/',         example: 'Annual appraisals help employees understand their performance.',          collocation: 'performance appraisal / annual appraisal',      topic: 'work' },
  { word: 'turnover',       vi: 'doanh thu / tỷ lệ nghỉ việc', pronunciation: '/ˈtɜːn.əʊ.vər/', example: 'High staff turnover is a sign of poor workplace culture.',               collocation: 'staff turnover / high turnover rate',           topic: 'work' },
  { word: 'freelance',      vi: 'tự do, làm việc tự do',   pronunciation: '/ˈfriː.lɑːns/',       example: 'More professionals are choosing freelance work for greater flexibility.',  collocation: 'freelance work / freelance career',             topic: 'work' },
  { word: 'workforce',      vi: 'lực lượng lao động',       pronunciation: '/ˈwɜːk.fɔːs/',        example: 'Automation is expected to displace a significant portion of the workforce.', collocation: 'skilled workforce / global workforce',        topic: 'work' },
  { word: 'vocational',     vi: 'hướng nghiệp, nghề nghiệp', pronunciation: '/vəʊˈkeɪ.ʃən.əl/', example: 'Vocational training provides practical skills for specific careers.',      collocation: 'vocational training / vocational qualification', topic: 'work' },

  // ── society (extra) ───────────────────────────────────────────────────────
  { word: 'poverty',        vi: 'đói nghèo',               pronunciation: '/ˈpɒv.ər.ti/',        example: 'Addressing poverty requires long-term investment in education and health.', collocation: 'extreme poverty / poverty line / cycle of poverty', topic: 'society' },
  { word: 'solidarity',     vi: 'tinh thần đoàn kết',      pronunciation: '/ˌsɒl.ɪˈdær.ɪ.ti/',  example: 'Community solidarity was essential during the economic crisis.',           collocation: 'social solidarity / show solidarity',           topic: 'society' },
  { word: 'marginalised',   vi: 'bị gạt ra ngoài lề',      pronunciation: '/ˈmɑː.dʒɪ.nə.laɪzd/', example: 'Marginalised communities often lack access to quality education.',        collocation: 'marginalised group / marginalised community',   topic: 'society' },
  { word: 'philanthropy',   vi: 'từ thiện, hảo tâm',        pronunciation: '/fɪˈlæn.θrə.pi/',     example: 'Corporate philanthropy can play a role in addressing social inequality.',   collocation: 'corporate philanthropy / act of philanthropy',  topic: 'society' },
  { word: 'civic',          vi: 'công dân, dân sự',         pronunciation: '/ˈsɪv.ɪk/',           example: 'Civic engagement is essential for a functioning democracy.',               collocation: 'civic duty / civic society / civic engagement', topic: 'society' },
  { word: 'inclusive',      vi: 'bao gồm, toàn diện',      pronunciation: '/ɪnˈkluː.sɪv/',       example: 'Governments should design inclusive policies that benefit all citizens.',   collocation: 'inclusive education / inclusive society',       topic: 'society' },
  { word: 'gentrification', vi: 'quý tộc hóa đô thị',      pronunciation: '/ˌdʒen.trɪ.fɪˈkeɪ.ʃən/', example: 'Gentrification has displaced long-term residents from city centres.',  collocation: 'urban gentrification / rapid gentrification',   topic: 'society' },
  { word: 'social mobility', vi: 'dịch chuyển xã hội',     pronunciation: '/ˈsəʊ.ʃəl məʊˈbɪl.ɪ.ti/', example: 'Education is one of the most powerful drivers of social mobility.',   collocation: 'upward social mobility / social mobility gap',  topic: 'society' },

  // ── culture (extra) ───────────────────────────────────────────────────────
  { word: 'multicultural',  vi: 'đa văn hóa',              pronunciation: '/ˌmʌl.tiˈkʌl.tʃər.əl/', example: 'London is one of the most multicultural cities in the world.',          collocation: 'multicultural society / multicultural education', topic: 'culture' },
  { word: 'stereotype',     vi: 'định kiến, khuôn mẫu',    pronunciation: '/ˈster.i.ə.taɪp/',    example: 'Media stereotypes can reinforce harmful assumptions about different groups.', collocation: 'cultural stereotype / gender stereotype',      topic: 'culture' },
  { word: 'folklore',       vi: 'văn hóa dân gian',         pronunciation: '/ˈfəʊk.lɔːr/',        example: 'Folklore reflects the beliefs and values of a community across generations.', collocation: 'local folklore / traditional folklore',       topic: 'culture' },
  { word: 'taboo',          vi: 'điều cấm kỵ',              pronunciation: '/təˈbuː/',             example: 'In many cultures, discussing money openly is considered a taboo.',          collocation: 'cultural taboo / social taboo',                 topic: 'culture' },
  { word: 'dialect',        vi: 'phương ngữ, thổ ngữ',      pronunciation: '/ˈdaɪ.ə.lekt/',        example: 'Regional dialects are an important part of cultural diversity.',           collocation: 'local dialect / regional dialect',              topic: 'culture' },
  { word: 'etiquette',      vi: 'phép tắc, lễ nghi',        pronunciation: '/ˈet.ɪ.kɪt/',          example: 'Business etiquette varies significantly across different cultures.',        collocation: 'social etiquette / business etiquette',         topic: 'culture' },
  { word: 'intercultural',  vi: 'giao thoa văn hóa',        pronunciation: '/ˌɪn.tə.ˈkʌl.tʃər.əl/', example: 'Intercultural communication skills are valuable in global workplaces.',  collocation: 'intercultural dialogue / intercultural exchange', topic: 'culture' },
  { word: 'subculture',     vi: 'tiểu văn hóa',             pronunciation: '/ˈsʌb.kʌl.tʃər/',     example: 'Youth subcultures often challenge mainstream social norms.',                collocation: 'urban subculture / youth subculture',           topic: 'culture' },

  // ── media (extra) ─────────────────────────────────────────────────────────
  { word: 'broadcasting',   vi: 'phát sóng',                pronunciation: '/ˈbrɔːd.kɑː.stɪŋ/',  example: 'Public broadcasting plays a vital role in informing citizens.',           collocation: 'public broadcasting / live broadcasting',       topic: 'media' },
  { word: 'transparency',   vi: 'tính minh bạch',           pronunciation: '/trænsˈpær.ən.si/',    example: 'Transparency in reporting builds public trust in media organisations.',   collocation: 'media transparency / financial transparency',   topic: 'media' },
  { word: 'editorial',      vi: 'biên tập, xã luận',        pronunciation: '/ˌed.ɪˈtɔː.ri.əl/',  example: 'Editorial decisions should be independent of commercial interests.',       collocation: 'editorial independence / editorial decision',   topic: 'media' },
  { word: 'bias',           vi: 'thành kiến, thiên vị',     pronunciation: '/ˈbaɪ.əs/',            example: 'News bias can distort public understanding of important issues.',          collocation: 'media bias / unconscious bias / political bias', topic: 'media' },
  { word: 'viral',          vi: 'lan truyền nhanh (mạng)',  pronunciation: '/ˈvaɪ.rəl/',           example: 'A single viral post can reach millions of people within hours.',           collocation: 'go viral / viral content / viral campaign',     topic: 'media' },
  { word: 'clickbait',      vi: 'tiêu đề câu view',         pronunciation: '/ˈklɪk.beɪt/',         example: 'Clickbait headlines mislead readers and erode trust in journalism.',       collocation: 'clickbait article / clickbait headline',        topic: 'media' },
  { word: 'subscription',   vi: 'đăng ký, thuê bao',        pronunciation: '/səbˈskrɪp.ʃən/',      example: 'Subscription models have replaced advertising as the main revenue source.', collocation: 'paid subscription / subscription service',     topic: 'media' },
  { word: 'content algorithm', vi: 'thuật toán nội dung (mạng)', pronunciation: '/ˈkɒn.tent ˈæl.ɡə.rɪ.ðəm/', example: 'Content algorithms on social media determine which posts users see most.', collocation: 'content algorithm / platform algorithm',      topic: 'media' },

  // ── economics ─────────────────────────────────────────────────────────────
  { word: 'inflation',      vi: 'lạm phát',                 pronunciation: '/ɪnˈfleɪ.ʃən/',       example: 'High inflation erodes the purchasing power of ordinary households.',       collocation: 'inflation rate / combat inflation / rising inflation', topic: 'economics' },
  { word: 'recession',      vi: 'suy thoái kinh tế',        pronunciation: '/rɪˈseʃ.ən/',          example: 'The global recession of 2008 caused widespread unemployment.',             collocation: 'economic recession / deep recession',           topic: 'economics' },
  { word: 'fiscal policy',  vi: 'chính sách tài khóa',      pronunciation: '/ˈfɪs.kəl ˈpɒl.ɪ.si/', example: 'The government used fiscal policy to stimulate economic recovery.',     collocation: 'fiscal policy / fiscal measures / fiscal deficit', topic: 'economics' },
  { word: 'subsidise',      vi: 'trợ cấp, hỗ trợ tài chính', pronunciation: '/ˈsʌb.sɪ.daɪz/',    example: 'Many governments subsidise renewable energy to accelerate its adoption.',   collocation: 'subsidise industry / government subsidy',       topic: 'economics' },
  { word: 'deficit',        vi: 'thâm hụt ngân sách',       pronunciation: '/ˈdef.ɪ.sɪt/',         example: 'A persistent budget deficit can undermine investor confidence.',           collocation: 'budget deficit / trade deficit',                topic: 'economics' },
  { word: 'gross domestic product', vi: 'tổng sản phẩm quốc nội (GDP)', pronunciation: '/ˌɡrəʊs dəˌmes.tɪk ˈprɒd.ʌkt/', example: 'GDP growth slowed to 1.5% in the final quarter of the year.', collocation: 'GDP growth / GDP per capita',               topic: 'economics' },
  { word: 'monetary policy', vi: 'chính sách tiền tệ',      pronunciation: '/ˈmʌn.ɪ.tri ˈpɒl.ɪ.si/', example: 'Central banks use monetary policy to control inflation and employment.', collocation: 'monetary policy / tight monetary policy',      topic: 'economics' },
  { word: 'income gap',     vi: 'khoảng cách thu nhập',    pronunciation: '/ˈɪn.kʌm ɡæp/',       example: 'The income gap between the richest and poorest has widened sharply.',     collocation: 'widening income gap / income gap reduction',    topic: 'economics' },

  // ── governance ────────────────────────────────────────────────────────────
  { word: 'legislation',    vi: 'pháp luật, lập pháp',      pronunciation: '/ˌledʒ.ɪˈsleɪ.ʃən/', example: 'New legislation was introduced to protect consumers from data breaches.',  collocation: 'introduce legislation / draft legislation',     topic: 'governance' },
  { word: 'democracy',      vi: 'dân chủ',                  pronunciation: '/dɪˈmɒk.rə.si/',      example: 'A free press is considered a cornerstone of democracy.',                  collocation: 'liberal democracy / democratic values',         topic: 'governance' },
  { word: 'corruption',     vi: 'tham nhũng',               pronunciation: '/kəˈrʌp.ʃən/',         example: 'Widespread corruption undermines public trust in government institutions.', collocation: 'political corruption / anti-corruption measures', topic: 'governance' },
  { word: 'accountability', vi: 'trách nhiệm giải trình',   pronunciation: '/əˌkaʊnt.əˈbɪl.ɪ.ti/', example: 'Citizens demand greater accountability from elected officials.',           collocation: 'political accountability / public accountability', topic: 'governance' },
  { word: 'sovereignty',    vi: 'chủ quyền quốc gia',       pronunciation: '/ˈsɒv.rɪn.ti/',        example: 'National sovereignty is a core principle of international law.',           collocation: 'national sovereignty / sovereign state',        topic: 'governance' },
  { word: 'referendum',     vi: 'trưng cầu dân ý',          pronunciation: '/ˌref.əˈren.dəm/',     example: 'The government held a referendum on electoral reform.',                    collocation: 'hold a referendum / national referendum',       topic: 'governance' },
  { word: 'bureaucracy',    vi: 'bộ máy quan liêu',         pronunciation: '/bjʊˈrɒk.rə.si/',      example: 'Excessive bureaucracy slows down the delivery of public services.',        collocation: 'government bureaucracy / cut through bureaucracy', topic: 'governance' },
  { word: 'policy-making',  vi: 'hoạch định chính sách',    pronunciation: '/ˈpɒl.ɪ.si ˌmeɪ.kɪŋ/', example: 'Evidence-based policy-making leads to better outcomes for society.',      collocation: 'policy-making process / government policy-making', topic: 'governance' },

  // ── economics (additional) ───────────────────────────────────────────────────
  { word: 'expenditure',    vi: 'chi tiêu',                 pronunciation: '/ɪkˈspen.dɪ.tʃər/',    example: 'Government expenditure on healthcare increased significantly last year.',   collocation: 'public expenditure / household expenditure',    topic: 'economics' },
  { word: 'subsidy',        vi: 'trợ cấp',                  pronunciation: '/ˈsʌb.sə.di/',         example: 'Farmers receive a government subsidy to stabilise food prices.',            collocation: 'government subsidy / fuel subsidy',             topic: 'economics' },
  { word: 'commodity',      vi: 'hàng hóa',                 pronunciation: '/kəˈmɒd.ə.ti/',        example: 'Oil remains one of the most valuable commodities in global trade.',         collocation: 'global commodity / commodity prices',           topic: 'economics' },

  // ── society (additional) ─────────────────────────────────────────────────────
  { word: 'marginalise',    vi: 'gạt ra ngoài lề',          pronunciation: '/ˈmɑː.dʒɪn.əl.aɪz/',   example: 'Poorly designed policies can marginalise vulnerable groups.',               collocation: 'marginalise communities / marginalised groups', topic: 'society' },
  { word: 'norm',           vi: 'chuẩn mực',                pronunciation: '/nɔːm/',               example: 'Social norms vary considerably from one culture to another.',               collocation: 'social norm / cultural norm',                   topic: 'society' },
]

export const vocabTopics = [...new Set(ieltsVocabulary.map(v => v.topic))]
