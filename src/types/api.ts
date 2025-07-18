import { DemFileResolution, AerscreenOtherInputsUnits, AerscreenRuralOrUrban, DemFileUnits, DiscreteReceptorsUnits } from "./enums";

export enum TemperatureUnit {
  FAHRENHEIT = 'F',
  KELVIN = 'K'
}

export enum VelocityUnit {
  METERS_PER_SECOND = 'm/s',
  FEET_PER_SECOND = 'ft/s',
  MILES_PER_HOUR = 'mph',
  FEET_PER_MINUTE = 'ft/min',
}

export enum DistanceUnit {
  METERS = 'm',
  FEET = 'ft',
  KILOMETERS = 'km',
  MILES = 'mi'
}

export enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
  ENGLISH = 'english'
}

export enum SurfaceProfile {
  URBAN = 'urban',
  RURAL = 'rural'
}

export enum ClimateType {
  NONE = "NONE",
  AVERAGE_MOISTURE = "AVERAGE_MOISTURE",
  WET_CONDITIONS = "WET_CONDITIONS",
  DRY_CONDITIONS = "DRY_CONDITIONS "
}

export enum LandUseType {
  USER_ENTERED_SURFACE_CHARACTERISTICS = "USER_ENTERED_SURFACE_CHARACTERISTICS",
  WATER = "WATER",
  DECIDUOUS_FOREST = "DECIDUOUS_FOREST",
  CONIFEROUS_FOREST = "CONIFEROUS_FOREST",
  SWAMP = "SWAMP",
  CULTIVATED_LAND = "CULTIVATED_LAND",
  GRASSLAND = "GRASSLAND",
  URBAN = "URBAN",
  DESERT_SHRUB_LAND = "DESERT_SHRUB_LAND",
  USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS = "USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS",
  USE_PREVIOUS_AERSURFACE_RUN = "USE_PREVIOUS_AERSURFACE_RUN" 
}

/**
 * Indicates whether dispersion calculations should follow rural or urban options.
 */
export enum RuralUrban {
  RURAL = 'rural',
  URBAN = 'urban'
}

/**
 * Allowed file types for terrain input data.
 * Extend this enum as you add support for additional formats.
 */
export enum TerrainFileType {
  DEM = 'DEM',
  NED = 'NED',
}

/* ───────────── Terrain source options (upload vs national map) ─────────── */
export enum TerrainSource {
  UPLOAD_FILE  = 'upload_file',
  NATIONAL_MAP = 'national_map'
}

export interface RunInfo {
  run_id: string;
  status: string | number;
  message?: string;
  created_at?: string;
  updated_at?: string;
  created_on?: string;
  updated_on?: string;
  finished_on?: string | null;
}

export interface FlowSectorConcentration {
  flow_sector: string;
  concentration: number;
  distance: number;
  date: string;
}

export interface DistanceMaxConcentration {
  distance: number;
  concentration: number;
  date: string;
}

// Request Type for starting a run
export interface AerscreenRequest {
  source_data: AerscreenSourceData;
  building_data: AerscreenBuildingData;
  makemet_data: AerscreenMakemetData;
  terrain_data: AerscreenTerrainData;
  terrain_input_files?: TerrainInputFiles;
  discrete_receptors?: AerscreenDiscreteReceptors;
  use_discrete_receptors?: boolean;
  other_inputs?: AerscreenOtherInputs;
  fumigation?: AerscreenFumigation;
  debug?: AerscreenDebug;
}

export interface Row {
  id: number;
  type: string;
  value: number;
}

export interface LandCoverRow {
  data_source: 'User-provided' | 'NLCD';
  year: number;                                 // 1900-current
  type: 'NLCD Land Cover' | 'Percent impervious' | 'Percent canopy';
  file?: string;                                // uploaded file key / path (only when User-provided)
}
// Temporal-frequency definitions
export type Season = 'Winter' | 'Spring' | 'Summer' | 'Autumn';
export type Month =
  | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'
  | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

export interface TfAnnualOrMonthly {
  freq: 'Annual' | 'Monthly';
  seasons: Record<Season, Month | null>;
}

export interface TfSeasonal {
  freq: 'Seasonal';
  overrides: Season[];      // max 4, one per season
}

export type TemporalFrequency = TfAnnualOrMonthly | TfSeasonal;

/* ────────────────────────────  Sectors  ──────────────────────────── */
export type AirportOption = 'Airport' | 'Not airport' | 'Varying airport';
export type SectorMode    = 'Even sizes' | 'Custom sizes';

export interface EvenSectors {
  mode: 'Even sizes';
  count: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 16;
  airport: AirportOption;
}

export interface CustomSector {
  start: number;          // 0-360
  end: number;            // 0-360
  airport: AirportOption;
}

export interface CustomSectors {
  mode: 'Custom sizes';
  sectors: CustomSector[];        // max 12, validated in UI
}

export type Sectors = EvenSectors | CustomSectors;
/* ──────────────────────────────────────────────────────────────────── */

// Aersurface Request Type
export interface AersurfaceRequest {
  basic_info: {
    title1: string;
    title2: string;
    location: 'Primary' | 'Secondary';
    debug: 'EFFRAD' | 'GRID' | 'TIFF' | 'All';
  };
  surface_roughness: { method: 'ZORAD' | 'ZOEFF'; zo_radius?: number };
  meteorology: {
    coord_units: 'UTM' | 'LatLon';
    easting?: number;
    northing?: number;
    latitude?: number;
    longitude?: number;
    datum: 'NAD27' | 'NAD83';
    anem_height: number;
    surface_moisture: 'Wet' | 'Dry' | 'Average';
    snow_cover: 'Snow' | 'No snow';
    arid_condition?: 'Arid' | 'Non-arid';
  };
  land_cover: LandCoverRow[];
  temporal_frequency: TemporalFrequency;
  sectors: Sectors;
}

// Aermod Request Type
export interface AermodRequest {
  run_info: {
    project_description: string;
    run_option: 'CONC' | 'DEPOS' | 'DDEP' | 'WDEP';
    start_year: number;
    end_year: number;
    latitude: number | null;
    longitude: number | null;
    state: string;
    pollutants: {
      NO2: boolean;
      SO2: boolean;
      PM25: boolean;
      PM10: boolean;
      LEAD: boolean;
      CO: boolean;
      OTHER: boolean;
    };
  };
  sources: {
    method: 'manual' | 'upload' | 'previous';
    data?: SourceData[];
    uploaded_file?: string;
    previous_run_id?: string;
  };
  fence_line: {
    enabled: boolean;
    points: Array<{
      id: string;
      x_coordinate: number;
      y_coordinate: number;
      elevation: number;
    }>;
    receptor_height: number;
    spacing: number;
  };
  building_file: {
    enabled: boolean;
    file?: File;
    filename?: string;
    use_existing: boolean;
    existing_filename?: string;
  };
  receptor_grids: {
    grids: Array<{
      id: string;
      name: string;
      enabled: boolean;
      x_start: number;
      x_end: number;
      x_spacing: number;
      y_start: number;
      y_end: number;
      y_spacing: number;
      elevation: number;
      height: number;
    }>;
  };
  climate: {
    seasonal_category: 'ANNUAL' | 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'CUSTOM';
    precipitation_category: 'WET' | 'DRY' | 'AVERAGE' | 'CUSTOM';
    custom_seasons?: {
      spring_start: number;
      summer_start: number;
      autumn_start: number;
      winter_start: number;
    };
    custom_precipitation?: {
      wet_threshold: number;
      dry_threshold: number;
    };
  };
  meteorology: {
    adj_u: boolean;
    source_type: 'onsite' | 'previous_run' | 'default_station';
    onsite_data?: {
      latitude: number;
      longitude: number;
      elevation?: number;
      station_name?: string;
    };
    previous_run_id?: string;
    default_station?: {
      station_id: string;
      station_name: string;
    };
  };
  run_configuration: {
    run_title: string;
    run_description: string;
    output_options: {
      include_summary: boolean;
      include_detailed: boolean;
      include_plots: boolean;
      include_statistics: boolean;
    };
    advanced_options: {
      max_hours: number;
      convergence_criteria: number;
      debug_mode: boolean;
    };
  };
}

// Aermod Source Data Type
interface SourceData {
  id: string;
  name: string;
  type: 'POINT' | 'AREA' | 'VOLUME' | 'LINE';
  x_coordinate: number;
  y_coordinate: number;
  base_elevation: number;
  stack_height?: number;
  stack_diameter?: number;
  exit_velocity?: number;
  exit_temperature?: number;
  emission_rate: number;
  pollutant: string;
}

// Stack Data
export interface AerscreenSourceData {
  rate: number;
  height: number;
  diam: number;
  temp_k: number;
  vel: number;
  flow_rate: number;
  rate_unit: string;
  height_unit: string;
  diam_unit: string;
  temp_unit: string;
  vel_unit: string;
  flow_rate_unit: string;
  source_type?: string;
  heat_release_rate?: number;  heat_loss_fraction?: number;
  release_height_agl?: number; initial_lateral_dimension?: number; initial_vertical_dimension?: number;
  vertical_dimension_height_unit?: number;
  lateral_dimension_height_unit?: number;
  length?: number; width?: number; vertical_dimension?: number;
  length_unit?: string;
  width_unit?: string;
  radius?: number; num_vertices?: number;
  radius_unit?: string;
}

// Building Data
export interface AerscreenBuildingData {
  use_building_downwash: boolean;
  use_existing_bpipprm_file?: string | null
  height: number;
  height_units?: number;
  max_horizontal_dim: number;
  max_horizontal_dim_units?: number;
  min_horizontal_dim: number;
  min_horizontal_dim_units?: number;
  deg_from_north_of_max_hor_dim: number,
  deg_from_north_of_stack_rel_to_center: number,
  dist_stack_to_center: number,
  dist_to_stack_center_units?: number;
}

// Makemet Data
export interface AerscreenMakemetData {
  min_temp_k: number;
  min_temp_units?: TemperatureUnit;
  max_temp_k: number;
  max_temp_units?: TemperatureUnit;
  min_wind_speed_m_s: number;
  anemometer_height_m: number;
  climatology_type: ClimateType;
  land_use_type: LandUseType;
  albedo: number;
  bowen_ratio: number;
  surface_roughness: number;
  surface_characteristics_filename?: File | null;
  aersurface_run_id?: number;
}

// Terrain Data
export interface AerscreenTerrainData {
  use_terrain: boolean;
  utm_x: number
  utm_y: number
  utm_zone: number
  nad_datum: string
  probe_distance: number
  probe_distance_units: DistanceUnit
  elevation: number
  elevation_units?: number
  override_elevation_with_aermap_val: boolean
}

// Terrain Input Files
export interface TerrainInputFiles {
  file_type: TerrainFileType; 
  units: DemFileUnits;
  file: File | null;
  terrain_source: TerrainSource;
  dem_file_resolution?: DemFileResolution;
}

// Discrete Receptors
export interface AerscreenDiscreteReceptors {
  include_discrete_receptors: boolean
  distance_units: DiscreteReceptorsUnits
  receptors: number[];
}

// Other Inputs
export interface AerscreenOtherInputs {
  rural_or_urban: AerscreenRuralOrUrban
  population?: number
  distance_to_amb_air?: number
  use_flagpole_receptors: boolean
  flagpole_height_m: number
}

// Fumigation
export interface AerscreenFumigation {
  inversion_break_up: boolean;
  shoreline_fumigation: boolean;
  distance_to_shoreline: number;
  direction_to_shoreline_deg?: number
  run_aerscreen?: boolean
}

export interface NormalisedFlowSector {
  /** Central direction of the sector in degrees (0-360). */
  dir: number;
  /** Concentration of the pollutant in the sector (µg/m³). */
  conc: number;
  /** Distance from the source to the sector (m). */
  distance: number;
  /** Date and time of the measurement. */
  date: string;
}

export interface AerscreenDebug {
  debug?: boolean;
}
