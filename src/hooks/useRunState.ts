import { useState } from 'react';
import { AerscreenRequest } from '../types/api';
import { validateCompleteRequest } from '../utils/validation';

export interface UseRunStateReturn {
  formData: Partial<AerscreenRequest>;
  isComplete: boolean;
  updateSection: <K extends keyof AerscreenRequest>(
    section: K,
    data: AerscreenRequest[K]
  ) => void;
  resetFormData: () => void;
}

export function useRunState(): UseRunStateReturn {
  const [formData, setFormData] = useState<Partial<AerscreenRequest>>({});

  const updateSection = <K extends keyof AerscreenRequest>(
    section: K,
    data: AerscreenRequest[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  const isComplete = !!formData.source_data && 
                     !!formData.building_data && 
                     !!formData.makemet_data && 
                     !!formData.terrain_data && 
                     validateCompleteRequest(formData);

  return {
    formData,
    isComplete,
    updateSection,
    resetFormData,
  };
}

export default useRunState;
