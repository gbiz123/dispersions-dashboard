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

  // NEW: toggle for using discrete receptors
  const [useDiscrete, setUseDiscrete] = useState<boolean>(
    formData.use_discrete_receptors ?? true
  );
  //
  // Distance units options
  const discreteReceptorsUnits = [
    { value: DiscreteReceptorsUnits.METERS, label: 'Meters (m)' },
    { value: DiscreteReceptorsUnits.KILOMETERS, label: 'Kilometers (km)' },
    { value: DiscreteReceptorsUnits.FEET, label: 'Feet (ft)' },
    { value: DiscreteReceptorsUnits.MILES, label: 'Miles (mi)' },
  ];

  // Default values
  const defaultDiscreteReceptors: DiscreteReceptorsType = {
	distance_units: DiscreteReceptorsUnits.METERS,
	include_discrete_receptors: false,
    receptors: [0]
  };

  // Initialize state with existing data or defaults
  const [receptorsData, setReceptorsData] = useState<DiscreteReceptorsType>(
    formData.discrete_receptors || defaultDiscreteReceptors
  );

  // TODO: Instead of units selection per receptor, units and other fields should be defined up top
  
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedReceptors = [...receptorsData.receptors];
    updatedReceptors[index] = parseFloat(value) || 0;
    setReceptorsData({
      ...receptorsData,
      receptors: updatedReceptors
    });
  };

  const addReceptor = () => {
    if (receptorsData.receptors.length >= 10) return;
    setReceptorsData({
      ...receptorsData,
      receptors: [
        ...receptorsData.receptors,
		0
      ]
    });
  };

  const removeReceptor = (index: number) => {
    if (receptorsData.receptors.length <= 1) {
      return; // Don't remove the last receptor
    }

    const updatedReceptors = [...receptorsData.receptors];
    updatedReceptors.splice(index, 1);

    setReceptorsData({
      ...receptorsData,
      receptors: updatedReceptors
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData('use_discrete_receptors', useDiscrete); // NEW
    if (useDiscrete) {
      updateFormData('discrete_receptors', receptorsData);
    }
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
              checked={useDiscrete}
              onChange={() => setUseDiscrete(!useDiscrete)}
            />
            <span>Use discrete receptors here</span>
          </label>
        </Tooltip>

        {useDiscrete && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-4">
              <FormField
                label="Distance Units"
                name="distance_units"
                type="select"
                value={receptorsData.distance_units}
                onChange={(e) => setReceptorsData({ ...receptorsData, distance_units: e.target.value as DiscreteReceptorsUnits })}
                options={discreteReceptorsUnits}
                required
                tooltip="Select the units for receptor distances"
              />
            </div>

            {receptorsData.receptors.map((receptor, index) => (
              <div key={index} className="p-4 border rounded-md mb-5 bg-gray-50 relative">
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => removeReceptor(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    disabled={receptorsData.receptors.length <= 1}
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
                disabled={receptorsData.receptors.length >= 10}
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
