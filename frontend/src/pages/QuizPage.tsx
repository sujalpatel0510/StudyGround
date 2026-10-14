import { useState } from "react";
import { Brain, Loader2, RotateCcw, Trophy } from "lucide-react";
import { QuizCard } from "../components/QuizCard";
import { generateQuiz, gradeAnswer, submitQuizResults, getTopicsList } from "../lib/mockData";
import type { Question } from "../lib/types";

type QuizState = "setup" | "taking" | "results";

export function QuizPage() {
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
    submitQuizResults(selectedTopic, graded);
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
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <Brain className="w-7 h-7 text-purple-400" />
            Adaptive Quiz
          </h2>
          <p className="text-gray-400">
            Test your knowledge with source-grounded questions — your mastery updates in real-time
          </p>
        </header>

        {/* Setup */}
        {quizState === "setup" && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    Ch. {t.chapter} — {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Questions</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {[2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} questions</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 py-3 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating questions...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate Quiz
                </>
              )}
            </button>
          </div>
        )}

        {/* Taking Quiz */}
        {quizState === "taking" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div>
                <h3 className="font-semibold">{topicTitle}</h3>
                <p className="text-sm text-gray-400">
                  {answeredCount}/{questions.length} answered
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Submit Quiz
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

        {/* Results */}
        {quizState === "results" && (
          <div className="space-y-4">
            {/* Score Card */}
            <div
              className={`rounded-2xl border p-6 text-center ${
                correctCount === questions.length
                  ? "bg-green-500/10 border-green-500/30"
                  : correctCount >= questions.length / 2
                  ? "bg-blue-500/10 border-blue-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <Trophy
                className={`w-12 h-12 mx-auto mb-3 ${
                  correctCount === questions.length
                    ? "text-green-400"
                    : correctCount >= questions.length / 2
                    ? "text-blue-400"
                    : "text-red-400"
                }`}
              />
              <h3 className="text-3xl font-bold mb-1">
                {correctCount}/{questions.length}
              </h3>
              <p className="text-gray-400">
                {correctCount === questions.length
                  ? "Perfect score! 🎉"
                  : correctCount >= questions.length / 2
                  ? "Good job! Keep practicing."
                  : "Keep studying — you'll get there!"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Your mastery for <strong>{topicTitle}</strong> has been updated via Bayesian Knowledge Tracing.
              </p>
            </div>

            {/* Per-question feedback */}
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

            <button
              onClick={handleReset}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
