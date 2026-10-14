import { Lock, CheckCircle, Circle } from "lucide-react";
import type { TopicNode } from "../lib/types";

export function MasteryBar({ topic }: { topic: TopicNode }) {
  const pct = Math.round(topic.mastery * 100);

  const stateConfig = {
    MASTERED: {
      barColor: "bg-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
      label: "Mastered",
    },
    READY: {
      barColor: "bg-blue-500",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      icon: <Circle className="w-4 h-4 text-blue-400" />,
      label: "Ready",
    },
    LOCKED: {
      barColor: "bg-gray-600",
      bgColor: "bg-gray-800/50",
      borderColor: "border-gray-700/50",
      textColor: "text-gray-500",
      icon: <Lock className="w-4 h-4 text-gray-500" />,
      label: "Locked",
    },
  };

  const cfg = stateConfig[topic.state];

  return (
    <div className={`rounded-xl border p-4 ${cfg.bgColor} ${cfg.borderColor} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          {cfg.icon}
          <div>
            <h4 className="text-sm font-medium text-white">{topic.title}</h4>
            <span className="text-xs text-gray-500">Chapter {topic.chapter}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.textColor}`}>
            {cfg.label}
          </span>
          <span className={`text-sm font-bold ${cfg.textColor}`}>{pct}%</span>
        </div>
      </div>
      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${cfg.barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
