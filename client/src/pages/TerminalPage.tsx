import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export function TerminalPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: "user", text: input };
    setLoading(true);
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");

    try {
      const { data } = await axios.post("/api/chat", {
        prompt: input,
        messages: messages.map(m => ({ role: m.role, content: m.text }))
      });
      
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          text: data.content || data.text || "No response received",
          citations: data.citations,
        },
      ]);
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", text: "Error: " + (err.response?.data?.message || err.message) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-page min-h-screen bg-black text-green-500 p-4 font-mono">
      <header className="mb-8 border-b border-green-900 pb-4">
        <h1 className="text-2xl font-bold">VERITAS: Truth-Seeking AI Assistant</h1>
        <p className="text-green-700">
          <strong>Mission:</strong> Uncover hidden knowledge, cite evidence, and dig through layers of information.
        </p>
      </header>
      
      <div className="chat-window h-[60vh] overflow-y-auto mb-4 border border-green-900 p-4 rounded bg-black/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
            <div className="flex gap-2">
              <span className="font-bold">[{msg.role.toUpperCase()}]:</span>
              <div className="flex-1 whitespace-pre-wrap">{msg.text}</div>
            </div>
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-2 ml-8 text-xs text-green-700">
                <div className="font-bold underline mb-1">Sources:</div>
                <ul className="list-disc list-inside">
                  {msg.citations.map((c: any, i: number) => (
                    <li key={i}>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {c.title || c.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-yellow-600 animate-pulse">[VERITAS IS THINKING...]</div>}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <span className="text-green-500 font-bold">{">"}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-green-500 placeholder-green-900"
          placeholder="Enter query for deep-layer analysis..."
          disabled={loading}
          autoFocus
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="hidden"
        >
          Execute
        </button>
      </form>
    </div>
  );
}
