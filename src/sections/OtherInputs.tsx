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
  const [useDefaultMinAmbDist, setUseDefaultMinAmbDist] = useState<boolean>(true)
  
  const defaultOtherInputs: OtherInputsType = {
	use_flagpole_receptors: false,
	flagpole_height_m: 0,
	rural_or_urban: AerscreenRuralOrUrban.RURAL,
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

  const ruralUrbanOptions = [
    { value: AerscreenRuralOrUrban.RURAL, label: 'Rural' },
    { value: AerscreenRuralOrUrban.URBAN, label: 'Urban' }
  ];

  return (
    <SectionContainer
      title="Other Inputs"
      onSubmit={handleSubmit}
      nextSection="/fumigation"
      nextSectionLabel="Fumigation"
      previousSection="/discrete-receptors"
    >
      <InfoSection content="Configure urban/rural classification and minimum ambient distance for regulatory compliance." />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Rural or Urban?"
            name="rural_or_urban"
            type="select"
            value={otherInputs.rural_or_urban}
            onChange={handleChange}
            options={ruralUrbanOptions}
            required
            tooltip="Select whether the source is in a rural or urban area"
          />
          {otherInputs.rural_or_urban === AerscreenRuralOrUrban.URBAN ? (
            <FormField
              label="Urban Population"
              name="population"
              type="number"
              value={otherInputs.population || 0}
              onChange={handleChange}
              tooltip="Enter the urban population if applicable"
            />
          ) : (
            <div></div>
          )}
            {/* Input mode selection */}
          <FormField
            label="Use Default Minimum Ambient Distance"
            name="use_default_minimum_ambient_distance"
            type="checkbox"
            value={useDefaultMinAmbDist}
            onChange={ () => setUseDefaultMinAmbDist(!useDefaultMinAmbDist) }
            tooltip="Use the default AERSCREEN minimum ambient distance. Non-volume sources are 1 meter, and volume sources are 2.15 times the initial lateral dimension."
          />

		  {!useDefaultMinAmbDist && (
			  <FormField
				label="Minimum Distance to Ambient Air (m)"
				name="distance_to_amb_air"
				type="number"
				value={otherInputs.distance_to_amb_air}
				onChange={handleChange}
				required
				tooltip="Enter the minimum distance to ambient air in meters"
			  />
		  )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default OtherInputs;
