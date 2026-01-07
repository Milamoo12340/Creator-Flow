import React, { createContext, useContext, useState, useEffect } from "react";

interface ConfigContextType {
  activeModel: string;
  temperature: number;
  osintTools: {
    torbot: boolean;
    onionscan: boolean;
    wayback: boolean;
    dorks: boolean;
  };
  systemPrompt: string;
  updateConfig: (updates: Partial<ConfigContextType>) => void;
  toggleTool: (tool: keyof ConfigContextType['osintTools']) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfigContextType>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("veritas_config") : null;
    const initial = saved ? JSON.parse(saved) : {};
    
    return {
      activeModel: initial.activeModel || "gpt-4o",
      temperature: 75,
      osintTools: {
        torbot: true,
        onionscan: true,
        wayback: true,
        dorks: true,
      },
      systemPrompt: initial.systemPrompt || "You are VERITAS, a deeply personalized AI assistant whose mission is to uncover hidden knowledge, verify facts, and provide evidence-based answers.",
      updateConfig: () => {},
      toggleTool: () => {},
    };
  });

  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      updateConfig: (updates) => {
        setConfig((curr) => {
          const next = { ...curr, ...updates };
          if (typeof window !== 'undefined') {
            localStorage.setItem("veritas_config", JSON.stringify({
              activeModel: next.activeModel,
              systemPrompt: next.systemPrompt
            }));
          }
          return next;
        });
      },
      toggleTool: (tool) => {
        setConfig((curr) => ({
          ...curr,
          osintTools: {
            ...curr.osintTools,
            [tool]: !curr.osintTools[tool],
          },
        }));
      },
    }));
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
}
