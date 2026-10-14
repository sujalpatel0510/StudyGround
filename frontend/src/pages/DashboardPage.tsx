import { useEffect, useState } from "react";
import { BarChart3, Target, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MasteryBar } from "../components/MasteryBar";
import { KnowledgeGraph } from "../components/KnowledgeGraph";
import { getDashboard } from "../lib/mockData";
import type { DashboardData } from "../lib/types";

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    const d = await getDashboard();
    setData(d);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  const masteredCount = data.topics.filter((t) => t.state === "MASTERED").length;
  const readyCount = data.topics.filter((t) => t.state === "READY").length;
  const lockedCount = data.topics.filter((t) => t.state === "LOCKED").length;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <BarChart3 className="w-7 h-7 text-green-400" />
            Learning Dashboard
          </h2>
          <p className="text-gray-400">
            Track your mastery across all topics — powered by Bayesian Knowledge Tracing
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{data.overallProgress}%</p>
            <p className="text-xs text-gray-400 mt-1">Overall Progress</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{masteredCount}</p>
            <p className="text-xs text-gray-400 mt-1">Mastered</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{readyCount}</p>
            <p className="text-xs text-gray-400 mt-1">Ready</p>
          </div>
          <div className="bg-gray-700/30 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-400">{lockedCount}</p>
            <p className="text-xs text-gray-400 mt-1">Locked</p>
          </div>
        </div>

        {/* Recommended Next */}
        {data.frontier.length > 0 && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2 mb-3">
              <Target className="w-4 h-4" />
              Recommended Next
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.frontier.map((topicId) => {
                const topic = data.topics.find((t) => t.id === topicId);
                return topic ? (
                  <button
                    key={topicId}
                    onClick={() => navigate("/quiz")}
                    className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-3 py-1.5 rounded-lg text-sm text-blue-300 transition-colors flex items-center gap-1"
                  >
                    Ch. {topic.chapter}: {topic.title}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Knowledge Graph */}
        <div className="mb-8">
          <KnowledgeGraph topics={data.topics} edges={data.edges} />
        </div>

        {/* Topic Mastery */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Topic Mastery
          </h3>
          <div className="space-y-3">
            {data.topics
              .sort((a, b) => a.chapter - b.chapter)
              .map((topic) => (
                <MasteryBar key={topic.id} topic={topic} />
              ))}
          </div>
        </div>

        {/* Quiz History */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Recent Quiz History
          </h3>
          {data.history.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-3">No quizzes taken yet</p>
              <button
                onClick={() => navigate("/quiz")}
                className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Take Your First Quiz →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {data.history.map((h) => (
                <div
                  key={h.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{h.topic}</p>
                    <p className="text-xs text-gray-500">
                      {h.date.toLocaleDateString()} at {h.date.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${
                        h.score === h.total
                          ? "text-green-400"
                          : h.score >= h.total / 2
                          ? "text-blue-400"
                          : "text-red-400"
                      }`}
                    >
                      {h.score}/{h.total}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        h.score === h.total
                          ? "bg-green-500/20 text-green-400"
                          : h.score >= h.total / 2
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {Math.round((h.score / h.total) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
