import React, { useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import FormField from '../components/forms/FormField';
import { useAersurface } from '../context/AersurfaceContext';

type CoordUnits = 'UTM' | 'LatLon';

type MeteorologyState = {
  coord_units: CoordUnits;
  easting?: number;
  northing?: number;
  latitude?: number;
  longitude?: number;
  datum: 'NAD27' | 'NAD83';
  anem_height: number;
  surface_moisture: 'Wet' | 'Dry' | 'Average';
  snow_cover: 'Snow' | 'No snow';
  arid_condition?: 'Arid' | 'Non-arid';
};

const Meteorology: React.FC = () => {
  const { formData, update } = useAersurface();

  const [state, set] = useState<MeteorologyState>(
    (formData.meteorology as MeteorologyState) ?? {
      coord_units: 'UTM',
      easting: 0,
      northing: 0,
      datum: 'NAD83',
      anem_height: 10,
      surface_moisture: 'Average',
      snow_cover: 'Snow'
    }
  );

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    set(prev => {
      let next: typeof prev = { ...prev };

      if (name === 'anem_height') {
        const h = Math.min(100, Math.max(1, parseFloat(value) || 0));
        next.anem_height = h;
      } else if (name === 'easting' || name === 'northing' || name === 'latitude' || name === 'longitude') {
        next[name] = parseFloat(value) || 0;
      } else {
        (next as any)[name] = value;
      }

      // clear arid condition if not relevant
      if (name === 'snow_cover' && value !== 'No snow') next.arid_condition = undefined;
      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    update('meteorology', state);
  };

  return (
    <SectionContainer
      title="🌤️ Meteorology"
      onSubmit={submit}
      nextSection="/aersurface/land-cover"
      previousSection="/aersurface/surface-roughness"
      nextSectionLabel="Land Cover"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coordinate units selector */}
        <FormField
          label="Coordinate Units"
          name="coord_units"
          type="select"
          value={state.coord_units}
          onChange={handle}
          options={[
            { value: 'UTM', label: 'UTM' },
            { value: 'LatLon', label: 'Latitude/Longitude' }
          ]}
        />

        {/* Datum */}
        <FormField
          label="Datum"
          name="datum"
          type="select"
          value={state.datum}
          onChange={handle}
          options={[
            { value: 'NAD27', label: 'NAD27' },
            { value: 'NAD83', label: 'NAD83' }
          ]}
        />

        {/* Coordinates */}
        {state.coord_units === 'UTM' ? (
          <>
            <FormField
              label="Easting"
              name="easting"
              type="number"
              value={state.easting ?? 0}
              onChange={handle}
              required
            />
            <FormField
              label="Northing"
              name="northing"
              type="number"
              value={state.northing ?? 0}
              onChange={handle}
              required
            />
          </>
        ) : (
          <>
            <FormField
              label="Latitude"
              name="latitude"
              type="number"
              value={state.latitude ?? 0}
              onChange={handle}
              required
            />
            <FormField
              label="Longitude"
              name="longitude"
              type="number"
              value={state.longitude ?? 0}
              onChange={handle}
              required
            />
          </>
        )}

        {/* Anemometer height */}
        <FormField
          label="Anemometer Height (1–100 m)"
          name="anem_height"
          type="number"
          min={1}
          max={100}
          step={0.1}
          value={state.anem_height}
          onChange={handle}
          required
        />

        {/* Surface moisture */}
        <FormField
          label="Surface Moisture"
          name="surface_moisture"
          type="select"
          value={state.surface_moisture}
          onChange={handle}
          options={[
            { value: 'Wet', label: 'Wet' },
            { value: 'Dry', label: 'Dry' },
            { value: 'Average', label: 'Average' }
          ]}
        />

        {/* Snow cover */}
        <FormField
          label="Snow Cover"
          name="snow_cover"
          type="select"
          value={state.snow_cover}
          onChange={handle}
          options={[
            { value: 'Snow', label: 'Snow' },
            { value: 'No snow', label: 'No snow' }
          ]}
        />

        {/* Arid condition – always visible, disabled unless snow cover = No snow */}
        <FormField
          label="Arid Condition"
          name="arid_condition"
          type="select"
          value={state.arid_condition ?? 'Arid'}
          onChange={handle}
          disabled={state.snow_cover !== 'No snow'}
          options={[
            { value: 'Arid', label: 'Arid' },
            { value: 'Non-arid', label: 'Non-arid' }
          ]}
        />
      </div>
    </SectionContainer>
  );
};

export default Meteorology;