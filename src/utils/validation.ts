import { AerscreenRequest } from '../types/api';

export const validateStackData = (data: AerscreenRequest['source_data']) => {
  if (!data) return false;
  
  return (
    data.rate > 0 &&
    data.height > 0 &&
    data.diam > 0 &&
    data.temp_k > 0 &&
    data.vel > 0 &&
    !!data.rate_unit &&
    !!data.height_unit &&
    !!data.diam_unit &&
    !!data.temp_unit &&
    !!data.vel_unit
  );
};

export const validateBuildingData = (data: AerscreenRequest['building_data']) => {
  if (!data) return false;
  
  if (!data.use_building_downwash) return true;
  
  return (
    data.height! > 0 &&
    data.max_horizontal_dim! > 0 &&
    data.min_horizontal_dim! > 0 &&
    !!data.max_horizontal_dim &&
    !!data.min_horizontal_dim
  );
};

export const validateMakemetData = (data: AerscreenRequest['makemet_data']) => {
  if (!data) return false;
  
  // Basic validation for required fields
  if (
    !data.land_use_type ||
    !data.climatology_type
  ) {
    return false;
  }
  
  // Temperature checks
  if (data.min_temp_k > data.max_temp_k) {
    return false;
  }
  
  // Wind speed check
  if (data.min_wind_speed_m_s < 0) {
    return false;
  }
  
  return true;
};

export const validateTerrainData = (data: AerscreenRequest['terrain_data']) => {
  if (!data) return false;
  
  if (!data.use_terrain) return true;
  
  return true;
};

export const validateDiscreteReceptors = (data: AerscreenRequest['discrete_receptors']) => {
  if (!data) return true; // Optional section
  
  if (!data.receptors || data.receptors.length === 0) {
    return false;
  }
};

export const validateFumigation = (data: AerscreenRequest['fumigation']) => {
  if (!data) return true; // Optional section
  
  return (
    data.distance_to_shoreline > 0
  );
};

export const validateCompleteRequest = (data: Partial<AerscreenRequest>) => {
  return (
    validateStackData(data.source_data!) &&
    validateBuildingData(data.building_data!) &&
    validateMakemetData(data.makemet_data!) &&
    validateTerrainData(data.terrain_data!) 
  );
};
