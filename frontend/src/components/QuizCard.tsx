import type { Question } from "../lib/types";
import { FileText } from "lucide-react";

interface QuizCardProps {
  question: Question;
  index: number;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function QuizCard({
  question,
  index,
  selectedAnswer,
  onAnswer,
  showResult,
  isCorrect,
}: QuizCardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-xl border p-5 transition-all ${
        showResult
          ? isCorrect
            ? "border-green-500/50 bg-green-500/5"
            : "border-red-500/50 bg-red-500/5"
          : "border-gray-700"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded border border-blue-500/30">
          Q{index + 1}
        </span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded border ${
            difficultyColors[question.difficulty] || difficultyColors.medium
          }`}
        >
          {question.difficulty}
        </span>
        <span className="text-xs text-gray-500 px-2 py-0.5 rounded bg-gray-700/50">
          {question.question_type === "MCQ" ? "Multiple Choice" : "Short Answer"}
        </span>
      </div>

      {/* Question */}
      <p className="text-white font-medium mb-4 leading-relaxed">{question.prompt}</p>

      {/* Answer Input */}
      {question.question_type === "MCQ" && question.options ? (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            let optClass = "border-gray-700 hover:border-gray-500 hover:bg-gray-700/50";
            if (showResult) {
              if (opt.is_correct) optClass = "border-green-500 bg-green-500/10";
              else if (isSelected && !opt.is_correct)
                optClass = "border-red-500 bg-red-500/10";
              else optClass = "border-gray-700 opacity-50";
            } else if (isSelected) {
              optClass = "border-blue-500 bg-blue-500/10";
            }

            return (
              <button
                key={opt.id}
                onClick={() => !showResult && onAnswer(opt.id)}
                disabled={!!showResult}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${optClass}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-sm">{opt.text}</span>
                {showResult && opt.is_correct && (
                  <span className="ml-auto text-green-400 text-xs font-medium">✓ Correct</span>
                )}
                {showResult && isSelected && !opt.is_correct && (
                  <span className="ml-auto text-red-400 text-xs font-medium">✗ Wrong</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <textarea
          value={selectedAnswer}
          onChange={(e) => !showResult && onAnswer(e.target.value)}
          disabled={!!showResult}
          placeholder="Type your answer..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 disabled:opacity-70"
        />
      )}

      {/* Result Feedback */}
      {showResult && (
        <div
          className={`mt-4 p-3 rounded-lg border ${
            isCorrect
              ? "bg-green-500/10 border-green-500/30"
              : "bg-red-500/10 border-red-500/30"
          }`}
        >
          <p className={`text-sm font-medium mb-1 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </p>
          <p className="text-sm text-gray-300">{question.explanation}</p>
          {question.correct_answer && !isCorrect && (
            <p className="text-sm text-yellow-400 mt-1">
              Correct answer: <strong>{question.correct_answer}</strong>
            </p>
          )}
        </div>
      )}

      {/* Source */}
      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-700/50">
        <FileText className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs text-gray-500">{question.source_label}</span>
      </div>
    </div>
  );
}
