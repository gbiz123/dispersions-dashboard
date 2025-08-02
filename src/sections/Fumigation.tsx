import InfoSection from 'components/InfoSection';
import WarningSection from 'components/WarningSection';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { AerscreenFumigation as FumigationType } from '../types/api';
import { AerscreenSourceType, DistanceUnit } from '../types/enums';


const Fumigation: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  
  const defaultFumigation: FumigationType = {
    distance_to_shoreline: 0,
    shoreline_fumigation: false,
    inversion_break_up: false,
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
        [name]: type === 'number'
          ? parseFloat(value) || 0
          : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
	  {
		  (formData.source_data.sourceType !== AerscreenSourceType.POINT ||
		  formData.source_data.height < 10) && (
		  <WarningSection content="Shoreline and inversion breakup fumigation effects are only applicable to point sources with release heights 10m or higher." /> 
	  )}
	  {
		  formData.source_data.sourceType === AerscreenSourceType.POINT &&
		  formData.source_data.height >= 10 && (
		  <>
		  <InfoSection content="Calculate fumigation due to inversion breakup and coastal fumigation for point sources with release heights 10m or higher." /> 
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
		  {/* Check-boxes */}
			<FormField
			  label="Enable Shoreline Fumigation"
			  name="shoreline_fumigation"
			  type="checkbox"
			  value={fumigation.shoreline_fumigation}
			  onChange={handleChange}
			  required
			  tooltip="Apply shoreline fumigation effects to the study"
			/>

			<FormField
			  label="Enable Inversion Breakup"
			  name="inversion_break_up"
			  type="checkbox"
			  value={fumigation.inversion_break_up}
			  onChange={handleChange}
			  required
			  tooltip="Apply inversion breakup fumigation effects to the study"
			/>

			{fumigation.shoreline_fumigation && (
				<>
					<FormField
					  label="Shoreline Distance (m)"
					  name="distance_to_shoreline"
					  type="number"
					  value={fumigation.distance_to_shoreline}
					  onChange={handleChange}
					  required
					  tooltip="Enter the minimum distance from the emission source to the shoreline in meters"
					/>
					<FormField
					  label="Direction to shoreline (deg)"
					  name="direction_to_shoreline_deg"
					  type="number"
					  value={fumigation.direction_to_shoreline_deg}
					  onChange={handleChange}
					  tooltip="Optional direction to shoreline from emission source"
					/>
				</>
			)}

			{/* Add inputs for other FumigationType numeric/string fields here */}
		  </div>
	    </>
	  )}
    </SectionContainer>
  );
};

export default Fumigation;
