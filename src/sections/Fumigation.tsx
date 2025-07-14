import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { AerscreenFumigation as FumigationType } from '../types/api';
import { DistanceUnit } from '../types/enums';

const Fumigation: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  
  // Default values
  const defaultFumigation: FumigationType = {
    distance_to_shoreline: 0,
    shore_dist_unit: DistanceUnit.METERS,
    shoreline_fumigation: false,
    inversion_break_up: false
    // ⬆ add more defaults when additional fields are known
  };
  
  // Initialize state with existing data or defaults
  const [fumigation, setFumigation] = useState<FumigationType>(
    formData.fumigation || defaultFumigation
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFumigation(prev => ({ ...prev, [name]: checked }));
    } else {
      setFumigation(prev => ({
        ...prev,
        [name]: name.includes('shore_dist') && !name.includes('unit')
          ? parseFloat(value) || 0
          : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (fumigation.distance_to_shoreline <= 0) {
      alert('Shore distance must be greater than 0');
      return;
    }
    
    updateFormData('fumigation', fumigation);
    navigate('/debug');
  };

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

  return (
    <SectionContainer
      title="Fumigation"
      onSubmit={handleSubmit}
      nextSection="/debug"
      nextSectionLabel="Debug"
      previousSection="/other-inputs"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Shore Line Distance"
          name="shore_dist"
          type="number"
          value={fumigation.distance_to_shoreline}
          onChange={handleChange}
          required
        />
        <FormField
          label="Distance Unit"
          name="shore_dist_unit"
          type="select"
          value={fumigation.shore_dist_unit}
          onChange={handleChange}
          options={distanceUnits}
          required
        />

        {/* Add inputs for other FumigationType numeric/string fields here */}
      </div>

      {/* Check-boxes */}
      <div className="mt-6 space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="enable_shoreline_fumigation"
            checked={fumigation.shoreline_fumigation}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <span>Enable shoreline fumigation</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="use_inv_breakup"
            checked={fumigation.inversion_break_up}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <span>Use inversion breakup</span>
        </label>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-medium text-blue-800">About Fumigation</h3>
        <p className="text-sm text-blue-700 mt-2">
          Fumigation refers to the mixing of a plume with the growing convective boundary layer 
          when it is carried over a shore by the wind. This can lead to elevated ground-level
          concentrations. Shore distance represents the distance from the source to the shoreline.
        </p>
      </div>
    </SectionContainer>
  );
};

export default Fumigation;
