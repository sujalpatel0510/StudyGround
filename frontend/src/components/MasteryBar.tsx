import { Lock, CheckCircle2, Play, Clock, Sparkles } from "lucide-react";
import type { TopicNode } from "../lib/types";

export function MasteryBar({ topic }: { topic: TopicNode }) {
  const pct = Math.round(topic.mastery * 100);

  const stateConfig = {
    MASTERED: {
      barGradient: "bg-gradient-to-r from-emerald-500 to-teal-400",
      bgColor: "bg-emerald-500/5",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      label: "Mastered",
    },
    READY: {
      barGradient: "bg-gradient-to-r from-indigo-500 to-teal-400",
      bgColor: "bg-indigo-500/5",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-300",
      badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      icon: <Play className="w-4 h-4 text-teal-400 fill-teal-400/20" />,
      label: "Ready to Learn",
    },
    LOCKED: {
      barGradient: "bg-slate-700",
      bgColor: "bg-slate-900/40",
      borderColor: "border-slate-800",
      textColor: "text-slate-400",
      badgeBg: "bg-slate-800 text-slate-400 border-slate-700",
      icon: <Lock className="w-4 h-4 text-slate-400" />,
      label: "Prerequisites Required",
    },
  };

  const cfg = stateConfig[topic.state];

  return (
    <div className={`rounded-xl border p-4 ${cfg.bgColor} ${cfg.borderColor} transition-all duration-200 hover:border-slate-700`}>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
            {cfg.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">{topic.title}</h4>
              <span className="text-[11px] font-mono text-slate-400">Ch. {topic.chapter}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
              {topic.conceptCount && (
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {topic.conceptCount} Key Concepts
                </span>
              )}
              {topic.estimatedMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  ~{topic.estimatedMinutes} mins
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${cfg.badgeBg}`}>
            {cfg.label}
          </span>
          <span className={`text-base font-bold font-mono ${cfg.textColor}`}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.barGradient}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
