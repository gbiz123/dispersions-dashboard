import { AerscreenRequest } from '../types/api';

export const validateStackData = (data: AerscreenRequest['stack_data']) => {
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
  
  if (!data.has_building) return true;
  
  return (
    data.bldg_height! > 0 &&
    data.bldg_width_max! > 0 &&
    data.bldg_width_min! > 0 &&
    !!data.bldg_height_unit &&
    !!data.bldg_width_max_unit &&
    !!data.bldg_width_min_unit
  );
};

export const validateMakemetData = (data: AerscreenRequest['makemet_data']) => {
  if (!data) return false;
  
  // Basic validation for required fields
  if (
    !data.min_temp_unit ||
    !data.max_temp_unit ||
    !data.min_wspd_unit ||
    !data.anem_height_unit ||
    !data.surface_profile ||
    !data.climate_type
  ) {
    return false;
  }
  
  // Temperature checks
  if (data.min_temp > data.max_temp) {
    return false;
  }
  
  // Wind speed check
  if (data.min_wspd < 0) {
    return false;
  }
  
  return true;
};

export const validateTerrainData = (data: AerscreenRequest['terrain_data']) => {
  if (!data) return false;
  
  if (!data.has_terrain) return true;
  
  if (!data.terrain_type || !data.elev_unit) {
    return false;
  }
  
  if (data.terrain_type === 'simple') {
    return (
      data.hill_height! > 0 &&
      !!data.hill_height_unit
    );
  }
  
  return true;
};

export const validateTerrainInputFiles = (data: AerscreenRequest['terrain_input_files']) => {
  if (!data) return true; // Optional section
  
  if (data.terrain_source === 'national_map') return true; // <-- add

  // NAD Datum is required if providing terrain input files
  return !!data.nad_datum;
};

export const validateDiscreteReceptors = (data: AerscreenRequest['discrete_receptors']) => {
  if (!data) return true; // Optional section
  
  if (!data.receptors || data.receptors.length === 0) {
    return false;
  }
  
  // Validate each receptor
  return data.receptors.every(receptor => 
    receptor.x != null && 
    receptor.y != null && 
    !!receptor.x_unit && 
    !!receptor.y_unit
  );
};

export const validateOtherInputs = (data: AerscreenRequest['other_inputs']) => {
  if (!data) return false;
  
  return (
    data.min_dist_ambient > 0 &&
    !!data.min_dist_ambient_unit
  );
};

export const validateFumigation = (data: AerscreenRequest['fumigation']) => {
  if (!data) return true; // Optional section
  
  return (
    data.shore_dist > 0 &&
    !!data.shore_dist_unit
  );
};

export const validateCompleteRequest = (data: Partial<AerscreenRequest>) => {
  return (
    validateStackData(data.stack_data!) &&
    validateBuildingData(data.building_data!) &&
    validateMakemetData(data.makemet_data!) &&
    validateTerrainData(data.terrain_data!) &&
    // Check terrain input files only if has_terrain is true
    (!data.terrain_data?.has_terrain || validateTerrainInputFiles(data.terrain_input_files)) &&
    // Check discrete receptors only if use_discrete_receptors is true
    (!data.terrain_data?.use_discrete_receptors || validateDiscreteReceptors(data.discrete_receptors)) &&
    validateOtherInputs(data.other_inputs!) &&
    // Check fumigation only if is_fumigation is true
    (!data.other_inputs?.is_fumigation || validateFumigation(data.fumigation))
  );
};