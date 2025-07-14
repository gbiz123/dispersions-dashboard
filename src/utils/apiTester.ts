import { runService } from '../services/runService';
import { resultService } from '../services/resultService';
import { AerscreenRequest, TemperatureUnit, VelocityUnit, DistanceUnit, SurfaceProfile, ClimateType, LandUseType, RuralUrban, TerrainSource, TerrainFileType, UnitSystem } from '../types/api';
import { AerscreenOtherInputsUnits, AerscreenRuralOrUrban, DemFileType, DemFileUnits } from 'types/enums';

// Sample data
const sampleRequest: AerscreenRequest = {
  source_data: {
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
	deg_from_north_of_stack_rel_to_center: 0,
	dist_stack_to_center: 10,
    use_building_downwash: true,
    height: 25,
    max_horizontal_dim: 40,
    min_horizontal_dim: 20,
	deg_from_north_of_max_hor_dim: 9,
    use_existing_bpipprm_file: null,
  },
  makemet_data: {
	climatology_type: ClimateType.NONE,
	min_temp_k: 250,
    max_temp_k: 310,
    min_wind_speed_m_s: 0.5,
    anemometer_height_m: 10,
	land_use_type: LandUseType.SWAMP,
    albedo: 0.18,
    bowen_ratio: 1.0,
    surface_roughness: 0.3,
  },
  terrain_data: {
	use_terrain: false,
    utm_x: 0,
    utm_y: 0,
    utm_zone: 15,
    nad_datum: "NAD27",
    probe_distance_m: 0,
    elevation: 0,
    dem_file_type: DemFileType.DEM_1_METER,
    dem_file_units: DemFileUnits.FEET,
    override_elevation_with_aermap_val: false
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
	flagpole_height_m: 0,
	use_flagpole_receptors: false,
	units: AerscreenOtherInputsUnits.METRIC,
    distance_to_amb_air: 100,
	rural_or_urban: AerscreenRuralOrUrban.RURAL
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
