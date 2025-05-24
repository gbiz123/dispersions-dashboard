import React, { createContext, useContext, useState } from 'react';
import { AermodRequest } from '../types/api';

interface Ctx {
  formData: Partial<AermodRequest>;
  update: <K extends keyof AermodRequest>(
    k: K,
    v: AermodRequest[K]
  ) => void;
}

const C = createContext({} as Ctx);
export const useAermod = () => useContext(C);

export const AermodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, set] = useState<Partial<AermodRequest>>({});

  const update = <K extends keyof AermodRequest>(
    key: K,
    value: AermodRequest[K]
  ) => set(prev => ({ ...prev, [key]: value }));

  return <C.Provider value={{ formData, update }}>{children}</C.Provider>;
};