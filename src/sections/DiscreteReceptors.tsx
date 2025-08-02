import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { AerscreenDiscreteReceptors as DiscreteReceptorsType } from '../types/api';
import { DiscreteReceptorsUnits, DistanceUnit } from '../types/enums';
import InfoSection from '../components/InfoSection';
import Tooltip from '../components/Tooltip';

const DiscreteReceptors: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();

  // Distance units options
  const discreteReceptorsUnits = [
    { value: DiscreteReceptorsUnits.METERS, label: 'Meters (m)' },
    { value: DiscreteReceptorsUnits.KILOMETERS, label: 'Kilometers (km)' },
    { value: DiscreteReceptorsUnits.FEET, label: 'Feet (ft)' },
    { value: DiscreteReceptorsUnits.MILES, label: 'Miles (mi)' },
  ];

  // TODO: Instead of units selection per receptor, units and other fields should be defined up top
  
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const currentReceptors = formData.discrete_receptors?.receptors || [0];
    const updatedReceptors = [...currentReceptors];
    updatedReceptors[index] = parseFloat(value) || 0;
    
    updateFormData('discrete_receptors', {
      ...formData.discrete_receptors,
      receptors: updatedReceptors
    });
  };

  const addReceptor = () => {
    const currentReceptors = formData.discrete_receptors?.receptors || [0];
    if (currentReceptors.length >= 10) return;
    
    updateFormData('discrete_receptors', {
      ...formData.discrete_receptors,
      receptors: [...currentReceptors, 0]
    });
  };

  const removeReceptor = (index: number) => {
    const currentReceptors = formData.discrete_receptors?.receptors || [0];
    if (currentReceptors.length <= 1) {
      return; // Don't remove the last receptor
    }

    const updatedReceptors = [...currentReceptors];
    updatedReceptors.splice(index, 1);

    updateFormData('discrete_receptors', {
      ...formData.discrete_receptors,
      receptors: updatedReceptors
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/other-inputs');
  };

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

  return (
    <SectionContainer
      title="Discrete Receptors"
      onSubmit={handleSubmit}
      nextSection="/other-inputs"
      nextSectionLabel="Other Inputs"
      previousSection="/terrain-data"
    >
      <InfoSection content="Include up to 10 specific receptor locations for detailed concentration calculations." />
      
      <div className="space-y-6">
        {/* NEW: checkbox */}
        <Tooltip content="Check the box to include discrete receptors in this study">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.use_discrete_receptors ?? false}
              onChange={() => updateFormData('use_discrete_receptors', !formData.use_discrete_receptors)}
            />
            <span>Include Discrete Receptors</span>
          </label>
        </Tooltip>

        {formData.use_discrete_receptors && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-4">
              <FormField
                label="Distance Units"
                name="distance_units"
                type="select"
                value={formData.discrete_receptors?.distance_units || DiscreteReceptorsUnits.METERS}
                onChange={(e) => updateFormData('discrete_receptors', { ...formData.discrete_receptors, distance_units: e.target.value as DiscreteReceptorsUnits })}
                options={discreteReceptorsUnits}
                required
                tooltip="Select the units for receptor distances"
              />
            </div>

            {(formData.discrete_receptors?.receptors || [0]).map((receptor: any, index: any) => (
              <div key={index} className="p-4 border rounded-md mb-5 bg-gray-50 relative">
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => removeReceptor(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    disabled={(formData.discrete_receptors?.receptors || [0]).length <= 1}
                  >
                    <span className="text-xl">&times;</span>
                  </button>
                </div>

                <h4 className="font-medium mb-3">Receptor {index + 1}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Receptor"
                    name="distance"
                    type="number"
                    value={receptor}
                    onChange={(e) => handleChange(index, e)}
                    required
                    tooltip="Enter the distance along plume centerline of the receptor"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Receptors</h3>
              <button
                type="button"
                onClick={addReceptor}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                disabled={(formData.discrete_receptors?.receptors || [0]).length >= 10}
              >
                Add Receptor
              </button>
            </div>
          </div>
        )}
        </div>
    </SectionContainer>
  );
};

export default DiscreteReceptors;
