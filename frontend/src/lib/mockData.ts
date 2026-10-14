// =========================================================================
// StudyGround Mock Engine: BKT, Spaced Repetition (SM-2), Multimodal Data
// =========================================================================

import type {
  Question,
  QuizResponse,
  TopicNode,
  TopicEdge,
  QuizAttempt,
  DashboardData,
  SourceRef,
  StudentProfile,
} from "./types";

// ── Realistic Demo Student Profile ───────────────────────────────────────
export let currentProfile: StudentProfile = {
  id: "student_alex_chen",
  name: "Alex Chen",
  handle: "@alexchen_cs",
  role: "Computer Science Sophomore",
  institution: "Stanford University • CS School",
  targetExam: "CS106B Midterm: Data Structures & Algorithms",
  examDate: "Nov 24, 2026 (in 18 days)",
  level: 14,
  currentXp: 3850,
  nextLevelXp: 5000,
  streakDays: 7,
  totalHoursStudied: 19.4,
  totalQuestionsAttempted: 142,
  overallAccuracy: 88,
  activeCourse: "CS101: Systems & Python Computation",
  badges: [
    {
      id: "streak_7",
      title: "Consistent Scholar",
      description: "Maintained a 7-day continuous study streak",
      iconName: "Flame",
      unlockedAt: "Yesterday",
      rarity: "rare",
    },
    {
      id: "recursion_slayer",
      title: "Algorithmic Precision",
      description: "Scored 100% on Functions & Closures on first attempt",
      iconName: "Zap",
      unlockedAt: "3 days ago",
      rarity: "epic",
    },
    {
      id: "grounded_scholar",
      title: "Source Verifier",
      description: "Inspected 25+ direct video and textbook source citations",
      iconName: "Award",
      unlockedAt: "Oct 12, 2026",
      rarity: "common",
    },
  ],
  upcomingReviews: [
    {
      topicId: "variables",
      topicTitle: "Variables & Numeric Types",
      dueIn: "Today (High Priority)",
      retentionEstimate: 76,
      intervalDays: 4,
      easeFactor: 2.5,
    },
    {
      topicId: "control_flow",
      topicTitle: "Control Flow & Iteration",
      dueIn: "Tomorrow",
      retentionEstimate: 83,
      intervalDays: 7,
      easeFactor: 2.6,
    },
    {
      topicId: "data_structures",
      topicTitle: "Lists, Sets & Hash Tables",
      dueIn: "In 3 days",
      retentionEstimate: 91,
      intervalDays: 12,
      easeFactor: 2.7,
    },
  ],
};

// ── Topic Graph Data with Concept Estimates ──────────────────────────────
const TOPIC_NODES: Omit<TopicNode, "state" | "mastery">[] = [
  { id: "variables", title: "Variables & Data Types", chapter: 1, tier: 1, unlock_threshold: 0.7, estimatedMinutes: 45, conceptCount: 8 },
  { id: "control_flow", title: "Control Flow & Loops", chapter: 2, tier: 2, unlock_threshold: 0.7, estimatedMinutes: 60, conceptCount: 11 },
  { id: "data_structures", title: "Data Structures & Slicing", chapter: 3, tier: 2, unlock_threshold: 0.7, estimatedMinutes: 90, conceptCount: 14 },
  { id: "functions", title: "Functions & Closures", chapter: 4, tier: 3, unlock_threshold: 0.75, estimatedMinutes: 75, conceptCount: 10 },
  { id: "oop", title: "Object-Oriented Programming", chapter: 5, tier: 4, unlock_threshold: 0.75, estimatedMinutes: 120, conceptCount: 16 },
  { id: "error_handling", title: "Error & Exception Handling", chapter: 6, tier: 3, unlock_threshold: 0.7, estimatedMinutes: 40, conceptCount: 6 },
  { id: "file_io", title: "File I/O & Serialization", chapter: 7, tier: 3, unlock_threshold: 0.7, estimatedMinutes: 50, conceptCount: 9 },
];

const TOPIC_EDGES: TopicEdge[] = [
  { from: "variables", to: "control_flow" },
  { from: "variables", to: "data_structures" },
  { from: "control_flow", to: "functions" },
  { from: "data_structures", to: "functions" },
  { from: "functions", to: "oop" },
  { from: "control_flow", to: "error_handling" },
  { from: "variables", to: "file_io" },
  { from: "data_structures", to: "file_io" },
];

// Initial seeded mastery scores for a realistic mid-progress demo student
let masteryScores: Record<string, number> = {
  variables: 0.85,     // Mastered
  control_flow: 0.74,  // Mastered
  data_structures: 0.45,// Ready (Active focus)
  functions: 0.20,     // Ready (Frontier)
  oop: 0.05,           // Locked
  error_handling: 0.10,// Locked
  file_io: 0.0,        // Locked
};

let quizHistory: QuizAttempt[] = [
  {
    id: "quiz_hist_01",
    topic: "Variables & Data Types",
    score: 3,
    total: 3,
    date: new Date(Date.now() - 3600000 * 26),
    difficulty: "medium",
    xpEarned: 150,
  },
  {
    id: "quiz_hist_02",
    topic: "Control Flow & Loops",
    score: 3,
    total: 4,
    date: new Date(Date.now() - 3600000 * 52),
    difficulty: "medium",
    xpEarned: 120,
  },
  {
    id: "quiz_hist_03",
    topic: "Data Structures & Slicing",
    score: 2,
    total: 3,
    date: new Date(Date.now() - 3600000 * 120),
    difficulty: "hard",
    xpEarned: 80,
  },
];

// ── BKT (Bayesian Knowledge Tracing) ──────────────────────────────────────
function updateBKT(pL: number, isCorrect: boolean, pG = 0.25, pS = 0.10, pT = 0.20): number {
  let pLGiven: number;
  if (isCorrect) {
    pLGiven = (pL * (1 - pS)) / (pL * (1 - pS) + (1 - pL) * pG);
  } else {
    pLGiven = (pL * pS) / (pL * pS + (1 - pL) * (1 - pG));
  }
  return Math.min(1.0, Math.round((pLGiven + (1 - pLGiven) * pT) * 10000) / 10000);
}

// ── Topic State Calculator ────────────────────────────────────────────────
function getTopicState(topicId: string): "LOCKED" | "READY" | "MASTERED" {
  const node = TOPIC_NODES.find((n) => n.id === topicId)!;
  const score = masteryScores[topicId] ?? 0;
  if (score >= node.unlock_threshold) return "MASTERED";

  const parents = TOPIC_EDGES.filter((e) => e.to === topicId).map((e) => e.from);
  for (const pid of parents) {
    const parentNode = TOPIC_NODES.find((n) => n.id === pid)!;
    if ((masteryScores[pid] ?? 0) < parentNode.unlock_threshold) return "LOCKED";
  }
  return "READY";
}

// ── Multimodal Chat Responses (with Video Timestamps & Slide indices) ─────
const CHAT_RESPONSES: Record<string, { answer: string; sources: SourceRef[] }> = {
  variable: {
    answer: `In Python, a **variable** is a dynamic reference bound to an object in memory. Because Python is dynamically typed, the type is bound to the *value* rather than the variable name itself.

\`\`\`python
student_id = "S2026_09"  # str allocated in heap
gpa = 3.85               # float
semester = 4             # int
enrolled = True          # bool
\`\`\`

Python's numeric hierarchy includes \`int\` (arbitrary precision in Python 3), \`float\` (double-precision IEEE 754), and \`complex\` (\`z = 3 + 4j\`).

During **Lecture 01 @ 12:45**, Prof. Roberts emphasized that integer division \`//\` floors the quotient toward negative infinity (\`-7 // 2 == -4\`), a frequent midterm trap!

You can inspect the underlying memory identifier using \`id(variable)\` and verify type safety with \`isinstance(val, int)\`.`,
    sources: [
      {
        label: "Lecture 01: Memory Allocation & Typing",
        source_type: "lecture_video",
        media_type: "video",
        timestamp: "12:45 - 15:20",
        confidence: 0.98,
        content_preview: "Prof. Roberts: 'Remember, variables in Python do not have types; values have types. When you say x = 5, x is a reference pointer to an integer object.'",
      },
      {
        label: "Textbook Chapter 1: Foundations",
        source_type: "pdf_textbook",
        media_type: "pdf",
        page_number: 14,
        confidence: 0.95,
        content_preview: "Section 1.2 Numeric Types: Python automatically promotes integers to arbitrary precision, avoiding classic 32-bit overflow vulnerabilities.",
      },
      {
        label: "Slide Deck 01: Core Semantics",
        source_type: "slide_deck",
        media_type: "slide",
        slide_number: 8,
        confidence: 0.92,
        content_preview: "Slide 8 Diagram: Variable reference graph showing pointer reassignment vs in-place mutation.",
      },
    ],
  },
  loop: {
    answer: `Python provides sequence iteration via **for loops** (iterating over iterables using the iterator protocol \`__iter__()\` / \`__next__()\`) and condition-driven **while loops**.

\`\`\`python
# Vectorized range iteration (O(1) memory)
for step in range(0, 10, 2):
    print(f"Step index: {step}")

# While loop with defensive guard
retries = 3
while retries > 0:
    if attempt_connection():
        break
    retries -= 1
else:
    # Executes ONLY if loop finishes WITHOUT encountering a break
    alert_admin("Connection exhausted")
\`\`\`

**Key Concept Grounding:**
As highlighted on **Slide 19 of Deck 2**, the \`else\` clause on loops acts as a completion assertion: it runs when the loop terminates naturally, not via an early \`break\`.`,
    sources: [
      {
        label: "Slide Deck 02: Control Structures",
        source_type: "slide_deck",
        media_type: "slide",
        slide_number: 19,
        confidence: 0.96,
        content_preview: "Slide 19: The 'else' clause pattern for search loops. Demonstrates how to avoid flag variables like found = False.",
      },
      {
        label: "Lecture 02: Iteration & Protocols",
        source_type: "lecture_video",
        media_type: "video",
        timestamp: "24:10 - 28:05",
        confidence: 0.94,
        content_preview: "Timestamp 24:10: Breakdown of how 'for x in iterable' calls iter() behind the scenes and catches StopIteration.",
      },
    ],
  },
  list: {
    answer: `**Lists** are dynamic arrays stored as contiguous arrays of pointers, offering $O(1)$ amortized append and $O(k)$ slicing.

\`\`\`python
# Comprehensive slicing: [start:stop:step]
raw_telemetry = [10.2, 11.5, 9.8, 14.1, 15.0, 12.2]
reversed_view = raw_telemetry[::-1]       # Reverses sequence
downsampled = raw_telemetry[::2]          # Every 2nd sample

# List Comprehension with condition
valid_pings = [x * 100 for x in raw_telemetry if x > 10.0]
\`\`\`

**Midterm Alert (Textbook p. 32):** Slicing creates a *shallow copy* of the list container. Modifying nested mutable objects inside a slice will still mutate the original elements!`,
    sources: [
      {
        label: "Textbook Chapter 3: Sequences",
        source_type: "pdf_textbook",
        media_type: "pdf",
        page_number: 32,
        confidence: 0.99,
        content_preview: "Section 3.1: Python list allocation mechanics, dynamic over-allocation factor, and memory pointer implications during shallow slicing.",
      },
      {
        label: "Lecture 03: Vector Operations",
        source_type: "lecture_video",
        media_type: "video",
        timestamp: "18:22 - 21:40",
        confidence: 0.91,
        content_preview: "Prof. Roberts whiteboard walkthrough of pointer indirection and why list.append is amortized O(1) while list.insert(0, v) is O(n).",
      },
    ],
  },
  function: {
    answer: `Functions in Python are **first-class citizens** — they can be passed as arguments, assigned to variables, and returned from other functions.

\`\`\`python
def memoize(func):
    cache = {}
    def wrapper(*args, **kwargs):
        key = (args, tuple(sorted(kwargs.items())))
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    return wrapper

@memoize
def fibonacci(n: int) -> int:
    return n if n <= 1 else fibonacci(n - 1) + fibonacci(n - 2)
\`\`\`

**Scope Resolution (LEGB):**
1. **L**ocal (within function body)
2. **E**nclosing (outer function closures via \`nonlocal\`)
3. **G**lobal (module level via \`global\`)
4. **B**uilt-in (\`len\`, \`range\`, \`Exception\`)

Citing **Lecture 04 @ 34:10**, closures retain references to enclosing scope variables even after the outer function has returned.`,
    sources: [
      {
        label: "Lecture 04: Closures & Decorators",
        source_type: "lecture_video",
        media_type: "video",
        timestamp: "34:10 - 39:50",
        confidence: 0.97,
        content_preview: "Step-by-step breakdown of how decorator syntactic sugar '@decorator' desugars to 'func = decorator(func)'.",
      },
      {
        label: "Textbook Chapter 4: Functional Python",
        source_type: "pdf_textbook",
        media_type: "pdf",
        page_number: 58,
        confidence: 0.93,
        content_preview: "Section 4.4 LEGB Scope Hierarchy: Common pitfalls with late binding in closures inside list comprehensions.",
      },
    ],
  },
  class: {
    answer: `Object-Oriented Programming in Python uses classes as extensible blueprints. Python supports multiple inheritance resolved through the **C3 Method Resolution Order (MRO)** algorithm.

\`\`\`python
class BaseTelemetry:
    def __init__(self, device_id: str):
        self.device_id = device_id
        self._calibrated = False # Protected convention

    def calibrate(self):
        self._calibrated = True

class SensorNode(BaseTelemetry):
    def __init__(self, device_id: str, sampling_rate_hz: int):
        super().__init__(device_id)
        self.sampling_rate_hz = sampling_rate_hz
\`\`\`

**Key Takeaway (Deck 5, Slide 14):** Always invoke \`super().__init__()\` rather than explicit base class names to ensure cooperative multiple inheritance remains intact.`,
    sources: [
      {
        label: "Slide Deck 05: Class Architectures",
        source_type: "slide_deck",
        media_type: "slide",
        slide_number: 14,
        confidence: 0.95,
        content_preview: "Slide 14: Method Resolution Order (MRO) visualization and why super() is required for diamond inheritance patterns.",
      },
    ],
  },
  out_of_scope: {
    answer: `🛡️ **Source-Grounding Guardrail Activated: Query Out-of-Scope**

The question you asked pertains to topics **not covered in your uploaded syllabus**:
*Active Curriculum: CS101 Systems & Python Computation (Chapters 1–7)*

**Why was this blocked?**
StudyGround adheres to **Strict Source Grounding (Track D Spec)** to prevent AI hallucinations and keep you focused on your actual exam material.

**Covered Topics Ready for Revision:**
1. Chapter 1: Variables, Numeric Types & Floating-Point Bounds
2. Chapter 2: Control Flow, Iteration & Loop Invariants
3. Chapter 3: Sequences, Slicing & Hash Maps
4. Chapter 4: Functions, Closures & First-Class Decorators
5. Chapter 5: OOP, Inheritance & Polymorphism`,
    sources: [],
  },
  default: {
    answer: `I am your source-grounded study companion for **CS101: Systems & Python Computation**.

I synthesize concepts across your uploaded lecture videos, slide decks, and course textbook. Every explanation includes exact timestamps and page references.

**Suggested study prompts based on your frontier:**
- *"Explain the difference between mutable and immutable types in Python"*
- *"How does list comprehension memory allocation compare to standard loops?"*
- *"Walk me through the LEGB variable scope hierarchy with an example"*
- *"Why does the 'else' block execute on a for loop?"*`,
    sources: [],
  },
};

function findChatResponse(query: string): { answer: string; sources: SourceRef[] } {
  const q = query.toLowerCase();
  const outOfScope = ["quantum", "blockchain", "react", "css", "docker", "kubernetes", "c++", "rust", "neuroscience", "stock market"];
  if (outOfScope.some((kw) => q.includes(kw))) return CHAT_RESPONSES.out_of_scope;

  if (q.includes("variable") || q.includes("type") || q.includes("float") || q.includes("int") || q.includes("memory")) return CHAT_RESPONSES.variable;
  if (q.includes("loop") || q.includes("for") || q.includes("while") || q.includes("break") || q.includes("continue")) return CHAT_RESPONSES.loop;
  if (q.includes("list") || q.includes("slice") || q.includes("slicing") || q.includes("comprehension") || q.includes("array")) return CHAT_RESPONSES.list;
  if (q.includes("function") || q.includes("closure") || q.includes("decorator") || q.includes("legb") || q.includes("scope") || q.includes("lambda")) return CHAT_RESPONSES.function;
  if (q.includes("class") || q.includes("object") || q.includes("oop") || q.includes("mro") || q.includes("super")) return CHAT_RESPONSES.class;

  return CHAT_RESPONSES.default;
}

// ── Realistic Quiz Questions with Taxonomy & XP ──────────────────────────
const QUIZ_POOL: Record<string, Question[]> = {
  variables: [
    {
      question_type: "MCQ",
      prompt: "In Python 3, what is the exact output of: -7 // 2 ?",
      difficulty: "medium",
      source_label: "Lecture 01 @ 14:10 / Textbook p.15",
      media_type: "video",
      timestamp: "14:10",
      cognitive_level: "Analysis",
      xp_reward: 45,
      options: [
        { id: "A", text: "-3.5", is_correct: false },
        { id: "B", text: "-3", is_correct: false },
        { id: "C", text: "-4", is_correct: true },
        { id: "D", text: "Raises ZeroDivisionError", is_correct: false },
      ],
      correct_answer: "C",
      explanation: "Floor division (//) rounds toward negative infinity. -7 / 2 = -3.5, and the largest integer less than or equal to -3.5 is -4. This is a common exam pitfall!",
    },
    {
      question_type: "MCQ",
      prompt: "Which statement accurately describes Python's object model for primitive integers?",
      difficulty: "easy",
      source_label: "Slide Deck 01, Slide 12",
      media_type: "slide",
      cognitive_level: "Recall",
      xp_reward: 30,
      options: [
        { id: "A", text: "Integers are stored directly in register stacks as primitive 32-bit values", is_correct: false },
        { id: "B", text: "Variables hold reference pointers to immutable heap-allocated integer objects", is_correct: true },
        { id: "C", text: "Integers automatically mutate in-place when re-assigned", is_correct: false },
        { id: "D", text: "Variables must declare signedness before allocation", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "In Python, all integers are immutable heap-allocated objects. Variable names merely hold pointers referencing those memory locations.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What built-in function returns the unique integer memory identity of a Python object?",
      difficulty: "easy",
      source_label: "Textbook Chapter 1, Section 1.3",
      media_type: "pdf",
      cognitive_level: "Recall",
      xp_reward: 25,
      correct_answer: "id()",
      explanation: "The id() function returns the identity of an object as an integer, which corresponds to the object's actual memory address in CPython.",
    },
  ],
  data_structures: [
    {
      question_type: "MCQ",
      prompt: "Given lst = [1, 2, [3, 4]], what happens if we execute copy_lst = lst[:] followed by copy_lst[2].append(5)?",
      difficulty: "hard",
      source_label: "Lecture 03 @ 22:15 / Textbook p.34",
      media_type: "video",
      timestamp: "22:15",
      cognitive_level: "Analysis",
      xp_reward: 60,
      options: [
        { id: "A", text: "lst remains [1, 2, [3, 4]] because lst[:] creates a deep copy", is_correct: false },
        { id: "B", text: "lst becomes [1, 2, [3, 4, 5]] because slicing only produces a shallow copy", is_correct: true },
        { id: "C", text: "Raises an AttributeError because sliced lists are immutable", is_correct: false },
        { id: "D", text: "Raises a MemoryError", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "Slicing lst[:] creates a shallow copy: the outer list container is duplicated, but internal references to nested mutable objects (like the inner list) are shared.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What is the amortized average time complexity of appending an element to a Python list using .append()?",
      difficulty: "medium",
      source_label: "Slide Deck 03, Slide 8",
      media_type: "slide",
      cognitive_level: "Recall",
      xp_reward: 35,
      correct_answer: "O(1)",
      explanation: "Python lists use geometric over-allocation (approximately 1.125x resize factor). While occasional resizes take O(n), the amortized cost per append is O(1).",
    },
  ],
  functions: [
    {
      question_type: "MCQ",
      prompt: "What does Python's LEGB rule govern during runtime execution?",
      difficulty: "medium",
      source_label: "Textbook Chapter 4, p.62",
      media_type: "pdf",
      cognitive_level: "Application",
      xp_reward: 40,
      options: [
        { id: "A", text: "The sequence order of exception handlers in try-except blocks", is_correct: false },
        { id: "B", text: "The priority resolution for variable scope: Local -> Enclosing -> Global -> Built-in", is_correct: true },
        { id: "C", text: "The garbage collection sweep order for circular references", is_correct: false },
        { id: "D", text: "The byte-compilation order of imported package modules", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "LEGB defines Python's name-resolution hierarchy: Local scope first, followed by Enclosing function closures, then Global module attributes, and finally Built-ins.",
    },
  ],
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Public API ────────────────────────────────────────────────────────────

let isIngested = false;

export async function ingestSample(): Promise<{ status: string; chunks: number; sourcesIndexed: string[] }> {
  await delay(1200);
  isIngested = true;
  // Award 150 XP for loading course material
  currentProfile.currentXp += 150;
  return {
    status: "ok",
    chunks: 42,
    sourcesIndexed: [
      "PDF Textbook: Systems & Python Computation (142 pgs)",
      "Slide Deck: CS101 Lecture Modules (48 slides)",
      "Video Transcripts: 6 Lectures (Whisper-diarized with timestamps)",
    ],
  };
}

export function isDataLoaded(): boolean {
  return isIngested;
}

export async function chat(query: string): Promise<{ answer: string; sources: SourceRef[]; modelConfidence: number }> {
  await delay(700 + Math.random() * 800);
  const resp = findChatResponse(query);
  return {
    ...resp,
    modelConfidence: resp.sources.length > 0 ? 0.96 : 0.82,
  };
}

export async function generateQuiz(
  topicId: string,
  numQuestions: number = 3,
  difficulty: string = "medium"
): Promise<QuizResponse> {
  await delay(900);
  const pool = QUIZ_POOL[topicId] || QUIZ_POOL.variables;
  const topicNode = TOPIC_NODES.find((n) => n.id === topicId);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

  return {
    topic: topicNode?.title || topicId,
    difficulty,
    questions: selected,
  };
}

export function gradeAnswer(question: Question, studentAnswer: string): { isCorrect: boolean; score: number } {
  if (question.question_type === "MCQ") {
    const correct = question.options?.find((o) => o.is_correct);
    const isCorrect = studentAnswer.toUpperCase() === correct?.id;
    return { isCorrect, score: isCorrect ? 1 : 0 };
  } else {
    const canonical = (question.correct_answer || "").toLowerCase().trim();
    const student = studentAnswer.toLowerCase().trim();
    const isCorrect = student.includes(canonical) || canonical.includes(student);
    return { isCorrect, score: isCorrect ? 1 : student.length > 0 ? 0.3 : 0 };
  }
}

export function submitQuizResults(
  topicId: string,
  results: { isCorrect: boolean; xp?: number }[]
): { xpEarned: number; newMastery: number; streakUpdated: boolean } {
  let earnedXp = 0;
  for (const r of results) {
    masteryScores[topicId] = updateBKT(masteryScores[topicId] ?? 0, r.isCorrect);
    earnedXp += r.isCorrect ? 40 : 10;
  }

  currentProfile.currentXp += earnedXp;
  currentProfile.totalQuestionsAttempted += results.length;
  if (currentProfile.currentXp >= currentProfile.nextLevelXp) {
    currentProfile.level += 1;
    currentProfile.nextLevelXp += 2500;
  }

  const correct = results.filter((r) => r.isCorrect).length;
  quizHistory.unshift({
    id: `quiz_${Date.now()}`,
    topic: TOPIC_NODES.find((n) => n.id === topicId)?.title || topicId,
    score: correct,
    total: results.length,
    date: new Date(),
    difficulty: "adaptive",
    xpEarned: earnedXp,
  });

  return {
    xpEarned: earnedXp,
    newMastery: masteryScores[topicId],
    streakUpdated: true,
  };
}

export async function getDashboard(): Promise<DashboardData> {
  await delay(200);

  const topics: TopicNode[] = TOPIC_NODES.map((n) => ({
    ...n,
    state: getTopicState(n.id),
    mastery: masteryScores[n.id] ?? 0,
  }));

  const frontier = topics.filter((t) => t.state === "READY").map((t) => t.id);
  const mastered = topics.filter((t) => t.state === "MASTERED").length;
  const overallProgress = Math.round((mastered / topics.length) * 100);

  return {
    profile: { ...currentProfile },
    mastery: { ...masteryScores },
    topics,
    edges: TOPIC_EDGES,
    frontier,
    history: quizHistory.slice(0, 10),
    overallProgress,
  };
}

export function getTopicsList(): { id: string; title: string; chapter: number }[] {
  return TOPIC_NODES.map((n) => ({ id: n.id, title: n.title, chapter: n.chapter }));
}
