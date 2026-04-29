"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { GameMessage } from "./useChessSocket";

interface GameChatProps {
  messages: GameMessage[];
  isConnected: boolean;
  onSendMessage: (text: string, callback: (ack: { ok: boolean; error?: string }) => void) => void;
  username: string;
}

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function GameChat({
  messages,
  isConnected,
  onSendMessage,
  username,
}: GameChatProps) {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newly added messages.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const canSend = useMemo(() => {
    return isConnected && draft.trim().length > 0 && !isSending;
  }, [draft, isSending, isConnected]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const messageText = draft.trim();
    if (!messageText) return;

    setIsSending(true);
    setError("");

    onSendMessage(messageText, (ack) => {
      setIsSending(false);

      if (!ack?.ok) {
        setError(ack?.error ?? "Failed to send message");
        return;
      }

      setDraft("");
    });
  };

  return (
    <div className="flex flex-col rounded-2xl border border-black/10 bg-background dark:border-white/15 overflow-hidden">
      {/* Header */}
      <div className="border-b border-black/10 bg-background/50 px-4 py-3 dark:border-white/15">
        <h3 className="font-semibold text-sm">Game Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-64 space-y-2 overflow-y-auto p-3 max-h-96">
        {messages.length === 0 && (
          <p className="text-sm text-foreground/70">No messages in this game yet.</p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded px-3 py-2 text-xs ${
              message.username === username
                ? "bg-blue-100 dark:bg-blue-900/40"
                : "bg-gray-100 dark:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <strong className="text-xs font-semibold">{message.username}</strong>
              <span className="text-xs text-foreground/60">{formatTime(message.sentAt)}</span>
            </div>
            <p className="mt-1 break-words text-xs">{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-black/10 dark:border-white/15 p-3 space-y-2">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="flex-1 rounded px-3 py-2 text-xs border border-black/10 bg-background outline-none focus:ring-2 focus:ring-foreground/20 dark:border-white/15"
            placeholder="Message..."
            maxLength={200}
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded px-3 py-2 text-xs font-medium border border-black/10 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
          >
            send
          </button>
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-300">{error}</p>}
      </form>
    </div>
  );
}
