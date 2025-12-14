import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GlitchHeader } from "@/components/GlitchHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fingerprint, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AuthPage() {
  const [, setLocation] = useLocation();
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsAuthenticating(true);
    setError(false);

    // Mock authentication delay
    setTimeout(() => {
      // Accept any code for prototype, or empty
      setIsAuthenticating(false);
      setLocation("/terminal");
    }, 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] opacity-10 pointer-events-none">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-primary/20" />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center relative bg-black/50 backdrop-blur-sm animate-pulse">
               <Fingerprint className="w-10 h-10 text-primary" />
               <div className="absolute inset-0 rounded-full border border-primary/50 animate-[spin_3s_linear_infinite]" />
               <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_5s_linear_infinite_reverse]" />
            </div>
          </div>
          <GlitchHeader text="VERITAS OS" size="xl" className="justify-center text-primary" />
          <p className="text-muted-foreground font-mono tracking-widest text-xs">
            SECURE ACCESS TERMINAL // V.9.0.1
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-black/40 p-8 border border-primary/20 rounded-lg backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input 
                type="password"
                placeholder="ENTER ACCESS KEY"
                className="pl-9 bg-black/50 border-primary/30 font-mono text-center tracking-[0.5em] text-primary placeholder:tracking-normal focus:border-primary transition-all h-12"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary font-mono tracking-wider transition-all"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <span className="flex items-center gap-2 animate-pulse">
                <ShieldCheck className="w-4 h-4" /> VERIFYING BIOMETRICS...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                AUTHENTICATE <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
          
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-4 border-t border-white/5">
             <span>ID: ANONYMOUS</span>
             <span>ENCRYPTION: 4096-BIT</span>
          </div>
        </form>
      </motion.div>

      {/* Footer status */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
         <p className="text-[10px] font-mono text-primary/40">
           UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE <br/>
           ALL ATTEMPTS ARE LOGGED AND TRACED
         </p>
      </div>
    </div>
  );
}
