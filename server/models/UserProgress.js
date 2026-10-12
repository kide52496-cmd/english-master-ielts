import mongoose from 'mongoose'

const UserProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: 'user_default',
    },
    displayName: {
      type: String,
      default: 'IELTS Warrior',
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    streak: {
      type: Number,
      default: 0,
    },
    targetBand: {
      type: Number,
      default: 6.5,
    },
    stage: {
      type: String,
      default: 'A1 - Foundation',
    },
    learnedWordsCount: {
      type: Number,
      default: 0,
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    srsCardsCount: {
      type: Number,
      default: 0,
    },
    mockTestsCount: {
      type: Number,
      default: 0,
    },
    lastEstimatedBand: {
      type: Number,
      default: 5.0,
    },
    stateDump: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'user_progress',
  }
)

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema)
