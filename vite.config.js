import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  preview: {
    allowedHosts: true,
    host: true,
    port: 4173,
  },
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/src/')) return undefined

          // Vocabulary: split per source file so each chunk stays smaller.
          if (id.includes('/src/data/vocab_supp_travel'))    return 'vocab-supp-travel'
          if (id.includes('/src/data/vocab_supp_work'))      return 'vocab-supp-work'
          if (id.includes('/src/data/vocab_supp_family'))    return 'vocab-supp-family'
          if (id.includes('/src/data/vocab_supp_health'))    return 'vocab-supp-health'
          if (id.includes('/src/data/vocab_supp_society'))   return 'vocab-supp-society'
          if (id.includes('/src/data/vocab_ielts_foundation_full')) return 'vocab-ielts-foundation'
          if (id.includes('/src/data/vocab_ielts_5_full')) return 'vocab-ielts-5'
          if (id.includes('/src/data/vocab_a2')) return 'vocab-a2'
          if (id.includes('/src/data/vocab_a1')) return 'vocab-a1'
          if (id.includes('/src/data/vocab_b1_gaps')) return 'vocab-b1-gaps'
          if (id.includes('/src/data/vocab_b1plus_gaps')) return 'vocab-b1plus-gaps'
          if (id.includes('/src/data/vocab_b1plus')) return 'vocab-b1plus'
          if (id.includes('/src/data/vocab_b1')) return 'vocab-b1'
          if (id.includes('/src/data/vocab_beginner')) return 'vocab-beginner'
          if (id.includes('/src/data/vocab_ielts_foundation')) return 'vocab-ielts-foundation-lite'
          if (id.includes('/src/data/vocab_ielts_5')) return 'vocab-ielts-5-lite'
          if (id.includes('/src/data/vocabulary')) return 'vocab-aggregate'

          // Course lessons: split off so misc-data shrinks
          if (id.includes('/src/data/courseLessons_mat_goc'))   return 'course-lessons-mat-goc'
          if (id.includes('/src/data/courseLessons_a1'))         return 'course-lessons-a1'
          if (id.includes('/src/data/courseLessons_a2'))         return 'course-lessons-a2'
          if (id.includes('/src/data/courseLessons_b1plus'))     return 'course-lessons-b1plus'
          if (id.includes('/src/data/courseLessons_b1'))         return 'course-lessons-b1'
          if (id.includes('/src/data/courseLessons_ielts_f'))    return 'course-lessons-ielts-foundation'
          if (id.includes('/src/data/courseLessons_ielts_5'))    return 'course-lessons-ielts-5'
          if (id.includes('/src/data/courseLessons_ielts_55'))   return 'course-lessons-ielts-55'
          if (id.includes('/src/data/courseLessons_ielts_6'))    return 'course-lessons-ielts-6'
          if (id.includes('/src/data/courseLessons')) return 'course-lessons-index'

          // Grammar
          if (id.includes('/src/data/grammarLessons')) return 'grammar-data'

          // Listening / Speaking / Phrasebook (heavy text)
          if (id.includes('/src/data/listeningScripts')) return 'listening-scripts'
          if (id.includes('/src/data/speakingLessons')) return 'speaking-lessons'
          if (id.includes('/src/data/phrasebook')) return 'phrasebook-data'
          if (id.includes('/src/data/videoLessons')) return 'video-lessons'
          if (id.includes('/src/data/quiz')) return 'quiz-data'
          if (id.includes('/src/data/placementTest')) return 'placement-data'
          if (id.includes('/src/data/achievements')) return 'achievements-data'
          if (id.includes('/src/data/roadmap')) return 'roadmap-data'

          // IELTS data
          if (id.includes('/src/data/ielts')) return 'ielts-data'

          // Stories: split by level
          if (id.includes('/src/data/stories_beginner'))         return 'stories-beginner'
          if (id.includes('/src/data/stories_a1'))                return 'stories-a1'
          if (id.includes('/src/data/stories_a2'))                return 'stories-a2'
          if (id.includes('/src/data/stories_b1plus_gaps'))       return 'stories-b1plus'
          if (id.includes('/src/data/stories_b1plus'))            return 'stories-b1plus'
          if (id.includes('/src/data/stories_b1_'))               return 'stories-b1plus'
          if (id.includes('/src/data/stories_b1'))                return 'stories-b1'
          if (id.includes('/src/data/stories_ielts_foundation'))  return 'stories-ielts-foundation'
          if (id.includes('/src/data/stories_ielts_5_0_6_0'))     return 'stories-ielts-5'
          if (id.includes('/src/data/stories_'))                  return 'stories-other'
          if (id.includes('/src/data/stories'))                   return 'stories-index'

          // Misc data (catch-all)
          if (id.includes('/src/data/')) return 'misc-data'
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
