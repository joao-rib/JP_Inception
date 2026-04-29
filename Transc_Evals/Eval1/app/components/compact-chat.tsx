"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  id: string;
  username: string;
  text: string;
  sentAt: string;
  system?: boolean;
};

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

interface CompactChatProps {
  maxHeight?: string;
  connectedUsers: number;
  status: "connecting" | "connected" | "disconnected";
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<boolean>;
}

export default function CompactChat({ maxHeight = "max-h-96", connectedUsers, status, messages, onSendMessage }: CompactChatProps) {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canSend = useMemo(() => {
    return status === "connected" && draft.trim().length > 0 && !isSending;
  }, [draft, isSending, status]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void (async () => {
      const messageText = draft.trim();

      if (!messageText) {
        return;
      }

      setIsSending(true);
      const sent = await onSendMessage(messageText);
      setIsSending(false);

      if (sent) {
        setDraft("");
      }
    })();
  };

  return (
    <div className="flex flex-col rounded-2xl border border-black/10 bg-background dark:border-white/15 overflow-hidden">
      <div className="border-b border-black/10 bg-background/50 px-4 py-2 dark:border-white/15">
        <h3 className="font-semibold text-xs">Match Chat</h3>
        <p className="text-xs text-foreground/70">{connectedUsers}/2 connected</p>
      </div>

      <div className={`${maxHeight} space-y-1 overflow-y-auto p-2`}>
        {messages.length === 0 && (
          <p className="text-xs text-foreground/70 p-1">No messages yet.</p>
        )}

        {messages.map((message) => (
          <div key={message.id} className="rounded px-2 py-1 text-xs bg-gray-50 dark:bg-white/5">
            <div className="flex items-center justify-between gap-2">
              <strong className="text-xs font-semibold">{message.username}</strong>
              <span className="text-xs text-foreground/60">{formatTime(message.sentAt)}</span>
            </div>
            {message.text && <p className="mt-1 break-words text-xs">{message.text}</p>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-black/10 dark:border-white/15 p-2 space-y-1">
        <div className="flex gap-1">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="flex-1 rounded px-2 py-1 text-xs border border-black/10 bg-background outline-none focus:ring-1 focus:ring-foreground/20 dark:border-white/15"
            placeholder="Say hi..."
            maxLength={200}
            disabled={status !== "connected"}
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded px-2 py-1 text-xs font-medium border border-black/10 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
          >
            send
          </button>
        </div>
      </form>
    </div>
  );
}
