import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { SourceRef } from "../lib/types";

export function SourceCard({ source }: { source: SourceRef }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-900/80 rounded-lg p-2.5 text-sm border border-gray-700/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
        <span className="text-blue-300 font-medium text-xs">{source.label}</span>
        <span className="ml-auto">
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </span>
      </button>
      {expanded && (
        <p className="mt-2 text-gray-400 text-xs leading-relaxed border-t border-gray-700/50 pt-2">
          {source.content_preview}
        </p>
      )}
    </div>
  );
}
