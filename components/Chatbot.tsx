"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Size nào phù hợp với tôi?",
  "Pin dùng được bao lâu?",
  "Khác gì Oura Ring?",
  "Có chống nước không?",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Xin chào! Tôi có thể tư vấn về AuraRing — size, tính năng, hoặc so sánh. Bạn muốn hỏi gì?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(true); // assume true, flip on 503
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, msgs]);

  async function send(text = input.trim()) {
    if (!text || loading) return;
    setInput("");
    const newMsgs: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(newMsgs);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (res.status === 503) {
        setHasKey(false);
        setMsgs([...newMsgs, { role: "assistant", content: "Chatbot chưa được cấu hình API key. Vui lòng thêm ANTHROPIC_API_KEY vào .env.local để kích hoạt." }]);
      } else if (!res.ok || data.error) {
        setMsgs([...newMsgs, { role: "assistant", content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại." }]);
      } else {
        setMsgs([...newMsgs, { role: "assistant", content: data.content }]);
      }
    } catch {
      setMsgs([...newMsgs, { role: "assistant", content: "Không kết nối được. Kiểm tra lại mạng." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const userMsgCount = msgs.filter((m) => m.role === "user").length;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[calc(100vw-40px)] sm:w-[360px] max-h-[520px] flex flex-col rounded-2xl bg-bone dark:bg-midnight2 border border-midnight/10 dark:border-bone/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-midnight/5 dark:border-bone/5 bg-midnight dark:bg-midnight2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-aqua/20 flex items-center justify-center">
                  <span className="text-aqua text-xs font-semibold">AR</span>
                </div>
                <div>
                  <p className="text-bone text-sm font-medium leading-none">AuraRing AI</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-none">
                    {loading ? "Đang trả lời…" : "Trợ lý tư vấn"}
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Đóng chat"
                className="text-slate-400 hover:text-bone transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                    m.role === "user"
                      ? "bg-aqua text-midnight rounded-br-sm"
                      : "bg-midnight/5 dark:bg-bone/5 text-midnight dark:text-bone rounded-bl-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-midnight/5 dark:bg-bone/5 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              {/* Suggestions — only before user sends first message */}
              {userMsgCount === 0 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border border-midnight/10 dark:border-bone/10 text-slate-500 hover:border-aqua hover:text-aqua transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-midnight/5 dark:border-bone/5">
              <div className="flex items-end gap-2 bg-midnight/5 dark:bg-bone/5 rounded-xl px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={loading || !hasKey}
                  placeholder={hasKey ? "Hỏi về AuraRing…" : "Cần cấu hình API key"}
                  rows={1}
                  className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-slate-400 max-h-24 leading-relaxed"
                  style={{ overflowY: "auto" }}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  aria-label="Gửi"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-aqua text-midnight disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0 mb-0.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-slate-300 dark:text-slate-600 text-center mt-1.5">
                Powered by Claude Haiku
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng chat tư vấn" : "Mở chat tư vấn"}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-13 h-13 flex items-center justify-center rounded-full bg-midnight dark:bg-aqua shadow-lg"
        style={{ width: 52, height: 52 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className="text-bone dark:text-midnight">
              <path d="M18 6 6 18M6 6l12 12"/>
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              className="text-bone dark:text-midnight">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </motion.svg>
          )}
        </AnimatePresence>
        {/* Unread dot */}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-aqua border-2 border-bone dark:border-midnight" />
        )}
      </motion.button>
    </div>
  );
}
