export interface SourceRef {
  label: string;
  source_type: string;
  content_preview: string;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  timestamp: Date;
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
}

export interface DashboardData {
  mastery: Record<string, number>;
  topics: TopicNode[];
  edges: TopicEdge[];
  frontier: string[];
  history: QuizAttempt[];
  overallProgress: number;
}
