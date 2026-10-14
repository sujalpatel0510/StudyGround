export type MediaType = 'video' | 'pdf' | 'slide' | 'notes';

export interface SourceRef {
  label: string;
  source_type: string;
  media_type?: MediaType;
  content_preview: string;
  timestamp?: string; // e.g. "14:32"
  page_number?: number;
  slide_number?: number;
  confidence?: number;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  timestamp: Date;
  modelConfidence?: number;
}
export type ChatMessage = ChatMessageItem;

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface Question {
  question_type: "MCQ" | "SHORT_ANSWER";
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  source_label: string;
  media_type?: MediaType;
  timestamp?: string;
  page_number?: number;
  cognitive_level?: "Recall" | "Application" | "Analysis";
  xp_reward?: number;
  options?: QuizOption[];
  correct_answer?: string;
  explanation: string;
}

export interface QuizResponse {
  topic: string;
  difficulty: string;
  questions: Question[];
}

export interface TopicNode {
  id: string;
  title: string;
  chapter: number;
  tier: number;
  state: "LOCKED" | "READY" | "MASTERED";
  mastery: number;
  unlock_threshold: number;
  estimatedMinutes?: number;
  conceptCount?: number;
}

export interface TopicEdge {
  from: string;
  to: string;
}

export interface QuizAttempt {
  id: string;
  topic: string;
  score: number;
  total: number;
  date: Date;
  difficulty: string;
  xpEarned?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string;
  rarity: "common" | "rare" | "epic";
}

export interface ReviewScheduleItem {
  topicId: string;
  topicTitle: string;
  dueIn: string;
  retentionEstimate: number; // e.g. 84%
  intervalDays: number;
  easeFactor: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  handle: string;
  role: string;
  institution: string;
  targetExam: string;
  examDate: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  totalHoursStudied: number;
  totalQuestionsAttempted: number;
  overallAccuracy: number;
  badges: Badge[];
  activeCourse: string;
  upcomingReviews: ReviewScheduleItem[];
}

export interface DashboardData {
  profile: StudentProfile;
  mastery: Record<string, number>;
  topics: TopicNode[];
  edges: TopicEdge[];
  frontier: string[];
  history: QuizAttempt[];
  overallProgress: number;
}
