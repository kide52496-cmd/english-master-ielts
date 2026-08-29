// Auto-split stories.
// Generated: 2026-05-28T05:06:49.019Z
// Run gen_stories_split.cjs to regenerate.

import { stories_beginner } from "./stories_beginner.js"
import { stories_a1 } from "./stories_a1.js"
import { stories_a2 } from "./stories_a2.js"
import { stories_b1 } from "./stories_b1.js"
import { stories_b1_ } from "./stories_b1_.js"
import { stories_ielts_foundation } from "./stories_ielts_foundation.js"
import { stories_ielts_5_0_6_0 } from "./stories_ielts_5_0_6_0.js"

export const allStories = [
  ...stories_beginner,
  ...stories_a1,
  ...stories_a2,
  ...stories_b1,
  ...stories_b1_,
  ...stories_ielts_foundation,
  ...stories_ielts_5_0_6_0
];

export const stories = allStories;

export const storyLevels = [...new Set(allStories.map(s => s.level))];

export const storyTopics = [...new Set(allStories.map(s => s.topic).filter(Boolean))];

export function getStoriesByLevel(level) { return allStories.filter(s => s.level === level); }

export function getStoriesByTopic(topic) { return allStories.filter(s => s.topic === topic); }

export function getStoryById(id) { return allStories.find(s => s.id === id); }
