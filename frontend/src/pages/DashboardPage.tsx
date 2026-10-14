import { useEffect, useState } from "react";
import { Target, TrendingUp, Clock, ArrowRight, Flame, Sparkles, Calendar, Award, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MasteryBar } from "../components/MasteryBar";
import { KnowledgeGraph } from "../components/KnowledgeGraph";
import { getDashboard, currentProfile } from "../lib/mockData";
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
      <div className="flex items-center justify-center h-full text-slate-400 bg-[#0b0f17]">
        Loading student learner model & knowledge graph...
      </div>
    );
  }

  const profile = data?.profile || currentProfile;
  const masteredCount = data?.topics?.filter((t) => t.state === "MASTERED")?.length ?? 0;
  const readyCount = data?.topics?.filter((t) => t.state === "READY")?.length ?? 0;
  const lockedCount = data?.topics?.filter((t) => t.state === "LOCKED")?.length ?? 0;

  const xpPct = Math.round(((profile?.currentXp || 0) / (profile?.nextLevelXp || 5000)) * 100);

  return (
    <div className="h-full overflow-auto bg-[#0b0f17]">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Student Profile Identity Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            {/* Avatar & Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/10">
                  <div className="w-full h-full bg-[#0d131f] rounded-2xl flex items-center justify-center font-bold text-white text-xl">
                    AC
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#111827]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">{profile.name}</h2>
                  <span className="text-xs font-mono text-slate-400">{profile.handle}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    Lvl {profile.level}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{profile.role} • {profile.institution}</p>
                <p className="text-xs text-teal-400 font-medium flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Target: <span className="text-slate-200">{profile.targetExam}</span> ({profile.examDate})
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                  <Flame className="w-4 h-4 fill-current" />
                  {profile.streakDays} Days
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Study Streak</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                <p className="text-sm font-bold text-teal-400 font-mono">{profile.totalHoursStudied}h</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Time Logged</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                <p className="text-sm font-bold text-indigo-400 font-mono">{profile.overallAccuracy}%</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Accuracy</p>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Level {profile.level} Progression
              </span>
              <span className="font-mono text-slate-300">
                {profile.currentXp} / {profile.nextLevelXp} XP ({xpPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-700"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Mastery</p>
            <p className="text-2xl font-bold text-white mt-1 font-mono">{data.overallProgress}%</p>
            <p className="text-[11px] text-slate-400 mt-1">Weighted BKT across curriculum</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Mastered Units</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{masteredCount} / {data.topics.length}</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">Crossed ≥ 70% threshold</p>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4">
            <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Active Frontier</p>
            <p className="text-2xl font-bold text-teal-400 mt-1 font-mono">{readyCount} Units</p>
            <p className="text-[11px] text-teal-400/80 mt-1">Prerequisites fulfilled</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Locked Modules</p>
            <p className="text-2xl font-bold text-slate-400 mt-1 font-mono">{lockedCount} Units</p>
            <p className="text-[11px] text-slate-400 mt-1">Requires upstream mastery</p>
          </div>
        </div>

        {/* Spaced Repetition (SM-2) Queue & Recommended Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Spaced Repetition Card */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Spaced Repetition Review Schedule (SM-2)
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Retention Guard
              </span>
            </div>
            <div className="space-y-2">
              {profile.upcomingReviews.map((rev) => (
                <div
                  key={rev.topicId}
                  className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{rev.topicTitle}</p>
                    <p className="text-[11px] text-slate-400">Due: <strong className="text-amber-400">{rev.dueIn}</strong></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-teal-400">{rev.retentionEstimate}%</span>
                    <p className="text-[10px] text-slate-400">Estimated Retention</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Learning Frontier */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-400" />
                  Recommended Next (Curriculum Frontier)
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Ready to Learn
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Based on your Bayesian Knowledge Tracing scores, these units have all prerequisites unlocked and offer the highest learning yield:
              </p>
              <div className="space-y-2">
                {data.frontier.map((topicId) => {
                  const topic = data.topics.find((t) => t.id === topicId);
                  return topic ? (
                    <div
                      key={topicId}
                      className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">Ch. {topic.chapter}: {topic.title}</p>
                        <p className="text-[10px] text-slate-400">{topic.conceptCount} Key Concepts • ~{topic.estimatedMinutes} mins</p>
                      </div>
                      <button
                        onClick={() => navigate("/quiz")}
                        className="bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 border border-teal-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        Practice
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Prerequisite Knowledge Graph */}
        <KnowledgeGraph topics={data.topics} edges={data.edges} />

        {/* Topic Mastery Meters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Per-Topic Mastery Overview
            </h3>
            <span className="text-xs text-slate-400">Updated automatically via BKT</span>
          </div>
          <div className="space-y-3">
            {data.topics
              .sort((a, b) => a.chapter - b.chapter)
              .map((topic) => (
                <MasteryBar key={topic.id} topic={topic} />
              ))}
          </div>
        </div>

        {/* Badges & Recent History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Achievement Badges */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Award className="w-4 h-4 text-amber-400" />
              Earned Competency Badges
            </h3>
            <div className="space-y-2.5">
              {profile.badges.map((b) => (
                <div key={b.id} className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{b.title}</h4>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {b.rarity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{b.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Unlocked: {b.unlockedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Diagnostic History
            </h3>
            <div className="space-y-2">
              {data.history.map((h) => (
                <div
                  key={h.id}
                  className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{h.topic}</p>
                    <p className="text-[10px] text-slate-400">
                      {h.date.toLocaleDateString()} at {h.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {h.xpEarned && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        +{h.xpEarned} XP
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        h.score === h.total
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                      }`}
                    >
                      {h.score}/{h.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
