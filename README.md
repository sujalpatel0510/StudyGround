# 🎓 StudyGround — Source-Grounded Adaptive AI Study Companion

> **Multimodal AI Hackathon 2026 — Track D: Personalized Tutoring & Adaptive Learning**  
> *Prototype Edition (Vite + React + TypeScript + Tailwind CSS)*

---

## 🌟 Overview

Students struggle with learning materials scattered across lecture videos, textbooks, and slides. General AI chatbots hallucinate or provide answers disconnected from specific course material and student ability.

**StudyGround** is a source-grounded AI study companion that models the learner to make study time effective, trustworthy, and personalized.

---

## 🚀 Quick Start (Running the Prototype)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!NOTE]
> **No database or backend server is required for this prototype round.** All data structures, BKT (Bayesian Knowledge Tracing) algorithms, adaptive quiz pools, and citation lookups run locally with realistic sample materials.

---

## 🧩 Four High-Level Modules Demonstrated

### 1. 📚 Multimodal Knowledge Base & Source Grounding
- **Sample Course:** *Introduction to Python Programming* (7 Chapters, 42 knowledge chunks)
- **Inline Citations:** Answers include exact chapter, section, and topic reference tags.
- **Collapsible Source Cards:** Inspect the exact excerpt from the learning materials that backed the claim.
- **Out-of-Scope Detection:** Queries outside the uploaded course boundaries are flagged and gracefully declined.

### 2. 🧠 Adaptive Assessment & Evaluation
- **Multi-Format Questions:** Generates Multiple Choice Questions (MCQs) and open Short-Answer questions.
- **Difficulty Grading:** Easy, Medium, and Hard tiers.
- **Instant Explanations:** Explains the reasoning behind correct answers and diagnoses misconceptions for wrong answers.

### 3. 📊 Learner Model & Personalization (BKT)
- **Bayesian Knowledge Tracing:** Dynamically updates per-topic mastery:
  $$P(L_{t+1}) = P(L_t \mid \text{Observation}) + (1 - P(L_t \mid \text{Observation})) \cdot P(T)$$
- **Mastery States:**
  - 🔒 **LOCKED:** Prerequisites haven't met the 70% unlock threshold.
  - 🔵 **READY (Frontier):** Prerequisites met; recommended for active study.
  - 🟢 **MASTERED:** Mastery $\ge 70\%$.

### 4. 🗺️ Prerequisite Knowledge Graph
- Visual multi-tier curriculum DAG mapping foundations to advanced topics:
  - **Tier 1:** Variables & Data Types
  - **Tier 2:** Control Flow, Data Structures
  - **Tier 3:** Functions, Error Handling, File I/O
  - **Tier 4:** Object-Oriented Programming
- Real-time frontier recommendations highlight the highest-priority topic to tackle next.

---

## 🏗️ Project Architecture

```
multimodel_hackathone/
├── frontend/                     # Vite + React 19 + TypeScript + Tailwind v4
│   ├── src/
│   │   ├── components/           # Sidebar, ChatMessage, SourceCard, QuizCard, MasteryBar, KnowledgeGraph
│   │   ├── pages/                # UploadPage, ChatPage, QuizPage, DashboardPage
│   │   ├── lib/
│   │   │   ├── mockData.ts       # BKT algorithm, simulated RAG & quiz engine
│   │   │   └── types.ts          # Strongly-typed data contracts
│   │   ├── App.tsx               # Client-side router & layout
│   │   └── main.tsx
│   └── package.json
├── data/
│   ├── sample_materials/         # Structured course content (intro_to_python.md)
│   └── topic_graphs/             # DAG definition (python_basics.json)
└── README.md
```

---

## 🎯 Hackathon Presentation Demo Flow

1. **Upload / Home Page:** Click **"Load Sample Materials"** to index Python 101.
2. **Study Chat:**
   - Click a suggestion (e.g. *"What are Python variables?"*) $\rightarrow$ observe inline source citations and collapsible evidence cards.
   - Ask an out-of-scope query (e.g. *"How does quantum computing work?"*) $\rightarrow$ observe source grounding guardrail.
3. **Adaptive Quiz:**
   - Select **Variables & Data Types**, generate a 3-question quiz.
   - Complete the quiz $\rightarrow$ observe instant grading, feedback, and notification that BKT mastery updated.
4. **Learning Dashboard:**
   - View updated topic mastery bars, the **Prerequisite Knowledge Graph** unlocking dependencies, and the "Recommended Next" frontier.
