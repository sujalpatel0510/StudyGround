import { Lock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TopicNode, TopicEdge } from "../lib/types";

interface KnowledgeGraphProps {
  topics: TopicNode[];
  edges: TopicEdge[];
}

export function KnowledgeGraph({ topics, edges }: KnowledgeGraphProps) {
  const navigate = useNavigate();

  // Group by tier
  const tiers = [1, 2, 3, 4];
  const topicsByTier = tiers.map((tier) =>
    topics.filter((t) => t.tier === tier).sort((a, b) => a.chapter - b.chapter)
  );

  const tierLabels: Record<number, string> = {
    1: "Tier 1: Foundations",
    2: "Tier 2: Core Constructs",
    3: "Tier 3: Advanced Abstractions",
    4: "Tier 4: Architecture & OOP",
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Prerequisite Knowledge Graph</h3>
          <p className="text-xs text-gray-400">
            Dependencies unlock as you achieve ≥ 70% topic mastery
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Mastered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Ready
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-600" /> Locked
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {tiers.map((tier) => {
          const tierTopics = topicsByTier[tier - 1];
          if (!tierTopics || tierTopics.length === 0) return null;

          return (
            <div key={tier} className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <span>{tierLabels[tier]}</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tierTopics.map((topic) => {
                  const pct = Math.round(topic.mastery * 100);
                  const isLocked = topic.state === "LOCKED";
                  const isMastered = topic.state === "MASTERED";

                  // Find parents for tooltip/display
                  const parentIds = edges.filter((e) => e.to === topic.id).map((e) => e.from);
                  const parentTitles = parentIds
                    .map((pid) => topics.find((t) => t.id === pid)?.title)
                    .filter(Boolean);

                  return (
                    <div
                      key={topic.id}
                      className={`relative rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                        isMastered
                          ? "bg-green-500/10 border-green-500/30 hover:border-green-500/60"
                          : isLocked
                          ? "bg-gray-800/30 border-gray-800 opacity-60"
                          : "bg-blue-500/10 border-blue-500/40 hover:border-blue-400 shadow-lg shadow-blue-500/5"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-400">
                            Ch. {topic.chapter}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isMastered
                                ? "bg-green-500/20 text-green-300"
                                : isLocked
                                ? "bg-gray-700 text-gray-400"
                                : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {isMastered ? "Mastered" : isLocked ? "Locked" : "Ready"}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-white mb-1">{topic.title}</h4>

                        {parentTitles.length > 0 && (
                          <p className="text-[11px] text-gray-400 mb-3">
                            Requires:{" "}
                            <span className="text-gray-300">
                              {parentTitles.join(", ")}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-800/80 mt-2 flex items-center justify-between">
                        <div className="text-xs font-medium text-gray-400">
                          Mastery: <span className="text-white font-bold">{pct}%</span>
                        </div>

                        {!isLocked && (
                          <button
                            onClick={() => navigate("/quiz")}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {isMastered ? "Practice" : "Start"}
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        )}

                        {isLocked && (
                          <div className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Lock className="w-3 h-3" />
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
