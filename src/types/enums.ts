// Unit enums
export enum DistanceUnit {
  METERS = 'meters',
  FEET = 'feet'
}

export enum TerrainSource {
  UPLOAD_FILE   = 'upload_file',
  NATIONAL_MAP  = 'national_map'
}

export enum RuralUrban {
  RURAL = 'rural',
  URBAN = 'urban'
}

export enum VelocityUnit {
  METERS_PER_SECOND = 'm/s',
  FEET_PER_MINUTE = 'ft/min'
}

export enum FlowRateUnit {
  CUBIC_METERS_PER_SECOND = 'm³/s',
  CUBIC_FEET_PER_MINUTE = 'ft³/min'
}

export enum TemperatureUnit {
  KELVIN = 'K',
  CELSIUS = 'C',
  FAHRENHEIT = 'F'
}

export enum EmissionRateUnit {
  GRAMS_PER_SECOND = 'g/s',
  POUNDS_PER_HOUR = 'lb/hr'
}

// Surface profile enums
export enum SurfaceProfile {
  URBAN = 'urban',
  RURAL = 'rural'
}

// Climate type enums
export enum ClimateType {
  AVERAGE = 'average',
  ARID = 'arid',
  MOIST = 'moist'
}

// Terrain type enums
export enum TerrainType {
  FLAT = 'flat',
  SIMPLE = 'simple',
  COMPLEX = 'complex'
}

// NAD Datum enums
export enum NADDatum {
  NAD27 = 'NAD27',
  NAD83 = 'NAD83',
  WGS84 = 'WGS84'
}

export enum UnitSystem {
  METRIC = 'METRIC',
  ENGLISH = 'ENGLISH'
}

export enum TerrainFileType {
  DEM = 'DEM',
  DTED = 'DTED',
  GEO_TIFF = 'GEO_TIFF'
}

// Status enums
export enum RunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Land use type enums
export enum LandUseType {
  USER_ENTERED_SURFACE_CHARACTERISTICS = 0,
  // Add other land use types as needed
  USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS = 9
}