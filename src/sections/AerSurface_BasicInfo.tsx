import React, { useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import FormField from '../components/forms/FormField';
import { useAersurface } from '../context/AersurfaceContext';
import InfoSection from '../components/InfoSection';

const BasicInfo: React.FC = () => {
  const { formData, update } = useAersurface();

  type BasicInfoState = {
    title1: string;
    title2: string;
    location: 'Primary' | 'Secondary';
    debug: 'EFFRAD' | 'GRID' | 'TIFF' | 'All';
  };

  const [state, set] = useState<BasicInfoState>(
    (formData.basic_info as BasicInfoState) ?? {
      title1: '',
      title2: '',
      location: 'Primary',
      debug: 'EFFRAD',
    }
  );

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    set({ ...state, [e.target.name]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    update('basic_info', state);
  };

  return (
    <SectionContainer
      title="📝 Basic Info"
      onSubmit={submit}
      nextSection="/aersurface/surface-roughness"
      previousSection="/"
      nextSectionLabel="Surface Roughness"
    >
      <InfoSection content="Info section: Provide basic information about your AERSURFACE analysis including project titles and debugging options." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          label="Title 1" 
          name="title1" 
          type="text" 
          value={state.title1} 
          onChange={handle} 
          maxLength={200}
          tooltip="Dummy tooltip: Enter the main title for this analysis"
        />
        <FormField 
          label="Title 2" 
          name="title2" 
          type="text" 
          value={state.title2} 
          onChange={handle} 
          maxLength={200}
          tooltip="Dummy tooltip: Enter a subtitle or additional description"
        />
        <FormField
          label="Location"
          name="location"
          type="select"
          value={state.location}
          onChange={handle}
          options={[
            { value: 'Primary', label: 'Primary' },
            { value: 'Secondary', label: 'Secondary' },
          ]}
          tooltip="Dummy tooltip: Select the location type"
        />
        <FormField
          label="Debug Mode"
          name="debug"
          type="select"
          value={state.debug}
          onChange={handle}
          options={[
            { value: 'EFFRAD', label: 'EFFRAD' },
            { value: 'GRID', label: 'GRID' },
            { value: 'TIFF', label: 'TIFF' },
            { value: 'All', label: 'All' },
          ]}
          tooltip="Dummy tooltip: Select debug output options"
        />
      </div>
    </SectionContainer>
  );
};

export default BasicInfo;