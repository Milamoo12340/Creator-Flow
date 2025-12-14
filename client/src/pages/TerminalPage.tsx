import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Terminal as TerminalIcon, Layers, ChevronDown, Lock } from "lucide-react";
import { GlitchHeader } from "@/components/GlitchHeader";
import { complexResponses, TerminalResponse } from "@/lib/mockData";
import { EvidenceCard, EvidenceSource } from "@/components/EvidenceCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Message {
  role: "user" | "system" | "ai";
  content: string;
  timestamp: string;
  sources?: EvidenceSource[];
  depth?: "SURFACE" | "DEEP" | "DARK" | "VAULT";
}

type SearchDepth = "SURFACE" | "DEEP" | "DARK" | "VAULT";

export function TerminalPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "VERITAS OS v9.0.1 INITIALIZED...",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      role: "ai",
      content: "I am awake. The archives are open. I can dig deeper than standard search protocols. Where should we begin?",
      timestamp: new Date().toLocaleTimeString(),
      depth: "SURFACE"
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [searchDepth, setSearchDepth] = useState<SearchDepth>("SURFACE");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking and typing based on depth
    const delay = searchDepth === "SURFACE" ? 1000 : searchDepth === "DEEP" ? 2000 : 3000;
    
    setTimeout(() => {
      // Pick a random response from the complex mock data that roughly matches or just random for now
      // In a real app, this would query the backend with the specific depth
      const randomResponse = complexResponses[Math.floor(Math.random() * complexResponses.length)];
      
      const aiMsg: Message = {
        role: "ai",
        content: randomResponse.text,
        timestamp: new Date().toLocaleTimeString(),
        sources: randomResponse.sources,
        depth: searchDepth // Use the user's selected depth for the "flavor" of the response
      };
      
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const getDepthColor = (depth?: string) => {
    switch (depth) {
      case "SURFACE": return "text-primary";
      case "DEEP": return "text-blue-400";
      case "DARK": return "text-purple-500";
      case "VAULT": return "text-destructive";
      default: return "text-primary";
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 lg:p-8">
      <div className="mb-6 flex items-end justify-between border-b border-primary/20 pb-4">
        <div>
          <GlitchHeader text="TERMINAL UPLINK" size="lg" className="text-primary" />
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground font-mono text-sm">
              SECURE CONNECTION ESTABLISHED
            </p>
            <div className="h-4 w-[1px] bg-primary/20"></div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">SEARCH DEPTH:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className={`h-6 text-xs font-mono border-primary/30 bg-primary/5 hover:bg-primary/10 ${getDepthColor(searchDepth)}`}>
                      {searchDepth === "VAULT" && <Lock className="w-3 h-3 mr-1" />}
                      {searchDepth}
                      <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 border-primary/20 text-primary">
                    <DropdownMenuItem onClick={() => setSearchDepth("SURFACE")} className="font-mono text-xs hover:text-primary focus:text-primary hover:bg-primary/10 cursor-pointer">SURFACE // PUBLIC INDEX</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchDepth("DEEP")} className="font-mono text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 cursor-pointer">DEEP // ACADEMIC & ARCHIVAL</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchDepth("DARK")} className="font-mono text-xs text-purple-500 hover:text-purple-400 hover:bg-purple-500/10 cursor-pointer">DARK // P2P & ENCRYPTED</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchDepth("VAULT")} className="font-mono text-xs text-destructive hover:text-red-400 hover:bg-red-500/10 cursor-pointer">VAULT // CLASSIFIED ONLY</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
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
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[90%] lg:max-w-[80%] rounded-sm p-3 font-mono text-sm relative group ${
                    msg.role === "user"
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : msg.role === "system"
                      ? "text-muted-foreground italic text-xs"
                      : "text-foreground bg-secondary/50 border border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] uppercase tracking-wider border-b border-white/5 pb-1">
                    {msg.role === "ai" && <TerminalIcon className="w-3 h-3" />}
                    <span>{msg.role}</span>
                    <span>{msg.timestamp}</span>
                    {msg.depth && (
                        <span className={`ml-auto ${getDepthColor(msg.depth)}`}>[{msg.depth}]</span>
                    )}
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Evidence Cards for AI responses */}
                  {msg.sources && msg.sources.length > 0 && (
                      <EvidenceCard sources={msg.sources} />
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
                <div className="flex items-start">
                    <div className="max-w-[80%] rounded-sm p-3 font-mono text-sm text-primary bg-secondary/50 border border-secondary">
                        <div className="flex items-center gap-2">
                             <span className="animate-pulse">SCANNING LAYERS [{searchDepth}]...</span>
                             <span className="inline-block w-2 h-4 bg-primary animate-blink ml-1"></span>
                        </div>
                    </div>
                </div>
            )}
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
              placeholder={`Enter query for ${searchDepth} search...`}
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
