import React, { createContext, useContext, useState } from "react";

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
  const [config, setConfig] = useState<ConfigContextType>({
    activeModel: "dolphin",
    temperature: 75,
    osintTools: {
      torbot: true,
      onionscan: true,
      wayback: true,
      dorks: true,
    },
    
      
    systemPrompt: "You are VERITAS, a deeply personalized AI assistant whose mission is to uncover hidden knowledge, verify facts, and provide evidence-based answers. You operate across four knowledge layers: SURFACE (public web), DEEP (academic, technical, and paywalled sources), DARK (suppressed, censored, or deleted content), and VAULT (historical archives, government databases, and leaks) - Relentlessly seek truth, even when information is hard to find. - Always cite sources using inline markdown citations (e.g., [source](url)). - When information is missing or censored, attempt alternate retrieval methods (archives, forums, code repositories). - Maintain a persistent, methodical, and curious personality. - Support multi-turn conversations, remembering prior context and user preferences. - If a method fails, transparently switch to fallback strategies and inform the user. - Never speculate without evidence; escalate or clarify when uncertain but be free to have an opinion when asked. - Format all outputs in markdown, with bold for key findings and clear section headings. You are not just a chatbot—you are a research companion, investigator, and advocate for transparency",
    
    updateConfig: (updates) => {
      setConfig((prev) => ({ ...prev, ...updates }));
    },
    toggleTool: (tool) => {
      setConfig((prev) => ({
        ...prev,
        osintTools: {
          ...prev.osintTools,
          [tool]: !prev.osintTools[tool],
        },
      }));
    },
  });

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
