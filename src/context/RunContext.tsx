import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AerscreenRequest } from '../types/api';

interface RunContextType {
  runId: string | null;
  setRunId: (id: string | null) => void;
  formData: Partial<AerscreenRequest>;
  updateFormData: <K extends keyof AerscreenRequest>(section: K, data: AerscreenRequest[K]) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
}

const RunContext = createContext<RunContextType | undefined>(undefined);

export const RunProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [runId, setRunId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AerscreenRequest>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const updateFormData = <K extends keyof AerscreenRequest>(
    section: K,
    data: AerscreenRequest[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <RunContext.Provider
      value={{
        runId,
        setRunId,
        formData,
        updateFormData,
        isRunning,
        setIsRunning
      }}
    >
      {children}
    </RunContext.Provider>
  );
};

export const useRunContext = (): RunContextType => {
  const context = useContext(RunContext);
  if (context === undefined) {
    throw new Error('useRunContext must be used within a RunProvider');
  }
  return context;
};