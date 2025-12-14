import { GlitchHeader } from "@/components/GlitchHeader";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const toolLogs = [
  { tool: "TorBot", action: "Crawling http://akjdfh...onion", status: "SUCCESS", latency: "240ms" },
  { tool: "OnionScan", action: "Vulnerability check on node 88", status: "WARNING", latency: "120ms" },
  { tool: "WaybackPy", action: "Retrieving snapshot: cia.gov/readingroom", status: "ARCHIVED", latency: "800ms" },
  { tool: "Gorks", action: "Google Dork: 'filetype:pdf top secret'", status: "FOUND 12", latency: "450ms" },
  { tool: "TorBot", action: "Indexing hidden wiki mirror", status: "PENDING", latency: "..." },
  { tool: "Hysteria", action: "Bypassing DPI packet inspection", status: "ACTIVE", latency: "50ms" },
  { tool: "ArchiveBox", action: "Snapshotting evidence source #442", status: "SAVING", latency: "1.2s" },
];

export function NetworkPage() {
  // Generate some random nodes for the visualization
  const nodes = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 5,
  }));

  const [logs, setLogs] = useState(toolLogs);

  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate logs to simulate live feed
      setLogs(prev => {
        const newLogs = [...prev];
        const first = newLogs.shift();
        if (first) newLogs.push(first);
        return newLogs;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full p-4 lg:p-8 relative overflow-hidden flex flex-col lg:flex-row gap-6">
      
      {/* LEFT PANEL - MAP */}
      <div className="flex-1 relative flex flex-col min-h-[50vh]">
        <div className="relative z-10 mb-4">
          <GlitchHeader text="GLOBAL SURVEILLANCE MAP" size="lg" />
          <p className="text-muted-foreground font-mono mt-2">
            Tracking active signal intercepts and anomalous data packets.
          </p>
        </div>

        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
           {/* Simple CSS-based radar sweep */}
           <div className="w-[600px] h-[600px] border border-primary rounded-full relative animate-[spin_10s_linear_infinite]">
              <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-primary to-transparent origin-left rotate-[-90deg]"></div>
           </div>
        </div>

        <div className="flex-1 border border-primary/20 rounded-md bg-black/40 backdrop-blur-sm relative overflow-hidden">
           <div className="absolute top-4 right-4 z-20">
               <div className="flex flex-col gap-1 text-[10px] font-mono text-primary">
                   <span>NODES_ACTIVE: 1,420</span>
                   <span>TRAFFIC_VOL: 44.2 TB/s</span>
                   <span>THREAT_LEVEL: ELEVATED</span>
               </div>
           </div>

           {/* Visual Nodes */}
           {nodes.map((node, i) => (
               <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/40 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      width: node.size,
                      height: node.size,
                  }}
                  animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                  }}
               />
           ))}

           {/* Grid Lines */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      </div>

      {/* RIGHT PANEL - LIVE TOOL FEED */}
      <div className="w-full lg:w-96 h-[300px] lg:h-auto border-l border-primary/20 bg-black/60 backdrop-blur-md flex flex-col">
        <div className="p-4 border-b border-primary/20">
          <h3 className="font-display font-bold text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"/>
            LIVE OPS FEED
          </h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {logs.map((log, i) => (
              <motion.div 
                key={i} 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-xs p-2 rounded bg-white/5 border border-white/5 flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">[{log.tool}]</span>
                  <Badge variant="outline" className="text-[9px] h-4 border-primary/30 text-primary/70">{log.status}</Badge>
                </div>
                <span className="text-muted-foreground truncate">{log.action}</span>
                <span className="text-[9px] text-muted-foreground/50 text-right">{log.latency}</span>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

    </div>
  );
}
