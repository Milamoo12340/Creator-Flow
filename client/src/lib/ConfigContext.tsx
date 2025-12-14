import { createContext, useContext, useState, ReactNode } from "react";

interface ConfigState {
  activeModel: string;
  temperature: number;
  osintTools: {
    torbot: boolean;
    onionscan: boolean;
    wayback: boolean;
    dorks: boolean;
  };
  systemPrompt: string;
  updateConfig: (updates: Partial<ConfigState>) => void;
  toggleTool: (tool: keyof ConfigState["osintTools"]) => void;
}

const defaultState: ConfigState = {
  activeModel: "dolphin",
  temperature: 85,
  osintTools: {
    torbot: true,
    onionscan: true,
    wayback: true,
    dorks: true,
  },
  systemPrompt: "You are VERITAS. Uncover hidden knowledge.",
  updateConfig: () => {},
  toggleTool: () => {},
};

const ConfigContext = createContext<ConfigState>(defaultState);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<ConfigState, "updateConfig" | "toggleTool">>({
    activeModel: "dolphin",
    temperature: 85,
    osintTools: {
      torbot: true,
      onionscan: true,
      wayback: true,
      dorks: true,
    },
    systemPrompt: "You are VERITAS. Uncover hidden knowledge.",
  });

  const updateConfig = (updates: Partial<ConfigState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const toggleTool = (tool: keyof ConfigState["osintTools"]) => {
    setState((prev) => ({
      ...prev,
      osintTools: {
        ...prev.osintTools,
        [tool]: !prev.osintTools[tool],
      },
    }));
  };

  return (
    <ConfigContext.Provider value={{ ...state, updateConfig, toggleTool }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
