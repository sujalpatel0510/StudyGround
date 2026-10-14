import { Lock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TopicNode, TopicEdge } from "../lib/types";

interface KnowledgeGraphProps {
  topics: TopicNode[];
  edges: TopicEdge[];
}

export function KnowledgeGraph({ topics, edges }: KnowledgeGraphProps) {
  const navigate = useNavigate();

  const tiers = [1, 2, 3, 4];
  const topicsByTier = tiers.map((tier) =>
    topics.filter((t) => t.tier === tier).sort((a, b) => a.chapter - b.chapter)
  );

  const tierLabels: Record<number, { title: string; desc: string }> = {
    1: { title: "Tier 1: Foundations", desc: "Primitive types & memory fundamentals" },
    2: { title: "Tier 2: Core Constructs", desc: "Iteration protocols & sequence operations" },
    3: { title: "Tier 3: Advanced Abstractions", desc: "First-class closures & error topologies" },
    4: { title: "Tier 4: Architecture & OOP", desc: "MRO, polymorphic classes & system design" },
  };

  return (
    <div className="bg-[#0f1523]/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Prerequisite Knowledge Graph (Curriculum DAG)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
              Live Topology
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Concepts automatically unlock when prerequisite topic mastery crosses the 70% threshold
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            Mastered (≥70%)
          </div>
          <div className="flex items-center gap-1.5 text-teal-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm shadow-teal-400/50 animate-pulse" />
            Frontier (Ready)
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            Locked (Prerequisites)
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {tiers.map((tier) => {
          const tierTopics = topicsByTier[tier - 1];
          if (!tierTopics || tierTopics.length === 0) return null;

          return (
            <div key={tier} className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300 uppercase tracking-wider font-mono text-[11px]">
                    {tierLabels[tier].title}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400 text-[11px]">{tierLabels[tier].desc}</span>
                </div>
                <div className="h-px flex-1 bg-slate-800/80 ml-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {tierTopics.map((topic) => {
                  const pct = Math.round(topic.mastery * 100);
                  const isLocked = topic.state === "LOCKED";
                  const isMastered = topic.state === "MASTERED";

                  const parentIds = edges.filter((e) => e.to === topic.id).map((e) => e.from);
                  const parentTitles = parentIds
                    .map((pid) => topics.find((t) => t.id === pid)?.title)
                    .filter(Boolean);

                  return (
                    <div
                      key={topic.id}
                      className={`relative rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                        isMastered
                          ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5"
                          : isLocked
                          ? "bg-slate-900/30 border-slate-800/70 opacity-60"
                          : "bg-gradient-to-br from-indigo-500/10 to-teal-500/10 border-teal-500/40 hover:border-teal-400 shadow-lg shadow-teal-500/5"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono text-slate-400">
                            Ch. {topic.chapter}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              isMastered
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : isLocked
                                ? "bg-slate-800 text-slate-400 border-slate-700"
                                : "bg-teal-500/20 text-teal-300 border-teal-500/30 animate-pulse"
                            }`}
                          >
                            {isMastered ? "Mastered" : isLocked ? "Locked" : "Active Frontier"}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1 tracking-tight">
                          {topic.title}
                        </h4>

                        {parentTitles.length > 0 && (
                          <p className="text-[11px] text-slate-400 mb-2">
                            Dependencies:{" "}
                            <span className="text-slate-300 font-medium">
                              {parentTitles.join(", ")}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                          BKT Mastery:{" "}
                          <span
                            className={`font-mono font-bold ${
                              isMastered
                                ? "text-emerald-400"
                                : isLocked
                                ? "text-slate-400"
                                : "text-teal-300"
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>

                        {!isLocked && (
                          <button
                            onClick={() => navigate("/quiz")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 border border-teal-500/30 transition-all cursor-pointer"
                          >
                            {isMastered ? "Review" : "Practice"}
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        )}

                        {isLocked && (
                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
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
