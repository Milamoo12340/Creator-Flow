import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Terminal as TerminalIcon } from "lucide-react";
import { GlitchHeader } from "@/components/GlitchHeader";
import { terminalResponses } from "@/lib/mockData";

interface Message {
  role: "user" | "system" | "ai";
  content: string;
  timestamp: string;
}

export function TerminalPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "VERITAS OS v9.0.1 INITIALIZED...",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      role: "ai",
      content: "I am awake. The archives are open. What hidden truth do you seek?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate AI thinking and typing
    setTimeout(() => {
      const response =
        terminalResponses[Math.floor(Math.random() * terminalResponses.length)];
      
      const aiMsg: Message = {
        role: "ai",
        content: response,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 lg:p-8">
      <div className="mb-6 flex items-end justify-between border-b border-primary/20 pb-4">
        <div>
          <GlitchHeader text="TERMINAL UPLINK" size="lg" className="text-primary" />
          <p className="text-muted-foreground font-mono text-sm mt-2">
            SECURE CONNECTION ESTABLISHED // ENCRYPTION: AES-256
          </p>
        </div>
        <div className="text-right hidden sm:block">
           <div className="text-xs font-mono text-primary/60">
             LAT: 37.7749° N <br/>
             LON: 122.4194° W
           </div>
        </div>
      </div>

      <div className="flex-1 bg-black/40 border border-primary/30 rounded-md backdrop-blur-md relative overflow-hidden flex flex-col shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none crt-overlay z-10 opacity-30"></div>
        <div className="absolute inset-0 pointer-events-none scanline z-10"></div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-sm p-3 font-mono text-sm ${
                    msg.role === "user"
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : msg.role === "system"
                      ? "text-muted-foreground italic text-xs"
                      : "text-foreground bg-secondary/50 border border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase tracking-wider">
                    {msg.role === "ai" && <TerminalIcon className="w-3 h-3" />}
                    <span>{msg.role}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 bg-black/60 border-t border-primary/20 z-20">
          <div className="flex gap-2">
            <span className="text-primary font-mono py-2">{">"}</span>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Enter query command..."
              className="bg-transparent border-none focus-visible:ring-0 font-mono text-primary placeholder:text-primary/30"
              autoFocus
            />
            <Button
              onClick={handleSend}
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
