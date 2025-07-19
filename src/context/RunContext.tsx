import React, { createContext, useContext, useState, useCallback } from 'react';

interface RunContextType {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  runId: string;
  setRunId: (id: string) => void;
}

const RunContext = createContext<RunContextType | undefined>(undefined);

export const RunProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [runId, setRunId] = useState<string>('');

  // Memoize the updateFormData function to prevent infinite loops
  const updateFormData = useCallback((section: string, data: any) => {
	console.log("formData updated in " + section)
	console.log(data)
    setFormData((prev: any) => ({
      ...prev,
      [section]: data
    }));
  }, []);

  return (
    <RunContext.Provider
      value={{
        formData,
        updateFormData,
        isRunning,
        setIsRunning,
        runId,
        setRunId,
      }}
    >
      {children}
    </RunContext.Provider>
  );
};

export const useRunContext = () => {
  const context = useContext(RunContext);
  if (!context) {
    throw new Error('useRunContext must be used within RunProvider');
  }
  return context;
};
