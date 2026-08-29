export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-8">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-base">🎓</span>
            <span className="font-semibold text-gray-600 dark:text-gray-400">English Master IELTS</span>
            <span className="hidden sm:inline">· by Nguyễn An Dương</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 Nguyễn An Dương</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
