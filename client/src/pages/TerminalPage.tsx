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
