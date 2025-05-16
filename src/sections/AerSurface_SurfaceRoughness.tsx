import React, { useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import FormField from '../components/forms/FormField';
import { useAersurface } from '../context/AersurfaceContext';

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
          />
        )}
      </div>
    </SectionContainer>
  );
};

export default SurfaceRoughness;