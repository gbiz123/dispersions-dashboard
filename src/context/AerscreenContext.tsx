import React, { createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRunData } from '../hooks/useRunData';
import { useRunContext } from './RunContext';

interface AerscreenContextType {
  isLoadingRunData: boolean;
}

const AerscreenContext = createContext<AerscreenContextType | undefined>(undefined);

export const AerscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run_id');
  const { formData, updateFormData } = useRunContext();
  
  // Fetch run data if editing
  const { runData, isLoading: isLoadingRunData } = useRunData({ 
    runId: runId || undefined, 
    module: 'AERSCREEN' 
  });

  // Load run data into state when it arrives
  useEffect(() => {
    if (runData && !isLoadingRunData) {
      // Update form data using the RunContext
      // The structure should match your API response format
      
      // Stack Data
      if (runData.source_data) {
        updateFormData('source_data', runData.source_data);
      } else {

	  }

      // Building Data
      if (runData.building_data) {
        updateFormData('building_data', runData.building_data);
      }

      // Makemet Data
      if (runData.makemet_data) {
        updateFormData('makemet_data', runData.makemet_data);
      }

      // Terrain Data
      if (runData.terrain_data) {
        updateFormData('terrain_data', runData.terrain_data);
      }

      // Terrain Input Files
      if (runData.terrain_input_files) {
        updateFormData('terrain_input_files', runData.terrain_input_files);
      }

      // Discrete Receptors
      if (runData.discrete_receptors) {
        updateFormData('discrete_receptors', runData.discrete_receptors);
      }

      // Other Inputs
      if (runData.other_inputs) {
        updateFormData('other_inputs', runData.other_inputs);
      }

      // Fumigation
      if (runData.fumigation) {
        updateFormData('fumigation', runData.fumigation);
      }

      // Debug
      if (runData.debug) {
        updateFormData('debug', runData.debug);
      }
    }
  }, [runData, isLoadingRunData]); // Remove updateFormData from dependencies

  return (
    <AerscreenContext.Provider
      value={{
        isLoadingRunData,
      }}
    >
      {children}
    </AerscreenContext.Provider>
  );
};

export const useAerscreen = () => {
  const context = useContext(AerscreenContext);
  if (!context) {
    throw new Error('useAerscreen must be used within AerscreenProvider');
  }
  return context;
};
