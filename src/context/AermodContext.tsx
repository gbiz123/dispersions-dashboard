import React, { createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRunData } from '../hooks/useRunData';
import { useRunContext } from './RunContext';

interface Ctx {
  isLoadingRunData: boolean;
}

const C = createContext({} as Ctx);
export const useAermod = () => useContext(C);

export const AermodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run_id');
  const { updateFormData } = useRunContext();

  // Fetch run data if editing
  const { runData, isLoading: isLoadingRunData } = useRunData({
    runId: runId || undefined,
    module: 'AERMOD',
  });

  // Load run data into global RunContext when it arrives
  useEffect(() => {
    if (runData && !isLoadingRunData) {
      // Map the API response to the global formData structure
      if (runData.run_info) {
        updateFormData('run_info', runData.run_info);
      }
      if (runData.sources) {
        updateFormData('sources', runData.sources);
      }
      if (runData.fence_line) {
        updateFormData('fence_line', runData.fence_line);
      }
      if (runData.building_file) {
        updateFormData('building_file', runData.building_file);
      }
      if (runData.receptor_grids) {
        updateFormData('receptor_grids', runData.receptor_grids);
      }
      if (runData.climate) {
        updateFormData('climate', runData.climate);
      }
      if (runData.meteorology) {
        updateFormData('meteorology', runData.meteorology);
      }
    }
  }, [runData, isLoadingRunData, updateFormData]);

  return (
    <C.Provider value={{ isLoadingRunData }}>
      {children}
    </C.Provider>
  );
};