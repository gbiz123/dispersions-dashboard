// Unit enums
export enum DistanceUnit {
  METERS = 'meters',
  FEET = 'feet',
  INCHES = 'inches'
}

export enum DiscreteReceptorsUnits {
  FEET = 0,
  METERS = 1,
  KILOMETERS = 2,
  MILES = 3
}
export enum AerscreenOtherInputsUnits {
    ENGLISH = 0,
    METRIC = 1
}

export enum AerscreenRuralOrUrban {
    RURAL = 0,
    URBAN = 1
}

export enum DemFileType {
	NED_1_ARC_SECOND = "National Elevation Dataset (NED) 1 arc-second",
    NED_1_3RD_ARC_SECOND = "National Elevation Dataset (NED) 1/3 arc-second",
    NED_1_9TH_ARC_SECOND = "National Elevation Dataset (NED) 1/9 arc-second",
    NED_2_ARC_SECOND_ALASKA = "National Elevation Dataset (NED) Alaska 2 arc-second",
    DEM_1_METER = "Digital Elevation Model (DEM) 1 meter"
}

export enum DemFileUnits {
    FEET = 1,
    DECIFEET = 2,
    DECAFEET = 3,
    METERS = 4,
    DECIMETERS = 5,
    DECAMETERS = 6
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
  FEET_PER_SECOND = 'ft/min'
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
