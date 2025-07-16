import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useRunContext } from '../context/RunContext';
import { AerscreenOtherInputs as OtherInputsType } from '../types/api';
import { AerscreenOtherInputsUnits, AerscreenRuralOrUrban, DistanceUnit, RuralUrban } from '../types/enums';

const OtherInputs: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  
  const defaultOtherInputs: OtherInputsType = {
	use_flagpole_receptors: false,
	flagpole_height_m: 0,
	units: AerscreenOtherInputsUnits.METRIC,
	rural_or_urban: AerscreenRuralOrUrban.RURAL,
    distance_to_amb_air: 1,
    population: 0,
  };
  
  const [otherInputs, setOtherInputs] = useState<OtherInputsType>(
    formData.other_inputs || defaultOtherInputs
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setOtherInputs(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setOtherInputs(prev => ({
        ...prev,
        [name]: name.includes('min_dist') || name.includes('population') 
          ? parseFloat(value) || 0 
          : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData('other_inputs', otherInputs);
    navigate('/debug');
  };

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

  const ruralUrbanOptions = [
    { value: RuralUrban.RURAL, label: 'Rural' },
    { value: RuralUrban.URBAN, label: 'Urban' }
  ];

  return (
    <SectionContainer
      title="Other Inputs"
      onSubmit={handleSubmit}
      nextSection="/fumigation"
      nextSectionLabel="Fumigation"
      previousSection="/discrete-receptors"
    >
      <InfoSection content="Info section: Configure additional modeling parameters including urban/rural classification and minimum distances for regulatory compliance." />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Rural or Urban?"
            name="rural_urban"
            type="select"
            value={otherInputs.rural_or_urban}
            onChange={handleChange}
            options={ruralUrbanOptions}
            required
            tooltip="Dummy tooltip: Select whether the area is rural or urban"
          />
          <FormField
            label="Minimum Distance to Ambient Air"
            name="min_dist_ambient"
            type="number"
            value={otherInputs.distance_to_amb_air}
            onChange={handleChange}
            required
            tooltip="Dummy tooltip: Enter the minimum distance to ambient air boundary"
          />
          <FormField
            label="Distance Unit"
            name="min_dist_ambient_unit"
            type="select"
            value={otherInputs.distance_to_amb_air}
            onChange={handleChange}
            options={distanceUnits}
            required
            tooltip="Dummy tooltip: Select the unit for distance"
          />
          
          <FormField
            label="Urban Population"
            name="urban_population"
            type="number"
            value={otherInputs.population || 0}
            onChange={handleChange}
            tooltip="Dummy tooltip: Enter the urban population if applicable"
          />
        </div>
      </div>
    </SectionContainer>
  );
};

export default OtherInputs;
