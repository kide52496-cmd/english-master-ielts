// Single source of truth for every navigable page in the app.
//
// `App.jsx` renders by id, `Navbar.jsx` builds its menu from the `nav` entries,
// and `useRouter` validates URLs against this list so an unknown ?page= value
// can never render a blank screen. Adding a page means adding one row here.

export const DEFAULT_ROUTE = 'dashboard'

export const ROUTES = [
  { id: 'dashboard',        label: 'Trang Chủ',        title: 'Trang Chủ',              nav: true },
  { id: 'learning-path',    label: 'Lộ Trình',         title: 'Lộ Trình Học',           nav: true },
  { id: 'my-plan',          label: 'Plan Của Tôi',     title: 'Plan Của Tôi',           nav: true },
  { id: 'goal-mode',        label: 'Mục Tiêu',         title: 'Chế Độ Mục Tiêu',        nav: true },
  { id: 'placement',        label: 'Test Đầu Vào',     title: 'Test Đầu Vào',           nav: true },
  { id: 'course',           label: 'Khóa Học',         title: 'Khóa Học',               nav: true },
  { id: 'vocabulary',       label: 'Từ Vựng',          title: 'Từ Vựng',                nav: true },
  { id: 'vocab-pro',        label: 'Từ Vựng Pro',      title: 'Từ Vựng Pro',            nav: true },
  { id: 'flashcard',        label: 'Flashcard',        title: 'Flashcard',              nav: true },
  { id: 'quiz',             label: 'Quiz',             title: 'Quiz',                   nav: true },
  { id: 'quiz-pro',         label: 'Quiz Pro',         title: 'Quiz Pro',               nav: true },
  { id: 'grammar',          label: 'Ngữ Pháp',         title: 'Ngữ Pháp',               nav: true },
  { id: 'grammar-practice', label: 'Luyện Tập NP',     title: 'Luyện Tập Ngữ Pháp',     nav: true },
  { id: 'listening',        label: 'Nghe',             title: 'Luyện Nghe',             nav: true },
  { id: 'listening-pack',   label: '100 Bài Nghe-Nói', title: '100 Bài Nghe - Nói',     nav: true },
  { id: 'dictation-mode',   label: 'Dictation',        title: 'Dictation',              nav: true },
  { id: 'speaking',         label: 'Nói',              title: 'Luyện Nói',              nav: true },
  { id: 'speaking-coach',   label: 'Speaking Coach',   title: 'Speaking Coach',         nav: true },
  { id: 'reading-library',  label: 'Thư Viện Đọc',     title: 'Thư Viện Đọc',           nav: true },
  { id: 'story-book',       label: 'Story Book',       title: 'Story Book',             nav: true },
  { id: 'video-lab',        label: 'Video Lab',        title: 'Video Learning Lab',     nav: true },
  { id: 'ielts-hub',        label: 'IELTS Hub',        title: 'IELTS Hub',              nav: true },
  { id: 'mock-test',        label: 'Mock Test',        title: 'Mock Test IELTS',        nav: true },
  { id: 'review-center',    label: 'Review Center',    title: 'Review Center',          nav: true },
  { id: 'review-queue',     label: 'Ôn Hôm Nay',       title: 'Ôn Tập Hôm Nay',         nav: true },
  { id: 'phrasebook',       label: 'Phrasebook',       title: 'Phrasebook',             nav: true },
  { id: 'writing-workshop', label: 'Writing Workshop', title: 'Writing Workshop',       nav: true },
  { id: 'achievements',     label: 'Thành Tích',       title: 'Thành Tích',             nav: true },
  { id: 'notes',            label: 'Ghi Chú',          title: 'Ghi Chú',                nav: true },
  { id: 'mistakes-review',  label: 'Ôn Lỗi Sai',       title: 'Ôn Lỗi Sai',             nav: true },
  { id: 'mongodb-cloud',    label: 'MongoDB Cloud',    title: 'MongoDB Cloud & Database Hub', nav: true },
  { id: 'ai-tutor',         label: 'AI IELTS Copilot', title: 'AI IELTS Copilot & Examiner',  nav: true },
  { id: 'settings',         label: 'Cài Đặt',          title: 'Cài Đặt',                nav: true },

  // Reachable from inside other pages, not from the main menu.
  { id: 'roadmap',          label: 'Roadmap',          title: 'Roadmap',                nav: false },
]

export const NAV_ROUTES = ROUTES.filter(r => r.nav)

const BY_ID = new Map(ROUTES.map(r => [r.id, r]))

export function isRoute(id) {
  return typeof id === 'string' && BY_ID.has(id)
}

export function routeTitle(id) {
  return BY_ID.get(id)?.title || BY_ID.get(DEFAULT_ROUTE).title
}

export function routeLabel(id) {
  return BY_ID.get(id)?.label || BY_ID.get(DEFAULT_ROUTE).label
}
