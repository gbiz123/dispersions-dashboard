import React, { useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import FormField from '../components/forms/FormField';
import { useAersurface } from '../context/AersurfaceContext';
import InfoSection from '../components/InfoSection';

type RoughnessState = {
  method: 'ZORAD' | 'ZOEFF';
  zo_radius?: number;
};

const SurfaceRoughness: React.FC = () => {
  const { formData, update } = useAersurface();

  const [state, set] = useState<RoughnessState>(
    (formData.surface_roughness as RoughnessState) ?? { method: 'ZORAD', zo_radius: 1.0 }
  );

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    set((prev) => ({
      ...prev,
      [name]: name === 'zo_radius' ? parseFloat(value) || 0 : (value as RoughnessState['method']),
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    update('surface_roughness', state);
  };

  return (
    <SectionContainer
      title="🌾 Surface Roughness"
      onSubmit={submit}
      nextSection="/aersurface/meteorology"
      previousSection="/aersurface/basic-info"
      nextSectionLabel="Meteorology"
    >
      <InfoSection content="Info section: Configure surface roughness calculation methods. Surface roughness affects wind profiles and turbulence in the atmospheric boundary layer." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Surface Roughness Method"
          name="method"
          type="select"
          value={state.method}
          onChange={handle}
          options={[
            { value: 'ZORAD', label: 'ZORAD' },
            { value: 'ZOEFF', label: 'ZOEFF' },
          ]}
          tooltip="Dummy tooltip: Select the method for calculating surface roughness"
        />

        {state.method === 'ZORAD' && (
          <FormField
            label="Zo Radius (km)"
            name="zo_radius"
            type="number"
            min={0.1}
            step={0.1}
            value={state.zo_radius ?? 1.0}
            onChange={handle}
            tooltip="Dummy tooltip: Enter the radius for ZORAD calculations"
          />
        )}
      </div>
    </SectionContainer>
  );
};

export default SurfaceRoughness;