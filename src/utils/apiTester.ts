import { runService } from '../services/runService';
import { resultService } from '../services/resultService';
import { AerscreenRequest, TemperatureUnit, VelocityUnit, DistanceUnit, SurfaceProfile, ClimateType, LandUseType, RuralUrban, TerrainSource, TerrainFileType, UnitSystem } from '../types/api';

// Sample data
const sampleRequest: AerscreenRequest = {
  stack_data: {
    rate: 100,
    height: 50,
    diam: 2,
    temp_k: 400,
    vel: 10,
    flow_rate: 15,
    rate_unit: 'g/s',
    height_unit: 'meters',
    diam_unit: 'meters',
    temp_unit: 'K',
    vel_unit: 'm/s' as VelocityUnit,
    flow_rate_unit: 'm³/s'
  },
  building_data: {
    has_building: true,
    bldg_height: 25,
    bldg_width_max: 40,
    bldg_width_min: 20,
    bldg_height_unit: 'meters',
    bldg_width_max_unit: 'meters',
    bldg_width_min_unit: 'meters',
    useexistingbpipprm_file: null,
  },
  makemet_data: {
    min_temp: 250,
    min_temp_unit: 'K' as TemperatureUnit,
    max_temp: 310,
    max_temp_unit: 'K' as TemperatureUnit,
    min_wspd: 0.5,
    min_wspd_unit: 'm/s' as VelocityUnit,
    anem_height: 10,
    anem_height_unit: 'meters' as DistanceUnit,
    surface_profile: 'rural' as SurfaceProfile,
    climate_type: 'average' as ClimateType,
    land_use_type: 'rural' as LandUseType,
    albedo: 0.18,
    bowen_ratio: 1.0,
    roughness_length: 0.3,
    surface_characteristics_file: null
  },
  terrain_data: {
    has_terrain: true,
    use_discrete_receptors: false,
    terrain_type: 'complex',
    elev_unit: 'meters',
    utm_zone: 15
  },
  terrain_input_files: {
    nad_datum: 'NAD83',
    probe_dist: 1000,
    probe_dist_unit: 'meters',
    file_type: TerrainFileType.DEM,   // valid enum value
    units: UnitSystem.METRIC,         // valid enum value
    file: null,
    terrain_source: TerrainSource.UPLOAD_FILE   // ← NEW ­required field
  },
  other_inputs: {
    min_dist_ambient: 100,
    min_dist_ambient_unit: 'meters',
    is_fumigation: false,
    rural_urban: 'rural' as RuralUrban
  }
};

// Test function for API integration
export const testApiIntegration = async () => {
  console.log('Starting API integration test...');
  
  try {
    // 1. Start a new run
    console.log('Starting new run...');
    const runResponse = await runService.startRun(sampleRequest);
    console.log('Run started:', runResponse);
    
    const runId = runResponse.run_id;
    
    // 2. Poll for run status
    console.log('Polling for run status...');
    let runInfo;
    do {
      runInfo = await runService.getRunInfo(runId);
      console.log('Run status:', runInfo.status);
      
      if (runInfo.status === 'completed' || runInfo.status === 'failed') {
        break;
      }
      
      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    } while (true);
    
    if (runInfo.status === 'completed') {
      // 3. Get flow sector concentrations
      console.log('Getting flow sector concentrations...');
      const flowSectorData = await resultService.getFlowSectorConcentrations(runId);
      console.log('Flow sector data:', flowSectorData);
      
      // 4. Get distance max concentrations
      console.log('Getting distance max concentrations...');
      const distanceData = await resultService.getDistanceMaxConcentrations(runId);
      console.log('Distance data:', distanceData);
    } else {
      console.error('Run failed:', runInfo.message);
    }
    
    console.log('API integration test completed');
    return { success: true, runId };
  } catch (error) {
    console.error('API integration test failed:', error);
    return { success: false, error };
  }
};