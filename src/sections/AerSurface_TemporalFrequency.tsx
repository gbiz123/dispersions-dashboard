import React, { useMemo, useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import FormField from '../components/forms/FormField';
import { useAersurface } from '../context/AersurfaceContext';

/* ---------- types ---------- */
type Frequency = 'Annual' | 'Seasonal' | 'Monthly';
type Season = 'Winter' | 'Spring' | 'Summer' | 'Autumn';
type Month =
    | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'
    | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

const months: Month[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface SeasonOverride {
    season: Season;
    months: Month[];
}

export interface TfState {
    freq: Frequency;
    seasons: Record<Season, Month[]>;   // multiple months per season
    overrides: SeasonOverride[];        // used when freq === 'Seasonal'
}

const defaultState: TfState = {
    freq: 'Annual',
    seasons: { Winter: [], Spring: [], Summer: [], Autumn: [] },
    overrides: []
};

const TemporalFrequency: React.FC = () => {
    const { formData, update } = useAersurface();
    const [state, set] = useState<TfState>(() => {
        const tf = formData.temporal_frequency as unknown;
        return (tf && typeof tf === 'object' && 'seasons' in (tf as any))
            ? (tf as TfState)
            : defaultState;
    });

    /* ---------- helpers ---------- */
    const assignedMonths = useMemo(
        () => Object.values(state.seasons).flat(),
        [state.seasons]
    );

    const availableMonths = (current: Month[]) =>
        months.filter(m => current.includes(m) || !assignedMonths.includes(m));

    /* ---------- handlers ---------- */
    const setFreq = (freq: Frequency) =>
        set(prev => ({ ...prev, freq }));

    const setSeasonMonths = (season: Season, selected: Month[]) =>
        set(prev => ({
            ...prev,
            seasons: { ...prev.seasons, [season]: selected }
        }));

    const addOverride = () =>
        set(prev =>
            prev.overrides.length < 4
                ? { ...prev, overrides: [...prev.overrides, { season: 'Winter', months: [] }] }
                : prev
        );

    const changeOvSeason = (i: number, season: Season) =>
        set(prev => {
            const overrides = [...prev.overrides];
            overrides[i] = { ...overrides[i], season };
            return { ...prev, overrides };
        });

    const changeOvMonths = (i: number, mths: Month[]) =>
        set(prev => {
            const overrides = [...prev.overrides];
            overrides[i] = { ...overrides[i], months: mths };
            return { ...prev, overrides };
        });

    const removeOverride = (i: number) =>
        set(prev => ({ ...prev, overrides: prev.overrides.filter((_, idx) => idx !== i) }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        update('temporal_frequency', state as any);
    };

    /* ---------- render ---------- */
    return (
        <SectionContainer
            title="🗓️ Temporal Frequency"
            onSubmit={submit}
            nextSection="/aersurface/sectors"
            previousSection="/aersurface/land-cover"
            nextSectionLabel="Sectors"
        >
            <div className="space-y-6">

                {/* frequency selector */}
                <FormField
                    label="Temporal Frequency"
                    name="freq"
                    type="select"
                    value={state.freq}
                    onChange={e => setFreq(e.target.value as Frequency)}
                    options={[
                        { value: 'Annual', label: 'Annual' },
                        { value: 'Seasonal', label: 'Seasonal' },
                        { value: 'Monthly', label: 'Monthly' }
                    ]}
                />

                {/* Annual / Monthly – season → month picker */}
                {state.freq !== 'Seasonal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['Winter', 'Spring', 'Summer', 'Autumn'] as Season[]).map(season => (
                            <div key={season}>
                                <label className="block text-sm font-medium mb-1">
                                    {season} – Default months
                                </label>
                                <select
                                    multiple
                                    className="w-full border rounded px-2 py-1 h-32"
                                    value={state.seasons[season]}
                                    onChange={e => {
                                        const sel = Array.from(
                                            (e.target as HTMLSelectElement).selectedOptions
                                        ).map(o => o.value as Month);
                                        setSeasonMonths(season, sel);
                                    }}
                                >
                                    {availableMonths(state.seasons[season]).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                )}

                {/* Seasonal – override rows */}
                {state.freq === 'Seasonal' && (
                    <>
                        {state.overrides.map((ov, idx) => {
                            // gather months already picked in other overrides
                            const otherMonths = state.overrides
                                .filter((_, i) => i !== idx)
                                .flatMap(o => o.months);

                            const avail = (curr: Month[]) =>
                                months.filter(m => curr.includes(m) || !otherMonths.includes(m));

                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col md:flex-row items-start md:items-end gap-4 border p-3 rounded bg-gray-50"
                                >
                                    {/* season dropdown */}
                                    <FormField
                                        label="Season"
                                        name={`ov-season-${idx}`}
                                        type="select"
                                        value={ov.season}
                                        onChange={e => changeOvSeason(idx, e.target.value as Season)}
                                        options={[
                                            { value: 'Winter', label: 'Winter' },
                                            { value: 'Spring', label: 'Spring' },
                                            { value: 'Summer', label: 'Summer' },
                                            { value: 'Autumn', label: 'Autumn' }
                                        ]}
                                    />

                                    {/* months multiselect */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-1">
                                            Months
                                        </label>
                                        <select
                                            multiple
                                            className="w-full border rounded px-2 py-1 h-32"
                                            value={ov.months}
                                            onChange={e => {
                                                const sel = Array.from(
                                                    (e.target as HTMLSelectElement).selectedOptions
                                                ).map(o => o.value as Month);
                                                changeOvMonths(idx, sel);
                                            }}
                                        >
                                            {avail(ov.months).map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* remove button */}
                                    <button
                                        type="button"
                                        className="text-red-600 text-sm underline self-center"
                                        onClick={() => removeOverride(idx)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addOverride}
                            disabled={state.overrides.length >= 4}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded disabled:opacity-40"
                        >
                            + Add season override
                        </button>
                    </>
                )}
            </div>
        </SectionContainer>
    );
};

export default TemporalFrequency;