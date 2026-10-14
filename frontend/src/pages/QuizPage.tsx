import { useState } from "react";
import { Brain, Loader2, RotateCcw, Trophy, Sparkles, ShieldCheck, Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuizCard } from "../components/QuizCard";
import { generateQuiz, gradeAnswer, submitQuizResults, getTopicsList, currentProfile } from "../lib/mockData";
import type { Question } from "../lib/types";

type QuizState = "setup" | "taking" | "results";

export function QuizPage() {
  const navigate = useNavigate();
  const topics = getTopicsList();
  const [selectedTopic, setSelectedTopic] = useState(topics[0].id);
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(3);
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<{ isCorrect: boolean; score: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [xpEarned, setXpEarned] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    const quiz = await generateQuiz(selectedTopic, numQuestions, difficulty);
    setQuestions(quiz.questions);
    setTopicTitle(quiz.topic);
    setAnswers({});
    setResults([]);
    setQuizState("taking");
    setLoading(false);
  };

  const handleSubmit = () => {
    const graded = questions.map((q, i) => gradeAnswer(q, answers[i] || ""));
    setResults(graded);
    const submissionResult = submitQuizResults(selectedTopic, graded);
    setXpEarned(submissionResult.xpEarned);
    setQuizState("results");
  };

  const handleReset = () => {
    setQuizState("setup");
    setQuestions([]);
    setAnswers({});
    setResults([]);
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length;
  const correctCount = results.filter((r) => r.isCorrect).length;

  return (
    <div className="h-full overflow-auto bg-[#0b0f17]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Bar */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Brain className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Adaptive Assessment Engine
                </h2>
                <p className="text-xs text-slate-400">
                  Targeted quizzes tied to course material • Auto-calibrated with Bayesian Knowledge Tracing
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Learner:</span>
            <span className="text-white font-semibold">{currentProfile.name}</span>
            <span className="text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Flame className="w-3 h-3 fill-current" />
              {currentProfile.streakDays}d
            </span>
          </div>
        </header>

        {/* Setup Screen */}
        {quizState === "setup" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Configure Assessment</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a syllabus unit and cognitive difficulty level
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Topic & Curriculum Unit
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      Chapter {t.chapter}: {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Difficulty Tier
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  >
                    <option value="easy">Easy (Recall & Concepts)</option>
                    <option value="medium">Medium (Application & Analysis)</option>
                    <option value="hard">Hard (Synthesis & Edge Cases)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Question Count
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  >
                    {[2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} Questions</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BKT Pedagogical Callout */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Adaptive Calibration:</strong> Answers adjust your topic mastery probability P(Learned) through Bayesian Knowledge Tracing. Reaching 70% unlocks downstream curriculum modules on your Knowledge Graph.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Adaptive Questions from Sources...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Generate Grounded Assessment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Taking Quiz Mode */}
        {quizState === "taking" && (
          <div className="space-y-5 max-w-3xl mx-auto">
            <div className="flex items-center justify-between bg-[#111827] border border-slate-800 rounded-xl p-4">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">Active Assessment</span>
                <h3 className="font-bold text-white text-base">{topicTitle}</h3>
                <p className="text-xs text-slate-400">
                  {answeredCount} of {questions.length} questions completed
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                Submit Answers
              </button>
            </div>

            {questions.map((q, i) => (
              <QuizCard
                key={i}
                question={q}
                index={i}
                selectedAnswer={answers[i] || ""}
                onAnswer={(a) => setAnswers((prev) => ({ ...prev, [i]: a }))}
              />
            ))}
          </div>
        )}

        {/* Results Screen */}
        {quizState === "results" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Score Banner */}
            <div
              className={`rounded-2xl border p-6 text-center shadow-xl ${
                correctCount === questions.length
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                  : correctCount >= questions.length / 2
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-200"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-200"
              }`}
            >
              <Trophy className="w-12 h-12 mx-auto mb-2 text-amber-400" />
              <h3 className="text-3xl font-black text-white mb-1">
                {correctCount} / {questions.length} Correct
              </h3>
              <p className="text-sm text-slate-300">
                {correctCount === questions.length
                  ? "Mastery threshold achieved! Outstanding performance! 🎉"
                  : correctCount >= questions.length / 2
                  ? "Good retention. Review the misconceptions below to solidify mastery."
                  : "Needs revision. Recommended review scheduled in your Spaced Repetition queue."}
              </p>

              {/* XP Pill */}
              <div className="inline-flex items-center gap-1.5 mt-4 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{xpEarned} XP Earned</span>
                <span className="text-slate-400">•</span>
                <span>BKT Topic Mastery Updated</span>
              </div>
            </div>

            {/* Questions with Explanations */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Detailed Diagnostic Feedback
              </h4>
              {questions.map((q, i) => (
                <QuizCard
                  key={i}
                  question={q}
                  index={i}
                  selectedAnswer={answers[i] || ""}
                  onAnswer={() => {}}
                  showResult
                  isCorrect={results[i]?.isCorrect}
                />
              ))}
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10"
              >
                Inspect Updated Learner Model & Graph
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-6 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Try Another Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
