import React, { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import SectionContainer from '../components/SectionContainer';
import FormField from '../components/forms/FormField';
import InfoSection from '../components/InfoSection';
import { useAersurface } from '../context/AersurfaceContext';
import { EvenSectors, CustomSectors, Sectors } from '../types/api';

type Airport = 'Airport' | 'Not airport' | 'Varying airport';
type Mode = 'Even sizes' | 'Custom sizes';

type Count = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 16;

interface EvenLocal {
  mode: 'Even sizes';
  count: Count;
  airport: Airport;
}
interface CustomLocalSector {
  id: string;
  start: number | '';
  end: number | '';
  airport: Airport;
}
interface CustomLocal {
  mode: 'Custom sizes';
  sectors: CustomLocalSector[];
}

type SectorState = EvenLocal | CustomLocal;

const defaultState: SectorState = {
  mode: 'Even sizes',
  count: 4,
  airport: 'Airport'
} as const;

const airportOpts = [
  { value: 'Airport', label: 'Airport' },
  { value: 'Not airport', label: 'Not airport' },
  { value: 'Varying airport', label: 'Varying airport' }
];

const SectorEditor: React.FC = () => {
  const { formData, update } = useAersurface();
  const [state, set] = useState<SectorState>(
    (formData.sectors as unknown as SectorState) ?? defaultState
  );

  /* ------------- helpers / validation ------------- */
  const errors = useMemo(() => {
    if (state.mode !== 'Custom sizes' || !state.sectors?.length) return [];

    const rows = state.sectors;

    // --- numeric + range + ordering ---------------------------------
    for (const r of rows) {
      if (r.start === '' || r.end === '')   return ['Enter start / end for all sectors'];
      if (r.start < 0 || r.start > 360)     return ['Start values must be 0–360°'];
      if (r.end   < 0 || r.end   > 360)     return ['End values must be 0–360°'];
      if (r.end <= r.start)                 return ['End must be greater than start'];
    }

    // --- span --------------------------------------------------------
    const spans = rows.map(r => (r.end as number) - (r.start as number));
    if (spans.some(s => s < 30))            return ['Each sector must span at least 30°'];

    // --- continuity / overlap ---------------------------------------
    const ordered = [...rows].sort((a, b) => (a.start as number) - (b.start as number));

    for (let i = 0; i < ordered.length; i++) {
      const curr = ordered[i];
      const next = ordered[(i + 1) % ordered.length];
      const expectedNext = (curr.end === 360 ? 0 : curr.end);

      if (next.start !== expectedNext)
        return ['Sectors must be continuous without gaps / overlap'];
    }

    // --- total coverage ----------------------------------------------
    const total = spans.reduce((s, v) => s + v, 0);
    if (total !== 360)                      return ['Sector angles must sum to 360°'];

    return [];
  }, [state]);

  /* ---------- helper to update “even” ---------- */
  const setEven = <K extends 'count' | 'airport'>(field: K, v: EvenLocal[K]) =>
    set(prev => (prev.mode === 'Even sizes' ? { ...prev, [field]: v } : prev));

  const setMode = (mode: Mode) =>
    set(mode === 'Even sizes' ? { ...defaultState } : { mode, sectors: [] });

  const addSector = () =>
    set(prev =>
      prev.mode === 'Custom sizes'
        ? {
            ...prev,
            sectors: prev.sectors.concat({
              id: uuid(),
              start: '',
              end: '',
              airport: 'Airport'
            }).slice(0, 12)
          }
        : prev
    );

  const clamp = (n: number) => Math.max(0, Math.min(360, n));

  const updateSector = (id: string, field: keyof CustomLocalSector, value: any) =>
    set(prev =>
      prev.mode === 'Custom sizes'
        ? {
            ...prev,
            sectors: prev.sectors.map(r =>
              r.id === id
                ? {
                    ...r,
                    [field]:
                      field === 'start' || field === 'end'
                        ? (value === '' ? '' : clamp(value))
                        : value
                  }
                : r
            )
          }
        : prev
    );

  const removeSector = (id: string) =>
    set(prev =>
      prev.mode === 'Custom sizes'
        ? { ...prev, sectors: prev.sectors.filter(r => r.id !== id) }
        : prev
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.length) return;

    let apiObj: Sectors;

    if (state.mode === 'Even sizes') {
      /* branch typed as EvenSectors  */
      apiObj = {
        mode: 'Even sizes',
        count: state.count as EvenSectors['count'],
        airport: state.airport
      } satisfies EvenSectors;
    } else {
      /* branch typed as CustomSectors */
      apiObj = {
        mode: 'Custom sizes',
        sectors: state.sectors.map(s => ({
          start: s.start as number,
          end:   s.end   as number,
          airport: s.airport
        }))
      } satisfies CustomSectors;
    }

    update('sectors', apiObj);
  };

  /* ------------- render ------------- */
  return (
    <SectionContainer
      title="🧭 Sectors"
      onSubmit={submit}
      previousSection="/aersurface/temporal-frequency"
      nextSection="/aersurface/run"
      nextSectionLabel="Run AERSURFACE"
    >
      <InfoSection content="Info section: Define wind sectors for surface characteristic calculations. Sectors allow different surface parameters based on wind direction." />
      
      {/* mode selector */}
      <FormField
        label="Sectors"
        name="mode"
        type="select"
        value={state.mode}
        onChange={e => setMode(e.target.value as Mode)}
        options={[
          { value: 'Even sizes', label: 'Even sizes' },
          { value: 'Custom sizes', label: 'Custom sizes' }
        ]}
        tooltip="Dummy tooltip: Choose between evenly-sized or custom wind sectors"
      />

      {/* Even sizes */}
      {state.mode === 'Even sizes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            label="Number of sectors"
            name="count"
            type="select"
            value={state.count}
            onChange={e => setEven('count', parseInt(e.target.value, 10) as Count)}
            options={[...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16] as const)].map(n => ({
              value: n,
              label: String(n)
            }))}
            tooltip="Dummy tooltip: Select how many wind sectors to create"
          />
          <FormField
            label="Airport"
            name="airport"
            type="select"
            value={state.airport}
            onChange={e => setEven('airport', e.target.value as Airport)}
            options={airportOpts}
            tooltip="Dummy tooltip: Specify if the site is an airport"
          />
        </div>
      )}

      {/* Custom sizes */}
      {state.mode === 'Custom sizes' && (
        <div className="space-y-4">
          {state.sectors?.map((row, idx) => (
            <div key={row.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-3 border rounded">
              <FormField
                label="Start °"
                name={`start-${idx}`}
                type="number"
                min={0}
                max={360}
                step={1}
                value={row.start}
                onChange={e =>
                  updateSector(row.id, 'start', e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                tooltip="Dummy tooltip: Enter the starting angle for this sector"
              />
              <FormField
                label="End °"
                name={`end-${idx}`}
                type="number"
                min={0}
                max={360}
                step={1}
                value={row.end}
                onChange={e =>
                  updateSector(row.id, 'end', e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                tooltip="Dummy tooltip: Enter the ending angle for this sector"
              />
              <FormField
                label="Airport"
                name={`airport-${idx}`}
                type="select"
                value={row.airport}
                onChange={e => updateSector(row.id, 'airport', e.target.value as Airport)}
                options={airportOpts}
                tooltip="Dummy tooltip: Specify if this sector includes an airport"
              />
              <button
                type="button"
                onClick={() => removeSector(row.id)}
                className="text-red-600 text-sm underline"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded disabled:opacity-40"
            disabled={state.sectors?.length === 12}
            onClick={addSector}
          >
            + Add sector
          </button>

          {/* validation errors */}
          {errors.length > 0 && (
            <p className="text-red-600 text-sm">{errors[0]}</p>
          )}
        </div>
      )}
    </SectionContainer>
  );
};

export default SectorEditor;