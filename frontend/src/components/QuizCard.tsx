import type { Question } from "../lib/types";
import { Video, FileText, Presentation, Sparkles, CheckCircle2, XCircle } from "lucide-react";

interface QuizCardProps {
  question: Question;
  index: number;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  hard: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function QuizCard({
  question,
  index,
  selectedAnswer,
  onAnswer,
  showResult,
  isCorrect,
}: QuizCardProps) {
  const getMediaIcon = () => {
    switch (question.media_type) {
      case "video":
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case "slide":
        return <Presentation className="w-3.5 h-3.5 text-amber-400" />;
      case "pdf":
      default:
        return <FileText className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        showResult
          ? isCorrect
            ? "border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/5"
            : "border-rose-500/50 bg-rose-500/5 shadow-lg shadow-rose-500/5"
          : "border-slate-800 bg-[#111827] hover:border-slate-700/80"
      }`}
    >
      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/15 text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-md border border-indigo-500/30 font-mono">
            Q{index + 1}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md border capitalize ${
              difficultyColors[question.difficulty] || difficultyColors.medium
            }`}
          >
            {question.difficulty}
          </span>
          {question.cognitive_level && (
            <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
              Taxonomy: {question.cognitive_level}
            </span>
          )}
        </div>

        {question.xp_reward && (
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>+{question.xp_reward} XP</span>
          </div>
        )}
      </div>

      {/* Question Prompt */}
      <p className="text-white text-sm md:text-base font-semibold mb-4 leading-relaxed">
        {question.prompt}
      </p>

      {/* Answer Inputs */}
      {question.question_type === "MCQ" && question.options ? (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            let optClass = "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300";

            if (showResult) {
              if (opt.is_correct) {
                optClass = "border-emerald-500/80 bg-emerald-500/15 text-emerald-200 font-medium";
              } else if (isSelected && !opt.is_correct) {
                optClass = "border-rose-500/80 bg-rose-500/15 text-rose-200";
              } else {
                optClass = "border-slate-800/60 bg-slate-950/40 opacity-40 text-slate-400";
              }
            } else if (isSelected) {
              optClass = "border-teal-500/80 bg-teal-500/15 text-white font-medium shadow-sm shadow-teal-500/10";
            }

            return (
              <button
                key={opt.id}
                onClick={() => !showResult && onAnswer(opt.id)}
                disabled={!!showResult}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left cursor-pointer ${optClass}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSelected
                      ? "bg-teal-500 text-slate-950 shadow"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-xs md:text-sm">{opt.text}</span>

                {showResult && opt.is_correct && (
                  <span className="ml-auto inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </span>
                )}
                {showResult && isSelected && !opt.is_correct && (
                  <span className="ml-auto inline-flex items-center gap-1 text-rose-400 text-xs font-bold">
                    <XCircle className="w-4 h-4" /> Incorrect
                  </span>
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
          placeholder="Type your answer based on course concepts..."
          className="w-full bg-[#0a0f18] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-24 disabled:opacity-75 text-slate-200"
        />
      )}

      {/* Result Diagnostic Feedback */}
      {showResult && (
        <div
          className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed ${
            isCorrect
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              : "bg-rose-500/10 border-rose-500/30 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Concept Verified (+{question.xp_reward || 40} XP)</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span className="text-rose-400">Misconception Identified (Needs Revision)</span>
              </>
            )}
          </div>
          <p className="text-slate-300">{question.explanation}</p>
          {question.correct_answer && !isCorrect && (
            <p className="text-amber-300 mt-2 font-mono">
              Canonical Solution: <strong>{question.correct_answer}</strong>
            </p>
          )}
        </div>
      )}

      {/* Source Reference Footer */}
      <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <span className="p-0.5 rounded bg-slate-800/80">{getMediaIcon()}</span>
          <span className="text-slate-300 font-medium truncate">{question.source_label}</span>
        </div>
        <span className="text-teal-400 font-semibold shrink-0">Source-Grounded</span>
      </div>
    </div>
  );
}
