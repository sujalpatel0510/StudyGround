import { SourceCard } from "./SourceCard";
import type { ChatMessageItem } from "../lib/types";
import { User, Bot } from "lucide-react";

// Simple code block renderer
function renderContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.split("\n");
      const lang = lines[0].replace("```", "").trim();
      const code = lines.slice(1, -1).join("\n");
      return (
        <div key={i} className="my-2 rounded-lg overflow-hidden">
          {lang && (
            <div className="bg-gray-700/50 px-3 py-1 text-xs text-gray-400 font-mono">
              {lang}
            </div>
          )}
          <pre className="bg-gray-900 p-3 overflow-x-auto">
            <code className="text-sm font-mono text-green-300">{code}</code>
          </pre>
        </div>
      );
    }
    // Handle inline formatting
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
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-blue-600" : "bg-purple-600"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-800 border border-gray-700"
        }`}
      >
        <div className="text-sm leading-relaxed">{renderContent(message.content)}</div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-600/50 space-y-1.5">
            <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
              📎 Sources ({message.sources.length})
            </p>
            {message.sources.map((s, i) => (
              <SourceCard key={i} source={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
