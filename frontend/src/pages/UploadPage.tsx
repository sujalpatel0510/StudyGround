import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Brain, BarChart3, Map, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { ingestSample, isDataLoaded } from "../lib/mockData";

const features = [
  {
    icon: Search,
    title: "Source-Grounded Answers",
    desc: "Every answer cites exact chapter, section, and page from your materials. No hallucinations.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Brain,
    title: "Adaptive Quizzes",
    desc: "Dynamically generated MCQs and short-answer questions tied to specific topics and difficulty levels.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    icon: BarChart3,
    title: "Mastery Tracking",
    desc: "Bayesian Knowledge Tracing models your understanding per-topic and adapts recommendations.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: Map,
    title: "Knowledge Map",
    desc: "Prerequisite dependency graph shows what's mastered, ready, and locked — your learning roadmap.",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
];

export function UploadPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(isDataLoaded());

  const handleIngest = async () => {
    setLoading(true);
    await ingestSample();
    setDone(true);
    setLoading(false);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Multimodal AI Hackathon 2026 — Track D</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              StudyGround
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Your source-grounded AI study companion. Upload course materials, get cited answers,
            take adaptive quizzes, and track your mastery — all in one place.
          </p>
        </div>

        {/* Ingest CTA */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-12 text-center">
          <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Get Started</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Load the sample course material — <strong className="text-white">Introduction to Python Programming</strong> (7 chapters)
            — to see StudyGround in action.
          </p>

          {done ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Materials loaded! 42 knowledge chunks indexed.</span>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigate("/chat")}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Start Studying →
                </button>
                <button
                  onClick={() => navigate("/quiz")}
                  className="bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Take a Quiz →
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleIngest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 px-8 py-3 rounded-xl font-medium text-lg transition-all flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing materials...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Load Sample Materials
                </>
              )}
            </button>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-xl border p-5 ${f.bgColor} ${f.borderColor} transition-all hover:scale-[1.02]`}
            >
              <f.icon className={`w-8 h-8 ${f.color} mb-3`} />
              <h3 className="text-white font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
