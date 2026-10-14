import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Brain, BarChart3, Map, Loader2, Sparkles, Video, Presentation, FileText, ArrowRight, ShieldCheck, Flame, Calendar } from "lucide-react";
import { ingestSample, isDataLoaded, currentProfile } from "../lib/mockData";

const features = [
  {
    icon: Search,
    title: "1. Multimodal Source Grounding",
    desc: "Cites exact timestamps in lecture videos, slide indices, and textbook pages. Flags out-of-scope queries to eliminate hallucinations.",
    badge: "Track D Grounding",
    accent: "text-teal-400",
    border: "border-teal-500/30",
    bg: "bg-teal-500/5",
  },
  {
    icon: Brain,
    title: "2. Adaptive Assessment Engine",
    desc: "Generates multi-tier MCQs and open-ended questions targeting Bloom's taxonomy (Recall, Application, Analysis) with instant misconception diagnosis.",
    badge: "Track D Adaptive Test",
    accent: "text-indigo-400",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/5",
  },
  {
    icon: BarChart3,
    title: "3. Bayesian Learner Model (BKT)",
    desc: "Probabilistic mastery tracking P(Learned) across topics. Adjusts for lucky guesses and slips to schedule spaced reviews via SM-2.",
    badge: "Track D Personalization",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
  },
  {
    icon: Map,
    title: "4. Curriculum Prerequisite DAG",
    desc: "Organizes materials into dependency tiers. Locked topics remain closed until foundations achieve ≥ 70% mastery, creating a focused frontier.",
    badge: "Track D Knowledge Graph",
    accent: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
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
    <div className="h-full overflow-auto bg-[#0b0f17]">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1 text-xs font-medium text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Multimodal AI Hackathon 2026</span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-400 font-semibold">Track D: Personalized Tutoring</span>
          </div>

          {/* Student Profile Quick Pill */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-full px-3.5 py-1 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Learner: <strong className="text-white">{currentProfile.name}</strong></span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Flame className="w-3 h-3 fill-current" />
              {currentProfile.streakDays} Day Streak
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Source-Grounded <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              Adaptive Study Companion
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            Eliminate scattered notes and ungrounded hallucinations. StudyGround ingests lecture videos,
            textbooks, and slide decks to build a personalized mastery model tailored to your exam schedule.
          </p>
        </div>

        {/* Demo Student & Course Context Bento Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-400">
                Curriculum Syllabus
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {currentProfile.activeCourse}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Target Exam: <strong className="text-slate-200">{currentProfile.targetExam}</strong> ({currentProfile.examDate})
              </p>
            </div>

            {/* Overall Student Mastery Pill */}
            <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl">
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase">Current Mastery</p>
                <p className="text-xl font-bold text-emerald-400 font-mono">68%</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase">Study Logged</p>
                <p className="text-xl font-bold text-indigo-400 font-mono">{currentProfile.totalHoursStudied}h</p>
              </div>
            </div>
          </div>

          {/* Multimodal Artifact Inventory */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Included Course Artifacts (Multimodal Ingestion Pipeline)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Course Textbook (PDF)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">142 Pages • 7 Chapters</p>
                  <span className="inline-block mt-2 text-[10px] text-teal-400 font-medium">
                    ✓ PyMuPDF Layout Extracted
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Lecture Recordings</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">6 Modules • 6.2 Total Hours</p>
                  <span className="inline-block mt-2 text-[10px] text-rose-400 font-medium">
                    ✓ Whisper Phoneme Aligned
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Slide Decks (PPTX)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">48 Slides • Flow Diagrams</p>
                  <span className="inline-block mt-2 text-[10px] text-amber-400 font-medium">
                    ✓ Diagram & Table Parsed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Call to Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
              <p className="text-xs text-slate-300">
                {done
                  ? "42 Knowledge Chunks active. Exact-citation grounding verified across all sources."
                  : "Click below to index the course materials into the local vector space."}
              </p>
            </div>

            {done ? (
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/chat")}
                  className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 cursor-pointer"
                >
                  Open Study Companion
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/quiz")}
                  className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start Adaptive Quiz
                </button>
              </div>
            ) : (
              <button
                onClick={handleIngest}
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synthesizing Multimodal Knowledge...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Load Sample Materials (+150 XP)
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 4 Track D Pillars Bento Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Key Architecture Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border p-5 ${f.bg} ${f.border} transition-all duration-200 hover:border-slate-600 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <f.icon className={`w-6 h-6 ${f.accent}`} />
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      {f.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{f.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
