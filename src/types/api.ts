
export enum TemperatureUnit {
  CELSIUS = 'C',
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
  TROPICAL = 'tropical',
  TEMPERATE = 'temperate',
  CONTINENTAL = 'continental',
  POLAR = 'polar',
  AVERAGE = 'AVERAGE',
  ARID     = 'ARID',
  MOIST    = 'MOIST'
}

export enum LandUseType {
  USER_ENTERED_SURFACE_CHARACTERISTICS = 'USER_ENTERED_SURFACE_CHARACTERISTICS',
  USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS = 'USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS',
  AGRICULTURAL = 'agricultural',
  URBAN = 'urban',
  FOREST = 'forest',
  WATER = 'water',
  DESERT = 'desert',
  RURAL = 'Rural'
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
  DTED = 'DTED',
  GEO_TIFF = 'GEO_TIFF',   // Geo-referenced TIFF
  ASCII_GRID = 'ASCII_GRID'  // ESRI ASCII grid
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
  stack_data: StackData;
  building_data: BuildingData;
  makemet_data: MakemetData;
  terrain_data: TerrainData;
  terrain_input_files?: TerrainInputFiles;
  discrete_receptors?: DiscreteReceptors;
  use_discrete_receptors?: boolean;
  other_inputs?: OtherInputs;
  fumigation?: Fumigation;
  debug?: Debug;
}

// Stack Data
export interface StackData {
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
  length?: number; width?: number; vertical_dimension?: number;
  radius?: number; num_vertices?: number;
}

// Building Data
export interface BuildingData {
  has_building: boolean;
  bldg_height: number;
  bldg_width_max: number;
  bldg_width_min: number;
  bldg_height_unit: string;
  bldg_width_max_unit: string;
  bldg_width_min_unit: string;
  useexistingbpipprm_file: File | null;
}

// Makemet Data
export interface MakemetData {
  min_temp: number;
  min_temp_unit: TemperatureUnit;
  max_temp: number;
  max_temp_unit: TemperatureUnit;
  min_wspd: number;
  min_wspd_unit: VelocityUnit;
  anem_height: number;
  anem_height_unit: DistanceUnit;
  surface_profile: SurfaceProfile;
  climate_type: ClimateType;
  // Added fields
  land_use_type: LandUseType;
  albedo: number;
  bowen_ratio: number;
  roughness_length: number;
  surface_characteristics_file: File | null;
}

// Terrain Data
export interface TerrainData {
  has_terrain: boolean;
  use_discrete_receptors: boolean;
  terrain_type?: string;
  elev_unit?: string;
  hill_height?: number;
  hill_height_unit?: string;
  utm_zone: number;
}

// Terrain Input Files
export interface TerrainInputFiles {
  us_county?: string;
  us_state?: string;
  nad_datum?: string;
  probe_dist?: number;
  probe_dist_unit?: string;
  file_type: TerrainFileType; 
  units: UnitSystem;
  file: File | null;
}

// Discrete Receptors
export interface DiscreteReceptors {
  receptors: Receptor[];
}

export interface Receptor {
  x: number;
  y: number;
  elevation?: number;
  x_unit: string;
  y_unit: string;
  elevation_unit?: string;
}

// Other Inputs
export interface OtherInputs {
  min_dist_ambient: number;
  min_dist_ambient_unit: string;
  urban_population?: number;
  is_fumigation: boolean;
  rural_urban: RuralUrban;
}

// Fumigation
export interface Fumigation {
  shore_dist: number;
  shore_dist_unit: string;
  enable_shoreline_fumigation: boolean;
  use_inv_breakup: boolean;
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

// Debug
export interface Debug {
  save_input: boolean;
  save_aermap_input: boolean;
  save_debug: boolean;
  save_aermap_debug: boolean;
}