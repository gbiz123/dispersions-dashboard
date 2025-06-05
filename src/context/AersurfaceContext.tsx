import React, { createContext, useContext, useState, useEffect } from 'react';
import { AersurfaceRequest } from '../types/api';
import { useSearchParams } from 'react-router-dom';
import { useRunData } from '../hooks/useRunData';

interface Ctx {
  formData: Partial<AersurfaceRequest>;
  update: <K extends keyof AersurfaceRequest>(
    k: K,
    v: AersurfaceRequest[K]
  ) => void;
  isLoadingRunData: boolean;
}

const C = createContext({} as Ctx);
export const useAersurface = () => useContext(C);

export const AersurfaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run_id');

  const { runData, isLoading: isLoadingRunData } = useRunData({
    runId: runId || undefined,
    module: 'AERSURFACE',
  });

  const [formData, set] = useState<Partial<AersurfaceRequest>>({});

  const update = <K extends keyof AersurfaceRequest>(
    key: K,
    value: AersurfaceRequest[K]
  ) => set(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (runData && !isLoadingRunData) {
      // Map the API response to AersurfaceRequest structure
      const mappedData: Partial<AersurfaceRequest> = {};

      // Basic Info
      if (runData.basic_info) {
        mappedData.basic_info = runData.basic_info;
      }

      // Surface Roughness
      if (runData.surface_roughness) {
        mappedData.surface_roughness = runData.surface_roughness;
      }

      // Meteorology
      if (runData.meteorology) {
        mappedData.meteorology = runData.meteorology;
      }

      // Land Cover
      if (runData.land_cover) {
        mappedData.land_cover = runData.land_cover;
      }

      // Temporal Frequency
      if (runData.temporal_frequency) {
        mappedData.temporal_frequency = runData.temporal_frequency;
      }

      // Sectors
      if (runData.sectors) {
        mappedData.sectors = runData.sectors;
      }

      // Set all mapped data at once
      set(mappedData);
    }
  }, [runData, isLoadingRunData]);

  return <C.Provider value={{ formData, update, isLoadingRunData }}>{children}</C.Provider>;
};