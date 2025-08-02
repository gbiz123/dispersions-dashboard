import React, { createContext, useContext, useState, useEffect } from 'react';
import { AermodRequest } from '../types/api';
import { useSearchParams } from 'react-router-dom';
import { useRunData } from '../hooks/useRunData';

interface Ctx {
  formData: Partial<AermodRequest>;
  update: <K extends keyof AermodRequest>(
    k: K,
    v: AermodRequest[K]
  ) => void;
  isLoadingRunData: boolean;
}

const C = createContext({} as Ctx);
export const useAermod = () => useContext(C);

export const AermodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run_id');

  // Fetch run data if editing
  const { runData, isLoading: isLoadingRunData } = useRunData({
    runId: runId || undefined,
    module: 'AERMOD',
  });

  const [formData, set] = useState<Partial<AermodRequest>>({});

  const update = <K extends keyof AermodRequest>(
    key: K,
    value: AermodRequest[K]
  ) => set(prev => ({ ...prev, [key]: value }));

  // Load run data into state when it arrives
  useEffect(() => {
    if (runData && !isLoadingRunData) {
      // The runData should match the AermodRequest structure
      // Set the entire formData if the structure matches
      if (runData) {
        // Map the API response to AermodRequest structure
        const mappedData: Partial<AermodRequest> = {};

        // Map run_info data
        if (runData.run_info) {
          mappedData.run_info = runData.run_info;
        }

        // Map sources data
        if (runData.sources) {
          mappedData.sources = runData.sources;
        }

        // Map fence_line data
        if (runData.fence_line) {
          mappedData.fence_line = runData.fence_line;
        }

        // Map building_file data
        if (runData.building_file) {
          mappedData.building_file = runData.building_file;
        }

        // Map receptor_grids data
        if (runData.receptor_grids) {
          mappedData.receptor_grids = runData.receptor_grids;
        }

        // Map climate data
        if (runData.climate) {
          mappedData.climate = runData.climate;
        }

        // Map meteorology data
        if (runData.meteorology) {
          mappedData.meteorology = runData.meteorology;
        }

        // Set all mapped data at once
        set(mappedData);
      }
    }
  }, [runData, isLoadingRunData]);

  return (
    <C.Provider value={{ formData, update, isLoadingRunData }}>
      {children}
    </C.Provider>
  );
};