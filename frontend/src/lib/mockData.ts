// ============================
// Mock Data & Simulated API
// No backend needed — all data is local
// ============================

import type {
  Question,
  QuizResponse,
  TopicNode,
  TopicEdge,
  QuizAttempt,
  DashboardData,
  SourceRef,
} from "./types";

// ── Topic Graph Data ──────────────────────────────────────────────
const TOPIC_NODES: Omit<TopicNode, "state" | "mastery">[] = [
  { id: "variables", title: "Variables & Data Types", chapter: 1, tier: 1, unlock_threshold: 0.7 },
  { id: "control_flow", title: "Control Flow", chapter: 2, tier: 2, unlock_threshold: 0.7 },
  { id: "data_structures", title: "Data Structures", chapter: 3, tier: 2, unlock_threshold: 0.7 },
  { id: "functions", title: "Functions", chapter: 4, tier: 3, unlock_threshold: 0.75 },
  { id: "oop", title: "Object-Oriented Programming", chapter: 5, tier: 4, unlock_threshold: 0.75 },
  { id: "error_handling", title: "Error Handling", chapter: 6, tier: 3, unlock_threshold: 0.7 },
  { id: "file_io", title: "File I/O", chapter: 7, tier: 3, unlock_threshold: 0.7 },
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

// ── Mastery State (in-memory, persisted via closure) ──────────────
let masteryScores: Record<string, number> = {
  variables: 0.0,
  control_flow: 0.0,
  data_structures: 0.0,
  functions: 0.0,
  oop: 0.0,
  error_handling: 0.0,
  file_io: 0.0,
};

let quizHistory: QuizAttempt[] = [];

// ── BKT (Bayesian Knowledge Tracing) ──────────────────────────────
function updateBKT(
  pL: number,
  isCorrect: boolean,
  pG = 0.25,
  pS = 0.10,
  pT = 0.20
): number {
  let pLGiven: number;
  if (isCorrect) {
    pLGiven = (pL * (1 - pS)) / (pL * (1 - pS) + (1 - pL) * pG);
  } else {
    pLGiven = (pL * pS) / (pL * pS + (1 - pL) * (1 - pG));
  }
  return Math.round((pLGiven + (1 - pLGiven) * pT) * 10000) / 10000;
}

// ── Topic State Calculator ────────────────────────────────────────
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

// ── Mock Chat Responses ───────────────────────────────────────────
const CHAT_RESPONSES: Record<string, { answer: string; sources: SourceRef[] }> = {
  variable: {
    answer: `A **variable** in Python is a named reference to a value stored in memory. Unlike languages such as Java or C++, Python uses **dynamic typing** — you do not need to declare a variable's type before assigning a value.

\`\`\`python
name = "Alice"      # str
age = 25            # int
height = 5.6        # float
is_student = True   # bool
\`\`\`

Python supports three numeric types: **int** (whole numbers), **float** (decimal numbers), and **complex** (complex numbers like \`3+4j\`). [Source: Chapter 1, Section 1.1-1.2]

You can convert between types using built-in functions like \`int()\`, \`float()\`, \`str()\`, and \`bool()\`. [Source: Chapter 1, Section 1.4]`,
    sources: [
      { label: "Chapter 1, Section 1.1: What are Variables?", source_type: "textbook", content_preview: "A variable in Python is a named reference to a value stored in memory. Unlike languages such as Java or C++, Python uses dynamic typing..." },
      { label: "Chapter 1, Section 1.2: Numeric Types", source_type: "textbook", content_preview: "Python supports three numeric types: int (whole numbers like 42, -7, 0), float (decimal numbers like 3.14), and complex..." },
      { label: "Chapter 1, Section 1.4: Type Conversion", source_type: "textbook", content_preview: "Use built-in functions to convert between types: int('42'), float('3.14'), str(100), bool(0)..." },
    ],
  },
  loop: {
    answer: `Python supports two types of loops: **for loops** and **while loops**.

**For loops** iterate over sequences (lists, strings, ranges):
\`\`\`python
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

# range(start, stop, step)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
\`\`\`

**While loops** repeat as long as a condition is true:
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

You can use \`break\` to exit a loop early, \`continue\` to skip to the next iteration, and an \`else\` clause that executes when the loop finishes without \`break\`. [Source: Chapter 2, Section 2.3]`,
    sources: [
      { label: "Chapter 2, Section 2.3: Loops", source_type: "textbook", content_preview: "For loops iterate over sequences (lists, strings, ranges, etc.). While loops repeat as long as a condition is true..." },
      { label: "Chapter 2, Section 2.3: Break, Continue, and Else", source_type: "textbook", content_preview: "break — exit the loop immediately. continue — skip to the next iteration. else on a loop — executes when the loop finishes without break." },
    ],
  },
  list: {
    answer: `**Lists** are ordered, mutable collections that can hold mixed types. They are one of Python's most versatile data structures.

\`\`\`python
numbers = [1, 2, 3, 4, 5]
numbers.append(6)          # Add to end
numbers.insert(0, 0)       # Insert at index
numbers.pop()              # Remove last
numbers.sort(reverse=True) # Sort descending
\`\`\`

**List comprehensions** provide a concise way to create lists:
\`\`\`python
squares = [x**2 for x in range(10)]           # [0, 1, 4, 9, ..., 81]
evens = [x for x in range(20) if x % 2 == 0]  # [0, 2, 4, ..., 18]
\`\`\`

**Slicing** uses \`list[start:stop:step]\` syntax:
\`\`\`python
nums = [0, 1, 2, 3, 4, 5]
nums[1:4]     # [1, 2, 3]
nums[::-1]    # [5, 4, 3, 2, 1, 0] — reversed
\`\`\`
[Source: Chapter 3, Section 3.1]`,
    sources: [
      { label: "Chapter 3, Section 3.1: Lists", source_type: "textbook", content_preview: "Lists are ordered, mutable collections. They can hold mixed types. Key methods: append(), insert(), pop(), remove(), sort()..." },
    ],
  },
  function: {
    answer: `**Functions** in Python are defined with the \`def\` keyword and support default arguments, keyword arguments, and variable-length arguments.

\`\`\`python
def greet(name, greeting="Hello"):
    """Return a personalized greeting string."""
    return f"{greeting}, {name}!"
\`\`\`

**\`*args\` and \`**kwargs\`** allow flexible argument passing:
- \`*args\` collects extra positional arguments into a tuple
- \`**kwargs\` collects extra keyword arguments into a dictionary
[Source: Chapter 4, Section 4.2]

**Lambda functions** are anonymous single-expression functions:
\`\`\`python
square = lambda x: x ** 2
\`\`\`

Python follows the **LEGB rule** for variable scope: Local → Enclosing → Global → Built-in. [Source: Chapter 4, Section 4.4]`,
    sources: [
      { label: "Chapter 4, Section 4.1: Defining Functions", source_type: "textbook", content_preview: "Functions are defined with the def keyword. They support default arguments, keyword arguments, and variable-length arguments." },
      { label: "Chapter 4, Section 4.2: *args and **kwargs", source_type: "textbook", content_preview: "*args collects positional arguments into a tuple. **kwargs collects keyword arguments into a dictionary." },
      { label: "Chapter 4, Section 4.4: Scope and Closures", source_type: "textbook", content_preview: "Python follows the LEGB rule for variable scope: Local → Enclosing → Global → Built-in." },
    ],
  },
  class: {
    answer: `**Classes** in Python define blueprints for objects. The \`__init__\` method initializes instance attributes.

\`\`\`python
class Student:
    def __init__(self, name, student_id, gpa=0.0):
        self.name = name
        self.student_id = student_id
        self.gpa = gpa
        self.courses = []

    def enroll(self, course):
        self.courses.append(course)
        return f"{self.name} enrolled in {course}"
\`\`\`

**Inheritance** allows child classes to extend parent classes:
\`\`\`python
class GradStudent(Student):
    def __init__(self, name, student_id, gpa, thesis_topic):
        super().__init__(name, student_id, gpa)
        self.thesis_topic = thesis_topic
\`\`\`

**Polymorphism** lets different classes implement the same method interface. [Source: Chapter 5, Section 5.4]`,
    sources: [
      { label: "Chapter 5, Section 5.1: Classes and Objects", source_type: "textbook", content_preview: "A class defines a blueprint for objects. The __init__ method initializes instance attributes." },
      { label: "Chapter 5, Section 5.2: Inheritance", source_type: "textbook", content_preview: "A child class inherits attributes and methods from a parent class using super().__init__()." },
    ],
  },
  dictionary: {
    answer: `**Dictionaries** store key-value pairs with O(1) average lookup time. They are one of Python's most important data structures.

\`\`\`python
student = {
    "name": "Alice",
    "age": 20,
    "courses": ["CS101", "MATH201"]
}
student["gpa"] = 3.8          # Add new key
name = student.get("name")    # Safe access (returns None if missing)
student.pop("age")            # Remove key
\`\`\`

Iterate over dictionaries:
\`\`\`python
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

**Dictionary comprehensions**:
\`\`\`python
word_lengths = {word: len(word) for word in ["hello", "world", "python"]}
# {'hello': 5, 'world': 5, 'python': 6}
\`\`\`
[Source: Chapter 3, Section 3.2]`,
    sources: [
      { label: "Chapter 3, Section 3.2: Dictionaries", source_type: "textbook", content_preview: "Dictionaries store key-value pairs with O(1) average lookup time. Use .get() for safe access, .items() for iteration." },
    ],
  },
  default: {
    answer: `I can help you with topics covered in your **Introduction to Python Programming** course materials. Based on the uploaded content, I can answer questions about:

📖 **Chapter 1** — Variables & Data Types
📖 **Chapter 2** — Control Flow (if/else, loops)
📖 **Chapter 3** — Data Structures (lists, dicts, tuples, sets)
📖 **Chapter 4** — Functions (args, kwargs, lambdas, decorators)
📖 **Chapter 5** — Object-Oriented Programming
📖 **Chapter 6** — Error Handling
📖 **Chapter 7** — File I/O

Try asking something like *"Explain list comprehensions"* or *"How do decorators work?"*`,
    sources: [],
  },
  out_of_scope: {
    answer: `⚠️ **This topic isn't covered in your uploaded materials.**

Your current course materials cover Python fundamentals (Chapters 1-7). The topic you asked about appears to be outside the scope of these materials.

I can only provide answers grounded in your uploaded course content to ensure accuracy. Would you like to ask about one of the covered topics instead?`,
    sources: [],
  },
};

function findChatResponse(query: string): { answer: string; sources: SourceRef[] } {
  const q = query.toLowerCase();
  // Out-of-scope keywords
  const outOfScope = ["machine learning", "neural network", "database", "sql", "react", "javascript", "web", "api", "django", "flask", "quantum", "blockchain"];
  if (outOfScope.some((kw) => q.includes(kw))) return CHAT_RESPONSES.out_of_scope;

  if (q.includes("variable") || q.includes("data type") || q.includes("int") || q.includes("string") || q.includes("float")) return CHAT_RESPONSES.variable;
  if (q.includes("loop") || q.includes("for") || q.includes("while") || q.includes("iteration")) return CHAT_RESPONSES.loop;
  if (q.includes("list") || q.includes("comprehension") || q.includes("slice") || q.includes("slicing")) return CHAT_RESPONSES.list;
  if (q.includes("function") || q.includes("def ") || q.includes("lambda") || q.includes("decorator") || q.includes("args") || q.includes("scope")) return CHAT_RESPONSES.function;
  if (q.includes("class") || q.includes("object") || q.includes("oop") || q.includes("inherit") || q.includes("polymorphism")) return CHAT_RESPONSES.class;
  if (q.includes("dict") || q.includes("dictionary") || q.includes("key-value") || q.includes("hash")) return CHAT_RESPONSES.dictionary;

  return CHAT_RESPONSES.default;
}

// ── Mock Quiz Questions Pool ──────────────────────────────────────
const QUIZ_POOL: Record<string, Question[]> = {
  variables: [
    {
      question_type: "MCQ",
      prompt: "What will be the output of: type(3.14)?",
      difficulty: "easy",
      source_label: "Chapter 1, Section 1.2",
      options: [
        { id: "A", text: "<class 'int'>", is_correct: false },
        { id: "B", text: "<class 'float'>", is_correct: true },
        { id: "C", text: "<class 'str'>", is_correct: false },
        { id: "D", text: "<class 'decimal'>", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "3.14 is a decimal number, so Python classifies it as a float type. Python supports int, float, and complex as numeric types.",
    },
    {
      question_type: "MCQ",
      prompt: "Which of the following is the correct way to create an f-string in Python?",
      difficulty: "easy",
      source_label: "Chapter 1, Section 1.3",
      options: [
        { id: "A", text: 'f"Hello, {name}!"', is_correct: true },
        { id: "B", text: '"Hello, ${name}!"', is_correct: false },
        { id: "C", text: '"Hello, " + name + "!"', is_correct: false },
        { id: "D", text: 'format("Hello, {}", name)', is_correct: false },
      ],
      correct_answer: "A",
      explanation: "f-strings (formatted string literals) use the f prefix and curly braces {} to embed expressions directly in strings. This is the recommended way in modern Python.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What does the expression bool(0) evaluate to in Python?",
      difficulty: "easy",
      source_label: "Chapter 1, Section 1.4",
      correct_answer: "False",
      explanation: "In Python, 0 is a falsy value. bool(0) converts the integer 0 to its boolean equivalent, which is False. Other falsy values include empty strings, None, and empty collections.",
    },
    {
      question_type: "MCQ",
      prompt: "What is the result of 17 // 5 in Python?",
      difficulty: "medium",
      source_label: "Chapter 1, Section 1.2",
      options: [
        { id: "A", text: "3.4", is_correct: false },
        { id: "B", text: "3", is_correct: true },
        { id: "C", text: "4", is_correct: false },
        { id: "D", text: "2", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "The // operator performs floor division, which divides and rounds down to the nearest integer. 17 / 5 = 3.4, and floor(3.4) = 3.",
    },
  ],
  control_flow: [
    {
      question_type: "MCQ",
      prompt: "What keyword is used to skip the current iteration in a loop?",
      difficulty: "easy",
      source_label: "Chapter 2, Section 2.3",
      options: [
        { id: "A", text: "break", is_correct: false },
        { id: "B", text: "skip", is_correct: false },
        { id: "C", text: "continue", is_correct: true },
        { id: "D", text: "pass", is_correct: false },
      ],
      correct_answer: "C",
      explanation: "'continue' skips the rest of the current iteration and moves to the next one. 'break' exits the loop entirely. 'pass' is a no-op placeholder.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What values does range(0, 10, 2) generate?",
      difficulty: "medium",
      source_label: "Chapter 2, Section 2.3",
      correct_answer: "0, 2, 4, 6, 8",
      explanation: "range(start, stop, step) generates numbers from start up to (but not including) stop, incrementing by step. So range(0, 10, 2) gives 0, 2, 4, 6, 8.",
    },
    {
      question_type: "MCQ",
      prompt: "When does the 'else' clause of a for loop execute?",
      difficulty: "hard",
      source_label: "Chapter 2, Section 2.3",
      options: [
        { id: "A", text: "When the loop condition becomes False", is_correct: false },
        { id: "B", text: "When the loop finishes without hitting a 'break'", is_correct: true },
        { id: "C", text: "When an exception occurs in the loop", is_correct: false },
        { id: "D", text: "It always executes after the loop", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "The else clause on a loop executes only when the loop completes normally — that is, without encountering a break statement.",
    },
  ],
  data_structures: [
    {
      question_type: "MCQ",
      prompt: "What does nums[::-1] do for a list nums = [1, 2, 3, 4, 5]?",
      difficulty: "medium",
      source_label: "Chapter 3, Section 3.1",
      options: [
        { id: "A", text: "Returns [1, 2, 3, 4]", is_correct: false },
        { id: "B", text: "Returns [5, 4, 3, 2, 1]", is_correct: true },
        { id: "C", text: "Returns [2, 3, 4, 5]", is_correct: false },
        { id: "D", text: "Raises an error", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "The slice [::-1] reverses the list. The -1 step means iterate backwards through the entire list.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What is the average time complexity of dictionary lookup in Python?",
      difficulty: "medium",
      source_label: "Chapter 3, Section 3.2",
      correct_answer: "O(1)",
      explanation: "Dictionaries in Python are implemented as hash tables, providing O(1) average-case time complexity for lookups, insertions, and deletions.",
    },
    {
      question_type: "MCQ",
      prompt: "Which data structure would you use if you need unique elements only?",
      difficulty: "easy",
      source_label: "Chapter 3, Section 3.4",
      options: [
        { id: "A", text: "List", is_correct: false },
        { id: "B", text: "Tuple", is_correct: false },
        { id: "C", text: "Set", is_correct: true },
        { id: "D", text: "Dictionary", is_correct: false },
      ],
      correct_answer: "C",
      explanation: "Sets are unordered collections of unique elements. Adding a duplicate element to a set has no effect.",
    },
  ],
  functions: [
    {
      question_type: "MCQ",
      prompt: "What does *args do in a function definition?",
      difficulty: "medium",
      source_label: "Chapter 4, Section 4.2",
      options: [
        { id: "A", text: "Collects keyword arguments into a dictionary", is_correct: false },
        { id: "B", text: "Collects positional arguments into a tuple", is_correct: true },
        { id: "C", text: "Makes arguments optional", is_correct: false },
        { id: "D", text: "Unpacks a list into arguments", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "*args collects any number of additional positional arguments into a tuple. **kwargs collects keyword arguments into a dictionary.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What is the LEGB rule in Python?",
      difficulty: "hard",
      source_label: "Chapter 4, Section 4.4",
      correct_answer: "Local, Enclosing, Global, Built-in",
      explanation: "LEGB stands for Local → Enclosing → Global → Built-in. It defines the order Python searches for variable names when they are referenced.",
    },
  ],
  oop: [
    {
      question_type: "MCQ",
      prompt: "What method is called when a new instance of a class is created?",
      difficulty: "easy",
      source_label: "Chapter 5, Section 5.1",
      options: [
        { id: "A", text: "__new__", is_correct: false },
        { id: "B", text: "__init__", is_correct: true },
        { id: "C", text: "__create__", is_correct: false },
        { id: "D", text: "__start__", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "__init__ is the initializer method called when a new instance is created. It sets up the instance's initial attributes.",
    },
    {
      question_type: "MCQ",
      prompt: "What function is used to call a parent class's method from a child class?",
      difficulty: "medium",
      source_label: "Chapter 5, Section 5.2",
      options: [
        { id: "A", text: "parent()", is_correct: false },
        { id: "B", text: "base()", is_correct: false },
        { id: "C", text: "super()", is_correct: true },
        { id: "D", text: "this()", is_correct: false },
      ],
      correct_answer: "C",
      explanation: "super() returns a proxy object that delegates method calls to the parent class, commonly used in __init__ to call the parent's constructor.",
    },
  ],
  error_handling: [
    {
      question_type: "MCQ",
      prompt: "Which block always executes regardless of whether an exception occurred?",
      difficulty: "easy",
      source_label: "Chapter 6, Section 6.1",
      options: [
        { id: "A", text: "try", is_correct: false },
        { id: "B", text: "except", is_correct: false },
        { id: "C", text: "else", is_correct: false },
        { id: "D", text: "finally", is_correct: true },
      ],
      correct_answer: "D",
      explanation: "The 'finally' block always executes, whether or not an exception was raised. It's typically used for cleanup operations like closing files.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What keyword is used to manually trigger an exception in Python?",
      difficulty: "easy",
      source_label: "Chapter 6, Section 6.2",
      correct_answer: "raise",
      explanation: "The 'raise' keyword is used to manually trigger an exception. For example: raise ValueError('invalid input')",
    },
  ],
  file_io: [
    {
      question_type: "MCQ",
      prompt: "What is the recommended way to open a file in Python to ensure it's properly closed?",
      difficulty: "easy",
      source_label: "Chapter 7, Section 7.1",
      options: [
        { id: "A", text: "f = open('file.txt')", is_correct: false },
        { id: "B", text: "with open('file.txt') as f:", is_correct: true },
        { id: "C", text: "file.open('file.txt')", is_correct: false },
        { id: "D", text: "open('file.txt').read()", is_correct: false },
      ],
      correct_answer: "B",
      explanation: "The 'with' statement (context manager) automatically closes the file when the block exits, even if an exception occurs. This is the recommended pattern.",
    },
    {
      question_type: "SHORT_ANSWER",
      prompt: "What mode would you use with open() to append text to an existing file?",
      difficulty: "easy",
      source_label: "Chapter 7, Section 7.2",
      correct_answer: "a",
      explanation: "The 'a' mode opens a file for appending. 'w' overwrites, 'r' reads. Use 'a' when you want to add content to the end of an existing file.",
    },
  ],
};

// ── Simulated delay ───────────────────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Public API ────────────────────────────────────────────────────

let isIngested = false;

export async function ingestSample(): Promise<{ status: string; chunks: number }> {
  await delay(1500);
  isIngested = true;
  return { status: "ok", chunks: 42 };
}

export function isDataLoaded(): boolean {
  return isIngested;
}

export async function chat(query: string): Promise<{ answer: string; sources: SourceRef[] }> {
  await delay(800 + Math.random() * 1200);
  const resp = findChatResponse(query);
  return resp;
}

export async function generateQuiz(
  topicId: string,
  numQuestions: number = 3,
  _difficulty: string = "medium"
): Promise<QuizResponse> {
  await delay(1000 + Math.random() * 1000);
  const pool = QUIZ_POOL[topicId] || QUIZ_POOL.variables;
  const topicNode = TOPIC_NODES.find((n) => n.id === topicId);

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

  return {
    topic: topicNode?.title || topicId,
    difficulty: _difficulty,
    questions: selected,
  };
}

export function gradeAnswer(question: Question, studentAnswer: string): { isCorrect: boolean; score: number } {
  if (question.question_type === "MCQ") {
    const correct = question.options?.find((o) => o.is_correct);
    const isCorrect = studentAnswer.toUpperCase() === correct?.id;
    return { isCorrect, score: isCorrect ? 1 : 0 };
  } else {
    // Short answer: simple keyword matching
    const canonical = (question.correct_answer || "").toLowerCase().trim();
    const student = studentAnswer.toLowerCase().trim();
    const isCorrect = student.includes(canonical) || canonical.includes(student);
    return { isCorrect, score: isCorrect ? 1 : student.length > 0 ? 0.3 : 0 };
  }
}

export function submitQuizResults(topicId: string, results: { isCorrect: boolean }[]): void {
  // Update mastery via BKT
  for (const r of results) {
    masteryScores[topicId] = updateBKT(masteryScores[topicId] ?? 0, r.isCorrect);
  }

  // Record history
  const correct = results.filter((r) => r.isCorrect).length;
  quizHistory.unshift({
    id: `quiz_${Date.now()}`,
    topic: TOPIC_NODES.find((n) => n.id === topicId)?.title || topicId,
    score: correct,
    total: results.length,
    date: new Date(),
    difficulty: "mixed",
  });
}

export async function getDashboard(): Promise<DashboardData> {
  await delay(300);

  const topics: TopicNode[] = TOPIC_NODES.map((n) => ({
    ...n,
    state: getTopicState(n.id),
    mastery: masteryScores[n.id] ?? 0,
  }));

  const frontier = topics.filter((t) => t.state === "READY").map((t) => t.id);
  const mastered = topics.filter((t) => t.state === "MASTERED").length;
  const overallProgress = Math.round((mastered / topics.length) * 100);

  return {
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
