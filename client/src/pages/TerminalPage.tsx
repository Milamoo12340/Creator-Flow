import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Terminal as TerminalIcon, Layers, ChevronDown, Lock, ShieldCheck, ArrowDownCircle } from "lucide-react";
import { GlitchHeader } from "@/components/GlitchHeader";
import { complexResponses, TerminalResponse, tieredTopics } from "@/lib/mockData";
import { EvidenceCard, EvidenceSource } from "@/components/EvidenceCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Message {
  role: "user" | "system" | "ai";
  content: string;
  timestamp: string;
  sources?: EvidenceSource[];
  depth?: "SURFACE" | "DEEP" | "DARK" | "VAULT";
  relatedTopicId?: string;
  nextDepth?: "DEEP" | "DARK" | "VAULT";
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
  const [thinkingLog, setThinkingLog] = useState("SCANNING LAYERS...");
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

    const lowerInput = userMsg.content.toLowerCase();
    
    // Simple keyword matching to simulate the AI finding the right topic
    let topicId = "";
    if (lowerInput.includes("mind") || lowerInput.includes("mkultra") || lowerInput.includes("cia")) topicId = "mkultra";
    else if (lowerInput.includes("ufo") || lowerInput.includes("uap") || lowerInput.includes("alien")) topicId = "uap";
    else if (lowerInput.includes("surveillance") || lowerInput.includes("snowden") || lowerInput.includes("spy")) topicId = "surveillance";

    const delay = searchDepth === "SURFACE" ? 1000 : searchDepth === "DEEP" ? 2000 : 3000;
    
    // Simulate tool activity logs
    const activeTools = [
      "TorBot: Crawling .onion indices...",
      "OnionScan: Verifying host integrity...",
      "WaybackPy: Checking archival snapshots...",
      "DorkScanner: Querying public file directories..."
    ];
    
    // Randomly pick a tool log to show in the "typing" state
    const toolLog = activeTools[Math.floor(Math.random() * activeTools.length)];
    
    setThinkingLog(toolLog); // We need to add this state

    setTimeout(() => {
      let response: TerminalResponse;

      if (topicId && tieredTopics[topicId]) {
        // If we found a topic, use the user's selected depth, or fallback to available layers
        const topic = tieredTopics[topicId];
        // Ensure the requested depth exists, otherwise default to SURFACE
        response = topic.layers[searchDepth] || topic.layers["SURFACE"];
        response.related_topic_id = topicId; // Ensure we pass this through
      } else {
        // Fallback for unknown topics
         response = complexResponses[Math.floor(Math.random() * complexResponses.length)];
      }
      
      const aiMsg: Message = {
        role: "ai",
        content: response.text,
        timestamp: new Date().toLocaleTimeString(),
        sources: response.sources,
        depth: response.depth_level,
        relatedTopicId: response.related_topic_id,
        nextDepth: response.next_depth
      };
      
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleDigDeeper = (topicId: string, nextDepth: "DEEP" | "DARK" | "VAULT") => {
    setIsTyping(true);
    setSearchDepth(nextDepth); // Update UI state to reflect new depth

    setTimeout(() => {
       const topic = tieredTopics[topicId];
       const response = topic.layers[nextDepth];

       const aiMsg: Message = {
        role: "ai",
        content: response.text,
        timestamp: new Date().toLocaleTimeString(),
        sources: response.sources,
        depth: response.depth_level,
        relatedTopicId: topicId,
        nextDepth: response.next_depth
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
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
                        <span className={`ml-auto font-bold ${getDepthColor(msg.depth)}`}>[{msg.depth}]</span>
                    )}
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Evidence Cards for AI responses */}
                  {msg.sources && msg.sources.length > 0 && (
                      <EvidenceCard sources={msg.sources} />
                  )}

                  {/* DIG DEEPER BUTTON */}
                  {msg.nextDepth && msg.relatedTopicId && (
                     <div className="mt-4 pt-2 border-t border-dashed border-white/10">
                        <Button 
                          onClick={() => handleDigDeeper(msg.relatedTopicId!, msg.nextDepth!)}
                          variant="outline" 
                          size="sm"
                          className={`w-full border-dashed bg-transparent hover:bg-secondary/80 h-8 text-xs font-mono uppercase tracking-widest transition-all ${getDepthColor(msg.nextDepth)} border-opacity-30`}
                        >
                          <ArrowDownCircle className="w-3 h-3 mr-2" />
                          Decrypt Layer: {msg.nextDepth}
                        </Button>
                     </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
                <div className="flex items-start">
                    <div className="max-w-[80%] rounded-sm p-3 font-mono text-sm text-primary bg-secondary/50 border border-secondary">
                        <div className="flex items-center gap-2">
                             <span className="animate-pulse">[{searchDepth}] {thinkingLog}</span>
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
