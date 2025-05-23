import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { MakemetData as MakemetDataType } from '../types/api';
import { 
  DistanceUnit, 
  VelocityUnit, 
  TemperatureUnit, 
  SurfaceProfile, 
  ClimateType,
  LandUseType 
} from '../types/api';
import { API_CONFIG } from '../config';
import { useModule } from '../context/ModuleContext'; // Add this import

// Add interface for AERSURFACE run
interface AersurfaceRun {
  title_one: string;
  title_two: string;
  run_id: number;
}

/* ------------------------------------------------------------------ */
/* 1️⃣  Helper – build the correct URL for WireMock                    */
/* ------------------------------------------------------------------ */
const getAersurfaceListUrl = () => {
  const root = API_CONFIG.BASE_URL.replace(/\/aerscreen$/, '');   // strip “…/aerscreen”
  return `${root}/aersurface/run/list`;
};

const MakemetData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  const { toggle } = useModule(); // Add this hook
  
  // Add state for AERSURFACE runs
  const [aersurfaceRuns, setAersurfaceRuns] = useState<AersurfaceRun[]>([]);
  const [selectedAersurfaceRun, setSelectedAersurfaceRun] = useState<number | null>(null);
  const [showAersurfaceList, setShowAersurfaceList] = useState(false);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [runsError, setRunsError] = useState<string | null>(null);
  
  // Default values
  const defaultMakemetData: MakemetDataType = {
    min_temp: 0,
    min_temp_unit: TemperatureUnit.KELVIN,
    max_temp: 0,
    max_temp_unit: TemperatureUnit.KELVIN,
    min_wspd: 0,
    min_wspd_unit: VelocityUnit.METERS_PER_SECOND,
    anem_height: 10,
    anem_height_unit: DistanceUnit.METERS,
    surface_profile: SurfaceProfile.RURAL,
    climate_type: ClimateType.AVERAGE,
    land_use_type: LandUseType.RURAL,
    albedo: 0,
    bowen_ratio: 0,
    roughness_length: 0,
    surface_characteristics_file: new File([], '')
  };
  
  // Initialize state with existing data or defaults
  const [makemetData, setMakemetData] = useState<MakemetDataType>(
    formData.makemet_data || defaultMakemetData
  );

  // Fetch AERSURFACE runs when dropdown changes
  useEffect(() => {
    if (makemetData.land_use_type !== LandUseType.USE_AERSURFACE) {
      setShowAersurfaceList(false);
      setSelectedAersurfaceRun(null);
      return;
    }

    setShowAersurfaceList(true);
    setLoadingRuns(true);
    setRunsError(null);

    const url = getAersurfaceListUrl();
    console.log('→ fetching AERSURFACE runs from', url);            // <-- keep for dev

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => setAersurfaceRuns(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setRunsError('Could not load runs ‑ open DevTools → Network for details.');
        setAersurfaceRuns([]);
      })
      .finally(() => setLoadingRuns(false));
  }, [makemetData.land_use_type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setMakemetData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMakemetData(prev => ({
      ...prev,
      surface_characteristics_file: e.target.files?.[0] ?? null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: any = { ...makemetData };
    
    
    if (makemetData.land_use_type === LandUseType.USE_AERSURFACE && selectedAersurfaceRun) {
      dataToSubmit.aersurface_run_id = selectedAersurfaceRun;
    }
    
    updateFormData('makemet_data', dataToSubmit);
    navigate('/terrain-data'); 
  };

  const handleAersurfaceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(); // Switch to AERSURFACE module
    navigate('/aersurface/basic-info'); 
  };

  // Temperature units options
  const temperatureUnits = [
    { value: TemperatureUnit.KELVIN, label: 'Kelvin (K)' },
    { value: TemperatureUnit.CELSIUS, label: 'Celsius (°C)' },
    { value: TemperatureUnit.FAHRENHEIT, label: 'Fahrenheit (°F)' }
  ];

  // Velocity units options
  const velocityUnits = [
    { value: VelocityUnit.METERS_PER_SECOND, label: 'Meters per second (m/s)' },
    { value: VelocityUnit.FEET_PER_MINUTE, label: 'Feet per minute (ft/min)' }
  ];

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

  // Surface profile options
  const surfaceProfileOptions = [
    { value: SurfaceProfile.URBAN, label: 'Urban' },
    { value: SurfaceProfile.RURAL, label: 'Rural' }
  ];

  // Climate type options
  const climateTypeOptions = [
    { value: ClimateType.AVERAGE, label: 'Average' },
    { value: ClimateType.ARID, label: 'Arid' },
    { value: ClimateType.MOIST, label: 'Moist' }
  ];

  // Land use type options
  const landUseTypeOptions = [
    { value: LandUseType.USER_ENTERED_SURFACE_CHARACTERISTICS, label: 'User-entered surface characteristics' },
    { value: LandUseType.USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS, label: 'External surface characteristics file' },
    { value: LandUseType.RURAL, label: 'Rural default' },
    { value: LandUseType.URBAN, label: 'Urban default' },
    { value: LandUseType.USE_AERSURFACE, label: 'Use previous AERSURFACE run' }
  ];

  // Visibility helpers -------------------------------------------------------
  const showFullFields =
    makemetData.land_use_type ===
    LandUseType.USER_ENTERED_SURFACE_CHARACTERISTICS;

  const showFileUploadOnly =
    makemetData.land_use_type ===
    LandUseType.USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS;

  return (
    <SectionContainer
      title="🌡️ Makemet Data"
      onSubmit={handleSubmit}
      nextSection="/terrain-data"          // ← correct route
      previousSection="/building-data"     // ← previous AERSCREEN section
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Land Use Type with AERSURFACE option */}
        <div className="relative">
          <FormField
            label="Land Use Type"
            name="land_use_type"
            type="select"
            value={makemetData.land_use_type}
            onChange={handleChange}
            options={landUseTypeOptions}
            className="col-span-1 md:col-span-2"
          />
          <button
            onClick={handleAersurfaceClick}
            className="absolute top-0 right-0 text-sm text-blue-600 hover:underline"
          >
            Open AERSURFACE →
          </button>
        </div>

        {/* AERSURFACE run selection list */}
        {showAersurfaceList && (
          <div className="col-span-full">
            <h3 className="text-sm font-medium mb-2">Select AERSURFACE Run:</h3>
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {loadingRuns ? (
                <p className="p-4 text-gray-500 text-center">Loading runs...</p>
              ) : runsError ? (
                <p className="p-4 text-red-500 text-center">{runsError}</p>
              ) : aersurfaceRuns.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No AERSURFACE runs found</p>
              ) : (
                aersurfaceRuns.map(run => (
                  <div
                    key={run.run_id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedAersurfaceRun === run.run_id ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                    onClick={() => setSelectedAersurfaceRun(run.run_id)}
                  >
                    <div className="font-medium">{run.title_one}</div>
                    <div className="text-sm text-gray-600">{run.title_two}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Only the file upload */}
        {showFileUploadOnly && (
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Surface Characteristics File
            </label>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm"
            />
          </div>
        )}

        {/* Full set of inputs */}
        {showFullFields && (
          <>
            <FormField
              label="Minimum Ambient Temperature"
              name="min_temp"
              type="number"
              value={makemetData.min_temp}
              onChange={handleChange}
              required
            />
            <FormField
              label="Minimum Temperature Unit"
              name="min_temp_unit"
              type="select"
              value={makemetData.min_temp_unit}
              onChange={handleChange}
              options={temperatureUnits}
              required
            />

            <FormField
              label="Maximum Ambient Temperature"
              name="max_temp"
              type="number"
              value={makemetData.max_temp}
              onChange={handleChange}
              required
            />
            <FormField
              label="Maximum Temperature Unit"
              name="max_temp_unit"
              type="select"
              value={makemetData.max_temp_unit}
              onChange={handleChange}
              options={temperatureUnits}
              required
            />

            <FormField
              label="Minimum Wind Speed"
              name="min_wspd"
              type="number"
              value={makemetData.min_wspd}
              onChange={handleChange}
              required
            />
            <FormField
              label="Minimum Wind Speed Unit"
              name="min_wspd_unit"
              type="select"
              value={makemetData.min_wspd_unit}
              onChange={handleChange}
              options={velocityUnits}
              required
            />

            <FormField
              label="Anemometer Height"
              name="anem_height"
              type="number"
              value={makemetData.anem_height}
              onChange={handleChange}
              required
            />
            <FormField
              label="Anemometer Height Unit"
              name="anem_height_unit"
              type="select"
              value={makemetData.anem_height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
            />

            <FormField
              label="Dominant Surface Profile"
              name="surface_profile"
              type="select"
              value={makemetData.surface_profile}
              onChange={handleChange}
              options={surfaceProfileOptions}
              required
            />

            <FormField
              label="Dominant Climate Type"
              name="climate_type"
              type="select"
              value={makemetData.climate_type}
              onChange={handleChange}
              options={climateTypeOptions}
              required
            />

            {/* Advanced characteristics */}
            <FormField
              label="Albedo"
              name="albedo"
              type="number"
              step={0.01}
              value={makemetData.albedo}
              onChange={handleChange}
            />
            <FormField
              label="Bowen Ratio"
              name="bowen_ratio"
              type="number"
              step={0.01}
              value={makemetData.bowen_ratio}
              onChange={handleChange}
            />
            <FormField
              label="Roughness Length"
              name="roughness_length"
              type="number"
              step={0.01}
              value={makemetData.roughness_length}
              onChange={handleChange}
            />
          </>
        )}

        {/* Show other fields only if not using AERSURFACE */}
        {makemetData.land_use_type !== LandUseType.USE_AERSURFACE && 
         makemetData.land_use_type !== LandUseType.USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS && (
          <>
            <FormField
              label="Albedo"
              name="albedo"
              type="number"
              value={makemetData.albedo}
              onChange={handleChange}
              min={0}
              max={1}
              step={0.01}
            />
            
            <FormField
              label="Bowen Ratio"
              name="bowen_ratio"
              type="number"
              value={makemetData.bowen_ratio}
              onChange={handleChange}
              step={0.1}
            />
            
            <FormField
              label="Roughness Length (m)"
              name="roughness_length"
              type="number"
              value={makemetData.roughness_length}
              onChange={handleChange}
              min={0}
              step={0.001}
            />
          </>
        )}
      </div>
    </SectionContainer>
  );
};

export default MakemetData;