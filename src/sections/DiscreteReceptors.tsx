import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { DiscreteReceptors as DiscreteReceptorsType, Receptor } from '../types/api';
import { DistanceUnit } from '../types/enums';

const DiscreteReceptors: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();

  // NEW: toggle for using discrete receptors
  const [useDiscrete, setUseDiscrete] = useState<boolean>(
    formData.use_discrete_receptors ?? true
  );

  // Default values
  const defaultDiscreteReceptors: DiscreteReceptorsType = {
    receptors: [
      {
        x: 0,
        y: 0,
        elevation: 0,
        x_unit: DistanceUnit.METERS,
        y_unit: DistanceUnit.METERS,
        elevation_unit: DistanceUnit.METERS
      }
    ]
  };

  // Initialize state with existing data or defaults
  const [receptorsData, setReceptorsData] = useState<DiscreteReceptorsType>(
    formData.discrete_receptors || defaultDiscreteReceptors
  );

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedReceptors = [...receptorsData.receptors];

    updatedReceptors[index] = {
      ...updatedReceptors[index],
      [name]: name.includes('x') || name.includes('y') || name.includes('elevation') 
        ? parseFloat(value) || 0 
        : value
    };

    setReceptorsData({
      ...receptorsData,
      receptors: updatedReceptors
    });
  };

  const addReceptor = () => {
    if (receptorsData.receptors.length >= 10) return; // NEW: hard cap
    setReceptorsData({
      ...receptorsData,
      receptors: [
        ...receptorsData.receptors,
        {
          x: 0,
          y: 0,
          elevation: 0,
          x_unit: DistanceUnit.METERS,
          y_unit: DistanceUnit.METERS,
          elevation_unit: DistanceUnit.METERS
        }
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
      <div className="space-y-6">
        {/* NEW: checkbox */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useDiscrete}
            onChange={() => setUseDiscrete(!useDiscrete)}
          />
          <span>Use discrete receptors here</span>
        </label>

        <div
          className={
            useDiscrete ? '' : 'opacity-50 pointer-events-none select-none'
          }
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Receptors</h3>
            <button
              type="button"
              onClick={addReceptor}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              disabled={!useDiscrete || receptorsData.receptors.length >= 10}
            >
              Add Receptor
            </button>
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
                  label="X Coordinate"
                  name="x"
                  type="number"
                  value={receptor.x}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
                <FormField
                  label="X Unit"
                  name="x_unit"
                  type="select"
                  value={receptor.x_unit}
                  onChange={(e) => handleChange(index, e)}
                  options={distanceUnits}
                  required
                />

                <FormField
                  label="Y Coordinate"
                  name="y"
                  type="number"
                  value={receptor.y}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
                <FormField
                  label="Y Unit"
                  name="y_unit"
                  type="select"
                  value={receptor.y_unit}
                  onChange={(e) => handleChange(index, e)}
                  options={distanceUnits}
                  required
                />

                <FormField
                  label="Elevation"
                  name="elevation"
                  type="number"
                  value={receptor.elevation || 0}
                  onChange={(e) => handleChange(index, e)}
                />
                <FormField
                  label="Elevation Unit"
                  name="elevation_unit"
                  type="select"
                  value={receptor.elevation_unit || DistanceUnit.METERS}
                  onChange={(e) => handleChange(index, e)}
                  options={distanceUnits}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default DiscreteReceptors;