import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Video, Presentation, ShieldCheck } from "lucide-react";
import type { SourceRef } from "../lib/types";

export function SourceCard({ source }: { source: SourceRef }) {
  const [expanded, setExpanded] = useState(false);

  const getMediaIcon = () => {
    switch (source.media_type) {
      case "video":
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case "slide":
        return <Presentation className="w-3.5 h-3.5 text-amber-400" />;
      case "pdf":
      default:
        return <FileText className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  const getMediaBadge = () => {
    if (source.timestamp) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
          ⏱️ {source.timestamp}
        </span>
      );
    }
    if (source.page_number) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
          📄 p. {source.page_number}
        </span>
      );
    }
    if (source.slide_number) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          📊 Slide #{source.slide_number}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#111827]/90 rounded-xl p-2.5 text-xs border border-slate-800 transition-all hover:border-slate-700">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left cursor-pointer"
      >
        <span className="p-1 rounded-md bg-slate-800/80 shrink-0">
          {getMediaIcon()}
        </span>
        <span className="text-slate-200 font-medium truncate flex-1">
          {source.label}
        </span>

        {getMediaBadge()}

        {source.confidence && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            {Math.round(source.confidence * 100)}% verified
          </span>
        )}

        <span className="text-slate-400 hover:text-slate-200 ml-1">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>

      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-slate-800 text-slate-300 text-[11px] leading-relaxed font-sans bg-slate-900/60 p-2 rounded-lg">
          <p className="italic text-slate-300">"{source.content_preview}"</p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
            <span>Indexed via Multimodal Ingestion Pipeline</span>
            <span className="text-teal-400 font-medium">Exact Match Grounding</span>
          </div>
        </div>
      )}
    </div>
  );
}
