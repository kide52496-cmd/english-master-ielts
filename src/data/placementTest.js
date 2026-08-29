export const placementQuestions = [
  // ── Mất gốc (Q1–6): siêu cơ bản ─────────────────────────────────────────
  {
    id: 1, level: 'Beginner',
    question: '"Hello" in Vietnamese means:',
    options: ['Tạm biệt', 'Xin chào', 'Cảm ơn', 'Xin lỗi'],
    correct: 1,
  },
  {
    id: 2, level: 'Beginner',
    question: '"Thank you" in Vietnamese means:',
    options: ['Xin lỗi', 'Xin chào', 'Cảm ơn', 'Không có gì'],
    correct: 2,
  },
  {
    id: 3, level: 'Beginner',
    question: 'How many letters are in the English alphabet?',
    options: ['24', '25', '26', '27'],
    correct: 2,
  },
  {
    id: 4, level: 'Beginner',
    question: 'Complete: "The sky is ___."',
    options: ['green', 'blue', 'red', 'yellow'],
    correct: 1,
  },
  {
    id: 5, level: 'Beginner',
    question: '"My name is Lan." — "Lan" is a ___.',
    options: ['verb', 'adjective', 'name / noun', 'number'],
    correct: 2,
  },
  {
    id: 6, level: 'Beginner',
    question: '"Book" in Vietnamese means:',
    options: ['Cái bàn', 'Cuốn sách', 'Cái bút', 'Ngôi nhà'],
    correct: 1,
  },

  // ── A1 (Q7–12): cơ bản ──────────────────────────────────────────────────
  {
    id: 7, level: 'A1',
    question: 'Choose the correct verb: "She ___ a teacher."',
    options: ['am', 'are', 'is', 'be'],
    correct: 2,
  },
  {
    id: 8, level: 'A1',
    question: 'Complete: "There are three ___ in the park."',
    options: ['dog', 'dogs', 'doges', 'dog\'s'],
    correct: 1,
  },
  {
    id: 9, level: 'A1',
    question: '"I ___ to school every day."',
    options: ['goes', 'go', 'going', 'gone'],
    correct: 1,
  },
  {
    id: 10, level: 'A1',
    question: 'Which article? "___ apple a day keeps the doctor away."',
    options: ['A', 'An', 'The', 'No article'],
    correct: 1,
  },
  {
    id: 11, level: 'A1',
    question: '"He ___ football every Saturday."',
    options: ['play', 'plays', 'playing', 'played'],
    correct: 1,
  },
  {
    id: 12, level: 'A1',
    question: '"What time is it?" — Best response:',
    options: ["It's Monday.", "It's 3 o'clock.", "It's sunny.", "I'm fine."],
    correct: 1,
  },

  // ── A1/A2 (Q13–18): grammar sơ-trung ────────────────────────────────────
  {
    id: 13, level: 'A1',
    question: '"Yesterday I ___ to the market."',
    options: ['go', 'goes', 'went', 'going'],
    correct: 2,
  },
  {
    id: 14, level: 'A2',
    question: '"She is ___ than her sister." (tall)',
    options: ['more taller', 'tallest', 'taller', 'tall'],
    correct: 2,
  },
  {
    id: 15, level: 'A2',
    question: 'Modal verb: "You ___ wear a helmet on a motorbike."',
    options: ['can', 'should', 'might', 'would'],
    correct: 1,
  },
  {
    id: 16, level: 'A2',
    question: '"I was born ___ 2005."',
    options: ['at', 'on', 'in', 'by'],
    correct: 2,
  },
  {
    id: 17, level: 'A2',
    question: '"I think it ___ rain tomorrow."',
    options: ['would', 'will', 'is', 'was'],
    correct: 1,
  },
  {
    id: 18, level: 'A2',
    question: '"How ___ water do you drink a day?"',
    options: ['many', 'much', 'few', 'little'],
    correct: 1,
  },

  // ── B1 (Q19–24): trung cấp ───────────────────────────────────────────────
  {
    id: 19, level: 'B1',
    question: '"I ___ never ___ sushi before." (Present Perfect)',
    options: ['had / ate', 'have / eaten', 'has / eat', 'have / ate'],
    correct: 1,
  },
  {
    id: 20, level: 'B1',
    question: 'Passive Voice: "The book ___ written in 1990."',
    options: ['is', 'was', 'were', 'has'],
    correct: 1,
  },
  {
    id: 21, level: 'B1',
    question: 'Conditional Type 1: "If it rains, I ___ stay home."',
    options: ['would', 'will', 'should', 'might'],
    correct: 1,
  },
  {
    id: 22, level: 'B1',
    question: '"The man ___ called you is my brother." (Relative clause)',
    options: ['which', 'where', 'who', 'whose'],
    correct: 2,
  },
  {
    id: 23, level: 'B1',
    question: '"She enjoys ___ to music while studying."',
    options: ['listen', 'to listen', 'listening', 'listened'],
    correct: 2,
  },
  {
    id: 24, level: 'B1',
    question: 'Conditional Type 2: "If I ___ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'be'],
    correct: 2,
  },

  // ── B1+/IELTS (Q25–30): nâng cao ─────────────────────────────────────────
  {
    id: 25, level: 'B1+',
    question: '"By the time she arrived, the meeting ___ already finished."',
    options: ['is', 'was', 'has', 'had'],
    correct: 3,
  },
  {
    id: 26, level: 'B1+',
    question: 'Reported speech: He said he ___ tired. (He said: "I am tired.")',
    options: ['is', 'was', 'were', 'has been'],
    correct: 1,
  },
  {
    id: 27, level: 'IELTS',
    question: '"Despite ___ illness, he continued working." (his/him)',
    options: ['him', 'his', 'he', 'himself'],
    correct: 1,
  },
  {
    id: 28, level: 'IELTS',
    question: 'Most academic word for "show": "The data ___ that pollution is rising."',
    options: ['show', 'tells', 'indicates', 'says'],
    correct: 2,
  },
  {
    id: 29, level: 'IELTS',
    question: '"Not only ___ she talented, but also hardworking."',
    options: ['is', 'was', 'does', 'has'],
    correct: 0,
  },
  {
    id: 30, level: 'IELTS',
    question: '"Unprecedented" means:',
    options: ['Phổ biến', 'Tạm thời', 'Chưa từng có', 'Thông thường'],
    correct: 2,
  },
]

export const scoreBands = [
  { min: 0,  max: 9,  stageId: 'beginner',         label: 'Mất Gốc',         icon: '🌱', message: 'Bắt đầu từ những kiến thức đầu tiên về tiếng Anh.' },
  { min: 10, max: 15, stageId: 'a1',                label: 'A1 – Sơ Cấp',     icon: '🌿', message: 'Bạn biết một số từ cơ bản, hãy xây nền tảng vững chắc!' },
  { min: 16, max: 21, stageId: 'a2',                label: 'A2 – Tiền Trung', icon: '🌳', message: 'Vốn từ cơ bản tốt, cần luyện thêm ngữ pháp.' },
  { min: 22, max: 26, stageId: 'b1',                label: 'B1 – Trung Cấp',  icon: '🌲', message: 'Khá tốt! Hãy nâng lên IELTS Foundation.' },
  { min: 27, max: 30, stageId: 'ielts_foundation',  label: 'IELTS Foundation', icon: '📐', message: 'Giỏi lắm! Sẵn sàng luyện IELTS rồi đó.' },
]

export function getSuggestedStage(score) {
  return scoreBands.find(b => score >= b.min && score <= b.max) || scoreBands[0]
}
