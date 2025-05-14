import React, { useState } from 'react';
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

const MakemetData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  
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

  // Visibility helpers -------------------------------------------------------
  const showFullFields =
    makemetData.land_use_type ===
    LandUseType.USER_ENTERED_SURFACE_CHARACTERISTICS;

  const showFileUploadOnly =
    makemetData.land_use_type ===
    LandUseType.USE_EXTERNAL_FILE_OF_SURFACE_CHARACTERISTICS;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numeric =
      [
        'min_temp',
        'max_temp',
        'min_wspd',
        'anem_height',
        'albedo',
        'bowen_ratio',
        'roughness_length'
      ].includes(name);

    setMakemetData(prev => ({
      ...prev,
      [name]: numeric ? parseFloat(value) || 0 : value
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
    
    // Basic validation
    if (makemetData.min_temp > makemetData.max_temp) {
      alert('Minimum temperature cannot be greater than maximum temperature');
      return;
    }
    
    updateFormData('makemet_data', makemetData);
    navigate('/terrain-data');
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
    { value: LandUseType.URBAN, label: 'Urban default' }
  ];

  return (
    <SectionContainer
      title="Makemet Data"
      onSubmit={handleSubmit}
      nextSection="/terrain-data"
      nextSectionLabel="Terrain Data"
      previousSection="/building-data"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Land-use selector FIRST */}
        <FormField
          label="Land Use Type"
          name="land_use_type"
          type="select"
          value={makemetData.land_use_type}
          onChange={handleChange}
          options={landUseTypeOptions}
          className="col-span-1 md:col-span-2"
        />

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
      </div>
    </SectionContainer>
  );
};

export default MakemetData;