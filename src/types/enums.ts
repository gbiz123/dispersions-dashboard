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
  UPLOAD_FILE   = 'UPLOAD_FILE',
  NATIONAL_MAP  = 'NATIONAL_MAP'
}

export enum RuralUrban {
  RURAL = 'RURAL',
  URBAN = 'URBAN'
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
  METERS_PER_SECOND = 'METERS_PER_SECOND',
  FEET_PER_SECOND = 'FEET_PER_SECOND'
}

export enum FlowRateUnit {
  CUBIC_METERS_PER_SECOND = 'm³/s',
  CUBIC_FEET_PER_MINUTE = 'ft³/min'
}

export enum TemperatureUnit {
  KELVIN = 'KELVIN',
  FAHRENHEIT = 'FAHRENHEIT'
}

export enum EmissionRateUnit {
  GRAMS_PER_SECOND = 'g/s',
  POUNDS_PER_HOUR = 'lb/hr'
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

export enum ClimateType {
  NONE = "NONE",
  AVERAGE_MOISTURE = "AVERAGE_MOISTURE",
  WET_CONDITIONS = "WET_CONDITIONS",
  DRY_CONDITIONS = "DRY_CONDITIONS "
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
