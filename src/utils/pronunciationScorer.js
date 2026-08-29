// Pronunciation scorer.
// Uses Web Speech Recognition transcript and compares it with the target text.
// Returns word-level diff + overall score (0-100).
// No external API. Heuristics only.

const PUNCT_RE = /[.,!?;:"'()\[\]\u2018\u2019\u201C\u201D\u2014\-]/g

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(PUNCT_RE, "")
    .replace(/\s+/g, " ")
    .trim()
}

function tokenize(s) {
  return normalize(s).split(/\s+/).filter(Boolean)
}

// Levenshtein distance between two short strings (used per-word fuzzy).
function levenshtein(a, b) {
  if (a === b) return 0
  if (!a) return b.length
  if (!b) return a.length
  const m = a.length, n = b.length
  const dp = Array(n + 1).fill(0).map((_, i) => i)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      dp[j] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = tmp
    }
  }
  return dp[n]
}

function similarity(a, b) {
  if (!a && !b) return 1
  const dist = levenshtein(a, b)
  const maxLen = Math.max(a.length, b.length, 1)
  return Math.max(0, 1 - dist / maxLen)
}

// Word-level alignment via DP (longest common subsequence with fuzzy match).
function alignWords(target, spoken) {
  const T = target.length, S = spoken.length
  const dp = Array(T + 1).fill(0).map(() => Array(S + 1).fill(0))
  const back = Array(T + 1).fill(0).map(() => Array(S + 1).fill(""))

  for (let i = 1; i <= T; i++) {
    for (let j = 1; j <= S; j++) {
      const sim = similarity(target[i - 1], spoken[j - 1])
      const matchScore = dp[i - 1][j - 1] + sim
      const skipT = dp[i - 1][j]
      const skipS = dp[i][j - 1]
      if (matchScore >= skipT && matchScore >= skipS) {
        dp[i][j] = matchScore; back[i][j] = "M"
      } else if (skipT >= skipS) {
        dp[i][j] = skipT; back[i][j] = "T"
      } else {
        dp[i][j] = skipS; back[i][j] = "S"
      }
    }
  }

  // Trace back
  const out = []
  let i = T, j = S
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && back[i][j] === "M") {
      const sim = similarity(target[i - 1], spoken[j - 1])
      out.push({
        target: target[i - 1],
        spoken: spoken[j - 1],
        status: sim >= 0.85 ? "correct" : sim >= 0.55 ? "close" : "wrong",
        sim,
      })
      i--; j--
    } else if (j > 0 && (i === 0 || back[i][j] === "S")) {
      out.push({ target: null, spoken: spoken[j - 1], status: "extra", sim: 0 })
      j--
    } else {
      out.push({ target: target[i - 1], spoken: null, status: "missed", sim: 0 })
      i--
    }
  }
  return out.reverse()
}

export function scoreUtterance(targetText, spokenText) {
  const target = tokenize(targetText)
  const spoken = tokenize(spokenText)
  if (!target.length) {
    return { score: 0, alignment: [], target: [], spoken, hint: "Không có target" }
  }
  if (!spoken.length) {
    return {
      score: 0,
      alignment: target.map(t => ({ target: t, spoken: null, status: "missed", sim: 0 })),
      target, spoken,
      hint: "Chưa nghe được câu nói nào.",
    }
  }
  const alignment = alignWords(target, spoken)
  let totalSim = 0
  let counted = 0
  alignment.forEach(a => {
    if (a.target) {
      totalSim += a.spoken ? a.sim : 0
      counted++
    }
  })
  let score = counted > 0 ? Math.round((totalSim / counted) * 100) : 0
  // Penalise extra junk words
  const extras = alignment.filter(a => a.status === "extra").length
  const penalty = Math.min(20, extras * 5)
  score = Math.max(0, score - penalty)

  return {
    score,
    alignment,
    target,
    spoken,
    hint:
      score >= 90 ? "Xuất sắc, gần như giống bản chuẩn." :
      score >= 75 ? "Tốt — vài từ cần phát âm rõ hơn." :
      score >= 55 ? "Khá — chú ý các từ màu cam/đỏ." :
      score >= 30 ? "Cần luyện thêm. Đọc chậm và rõ từng từ." :
                   "Hãy nghe mẫu nhiều lần rồi nhắc lại từng cụm.",
  }
}

export function tipsByScore(score) {
  if (score >= 90) return ["Quá tốt!", "Thử tăng tốc độ tự nhiên hơn."]
  if (score >= 75) return ["Tách câu thành 2-3 cụm khi luyện.", "Phát âm rõ phụ âm cuối (s, t, d)."]
  if (score >= 55) return ["Đọc theo từng cụm, đừng ép cả câu.", "Ghi âm để so sánh với bản gốc."]
  return ["Nghe mẫu 3 lần rồi nhắc lại từng từ.", "Chú ý nguyên âm và trọng âm.", "Đọc chậm 0.7x rồi tăng dần."]
}
