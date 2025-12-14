import { GlitchHeader } from "@/components/GlitchHeader";
import { motion } from "framer-motion";

export function NetworkPage() {
  // Generate some random nodes for the visualization
  const nodes = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 5,
  }));

  return (
    <div className="h-full w-full p-4 lg:p-8 relative overflow-hidden">
      <div className="relative z-10 mb-8">
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

      <div className="w-full h-[60vh] border border-primary/20 rounded-md bg-black/40 backdrop-blur-sm relative overflow-hidden">
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
  );
}
