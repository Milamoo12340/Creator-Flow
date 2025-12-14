import { Link, useLocation } from "wouter";
import { Terminal, Database, Network, ShieldAlert, Cpu, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Terminal, label: "TERMINAL" },
    { href: "/archives", icon: Database, label: "ARCHIVES" },
    { href: "/network", icon: Network, label: "NETWORK" },
    { href: "/config", icon: Settings, label: "SYSTEM" },
  ];

  return (
    <div className="w-20 lg:w-64 h-screen border-r border-border bg-card/50 backdrop-blur-sm flex flex-col z-20 relative">
      <div className="p-6 flex items-center gap-3 border-b border-border/50">
        <ShieldAlert className="w-8 h-8 text-primary animate-pulse" />
        <span className="font-display font-bold text-xl tracking-widest hidden lg:block text-primary">
          VERITAS
        </span>
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-sm transition-all duration-300 group hover:bg-primary/10",
                location === item.href
                  ? "bg-primary/20 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm tracking-wider hidden lg:block">
                {item.label}
              </span>
            </a>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Cpu className="w-4 h-4" />
          <span className="hidden lg:block font-mono">SYS.ONLINE</span>
          <span className="hidden lg:block w-2 h-2 rounded-full bg-primary animate-pulse ml-auto" />
        </div>
      </div>
    </div>
  );
}
