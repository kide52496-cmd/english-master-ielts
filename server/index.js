import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import UserProgress from './models/UserProgress.js'
import IELTSActivity from './models/IELTSActivity.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/english_master_db'

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// MongoDB Connection
let isMongoConnected = false

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    isMongoConnected = true
    console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.name || 'english_master_db'}`)
  } catch (err) {
    isMongoConnected = false
    console.warn(`[MongoDB] Connection warning (running in graceful standby):`, err.message)
  }
}

connectDB()

// In-memory fallback cache when MongoDB is in standby mode
const inMemoryCache = {
  users: new Map(),
  activities: [],
}

// ── Health & Database Status ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const stateNames = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting']
  const mongoStatus = stateNames[mongoose.connection.readyState] || 'Unknown'

  res.json({
    status: 'ok',
    service: 'English Master IELTS API & Cloud Controller',
    version: '2.0.0',
    mongodb: {
      status: isMongoConnected ? 'connected' : mongoStatus,
      database: mongoose.connection.name || 'english_master_db',
      host: mongoose.connection.host || 'localhost',
      readyState: mongoose.connection.readyState,
    },
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  })
})

// ── Database Metrics & Statistics ──────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    if (isMongoConnected) {
      const userCount = await UserProgress.countDocuments()
      const activityCount = await IELTSActivity.countDocuments()
      const topLearners = await UserProgress.find().sort({ xp: -1 }).limit(5).select('userId displayName xp level streak')

      return res.json({
        success: true,
        cluster: 'MongoDB Cloud Cluster0',
        database: mongoose.connection.name || 'english_master_db',
        collections: {
          user_progress: userCount,
          ielts_submissions: activityCount,
        },
        topLearners,
      })
    }

    // In-memory fallback
    res.json({
      success: true,
      cluster: 'In-Memory / Standby Mode',
      database: 'english_master_db',
      collections: {
        user_progress: inMemoryCache.users.size,
        ielts_submissions: inMemoryCache.activities.length,
      },
      topLearners: Array.from(inMemoryCache.users.values()).slice(0, 5),
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ── Get User Progress from MongoDB ────────────────────────────────────────
app.get('/api/user/:userId/progress', async (req, res) => {
  const { userId } = req.params

  try {
    if (isMongoConnected) {
      const doc = await UserProgress.findOne({ userId })
      if (!doc) {
        return res.status(404).json({ success: false, message: 'User progress not found in MongoDB' })
      }
      return res.json({ success: true, source: 'mongodb', data: doc })
    }

    const cached = inMemoryCache.users.get(userId)
    if (!cached) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    return res.json({ success: true, source: 'cache', data: cached })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ── Upsert User Progress to MongoDB ───────────────────────────────────────
app.post('/api/user/:userId/progress', async (req, res) => {
  const { userId } = req.params
  const payload = req.body

  try {
    const updateData = {
      userId,
      displayName: payload.displayName || 'IELTS Warrior',
      xp: Number(payload.xp || 0),
      level: Number(payload.level || 1),
      streak: Number(payload.streak || 0),
      targetBand: Number(payload.targetBand || 6.5),
      stage: payload.stage || 'A1 - Foundation',
      learnedWordsCount: Number(payload.learnedWordsCount || (payload.learnedWords ? payload.learnedWords.length : 0)),
      completedLessons: Array.isArray(payload.completedLessons) ? payload.completedLessons : [],
      srsCardsCount: Number(payload.srsCardsCount || 0),
      mockTestsCount: Number(payload.mockTestsCount || 0),
      stateDump: payload.stateDump || payload,
      lastSyncedAt: new Date(),
    }

    if (isMongoConnected) {
      const result = await UserProgress.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { upsert: true, new: true }
      )
      return res.json({
        success: true,
        source: 'mongodb',
        message: 'Progress synced to MongoDB successfully',
        docId: result._id,
        syncedAt: result.lastSyncedAt,
      })
    }

    // Save in memory
    const pseudoDoc = {
      _id: `mock_${Date.now().toString(16)}`,
      ...updateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    inMemoryCache.users.set(userId, pseudoDoc)

    return res.json({
      success: true,
      source: 'memory_standby',
      message: 'Progress recorded (MongoDB standby active)',
      docId: pseudoDoc._id,
      syncedAt: pseudoDoc.lastSyncedAt,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ── Record IELTS Writing / Speaking Submission ────────────────────────────
app.post('/api/ielts/submit', async (req, res) => {
  const {
    userId = 'user_default',
    activityType = 'writing',
    title = 'IELTS Task',
    prompt,
    submissionText,
    estimatedBand,
    criteriaBreakdown,
    feedback,
    improvedVersion,
  } = req.body

  try {
    const record = {
      userId,
      activityType,
      title,
      prompt,
      submissionText,
      estimatedBand: Number(estimatedBand || 6.0),
      criteriaBreakdown,
      feedback,
      improvedVersion,
    }

    if (isMongoConnected) {
      const doc = await IELTSActivity.create(record)
      return res.json({ success: true, source: 'mongodb', recordId: doc._id })
    }

    const mockId = `act_${Date.now()}`
    inMemoryCache.activities.push({ _id: mockId, ...record, createdAt: new Date() })
    return res.json({ success: true, source: 'memory_standby', recordId: mockId })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ── AI IELTS Evaluation & Chat Endpoint ───────────────────────────────────
app.post('/api/ai/grade-essay', (req, res) => {
  const { text = '', taskType = 'task2', topic = '' } = req.body

  const words = text.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // Heuristic calculation of Band Score
  const minRequired = taskType === 'task1' ? 150 : 250
  let lengthPenalty = 0
  if (wordCount < minRequired) {
    lengthPenalty = ((minRequired - wordCount) / minRequired) * 1.5
  }

  // Academic Word List (AWL) heuristic detection
  const academicTerms = [
    'furthermore', 'moreover', 'nevertheless', 'consequently', 'substantial',
    'predominant', 'phenomenon', 'significantly', 'demonstrate', 'illustrate',
    'imperative', 'detrimental', 'profound', 'facilitate', 'mitigate',
    'inevitable', 'unprecedented', 'contemporary', 'comprehensive', 'perspective'
  ]
  const matchedAcademic = academicTerms.filter(term => text.toLowerCase().includes(term))
  const lexicalScore = Math.min(9.0, Math.max(5.0, 5.5 + matchedAcademic.length * 0.4))

  // Grammar & Cohesion calculation
  const hasParagraphs = (text.split(/\n\s*\n/).length >= 3)
  const cohesionScore = Math.min(9.0, Math.max(5.0, (hasParagraphs ? 6.5 : 5.0) + (matchedAcademic.length > 2 ? 0.5 : 0)))
  const taskAchievement = Math.min(9.0, Math.max(4.5, 7.0 - lengthPenalty))
  const grammarScore = Math.min(9.0, Math.max(5.0, 6.0 + (wordCount > 200 ? 0.5 : 0)))

  const rawBand = (taskAchievement + cohesionScore + lexicalScore + grammarScore) / 4
  const roundedBand = Math.round(rawBand * 2) / 2 // round to nearest 0.5

  res.json({
    success: true,
    wordCount,
    estimatedBand: roundedBand,
    criteria: {
      taskAchievement: Math.round(taskAchievement * 2) / 2,
      coherenceCohesion: Math.round(cohesionScore * 2) / 2,
      lexicalResource: Math.round(lexicalScore * 2) / 2,
      grammaticalAccuracy: Math.round(grammarScore * 2) / 2,
    },
    strengths: [
      hasParagraphs ? 'Cấu trúc bài chia đoạn rõ ràng, có mở bài, thân bài và kết bài.' : 'Đã cố gắng triển khai ý.',
      matchedAcademic.length > 0 ? `Sử dụng tốt ${matchedAcademic.length} từ vựng học thuật cao cấp (${matchedAcademic.slice(0, 3).join(', ')}).` : 'Văn phong mạch lạc.',
      wordCount >= minRequired ? `Đạt chuẩn độ dài yêu cầu (${wordCount}/${minRequired} từ).` : 'Cần bổ sung độ dài để tránh bị trừ điểm Task Achievement.',
    ],
    improvements: [
      'Nên áp dụng thêm cấu trúc đảo ngữ (Inversion) hoặc mệnh đề quan hệ rút gọn để đẩy điểm Ngữ pháp lên Band 7.5+.',
      'Sử dụng các cụm Collocation tự nhiên thay vì ghép từ dịch đơn lẻ.',
    ],
    improvedExcerpt: text.length > 50
      ? `It is widely acknowledged that ${text.slice(0, 100)}... In particular, contemporary empirical evidence substantiates the imperative nature of this phenomenon.`
      : 'Bản nâng cấp học thuật mẫu Band 8.5 sẽ hiển thị khi bạn nhập đoạn văn hoàn chỉnh.',
  })
})

app.listen(PORT, () => {
  console.log(`=======================================================`)
  console.log(`🚀 English Master IELTS Backend Server running on port ${PORT}`)
  console.log(`🍃 MongoDB URI: ${MONGODB_URI}`)
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`)
  console.log(`📊 Stats Endpoint: http://localhost:${PORT}/api/stats`)
  console.log(`=======================================================`)
})
