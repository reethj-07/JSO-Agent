"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the **Agency Trust & Transparency Agent**. I can help you evaluate agency trustworthiness on the JSO platform.\n\nTry asking:\n- \"Which are the most trusted agencies?\"\n- \"Tell me about TechPlace Global\"\n- \"Which agencies have declining scores?\"\n- \"How are trust scores calculated?\"",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.content }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: data.timestamp,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setIsLoading(false);
  }

  function renderMarkdown(text: string) {
    // Simple markdown rendering for bold, tables, and lists
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold
      let processed = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white">$1</strong>'
      );

      // Table detection
      if (processed.startsWith("|")) {
        if (processed.includes("---")) return null;
        const cells = processed
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim());
        return (
          <div key={i} className="flex gap-4 text-xs font-mono">
            {cells.map((cell, j) => (
              <span
                key={j}
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: cell }}
              />
            ))}
          </div>
        );
      }

      // List items
      if (processed.startsWith("- ")) {
        return (
          <div
            key={i}
            className="pl-3 text-sm"
            dangerouslySetInnerHTML={{
              __html: "• " + processed.slice(2),
            }}
          />
        );
      }

      // Numbered list
      if (/^\d+\./.test(processed)) {
        return (
          <div
            key={i}
            className="pl-3 text-sm"
            dangerouslySetInnerHTML={{ __html: processed }}
          />
        );
      }

      if (processed.trim() === "") return <br key={i} />;

      return (
        <p
          key={i}
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    });
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-blue-600 hover:bg-blue-500 animate-pulse"
        }`}
      >
        {isOpen ? (
          <span className="text-white text-xl">✕</span>
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[32rem] bg-gray-900 border border-gray-700 rounded-2xl flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Trust Agent
                </h3>
                <p className="text-[11px] text-gray-400">
                  Agency Trust & Transparency AI
                </p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-gray-300 ${
                    msg.role === "user"
                      ? "bg-blue-600/20 border border-blue-800/50"
                      : "bg-gray-800/50 border border-gray-700/50"
                  }`}
                >
                  {msg.role === "assistant"
                    ? renderMarkdown(msg.content)
                    : <p className="text-sm">{msg.content}</p>}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-gray-400">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about agency trust..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
