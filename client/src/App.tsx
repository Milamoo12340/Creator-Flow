import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import { TerminalPage } from "@/pages/TerminalPage";
import { ArchivesPage } from "@/pages/ArchivesPage";
import { NetworkPage } from "@/pages/NetworkPage";
import { ConfigPage } from "@/pages/ConfigPage";
import NotFound from "@/pages/not-found";
import bgImage from "@assets/generated_images/dark_abstract_cyber_network_with_data_streams.png";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TerminalPage} />
      <Route path="/archives" component={ArchivesPage} />
      <Route path="/network" component={NetworkPage} />
      <Route path="/config" component={ConfigPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden font-mono relative">
        {/* Global Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative z-10">
           <Router />
        </main>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
