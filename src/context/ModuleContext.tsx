import React, { createContext, useContext, useState } from 'react';

export type Module = 'AERSCREEN' | 'AERSURFACE';

interface Ctx {
  module: Module;
  toggle: () => void;
}

const C = createContext({} as Ctx);
export const useModule = () => useContext(C);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [module, setModule] = useState<Module>('AERSCREEN');
  const toggle = () => setModule(m => (m === 'AERSCREEN' ? 'AERSURFACE' : 'AERSCREEN'));
  return <C.Provider value={{ module, toggle }}>{children}</C.Provider>;
};