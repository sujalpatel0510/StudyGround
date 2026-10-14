import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ShieldCheck, Flame, BookOpen } from "lucide-react";
import { ChatMessage } from "../components/ChatMessage";
import { chat, currentProfile } from "../lib/mockData";
import type { ChatMessageItem } from "../lib/types";

const SUGGESTIONS = [
  "What is the difference between integer division // and float division in Python?",
  "How does slicing lst[::-1] work under the hood?",
  "Explain the LEGB scope rule with an example of closures",
  "Why does the 'else' block execute on a for loop?",
  "What is Python's Method Resolution Order (MRO)?",
  "Can you explain quantum computing and entanglement?", // Out of scope test!
];

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessageItem = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const resp = await chat(query);

    const botMsg: ChatMessageItem = {
      id: `msg_${Date.now()}_bot`,
      role: "assistant",
      content: resp.answer,
      sources: resp.sources,
      modelConfidence: resp.modelConfidence,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f17]">
      {/* Top Header */}
      <header className="px-6 py-3.5 border-b border-slate-800 bg-[#0d131f] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                CS101 Source-Grounded Study Chat
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Grounding Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cross-referencing lecture videos, textbooks, and slide decks in real-time
            </p>
          </div>
        </div>

        {/* Student Active Session Info */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Student:</span>
            <span className="text-white font-medium">{currentProfile.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-teal-400 font-semibold">Lvl {currentProfile.level}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{currentProfile.streakDays}d Streak</span>
          </div>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-5">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-indigo-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-lg shadow-teal-500/5">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Ask anything from your course materials
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mb-6 leading-relaxed">
              Every answer is synthesized directly from your uploaded textbook chapters,
              lecture video timestamps, and presentation slides.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
                Suggested Exam Review Prompts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className={`p-3 rounded-xl text-xs transition-all text-left border cursor-pointer ${
                      idx === SUGGESTIONS.length - 1
                        ? "bg-rose-500/5 border-rose-500/20 text-rose-300 hover:border-rose-400"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-teal-500/40 hover:text-white"
                    }`}
                  >
                    <span className="font-medium">{s}</span>
                    {idx === SUGGESTIONS.length - 1 && (
                      <span className="block mt-1 text-[10px] text-rose-400/80 font-mono">
                        (Tests Out-of-Scope Detection)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {loading && (
          <div className="flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-teal-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md max-w-[80%]">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                <span>Searching textbook embeddings & lecture video timestamps...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0d131f] shrink-0">
        <div className="max-w-4xl mx-auto flex gap-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about your syllabus concepts, functions, loops, or exam problems..."
            className="flex-1 bg-[#090d16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-xl px-5 py-3 transition-colors flex items-center justify-center cursor-pointer shadow-lg shadow-teal-500/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
