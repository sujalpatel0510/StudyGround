import { NavLink } from "react-router-dom";
import { BookOpen, MessageSquare, Brain, BarChart3, Upload, Flame, Sparkles } from "lucide-react";
import { currentProfile } from "../lib/mockData";

const nav = [
  { href: "/", label: "Course Materials", icon: Upload },
  { href: "/chat", label: "Study Companion", icon: MessageSquare },
  { href: "/quiz", label: "Adaptive Quizzes", icon: Brain },
  { href: "/dashboard", label: "Learner Model", icon: BarChart3 },
];

export function Sidebar() {
  const xpPct = Math.round((currentProfile.currentXp / currentProfile.nextLevelXp) * 100);

  return (
    <aside className="w-64 bg-[#0d131f] border-r border-slate-800/80 p-4 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 px-2 pt-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/10">
          <BookOpen className="w-5 h-5 text-slate-950 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-white tracking-tight">
              StudyGround
            </h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
              AI Tutor
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Source-Grounded Companion</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-6">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </p>
        {nav.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Active Course Banner */}
      <div className="px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Active Syllabus
        </p>
        <p className="text-xs font-semibold text-slate-200 line-clamp-1">
          {currentProfile.activeCourse}
        </p>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-teal-400">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span>Multimodal Index Ready</span>
        </div>
      </div>

      {/* Student Profile Snapshot Footer */}
      <div className="mt-auto pt-3 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  AC
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">
                  {currentProfile.name}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Lvl {currentProfile.level} • {currentProfile.institution.split("•")[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{currentProfile.streakDays}d</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                XP Progress
              </span>
              <span>{currentProfile.currentXp} / {currentProfile.nextLevelXp}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-2.5 px-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>Hackathon Track D</span>
          <span className="text-slate-300">Target: Stanford CS</span>
        </div>
      </div>
    </aside>
  );
}
