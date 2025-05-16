import React, { createContext, useContext, useState } from 'react';
import { AersurfaceRequest } from '../types/api';

interface Ctx {
  formData: Partial<AersurfaceRequest>;
  update: <K extends keyof AersurfaceRequest>(
    k: K,
    v: AersurfaceRequest[K]
  ) => void;
}

const C = createContext({} as Ctx);
export const useAersurface = () => useContext(C);

export const AersurfaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, set] = useState<Partial<AersurfaceRequest>>({});

  const update = <K extends keyof AersurfaceRequest>(
    key: K,
    value: AersurfaceRequest[K]
  ) => set(prev => ({ ...prev, [key]: value }));

  return <C.Provider value={{ formData, update }}>{children}</C.Provider>;
};