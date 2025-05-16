import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import SectionContainer from '../components/SectionContainer';
import FormField from '../components/forms/FormField';
import { useAersurface } from '../context/AersurfaceContext';
import { LandCoverRow } from '../types/api';

type DataSource = 'User-provided' | 'NLCD';
type CoverType = 'NLCD Land Cover' | 'Percent impervious' | 'Percent canopy';

interface Row {
  id: string;
  data_source: DataSource;
  file?: File | null;
  year: number;
  type: CoverType;
}

const years = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: y, label: String(y) };
});

const LandCover: React.FC = () => {
  const { formData, update } = useAersurface();

  const initialRows: Row[] = Array.isArray(formData.land_cover)
    ? (formData.land_cover as LandCoverRow[]).map(r => ({
        id: uuid(),
        data_source: r.data_source,
        year: r.year,
        type: r.type,
        file: undefined
      }))
    : [
        {
          id: uuid(),
          data_source: 'NLCD',
          year: new Date().getFullYear(),
          type: 'NLCD Land Cover'
        }
      ];
  // ----------------------------------------------------

  const [rows, setRows] = useState<Row[]>(initialRows);

  const addRow = () =>
    setRows(prev => [
      ...prev,
      { id: uuid(), data_source: 'NLCD', year: new Date().getFullYear(), type: 'NLCD Land Cover' }
    ]);

  const updateRow = (id: string, field: keyof Row, value: any) =>
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value, ...(field === 'data_source' && value !== 'User-provided' ? { file: undefined } : {}) } : r))
    );

  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    
    const apiRows: LandCoverRow[] = rows.map(r => ({
      data_source: r.data_source,
      year: r.year,
      type: r.type,
      file: r.data_source === 'User-provided' ? r.file?.name : undefined
    }));

    update('land_cover', apiRows);
  };

  return (
    <SectionContainer
      title="🏞️ Land Cover"
      onSubmit={submit}
      nextSection="/aersurface/temporal-frequency"
      previousSection="/aersurface/meteorology"
      nextSectionLabel="Temporal Frequency"
    >
      <div className="space-y-6">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded border border-gray-200"
          >
            {/* Data source */}
            <FormField
              label={`Data Source ${idx + 1}`}
              name="data_source"
              type="select"
              value={row.data_source}
              onChange={e => updateRow(row.id, 'data_source', e.target.value as DataSource)}
              options={[
                { value: 'User-provided', label: 'User-provided' },
                { value: 'NLCD', label: 'Pull from NLCD' }
              ]}
            />

            {/* Year */}
            <FormField
              label="Year"
              name="year"
              type="select"
              value={row.year}
              onChange={e => updateRow(row.id, 'year', parseInt(e.target.value, 10))}
              options={years}
            />

            {/* Type */}
            <FormField
              label="Type"
              name="type"
              type="select"
              value={row.type}
              onChange={e => updateRow(row.id, 'type', e.target.value as CoverType)}
              options={[
                { value: 'NLCD Land Cover', label: 'NLCD Land Cover' },
                { value: 'Percent impervious', label: 'Percent impervious' },
                { value: 'Percent canopy', label: 'Percent canopy' }
              ]}
            />

            {/* File upload or remove button */}
            {row.data_source === 'User-provided' ? (
              <div>
                <label className="block text-sm font-medium mb-1">Upload</label>
                <input
                  type="file"
                  accept=".tif,.tiff,.img,.zip"
                  onChange={e => updateRow(row.id, 'file', e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="text-red-600 text-sm underline justify-self-start"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add button */}
        <button
          type="button"
          onClick={addRow}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
        >
          + Add land cover
        </button>
      </div>
    </SectionContainer>
  );
};

export default LandCover;