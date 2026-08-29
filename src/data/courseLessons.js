// Auto-generated rebuilt course data.
// Total lessons: 90
// Generated: 2026-05-28T05:05:38.766Z
// Run gen_course_lessons.cjs to regenerate.

import { lessons_mat_goc } from './courseLessons_mat_goc.js'
import { lessons_a1 } from './courseLessons_a1.js'
import { lessons_a2 } from './courseLessons_a2.js'
import { lessons_b1 } from './courseLessons_b1.js'
import { lessons_b1plus } from './courseLessons_b1plus.js'
import { lessons_ielts_f } from './courseLessons_ielts_f.js'
import { lessons_ielts_5 } from './courseLessons_ielts_5.js'
import { lessons_ielts_55 } from './courseLessons_ielts_55.js'
import { lessons_ielts_6 } from './courseLessons_ielts_6.js'

export const LEVELS = [
  {
    "id": "mat-goc",
    "title": "Mất Gốc",
    "titleEn": "Absolute Beginner",
    "icon": "🌱",
    "color": "#22c55e",
    "goal": "Bảng chữ cái, từ vựng cơ bản, chào hỏi",
    "output": "Giới thiệu bản thân đơn giản"
  },
  {
    "id": "a1",
    "title": "A1",
    "titleEn": "Beginner",
    "icon": "🌿",
    "color": "#3b82f6",
    "goal": "Hiểu câu đơn giản, từ vựng hàng ngày",
    "output": "Giao tiếp hàng ngày cơ bản"
  },
  {
    "id": "a2",
    "title": "A2",
    "titleEn": "Elementary",
    "icon": "🌳",
    "color": "#8b5cf6",
    "goal": "Diễn đạt ý đơn giản, thì quá khứ",
    "output": "Kể chuyện ngắn, miêu tả"
  },
  {
    "id": "b1",
    "title": "B1",
    "titleEn": "Intermediate",
    "icon": "🚀",
    "color": "#f59e0b",
    "goal": "Thảo luận chủ đề quen thuộc, viết đoạn văn",
    "output": "Viết email, tham gia hội thoại"
  },
  {
    "id": "b1plus",
    "title": "B1+",
    "titleEn": "Upper Intermediate",
    "icon": "🔥",
    "color": "#ef4444",
    "goal": "Diễn đạt trôi chảy, học thuật cơ bản",
    "output": "Tranh luận, thuyết trình ngắn"
  },
  {
    "id": "ielts-f",
    "title": "IELTS Foundation",
    "titleEn": "IELTS Foundation",
    "icon": "📘",
    "color": "#06b6d4",
    "goal": "Nắm cấu trúc IELTS, kỹ thuật cơ bản",
    "output": "Làm quen dạng bài IELTS"
  },
  {
    "id": "ielts-5",
    "title": "IELTS 5.0",
    "titleEn": "IELTS Band 5",
    "icon": "📗",
    "color": "#14b8a6",
    "goal": "Chiến thuật làm bài, từ vựng học thuật",
    "output": "Đạt band 5.0"
  },
  {
    "id": "ielts-55",
    "title": "IELTS 5.5",
    "titleEn": "IELTS Band 5.5",
    "icon": "📕",
    "color": "#a855f7",
    "goal": "Kỹ thuật nâng cao, quản lý thời gian",
    "output": "Đạt band 5.5"
  },
  {
    "id": "ielts-6",
    "title": "IELTS 6.0",
    "titleEn": "IELTS Band 6",
    "icon": "🏆",
    "color": "#eab308",
    "goal": "Tổng ôn, chiến thuật điểm cao",
    "output": "Đạt band 6.0+"
  }
];

export const lessons = [
  ...lessons_mat_goc,
  ...lessons_a1,
  ...lessons_a2,
  ...lessons_b1,
  ...lessons_b1plus,
  ...lessons_ielts_f,
  ...lessons_ielts_5,
  ...lessons_ielts_55,
  ...lessons_ielts_6
];

export function getLessonsByLevel(levelId) { return lessons.filter(l => l.levelId === levelId); }

export function getLessonById(id) { return lessons.find(l => l.id === id); }
