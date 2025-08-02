import React, { createContext, useContext, useEffect, useState } from 'react';
import { AerscreenSourceType, DistanceUnit, EmissionRateUnit, FlowRateUnit, TemperatureUnit, VelocityUnit } from 'types/enums';
import { useRunContext } from './RunContext';

export type Module = 'AERSCREEN' | 'AERSURFACE' | 'AERMOD' | 'Dashboard';

interface Ctx {
  module: Module;
  toggle: () => void;
  setModule: (module: Module) => void;
}

const C = createContext({} as Ctx);
export const useModule = () => useContext(C);

const defaultAerscreenData = {
	source_data: {
		rate: 0,
		height: 10,
		diam: 0,
		temp_k: 0,
		vel: 0,
		flow_rate: 0,
		rate_unit: EmissionRateUnit.GRAMS_PER_SECOND,
		height_unit: DistanceUnit.METERS,
		diam_unit: DistanceUnit.METERS,
		temp_unit: TemperatureUnit.KELVIN,
		vel_unit: VelocityUnit.METERS_PER_SECOND,
		flow_rate_unit: FlowRateUnit.CUBIC_METERS_PER_SECOND,
		heat_release_rate: 0,
		heat_loss_fraction: 0.55,
		release_height_agl: 0,
		initial_lateral_dimension: 0,
		initial_vertical_dimension: 0,
		length: 0,
		width: 0,
		vertical_dimension: 0,
		radius: 0,
		num_vertices: 20,
		sourceType: AerscreenSourceType.POINT
	} 
}

// Helper function to determine module from URL path
const getModuleFromPath = (): Module => {
  const path = window.location.pathname;
  
  if (path.includes('/aermod/')) {
    return 'AERMOD';
  } else if (path.includes('/aerscreen/')) {
    return 'AERSCREEN';
  } else if (path.includes('/aersurface/')) {
    return 'AERSURFACE';
  }
  
  return 'Dashboard';
};

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize module based on current URL path
  const [module, setModule] = useState<Module>(() => getModuleFromPath());
  const { formData, updateFormData } = useRunContext();

  // Update module when URL changes (for browser back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setModule(getModuleFromPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Create default values for AERSCREEN
  useEffect(() => {
    if (module === "AERSCREEN") {
      if (formData.source_data === undefined) {
        updateFormData(
          'source_data',
          defaultAerscreenData
        );
      }
    }
  }, [module, formData.source_data, updateFormData]);
  
  const toggle = () => {
    setModule(m => {
      if (m === 'AERSCREEN') return 'AERSURFACE';
      if (m === 'AERSURFACE') return 'AERMOD';
      if (m === 'AERMOD') return 'Dashboard';
      return 'AERSCREEN';
    });
  };
  
  return <C.Provider value={{ module, toggle, setModule }}>{children}</C.Provider>;
};