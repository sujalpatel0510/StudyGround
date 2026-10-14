import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { ChatMessage } from "../components/ChatMessage";
import { chat } from "../lib/mockData";
import type { ChatMessageItem } from "../lib/types";

const SUGGESTIONS = [
  "What are Python variables?",
  "Explain list comprehensions",
  "How do for loops work?",
  "What is inheritance in OOP?",
  "Explain dictionaries in Python",
  "How do decorators work?",
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
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 shrink-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          📚 Study Chat
        </h2>
        <p className="text-sm text-gray-400">
          Ask questions grounded in your course materials — every answer cites its source
        </p>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-12 h-12 text-blue-400/50 mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              What would you like to learn?
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Ask any question about your Python course materials. I'll answer with
              exact source citations.
            </p>
            <div className="flex flex-wrap gap-2 max-w-lg justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 px-3 py-1.5 rounded-lg text-sm text-gray-300 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                Searching course materials...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about your course materials..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl px-4 py-3 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
