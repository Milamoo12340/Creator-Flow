import { mockDocuments } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlitchHeader } from "@/components/GlitchHeader";
import { FileText, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

export function ArchivesPage() {
  return (
    <div className="h-full w-full p-4 lg:p-8 overflow-y-auto">
      <div className="mb-8">
        <GlitchHeader text="DECLASSIFIED ARCHIVES" size="lg" />
        <p className="text-muted-foreground font-mono mt-2 max-w-2xl">
          WARNING: Some records in this database are fragmented or partially redacted. 
          Accessing restricted files may trigger security protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockDocuments.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full bg-card/40 border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors group overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge 
                    variant={doc.clearance === "TOP SECRET" ? "destructive" : "outline"}
                    className="font-mono text-[10px] tracking-wider mb-2"
                  >
                    {doc.clearance}
                  </Badge>
                  {doc.clearance === "TOP SECRET" ? (
                    <Lock className="w-4 h-4 text-destructive opacity-70" />
                  ) : (
                    <Unlock className="w-4 h-4 text-primary opacity-70" />
                  )}
                </div>
                <CardTitle className="font-display text-lg group-hover:text-primary transition-colors">
                  {doc.title}
                </CardTitle>
                <div className="text-xs font-mono text-muted-foreground flex gap-4 mt-1">
                  <span>ID: {doc.id}</span>
                  <span>DATE: {doc.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed mb-4 relative">
                  {doc.summary}
                  {/* Decorative redact lines */}
                  <span className="absolute -bottom-6 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></span>
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {doc.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold text-primary/60 bg-primary/5 px-2 py-1 rounded-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30 rounded-tr-md group-hover:border-primary transition-colors"></div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
