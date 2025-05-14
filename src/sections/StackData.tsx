import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { StackData as StackDataType } from '../types/api';
import { DistanceUnit, VelocityUnit, FlowRateUnit, TemperatureUnit, EmissionRateUnit } from '../types/enums';

// Add SourceType enum
enum SourceType {
  POINT = 'point',
  POINTCAP = 'pointcap',
  AREA = 'area',
  VOLUME = 'volume',
  LINE = 'line'
}

const StackData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  
  // Default values
  const defaultStackData: StackDataType & { sourceType: SourceType } = {
    rate: 0,
    height: 0,
    diam: 0,
    temp_k: 0,
    vel: 0,
    flow_rate: 0,
    rate_unit: EmissionRateUnit.GRAMS_PER_SECOND,
    height_unit: DistanceUnit.METERS,
    diam_unit: DistanceUnit.METERS,
    temp_unit: TemperatureUnit.KELVIN,
    vel_unit: VelocityUnit.METERS_PER_SECOND,
    flow_rate_unit: FlowRateUnit.CUBIC_METERS_PER_SECOND,
    sourceType: SourceType.POINT
  };
  
  // Initialize state with existing data or defaults
  const [stackData, setStackData] = useState<StackDataType & { sourceType: SourceType }>(
    formData.stack_data 
      ? { ...formData.stack_data, sourceType: SourceType.POINT } 
      : defaultStackData
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStackData(prev => ({
      ...prev,
      [name]: name.includes('rate') || name.includes('height') || name.includes('diam') || 
              name.includes('temp') || name.includes('vel') || name.includes('flow') 
                ? parseFloat(value) || 0 
                : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData('stack_data', stackData);
    navigate('/building-data');
  };

  // Source type options
  const sourceTypeOptions = [
    { value: SourceType.POINT, label: 'Point' },
    { value: SourceType.POINTCAP, label: 'Pointcap' },
    { value: SourceType.AREA, label: 'Area' },
    { value: SourceType.VOLUME, label: 'Volume' },
    { value: SourceType.LINE, label: 'Line' }
  ];

  // Emit rate units options
  const emissionRateUnits = [
    { value: EmissionRateUnit.GRAMS_PER_SECOND, label: 'Grams per second (g/s)' },
    { value: EmissionRateUnit.POUNDS_PER_HOUR, label: 'Pounds per hour (lb/hr)' }
  ];

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

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

  // Flow rate units options
  const flowRateUnits = [
    { value: FlowRateUnit.CUBIC_METERS_PER_SECOND, label: 'Cubic meters per second (m³/s)' },
    { value: FlowRateUnit.CUBIC_FEET_PER_MINUTE, label: 'Cubic feet per minute (ft³/min)' }
  ];

  return (
    <SectionContainer
      title="Stack Data"
      onSubmit={handleSubmit}
      nextSection="/building-data"
      nextSectionLabel="Building Data"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Type - New dropdown */}
        <FormField
          label="Source Type"
          name="sourceType"
          type="select"
          value={stackData.sourceType}
          onChange={handleChange}
          options={sourceTypeOptions}
          required
        />
        <div className="md:col-span-1"></div>
        
        <FormField
          label="Emission Rate"
          name="rate"
          type="number"
          value={stackData.rate}
          onChange={handleChange}
          required
        />
        <FormField
          label="Emission Rate Unit"
          name="rate_unit"
          type="select"
          value={stackData.rate_unit}
          onChange={handleChange}
          options={emissionRateUnits}
          required
        />
        
        <FormField
          label="Stack Height"
          name="height"
          type="number"
          value={stackData.height}
          onChange={handleChange}
          required
        />
        <FormField
          label="Stack Height Unit"
          name="height_unit"
          type="select"
          value={stackData.height_unit}
          onChange={handleChange}
          options={distanceUnits}
          required
        />
        
        <FormField
          label="Stack Diameter"
          name="diam"
          type="number"
          value={stackData.diam}
          onChange={handleChange}
          required
        />
        <FormField
          label="Stack Diameter Unit"
          name="diam_unit"
          type="select"
          value={stackData.diam_unit}
          onChange={handleChange}
          options={distanceUnits}
          required
        />
        
        <FormField
          label="Stack Gas Exit Temperature"
          name="temp_k"
          type="number"
          value={stackData.temp_k}
          onChange={handleChange}
          required
        />
        <FormField
          label="Temperature Unit"
          name="temp_unit"
          type="select"
          value={stackData.temp_unit}
          onChange={handleChange}
          options={temperatureUnits}
          required
        />
        
        <FormField
          label="Stack Gas Exit Velocity"
          name="vel"
          type="number"
          value={stackData.vel}
          onChange={handleChange}
          required
        />
        <FormField
          label="Velocity Unit"
          name="vel_unit"
          type="select"
          value={stackData.vel_unit}
          onChange={handleChange}
          options={velocityUnits}
          required
        />
        
        <FormField
          label="Stack Gas Exit Flow Rate"
          name="flow_rate"
          type="number"
          value={stackData.flow_rate}
          onChange={handleChange}
          required
        />
        <FormField
          label="Flow Rate Unit"
          name="flow_rate_unit"
          type="select"
          value={stackData.flow_rate_unit}
          onChange={handleChange}
          options={flowRateUnits}
          required
        />
      </div>
    </SectionContainer>
  );
};

export default StackData;