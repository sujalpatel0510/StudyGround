import { SourceCard } from "./SourceCard";
import type { ChatMessageItem } from "../lib/types";
import { User, Sparkles, ShieldCheck } from "lucide-react";

// Code block parser & inline text formatting
function renderContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.split("\n");
      const lang = lines[0].replace("```", "").trim() || "python";
      const code = lines.slice(1, -1).join("\n");
      return (
        <div key={i} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-inner">
          <div className="bg-slate-900/90 px-3 py-1.5 text-[11px] text-slate-400 font-mono flex items-center justify-between border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-semibold text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              {lang}
            </span>
            <span className="text-[10px] text-slate-400">Source Example</span>
          </div>
          <pre className="p-3.5 overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );
    }
    // Handle inline bold formatting
    const formatted = part
      .split(/(\*\*.*?\*\*)/g)
      .map((seg, j) =>
        seg.startsWith("**") && seg.endsWith("**") ? (
          <strong key={j} className="text-white font-semibold">
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{seg}</span>
        )
      );
    return (
      <span key={i} className="whitespace-pre-wrap">
        {formatted}
      </span>
    );
  });
}

export function ChatMessage({ message }: { message: ChatMessageItem }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3.5 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
          isUser
            ? "bg-gradient-to-tr from-teal-500 to-indigo-600 text-white"
            : "bg-slate-800 border border-slate-700/80 text-teal-400"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[80%] rounded-2xl p-4 transition-all ${
          isUser
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
            : "bg-[#111827] border border-slate-800 text-slate-200 shadow-lg shadow-black/20"
        }`}
      >
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
            <span className="font-semibold text-teal-400 flex items-center gap-1">
              StudyGround Companion
            </span>
            {message.modelConfidence && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                {Math.round(message.modelConfidence * 100)}% Confidence
              </span>
            )}
          </div>
        )}

        <div className="text-sm leading-relaxed font-sans">{renderContent(message.content)}</div>

        {/* Multimodal Citations Section */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Cited Learning Artifacts ({message.sources.length})
              </span>
              <span className="text-[10px] text-teal-400 font-medium">Verified Source Grounding</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {message.sources.map((s, i) => (
                <SourceCard key={i} source={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
