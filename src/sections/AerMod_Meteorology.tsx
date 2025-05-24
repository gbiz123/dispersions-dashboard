import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useAermod } from '../context/AermodContext';
import { MapPinIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface PreviousRun {
  id: string;
  title: string;
  subtitle: string;
  created_date: string;
}

interface MeteorologicalData {
  adj_u: boolean;
  source_type: 'onsite' | 'previous_run' | 'default_station';
  onsite_data?: {
    latitude: number;
    longitude: number;
    elevation?: number;
    station_name?: string;
  };
  previous_run_id?: string;
  default_station?: {
    station_id: string;
    station_name: string;
  };
}

const Meteorology: React.FC = () => {
  const { formData, update } = useAermod();
  const navigate = useNavigate();

  const [metData, setMetData] = useState<MeteorologicalData>(
    (formData.meteorology as MeteorologicalData) ?? {
      adj_u: false,
      source_type: 'default_station'
    }
  );

  const [previousRuns, setPreviousRuns] = useState<PreviousRun[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  // Fetch previous runs when source type is set to previous_run
  useEffect(() => {
    if (metData.source_type === 'previous_run') {
      fetchPreviousRuns();
    }
  }, [metData.source_type]);

  // Update the fetchPreviousRuns function
  const fetchPreviousRuns = async () => {
    setIsLoadingRuns(true);
    try {
      const response = await fetch('https://l47qj.wiremockapi.cloud/aermet/run/list');
      if (response.ok) {
        const runs = await response.json();
        // Map the API response to match your interface
        const mappedRuns = runs.map((run: any) => ({
          id: run.run_id.toString(),
          title: run.title_one,
          subtitle: run.title_two,
          created_date: new Date().toISOString() // Since API doesn't provide this
        }));
        setPreviousRuns(mappedRuns);
      }
    } catch (error) {
      console.error('Failed to fetch previous runs:', error);
    } finally {
      setIsLoadingRuns(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setMetData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOnsiteChange = (field: string, value: any) => {
    setMetData(prev => ({
      ...prev,
      onsite_data: {
        ...prev.onsite_data,
        [field]: value
      } as MeteorologicalData['onsite_data']
    }));
  };

  const handleMapSelect = () => {
    setMapVisible(true);
    // In a real implementation, you would integrate with a mapping library
    // For now, we'll simulate map selection
    alert('Map integration would be implemented here. For demo, using default coordinates.');
    
    // Simulate map selection with default values
    handleOnsiteChange('latitude', 40.7128);
    handleOnsiteChange('longitude', -74.0060);
    handleOnsiteChange('elevation', 10);
    setMapVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation based on source type
    if (metData.source_type === 'onsite') {
      if (!metData.onsite_data?.latitude || !metData.onsite_data?.longitude) {
        alert('Please select coordinates for on-site meteorological data.');
        return;
      }
    } else if (metData.source_type === 'previous_run') {
      if (!metData.previous_run_id) {
        alert('Please select a previous run for meteorological data.');
        return;
      }
    } else if (metData.source_type === 'default_station') {
      if (!metData.default_station?.station_id) {
        alert('Please select a default meteorological station.');
        return;
      }
    }

    update('meteorology', metData);
    navigate('/aermod/run');
  };

  const sourceTypeOptions = [
    { value: 'default_station', label: 'Use Default Meteorological Station' },
    { value: 'onsite', label: 'On-Site Meteorological Data' },
    { value: 'previous_run', label: 'Use Meteorology from Previous Run' }
  ];

  const defaultStations = [
    { value: '', label: 'Select a station...' },
    { value: 'KJFK', label: 'John F. Kennedy Airport, NY' },
    { value: 'KLAX', label: 'Los Angeles International, CA' },
    { value: 'KORD', label: 'Chicago O\'Hare, IL' },
    { value: 'KATL', label: 'Atlanta International, GA' },
    { value: 'KDEN', label: 'Denver International, CO' }
  ];

  return (
    <SectionContainer
      title="🌬️ AERMOD Meteorology"
      onSubmit={handleSubmit}
      nextSection="/aermod/run"
      nextSectionLabel="Run AERMOD"
    >
      <InfoSection content="Configure meteorological data sources for your AERMOD analysis. Choose between default stations, on-site data, or data from previous AERMET runs." />
      
      <div className="space-y-6">
        {/* ADJ_U Option */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="adj_u"
            checked={metData.adj_u}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="text-sm font-medium">Enable ADJ_U wind speed adjustment</label>
          <div className="text-xs text-gray-500 ml-2">
            (Adjusts wind speeds for local terrain effects)
          </div>
        </div>

        {/* Meteorology Source Selection */}
        <div className="space-y-4">
          <FormField
            label="Meteorology Source"
            name="source_type"
            type="select"
            value={metData.source_type}
            onChange={handleChange}
            options={sourceTypeOptions}
            required
            tooltip="Select the source of meteorological data for your analysis"
          />

          {/* Default Station Selection */}
          {metData.source_type === 'default_station' && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Default Meteorological Station</h3>
              <FormField
                label="Station"
                name="station_id"
                type="select"
                value={metData.default_station?.station_id || ''}
                onChange={(e) => {
                  const selectedStation = defaultStations.find(s => s.value === e.target.value);
                  setMetData(prev => ({
                    ...prev,
                    default_station: {
                      station_id: e.target.value,
                      station_name: selectedStation?.label || ''
                    }
                  }));
                }}
                options={defaultStations}
                required
              />
              <div className="text-xs text-gray-500 mt-2">
                Default stations provide representative meteorological conditions for the region.
              </div>
            </div>
          )}

          {/* On-Site Data Configuration */}
          {metData.source_type === 'onsite' && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-4">On-Site Meteorological Data</h3>
              
              {/* Map Selection */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleMapSelect}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MapPinIcon className="h-4 w-4" />
                  <span>Select Location on Map</span>
                </button>
                <div className="text-xs text-gray-500 mt-1">
                  Click to open interactive map for coordinate and elevation selection
                </div>
              </div>

              {/* Coordinate Display/Input */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Latitude (°)"
                  name="latitude"
                  type="number"
                  value={metData.onsite_data?.latitude || ''}
                  onChange={(e) => handleOnsiteChange('latitude', parseFloat(e.target.value))}
                  step={0.000001}
                  required
                />
                
                <FormField
                  label="Longitude (°)"
                  name="longitude"
                  type="number"
                  value={metData.onsite_data?.longitude || ''}
                  onChange={(e) => handleOnsiteChange('longitude', parseFloat(e.target.value))}
                  step={0.000001}
                  required
                />
                
                <FormField
                  label="Elevation (m)"
                  name="elevation"
                  type="number"
                  value={metData.onsite_data?.elevation || ''}
                  onChange={(e) => handleOnsiteChange('elevation', parseFloat(e.target.value))}
                  tooltip="Site elevation above sea level"
                />
              </div>

              {/* Replace FormField with regular input for station name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Station Name (Optional)
                </label>
                <input
                  type="text"
                  name="station_name"
                  value={metData.onsite_data?.station_name || ''}
                  onChange={(e) => handleOnsiteChange('station_name', e.target.value)}
                  placeholder="e.g., On-site Weather Station #1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Previous Run Selection */}
          {metData.source_type === 'previous_run' && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Previous AERMET Run</h3>
              
              {isLoadingRuns ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <div className="mt-2 text-sm text-gray-600">Loading previous runs...</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {previousRuns.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded-md">
                      No previous AERMET runs found
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {previousRuns.map((run) => (
                        <label key={run.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="previous_run_id"
                            value={run.id}
                            checked={metData.previous_run_id === run.id}
                            onChange={(e) => setMetData(prev => ({ ...prev, previous_run_id: e.target.value }))}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{run.title}</div>
                            <div className="text-xs text-gray-500">{run.subtitle}</div>
                            <div className="text-xs text-gray-400">Created: {new Date(run.created_date).toLocaleDateString()}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meteorology Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Meteorological Data Requirements</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>ADJ_U:</strong> Enables wind speed adjustments for local terrain effects</p>
            <p>• <strong>Default Stations:</strong> Use standardized meteorological data from nearby airports</p>
            <p>• <strong>On-Site Data:</strong> Use meteorological measurements from your specific location</p>
            <p>• <strong>Previous Runs:</strong> Reuse processed meteorological data from AERMET</p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Meteorology;