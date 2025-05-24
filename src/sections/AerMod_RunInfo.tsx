import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import MapSelector from '../components/MapSelector';
import { useAermod } from '../context/AermodContext';

interface RunInfoData {
  project_description: string;
  run_option: 'CONC' | 'DEPOS' | 'DDEP' | 'WDEP';
  start_year: number;
  end_year: number;
  latitude: number | null;
  longitude: number | null;
  state: string;
  pollutants: {
    NO2: boolean;
    SO2: boolean;
    PM25: boolean;
    PM10: boolean;
    LEAD: boolean;
    CO: boolean;
    OTHER: boolean;
  };
}

const RunInfo: React.FC = () => {
  const { formData, update } = useAermod();
  const navigate = useNavigate();

  const [runInfo, setRunInfo] = useState<RunInfoData>(
    {
      project_description: '',
      run_option: 'CONC',
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear(),
      latitude: null,
      longitude: null,
      state: '',
      pollutants: {
        NO2: false,
        SO2: false,
        PM25: false,
        PM10: false,
        LEAD: false,
        CO: false,
        OTHER: false
      }
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      if (name.startsWith('pollutant_')) {
        const pollutant = name.replace('pollutant_', '') as keyof RunInfoData['pollutants'];
        setRunInfo(prev => ({
          ...prev,
          pollutants: {
            ...prev.pollutants,
            [pollutant]: target.checked
          }
        }));
      }
    } else if (name === 'start_year' || name === 'end_year') {
      setRunInfo(prev => ({
        ...prev,
        [name]: parseInt(value) || new Date().getFullYear()
      }));
    } else {
      setRunInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePositionChange = (lat: number, lng: number) => {
    setRunInfo(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const clearPin = () => {
    setRunInfo(prev => ({
      ...prev,
      latitude: null,
      longitude: null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const selectedPollutants = Object.values(runInfo.pollutants).some(selected => selected);
    if (!selectedPollutants) {
      alert('Please select at least one pollutant.');
      return;
    }

    if (runInfo.end_year < runInfo.start_year) {
      alert('End year must be greater than or equal to start year.');
      return;
    }

    update('run_info', runInfo);
    navigate('/aermod/sources'); // Navigate to next AERMOD section
  };

  // US States dropdown options
  const stateOptions = [
    { value: '', label: 'Select a state...' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'DC', label: 'District of Columbia' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

  const runOptionOptions = [
    { value: 'CONC', label: 'Concentration (CONC)' },
    { value: 'DEPOS', label: 'Total Deposition (DEPOS)' },
    { value: 'DDEP', label: 'Dry Deposition (DDEP)' },
    { value: 'WDEP', label: 'Wet Deposition (WDEP)' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => {
    const year = currentYear - 10 + i;
    return { value: year, label: year.toString() };
  });

  return (
    <SectionContainer
      title="🏗️ AERMOD Run Info"
      onSubmit={handleSubmit}
      nextSection="/aermod/sources"
      nextSectionLabel="Sources"
    >
      <InfoSection content="Configure your AERMOD analysis parameters including project details, modeling period, facility location, and target pollutants for dispersion modeling." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Project Description
          </label>
          <textarea
            name="project_description"
            value={runInfo.project_description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter a description of your AERMOD project..."
            required
          />
        </div>

        {/* Run Option */}
        <FormField
          label="Run Option"
          name="run_option"
          type="select"
          value={runInfo.run_option}
          onChange={handleChange}
          options={runOptionOptions}
          required
          tooltip="Select the type of output you want from AERMOD modeling"
        />

        {/* State */}
        <FormField
          label="State"
          name="state"
          type="select"
          value={runInfo.state}
          onChange={handleChange}
          options={stateOptions}
          required
          tooltip="Select the US state where your facility is located"
        />

        {/* Run Period */}
        <FormField
          label="Start Year"
          name="start_year"
          type="select"
          value={runInfo.start_year}
          onChange={handleChange}
          options={yearOptions}
          required
          tooltip="Select the starting year for your modeling period"
        />

        <FormField
          label="End Year"
          name="end_year"
          type="select"
          value={runInfo.end_year}
          onChange={handleChange}
          options={yearOptions}
          required
          tooltip="Select the ending year for your modeling period"
        />

        {/* Coordinates Display */}
        <FormField
          label="Latitude"
          name="latitude"
          type="number"
          value={runInfo.latitude ?? ''}
          onChange={(e) => {
            const lat = parseFloat(e.target.value);
            if (!isNaN(lat) && lat >= -90 && lat <= 90) {
              setRunInfo(prev => ({ ...prev, latitude: lat }));
            }
          }}
          step={0.000001}
          min={-90}
          max={90}
          tooltip="WGS84 latitude in decimal degrees from -90 to 90"
          required
        />

        <FormField
          label="Longitude"
          name="longitude"
          type="number"
          value={runInfo.longitude ?? ''}
          onChange={(e) => {
            const lng = parseFloat(e.target.value);
            if (!isNaN(lng) && lng >= -180 && lng <= 180) {
              setRunInfo(prev => ({ ...prev, longitude: lng }));
            }
          }}
          step={0.000001}
          min={-180}
          max={180}
          tooltip="WGS84 longitude in decimal degrees from -180 to 180"
          required
        />

        {/* Map Selector */}
        <div className="md:col-span-2 flex flex-col items-center space-y-4">
          <label className="block text-sm font-medium mb-1 self-start">
            Facility Center Point (Click on map to select)
          </label>
          <MapSelector
            latitude={runInfo.latitude}
            longitude={runInfo.longitude}
            onPositionChange={handlePositionChange}
          />
          <button
            type="button"
            onClick={clearPin}
            className="text-red-600 text-sm underline"
          >
            Clear pin
          </button>
        </div>

        {/* Pollutants */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-3">
            Pollutants (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(runInfo.pollutants).map((pollutant) => (
              <label key={pollutant} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={`pollutant_${pollutant}`}
                  checked={runInfo.pollutants[pollutant as keyof RunInfoData['pollutants']]}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm">
                  {pollutant === 'PM25' ? 'PM2.5' : 
                   pollutant === 'PM10' ? 'PM10' : 
                   pollutant === 'OTHER' ? 'Other' : pollutant}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default RunInfo;