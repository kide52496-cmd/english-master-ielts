import { useState, lazy, Suspense, useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

// Lazy-loaded page components (code-splitting for performance).
// Dashboard is lazy too: it pulls in heavy data modules for count badges,
// so keeping it out of the entry bundle speeds up first paint a lot.
const Dashboard = lazy(() => import('./components/Dashboard'))
const VocabularyPage = lazy(() => import('./components/VocabularyPage'))
const FlashcardPage = lazy(() => import('./components/FlashcardPage'))
const QuizPage = lazy(() => import('./components/QuizPage'))
const GrammarPage = lazy(() => import('./components/GrammarPage'))
const ListeningPage = lazy(() => import('./components/ListeningPage'))
const SpeakingPage = lazy(() => import('./components/SpeakingPage'))
const Roadmap = lazy(() => import('./components/Roadmap'))
const LearningPath = lazy(() => import('./components/LearningPath'))
const PlacementTest = lazy(() => import('./components/PlacementTest'))
const Achievements = lazy(() => import('./components/Achievements'))
const Settings = lazy(() => import('./components/Settings'))
const StoryBook = lazy(() => import('./components/StoryBook'))
const VideoLearningLab = lazy(() => import('./components/VideoLearningLab'))
const IELTSHub = lazy(() => import('./components/IELTSHub'))
const MockTest = lazy(() => import('./components/MockTest'))
const ReviewCenter = lazy(() => import('./components/ReviewCenter'))
const Phrasebook = lazy(() => import('./components/Phrasebook'))
const WritingWorkshop = lazy(() => import('./components/WritingWorkshop'))
const PersonalizedPlan = lazy(() => import('./components/PersonalizedPlan'))
const ReviewQueue = lazy(() => import('./components/ReviewQueue'))
const GoalMode = lazy(() => import('./components/GoalMode'))
const VocabularyEnhanced = lazy(() => import('./components/VocabularyEnhanced'))
const GrammarPracticeEngine = lazy(() => import('./components/GrammarPracticeEngine'))
const QuizPro = lazy(() => import('./components/QuizPro'))
const Course = lazy(() => import('./components/Course'))
const SpeakingCoach = lazy(() => import('./components/SpeakingCoach'))
const DictationMode = lazy(() => import('./components/DictationMode'))
const Notes = lazy(() => import('./components/Notes'))
const MistakesReview = lazy(() => import('./components/MistakesReview'))
const ListeningSpeakingPack = lazy(() => import('./components/ListeningSpeakingPack'))

// Loading fallback shown while page chunk is loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Đang tải trang...</p>
      </div>
    </div>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Allow ?page=xxx deep-link from PWA shortcuts and external links
    try {
      const params = new URLSearchParams(window.location.search)
      const p = params.get('page')
      if (p && /^[a-z][a-z0-9-]*$/i.test(p)) return p
    } catch {}
    return 'dashboard'
  })
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('ema_darkMode') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try {
      localStorage.setItem('ema_darkMode', String(darkMode))
    } catch {}
  }, [darkMode])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':      return <Dashboard setCurrentPage={setCurrentPage} />
      case 'roadmap':        return <Roadmap setCurrentPage={setCurrentPage} />
      case 'learning-path':  return <LearningPath setCurrentPage={setCurrentPage} />
      case 'my-plan':        return <PersonalizedPlan setCurrentPage={setCurrentPage} />
      case 'goal-mode':      return <GoalMode setCurrentPage={setCurrentPage} />
      case 'placement':      return <PlacementTest setCurrentPage={setCurrentPage} />
      case 'course':         return <Course />
      case 'vocabulary':     return <VocabularyPage />
      case 'vocab-pro':      return <VocabularyEnhanced />
      case 'flashcard':      return <FlashcardPage />
      case 'quiz':           return <QuizPage />
      case 'quiz-pro':       return <QuizPro setCurrentPage={setCurrentPage} />
      case 'grammar':        return <GrammarPage />
      case 'grammar-practice': return <GrammarPracticeEngine setCurrentPage={setCurrentPage} />
      case 'listening':      return <ListeningPage />
      case 'speaking':       return <SpeakingPage />
      case 'speaking-coach': return <SpeakingCoach />
      case 'dictation-mode': return <DictationMode />
      case 'story-book':     return <StoryBook />
      case 'video-lab':      return <VideoLearningLab />
      case 'ielts-hub':      return <IELTSHub />
      case 'mock-test':      return <MockTest onExit={() => setCurrentPage('ielts-hub')} />
      case 'review-center':  return <ReviewCenter />
      case 'review-queue':   return <ReviewQueue setCurrentPage={setCurrentPage} />
      case 'phrasebook':        return <Phrasebook />
      case 'writing-workshop':  return <WritingWorkshop />
      case 'achievements':      return <Achievements />
      case 'notes':             return <Notes setCurrentPage={setCurrentPage} />
      case 'mistakes-review':   return <MistakesReview setCurrentPage={setCurrentPage} />
      case 'listening-pack':    return <ListeningSpeakingPack />
      case 'settings':       return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
      default:               return <Dashboard setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/40 relative overflow-hidden">
          {/* Decorative blobs (background) */}
          <div className="blob bg-indigo-300/20 dark:bg-indigo-600/10 w-[28rem] h-[28rem] -top-32 -left-40" />
          <div className="blob bg-pink-300/20 dark:bg-pink-600/10 w-[24rem] h-[24rem] top-1/3 -right-32 animate-float-slow" />
          <div className="blob bg-cyan-300/20 dark:bg-cyan-600/10 w-[22rem] h-[22rem] bottom-0 left-1/4 animate-float-slow" style={{ animationDelay: '2s' }} />

          <div className="relative z-10">
            <Navbar
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <main className="container mx-auto px-4 py-6 max-w-6xl">
              <ErrorBoundary key={currentPage}>
                <Suspense fallback={<PageLoader />}>
                  <div key={currentPage} className="animate-fade-up">
                    {renderPage()}
                  </div>
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </div>
      </AppProvider>
    </ErrorBoundary>
  )
}
