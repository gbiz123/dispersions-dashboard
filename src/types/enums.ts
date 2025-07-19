// Unit enums
export enum DistanceUnit {
  METERS = 'meters',
  FEET = 'feet',
  INCHES = 'inches'
}

export enum DiscreteReceptorsUnits {
  FEET = "FEET",
  METERS = "METERS",
  KILOMETERS = "KILOMETERS",
  MILES = "MILES"
}
export enum AerscreenOtherInputsUnits {
    ENGLISH = "ENGLISH",
    METRIC = "METRIC",
}

export enum AerscreenRuralOrUrban {
    RURAL = "RURAL",
    URBAN = "URBAN"
}

export enum DemFileResolution {
	NED_1_ARC_SECOND = "NED_1_ARC_SECOND",
    NED_1_3RD_ARC_SECOND = "NED_1_3RD_ARC_SECOND",
    NED_1_9TH_ARC_SECOND = "NED_1_9TH_ARC_SECOND",
    NED_2_ARC_SECOND_ALASKA = "NED_2_ARC_SECOND_ALASKA",
    DEM_1_METER = "DEM_1_METER"
}

export enum DemFileUnits {
    FEET = "FEET",
    DECIFEET = "DECIFEET",
    DECAFEET = "DECAFEET",
    METERS = "METERS",
    DECIMETERS = "DECIMETERS",
    DECAMETERS = "DECAMETERS"
}

export enum TerrainSource {
  UPLOAD_FILE   = 'upload_file',
  NATIONAL_MAP  = 'national_map'
}

export enum RuralUrban {
  RURAL = 'rural',
  URBAN = 'urban'
}

export enum AerscreenSourceType {
  POINT = 'POINT',
  CAPPED_POINT = 'CAPPED_POINT',
  HORIZONTAL_POINT = 'HORIZONTAL_POINT',
  FLARE = 'FLARE',
  VOLUME = 'VOLUME',
  RECTANGULAR_AREA = 'RECTANGULAR_AREA',
  CIRCULAR_AREA = 'CIRCULAR_AREA'
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
  NED = 'NED'
}

// Status enums
export enum RunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
