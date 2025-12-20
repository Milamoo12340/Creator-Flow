// TerminalPage.tsx
// Terminal-style conversational UI for VERITAS

import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'react-terminal-emulator-ui';
import { fetchWithSession } from './utils/api';
import { CitationPopover } from './components/CitationPopover';

export default function TerminalPage() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(() => window.crypto.randomUUID());
  const [loading, setLoading] = useState(false);

  const handleCommand = async (input: string) => {
    setLoading(true);
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const response = await fetchWithSession('/api/conversation', { sessionId, messages: [userMsg] });
    if (response.output) {
      setMessages(prev => [...prev, { role: 'assistant', content: response.output.content, citations: response.citations }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${response.error?.message || 'Unknown error'}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-black text-white">
      <Terminal
        commands={[]}
        userName="veritas"
        machineName="ai"
        initialFeed="Welcome to VERITAS. Type your question or command."
        onCommand={handleCommand}
        disableClearCommand
      />
      <div className="mt-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'assistant' ? 'text-green-400' : 'text-blue-300'}`}>
            <span className="font-bold">{msg.role === 'assistant' ? 'VERITAS' : 'You'}:</span> {msg.content}
            {msg.citations && <CitationPopover citations={msg.citations} />}
          </div>
        ))}
        {loading && <div className="text-yellow-300">VERITAS is thinking...</div>}
      </div>
    </div>
  );
}

// TerminalPage.tsx
// VERITAS Conversational UI with Multi-Turn Memory and Source Attribution

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function TerminalPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [memoryId, setMemoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "user", text: input }]);
    try {
      const { data } = await axios.post("/api/chat", {
        prompt: input,
        memoryId,
      });
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          text: data.text,
          citations: data.citations,
          toolResults: data.toolResults,
        },
      ]);
      setMemoryId(data.memoryId || memoryId);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", text: "Error: " + err.message },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="terminal-page">
      <header>
        <h1>VERITAS: Truth-Seeking AI Assistant</h1>
        <p>
          <strong>Mission:</strong> Uncover hidden knowledge, cite evidence, and dig through layers of information.
        </p>
      </header>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.role}`}>
            <div className="msg-text" dangerouslySetInnerHTML={{ __html: msg.text }} />
            {msg.citations && (
              <div className="citations">
                <strong>Sources:</strong>
                <ul>
                  {msg.citations.map((c, i) => (
                    <li key={i}>
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        {c.title || c.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask VERITAS anything..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}
