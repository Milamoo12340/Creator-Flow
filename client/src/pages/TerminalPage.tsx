import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useConfig } from "../lib/ConfigContext";

export function TerminalPage() {
  const configContext = useConfig();
  const { activeModel, systemPrompt, updateConfig } = configContext;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPersonality, setShowPersonality] = useState(false);
  const [isCloaked, setIsCloaked] = useState(false);
  const [securityStatus, setSecurityStatus] = useState("VULNERABLE");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("veritas_cloaked");
      if (saved === "true") setIsCloaked(true);
    }
  }, []);

  useEffect(() => {
    if (isCloaked) {
      setSecurityStatus("CLOAKED");
      const interval = setInterval(() => {
        const fingerprints = ["CHROME-99-WIN", "FIREFOX-88-LINUX", "SAFARI-15-MAC", "TOR-BROWSER-11"];
        console.log(`[VERITAS] Rotating fingerprint to: ${fingerprints[Math.floor(Math.random() * fingerprints.length)]}`);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setSecurityStatus(messages.length > 5 ? "MONITORED" : "VULNERABLE");
    }
  }, [isCloaked, messages]);

  const toggleCloaking = () => {
    const nextState = !isCloaked;
    setIsCloaked(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem("veritas_cloaked", nextState.toString());
    }
  };

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("veritas_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history removed from useEffect to avoid redundant triggers
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearHistory = () => {
    if (window.confirm("Clear all investigation records?")) {
      setMessages([]);
      localStorage.removeItem("veritas_chat_history");
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = { role: "user", text: input };
    setLoading(true);
    setMessages((msgs) => {
      const next = [...msgs, userMsg];
      if (typeof window !== 'undefined') {
        localStorage.setItem("veritas_chat_history", JSON.stringify(next));
      }
      return next;
    });
    const currentInput = input;
    setInput("");

    try {
      const { data } = await axios.post("/api/chat", {
        prompt: currentInput,
        messages: messages.map(m => ({ role: m.role, content: m.text })),
        systemPrompt: systemPrompt,
        model: activeModel
      });
      
      console.log("Terminal API Response:", data);
      const resultData = data.result || data;

      setMessages((msgs) => {
        const next = [
          ...msgs,
          {
            role: "assistant",
            text: resultData.text || resultData.content || (typeof resultData === 'string' ? resultData : JSON.stringify(resultData)),
            citations: resultData.citations || resultData.sources,
          },
        ];
        if (typeof window !== 'undefined') {
          localStorage.setItem("veritas_chat_history", JSON.stringify(next));
        }
        return next;
      });
    } catch (err: any) {
      console.error("Terminal API Error:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Unknown Error";
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", text: "[[ SYSTEM ERROR ]]\n" + errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-page min-h-screen bg-black text-green-500 p-4 font-mono">
      <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">VERITAS: Truth-Seeking AI Assistant</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] px-1 border ${isCloaked ? 'border-blue-500 text-blue-500' : 'border-red-900 text-red-900'} font-bold`}>
              STATUS: {securityStatus}
            </span>
            <p className="text-green-700 text-sm">
              <strong>Mission:</strong> Uncover hidden knowledge, cite evidence, and dig through layers of information.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={toggleCloaking}
            className={`text-[10px] border px-2 py-1 transition-colors ${isCloaked ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 'border-green-900 text-green-700 hover:bg-green-900/20'}`}
          >
            {isCloaked ? "CLOAKING: ON" : "ACTIVATE CLOAK"}
          </button>
          <button 
            onClick={() => setShowPersonality(!showPersonality)}
            className="text-[10px] border border-green-900 px-2 py-1 hover:bg-green-900/20"
          >
            {showPersonality ? "CLOSE CORE" : "EDIT CORE"}
          </button>
          <button 
            onClick={clearHistory}
            className="text-[10px] border border-red-900/50 text-red-900/50 px-2 py-1 hover:bg-red-900/10"
          >
            PURGE SESSION
          </button>
        </div>
      </header>

      {showPersonality && (
        <div className="mb-6 border border-green-500/30 p-4 bg-green-500/5 rounded">
          <label className="block text-[10px] uppercase tracking-tighter mb-2 opacity-50">Core Personality / System Logic</label>
          <textarea 
            value={systemPrompt}
            onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
            className="w-full h-32 bg-black/50 border border-green-900 text-green-500 text-xs p-2 outline-none focus:border-green-500"
          />
          <div className="mt-2 flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-[10px] uppercase opacity-50 block mb-1">Active Model</label>
              <select 
                value={activeModel}
                onChange={(e) => updateConfig({ activeModel: e.target.value })}
                className="bg-black border border-green-900 text-green-500 text-[10px] p-1 w-full"
              >
                <optgroup label="Supported Models">
                  <option value="gpt-4o">GPT-4o (Standard)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                  <option value="o1">o1 (Deep Reasoning)</option>
                </optgroup>
                <optgroup label="External (Coming Soon)">
                  <option value="huggingface" disabled>HuggingFace Spaces</option>
                  <option value="ollama" disabled>Local Ollama</option>
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setShowPersonality(false);
                }}
                className="text-[10px] border border-green-500 text-green-500 px-4 py-1 hover:bg-green-500/20 font-bold uppercase tracking-widest"
              >
                SAVE CORE
              </button>
              <div className="text-[8px] text-green-900 italic text-right">Instant Persistence</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="chat-window h-[75vh] overflow-y-auto mb-4 border border-green-900 p-4 rounded bg-black/50 scrollbar-thin scrollbar-thumb-green-900 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-6 ${msg.role === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
            <div className="flex gap-2">
              <span className="font-bold opacity-70">[{msg.role.toUpperCase()}]:</span>
              <div className="flex-1 whitespace-pre-wrap leading-relaxed tracking-wide">
                {msg.text}
              </div>
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

      <form onSubmit={sendMessage} className="flex gap-2 items-center border-t border-green-900/50 pt-4">
        <span className="text-green-500 font-bold">{">"}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e as any);
            }
          }}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-green-500 placeholder-green-900 py-2"
          placeholder="Enter query for deep-layer analysis..."
          disabled={loading}
          autoFocus
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="px-4 py-1 border border-green-900 text-green-700 hover:text-green-500 hover:border-green-500 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          {loading ? "BUSY" : "EXECUTE"}
        </button>
      </form>
    </div>
  );
}
