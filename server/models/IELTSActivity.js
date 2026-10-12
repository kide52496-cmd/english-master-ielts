import mongoose from 'mongoose'

const IELTSActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      default: 'user_default',
    },
    activityType: {
      type: String,
      enum: ['writing', 'speaking', 'mock_test', 'quiz', 'srs_review'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
    },
    submissionText: {
      type: String,
    },
    estimatedBand: {
      type: Number,
    },
    criteriaBreakdown: {
      taskAchievement: Number,
      coherenceCohesion: Number,
      lexicalResource: Number,
      grammaticalAccuracy: Number,
    },
    feedback: {
      type: String,
    },
    improvedVersion: {
      type: String,
    },
    score: {
      type: Number,
    },
    totalQuestions: {
      type: Number,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'ielts_submissions',
  }
)

export default mongoose.models.IELTSActivity || mongoose.model('IELTSActivity', IELTSActivitySchema)
