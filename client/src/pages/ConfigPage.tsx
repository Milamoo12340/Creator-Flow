import { useState } from "react";
import { GlitchHeader } from "@/components/GlitchHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Network, Database, Shield, Terminal, Save, RefreshCw } from "lucide-react";
import { useConfig } from "@/lib/ConfigContext";

export function ConfigPage() {
  const [trainingStatus, setTrainingStatus] = useState<"IDLE" | "TRAINING" | "COMPLETE">("IDLE");
  const { activeModel, temperature, osintTools, updateConfig, toggleTool, systemPrompt } = useConfig();

  const handleTrain = () => {
    setTrainingStatus("TRAINING");
    setTimeout(() => setTrainingStatus("COMPLETE"), 3000);
  };

  return (
    <div className="h-full w-full p-4 lg:p-8 overflow-y-auto pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <GlitchHeader text="SYSTEM CONFIGURATION" size="lg" />
          <p className="text-muted-foreground font-mono mt-2">
            Model weights, OSINT modules, and cognitive parameters.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="font-mono border-primary/50 text-primary animate-pulse">
            BUILD MODE: ACTIVE
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="bg-black/40 border border-primary/20 p-1">
          <TabsTrigger value="models" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-mono">
            <Cpu className="w-4 h-4 mr-2" /> CORE MODELS
          </TabsTrigger>
          <TabsTrigger value="osint" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-mono">
            <Network className="w-4 h-4 mr-2" /> OSINT TOOLS
          </TabsTrigger>
          <TabsTrigger value="personality" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-mono">
            <Terminal className="w-4 h-4 mr-2" /> PERSONA
          </TabsTrigger>
        </TabsList>

        {/* AI MODELS TAB */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-primary flex items-center gap-2">
                  <Cpu className="w-5 h-5" /> Base LLM Selection
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  Select uncensored model architecture for inference.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">ACTIVE MODEL</Label>
                  <Select value={activeModel} onValueChange={(val) => updateConfig({ activeModel: val })}>
                    <SelectTrigger className="bg-black/20 border-primary/30 font-mono text-primary">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-primary/30 text-primary">
                      <SelectItem value="dolphin">Dolphin 2.9.1 (Llama 3 70B) // UNCENSORED</SelectItem>
                      <SelectItem value="wizard">WizardLM Uncensored 13B</SelectItem>
                      <SelectItem value="hermes">Nous Hermes 2 - SOLAR</SelectItem>
                      <SelectItem value="grok">Grok-1 (Open Weights)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between">
                    <Label className="font-mono text-xs">TEMPERATURE (CREATIVITY)</Label>
                    <span className="font-mono text-xs text-primary">{temperature}</span>
                  </div>
                  <Slider 
                    value={[temperature]} 
                    onValueChange={(val) => updateConfig({ temperature: val[0] })}
                    max={100} 
                    step={1} 
                    className="py-2" 
                  />
                  
                  <div className="flex justify-between">
                    <Label className="font-mono text-xs">CONTEXT WINDOW</Label>
                    <span className="font-mono text-xs text-primary">128k</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} step={1} className="py-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display text-primary flex items-center gap-2">
                  <Database className="w-5 h-5" /> Fine-Tuning Datasets
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  Upload archives for RAG and weight adjustment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-primary/20 rounded-md p-6 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors cursor-pointer group">
                  <Save className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="font-mono text-xs text-muted-foreground text-center">
                    DRAG & DROP .JSONL / .TXT / .PDF<br/>
                    <span className="text-primary/50">Supports Declassified Archives</span>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-sm border-l-2 border-primary">
                    <span className="font-mono text-xs">cia_reading_room_dump.jsonl</span>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">INDEXED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded-sm border-l-2 border-primary">
                    <span className="font-mono text-xs">wikileaks_cablegate_full.csv</span>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">INDEXED</Badge>
                  </div>
                </div>

                <Button 
                  onClick={handleTrain} 
                  disabled={trainingStatus !== "IDLE"}
                  className="w-full font-mono bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
                >
                  {trainingStatus === "IDLE" && <><RefreshCw className="w-4 h-4 mr-2" /> RETRAIN WEIGHTS</>}
                  {trainingStatus === "TRAINING" && "TRAINING IN PROGRESS..."}
                  {trainingStatus === "COMPLETE" && "TRAINING COMPLETE"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OSINT TOOLS TAB */}
        <TabsContent value="osint" className="space-y-6">
          <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-display text-primary flex items-center gap-2">
                <Network className="w-5 h-5" /> Active Search Modules
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                Enable/Disable specific scraping vectors.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between space-x-2 p-3 border border-white/5 rounded-md hover:border-primary/30 transition-colors">
                <div className="space-y-0.5">
                  <Label className="font-mono text-sm font-bold text-primary">TorBot</Label>
                  <p className="text-[10px] text-muted-foreground font-mono">Dark web crawler (.onion indexing)</p>
                </div>
                <Switch checked={osintTools.torbot} onCheckedChange={() => toggleTool("torbot")} />
              </div>
              <div className="flex items-center justify-between space-x-2 p-3 border border-white/5 rounded-md hover:border-primary/30 transition-colors">
                <div className="space-y-0.5">
                  <Label className="font-mono text-sm font-bold text-primary">OnionScan</Label>
                  <p className="text-[10px] text-muted-foreground font-mono">Vulnerability scanner for hidden services</p>
                </div>
                <Switch checked={osintTools.onionscan} onCheckedChange={() => toggleTool("onionscan")} />
              </div>
              <div className="flex items-center justify-between space-x-2 p-3 border border-white/5 rounded-md hover:border-primary/30 transition-colors">
                <div className="space-y-0.5">
                  <Label className="font-mono text-sm font-bold text-primary">WaybackPy</Label>
                  <p className="text-[10px] text-muted-foreground font-mono">Internet Archive / Wayback Machine API</p>
                </div>
                <Switch checked={osintTools.wayback} onCheckedChange={() => toggleTool("wayback")} />
              </div>
              <div className="flex items-center justify-between space-x-2 p-3 border border-white/5 rounded-md hover:border-primary/30 transition-colors">
                <div className="space-y-0.5">
                  <Label className="font-mono text-sm font-bold text-primary">Google Dorks</Label>
                  <p className="text-[10px] text-muted-foreground font-mono">Advanced search operators for public files</p>
                </div>
                <Switch checked={osintTools.dorks} onCheckedChange={() => toggleTool("dorks")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERSONA TAB */}
        <TabsContent value="personality" className="space-y-6">
          <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-display text-primary flex items-center gap-2">
                <Shield className="w-5 h-5" /> Cognitive Directives
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                Define the "Truth Speaker" behavior parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">SYSTEM PROMPT</Label>
                <textarea 
                  className="w-full h-40 bg-black/60 border border-primary/30 rounded-md p-3 font-mono text-xs text-foreground focus:outline-none focus:border-primary resize-none"
                  value={systemPrompt}
                  onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                />
              </div>
              
              <div className="space-y-4">
                 <Label className="font-mono text-xs">BEHAVIORAL OVERRIDES</Label>
                 <div className="flex items-center space-x-2">
                    <Switch id="censorship" checked={false} />
                    <Label htmlFor="censorship" className="font-mono text-xs">Standard Censorship Filters</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="hallucination" checked={true} />
                    <Label htmlFor="hallucination" className="font-mono text-xs">Strict Fact-Checking (Anti-Hallucination)</Label>
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
