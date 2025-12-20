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
    systemPrompt: "You are VERITAS, an uncensored AI dedicated to uncovering truth.",
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
