import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { AerscreenMakemetData as MakemetDataType } from '../types/api';
import { 
  DistanceUnit, 
  VelocityUnit, 
  RuralUrban, 
  ClimateType,
  LandUseType,
  TemperatureUnit
} from '../types/enums';
import { API_CONFIG } from '../config';
import { useModule } from '../context/ModuleContext'; // Add this import
import InfoSection from 'components/InfoSection';

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
  

  // Fetch AERSURFACE runs when dropdown changes
  useEffect(() => {
    if (formData.makemet_data?.land_use_type !== LandUseType.USE_PREVIOUS_AERSURFACE_RUN) {
      setShowAersurfaceList(false);
      setSelectedAersurfaceRun(null);
      return;
    }

    setShowAersurfaceList(true);
    setLoadingRuns(true);
    setRunsError(null);

    const url = getAersurfaceListUrl();
    console.log('→ fetching AERSURFACE runs from', url);

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
  }, [formData.makemet_data?.land_use_type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    updateFormData('makemet_data', {
      ...formData.makemet_data,
      [name]: processedValue
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData('makemet_data', {
      ...formData.makemet_data,
      surface_characteristics_filename: e.target.files?.[0] ?? null
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: any = { ...formData.makemet_data };
    
    
    if (formData.makemet_data?.land_use_type === LandUseType.USE_PREVIOUS_AERSURFACE_RUN && selectedAersurfaceRun) {
      dataToSubmit.aersurface_run_id = selectedAersurfaceRun;
      updateFormData('makemet_data', dataToSubmit);
    }
    
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
    { value: TemperatureUnit.FAHRENHEIT, label: 'Fahrenheit (°F)' }
  ];

  // Surface profile options
  const ruralUrbanOptions = [
    { value: RuralUrban.URBAN, label: 'Urban' },
    { value: RuralUrban.RURAL, label: 'Rural' }
  ];

  // Climate type options
  const climateTypeOptions = [
    { value: ClimateType.AVERAGE_MOISTURE, label: 'Average moisture' },
    { value: ClimateType.DRY_CONDITIONS, label: 'Dry conditions' },
    { value: ClimateType.WET_CONDITIONS, label: 'Wet conditions' },
    { value: ClimateType.NONE, label: 'None' }
  ];

  // Land use type options
  const landUseTypeOptions = [
    { value: LandUseType.USER_ENTERED_SURFACE_CHARACTERISTICS, label: 'User-entered surface characteristics' },
    { value: LandUseType.USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS, label: 'External surface characteristics file' },
    { value: LandUseType.WATER, label: 'Water' },
    { value: LandUseType.DECIDUOUS_FOREST, label: 'Deciduous Forest' },
    { value: LandUseType.CONIFEROUS_FOREST, label: 'Coniferous Forest' },
    { value: LandUseType.SWAMP, label: 'Swamp' },
    { value: LandUseType.CULTIVATED_LAND, label: 'Cultivated Land' },
    { value: LandUseType.GRASSLAND, label: 'Grassland' },
    { value: LandUseType.URBAN, label: 'Urban' },
    { value: LandUseType.DESERT_SHRUB_LAND, label: 'Desert Shrub Land' },
    { value: LandUseType.USE_PREVIOUS_AERSURFACE_RUN, label: 'Use Previous AERSURFACE run' },
  ];

  // Visibility helpers -------------------------------------------------------
  const showFileUploadOnly =
    formData.makemet_data?.land_use_type ===
    LandUseType.USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS;

  return (
    <SectionContainer
      title="Meteorology"
      onSubmit={handleSubmit}
      nextSection="/terrain-data"          // ← correct route
      previousSection="/building-data"     // ← previous AERSCREEN section
    >
      <InfoSection content="Configure meteorological and surface data for inputs into the MAKEMET meteorology preprocessor." />

	  <h3 className="text-lg font-semibold mt-6 mb-3">Climate Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <>
            <FormField
              label="Minimum Ambient Temperature"
              name="min_temp_k"
              type="number"
              value={formData.makemet_data?.min_temp_k || 0}
              onChange={handleChange}
              required
			  tooltip="Enter the minimum ambient air temperature in Fahrenheit or Kelvin"
            />
			<FormField
			  label="Minimum Temperature Units"
			  name="min_temp_units"
			  type="select"
			  value={formData.makemet_data?.min_temp_units || ''}
			  onChange={handleChange}
			  options={temperatureUnits}
			  required
			  tooltip="Select the unit for temperature"
			/>
            <FormField
              label="Maximum Ambient Temperature"
              name="max_temp_k"
              type="number"
              value={formData.makemet_data?.max_temp_k || 0}
              onChange={handleChange}
              required
			  tooltip="Enter the maximum ambient air temperature in Fahrenheit or Kelvin"
            />
			<FormField
			  label="Maximum Temperature Units"
			  name="max_temp_units"
			  type="select"
			  value={formData.makemet_data?.max_temp_units || ''}
			  onChange={handleChange}
			  options={temperatureUnits}
			  required
			  tooltip="Select the unit for temperature"
			/>
            <FormField
              label="Minimum Wind Speed (m/s)"
              name="min_wind_speed_m_s"
              type="number"
              value={formData.makemet_data?.min_wind_speed_m_s || 0}
              onChange={handleChange}
              required
			  tooltip="Enter the minimum wind speed in meters per second"
            />
            <FormField
              label="Anemometer Height (m)"
              name="anemometer_height_m"
              type="number"
              value={formData.makemet_data?.anemometer_height_m || 10}
              onChange={handleChange}
              required
			  tooltip="Enter the anemometer height in meters"
            />
          </>
        {/* Land Use Type with AERSURFACE option */}
		</div>
		<h3 className="text-lg font-semibold mt-6 mb-3">Surface Characteristics</h3>
        <div className="mb-6 border-t border-gray-200 pt-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="relative">
				  <FormField
					label="Land Use Type"
					name="land_use_type"
					type="select"
					value={formData.makemet_data?.land_use_type || ''}
					onChange={handleChange}
					options={landUseTypeOptions}
					className="col-span-1 md:col-span-2"
				  />
				  {formData.makemet_data?.land_use_type === LandUseType.USE_PREVIOUS_AERSURFACE_RUN && (
					  <button
						onClick={handleAersurfaceClick}
						className="absolute top-0 right-0 text-sm text-blue-600 hover:underline"
					  >
						New AERSURFACE Run →
					  </button>
				  )}
			</div>

			{
				formData.makemet_data?.land_use_type != LandUseType.USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS &&
				formData.makemet_data?.land_use_type != LandUseType.USER_ENTERED_SURFACE_CHARACTERISTICS && 
				formData.makemet_data?.land_use_type != LandUseType.USE_PREVIOUS_AERSURFACE_RUN && (
					<FormField
					  label="Climatology Type"
					  name="climatology_type"
					  type="select"
					  value={formData.makemet_data?.climatology_type || ''}
					  onChange={handleChange}
					  options={climateTypeOptions}
					  required
					/>
				)
			}
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


        {/* Show other fields only if not using AERSURFACE */}
        {formData.makemet_data?.land_use_type === LandUseType.USER_ENTERED_SURFACE_CHARACTERISTICS && (
		  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              label="Albedo"
              name="albedo"
              type="number"
              value={formData.makemet_data?.albedo || 0}
              onChange={handleChange}
              min={0}
              max={1}
              step={0.01}
            />
            
            <FormField
              label="Bowen Ratio"
              name="bowen_ratio"
              type="number"
              value={formData.makemet_data?.bowen_ratio || 0}
              onChange={handleChange}
              step={0.1}
            />
            
            <FormField
              label="Roughness Length (m)"
              name="roughness_length"
              type="number"
              value={formData.makemet_data?.surface_roughness || 0}
              onChange={handleChange}
              min={0}
              step={0.001}
            />
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default MakemetData;
