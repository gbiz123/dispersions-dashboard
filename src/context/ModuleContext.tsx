import React, { createContext, useContext, useState } from 'react';

export type Module = 'AERSCREEN' | 'AERSURFACE' | 'AERMOD';

interface Ctx {
  module: Module;
  toggle: () => void;
  setModule: (module: Module) => void;
}

const C = createContext({} as Ctx);
export const useModule = () => useContext(C);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [module, setModule] = useState<Module>('AERSCREEN');
  
  const toggle = () => {
    setModule(m => {
      if (m === 'AERSCREEN') return 'AERSURFACE';
      if (m === 'AERSURFACE') return 'AERMOD';
      return 'AERSCREEN';
    });
  };
  
  return <C.Provider value={{ module, toggle, setModule }}>{children}</C.Provider>;
};