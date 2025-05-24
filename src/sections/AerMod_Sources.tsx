import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useAermod } from '../context/AermodContext';
import { PlusIcon, TrashIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface SourceData {
  id: string;
  name: string;
  type: 'POINT' | 'AREA' | 'VOLUME' | 'LINE';
  x_coordinate: number;
  y_coordinate: number;
  base_elevation: number;
  stack_height?: number;
  stack_diameter?: number;
  exit_velocity?: number;
  exit_temperature?: number;
  emission_rate: number;
  pollutant: string;
}

interface PreviousRun {
  id: string;
  title: string;
  subtitle: string;
  created_date: string;
}

const Sources: React.FC = () => {
  const { formData, update } = useAermod();
  const navigate = useNavigate();

  // Fix 1: Access the sources data correctly
  const [sources, setSources] = useState<SourceData[]>(
    formData.sources?.data ?? []
  );
  
  // Fix 2: Initialize sourceMethod from formData
  const [sourceMethod, setSourceMethod] = useState<'manual' | 'upload' | 'previous'>(
    formData.sources?.method ?? 'manual'
  );
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previousRuns, setPreviousRuns] = useState<PreviousRun[]>([]);
  const [selectedPreviousRun, setSelectedPreviousRun] = useState<string>(
    formData.sources?.previous_run_id ?? ''
  );
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);

  // Fetch previous runs when user selects "previous run" option
  useEffect(() => {
    if (sourceMethod === 'previous') {
      fetchPreviousRuns();
    }
  }, [sourceMethod]);

  // Update the fetchPreviousRuns function
  const fetchPreviousRuns = async () => {
    setIsLoadingRuns(true);
    try {
      const response = await fetch('https://l47qj.wiremockapi.cloud/aermod/run/list');
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

  const addNewSource = () => {
    const newSource: SourceData = {
      id: `source_${Date.now()}`,
      name: `Source ${sources.length + 1}`,
      type: 'POINT',
      x_coordinate: 0,
      y_coordinate: 0,
      base_elevation: 0,
      stack_height: 0,
      stack_diameter: 0,
      exit_velocity: 0,
      exit_temperature: 0,
      emission_rate: 0,
      pollutant: 'PM25'
    };
    setSources([...sources, newSource]);
  };

  const removeSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };

  const updateSource = (id: string, field: keyof SourceData, value: any) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // TODO: Parse uploaded file and populate sources
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (sourceMethod === 'manual' && sources.length === 0) {
      alert('Please add at least one source.');
      return;
    }

    if (sourceMethod === 'upload' && !uploadedFile) {
      alert('Please upload a source parameter file.');
      return;
    }

    if (sourceMethod === 'previous' && !selectedPreviousRun) {
      alert('Please select a previous run.');
      return;
    }

    // Fix 3: Create the proper sources object structure
    const sourcesData = {
      method: sourceMethod,
      ...(sourceMethod === 'manual' && { data: sources }),
      ...(sourceMethod === 'upload' && { uploaded_file: uploadedFile?.name }),
      ...(sourceMethod === 'previous' && { previous_run_id: selectedPreviousRun })
    };

    update('sources', sourcesData);
    navigate('/aermod/receptors'); // Navigate to next AERMOD section
  };

  const sourceTypeOptions = [
    { value: 'POINT', label: 'Point Source' },
    { value: 'AREA', label: 'Area Source' },
    { value: 'VOLUME', label: 'Volume Source' },
    { value: 'LINE', label: 'Line Source' }
  ];

  const pollutantOptions = [
    { value: 'PM25', label: 'PM2.5' },
    { value: 'PM10', label: 'PM10' },
    { value: 'NO2', label: 'NO2' },
    { value: 'SO2', label: 'SO2' },
    { value: 'CO', label: 'CO' },
    { value: 'LEAD', label: 'Lead' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <SectionContainer
      title="🔥 AERMOD Sources"
      onSubmit={handleSubmit}
      nextSection="/aermod/receptors"
      nextSectionLabel="Receptors"
    >
      <InfoSection content="Define emission sources for your AERMOD analysis. You can manually create sources, upload a source parameter file, or use data from a previous run." />
      
      {/* Source Input Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Source Input Method</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setSourceMethod('manual')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              sourceMethod === 'manual'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">Manual Entry</div>
            <div className="text-sm text-gray-600">Create sources individually</div>
          </button>
          
          <button
            type="button"
            onClick={() => setSourceMethod('upload')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              sourceMethod === 'upload'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">Upload File</div>
            <div className="text-sm text-gray-600">Import source parameter file</div>
          </button>
          
          <button
            type="button"
            onClick={() => setSourceMethod('previous')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              sourceMethod === 'previous'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium">Previous Run</div>
            <div className="text-sm text-gray-600">Use data from previous analysis</div>
          </button>
        </div>
      </div>

      {/* Manual Entry */}
      {sourceMethod === 'manual' && (
        <div className="space-y-6">
          {sources.map((source, index) => (
            <div key={source.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Source {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeSource(source.id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="text-sm">Remove</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  label="Source Name"
                  name="name"
                  type="text"
                  value={source.name}
                  onChange={(e) => updateSource(source.id, 'name', e.target.value)}
                  required
                />
                
                <FormField
                  label="Source Type"
                  name="type"
                  type="select"
                  value={source.type}
                  onChange={(e) => updateSource(source.id, 'type', e.target.value)}
                  options={sourceTypeOptions}
                  required
                />
                
                <FormField
                  label="Pollutant"
                  name="pollutant"
                  type="select"
                  value={source.pollutant}
                  onChange={(e) => updateSource(source.id, 'pollutant', e.target.value)}
                  options={pollutantOptions}
                  required
                />
                
                <FormField
                  label="X Coordinate (m)"
                  name="x_coordinate"
                  type="number"
                  value={source.x_coordinate}
                  onChange={(e) => updateSource(source.id, 'x_coordinate', parseFloat(e.target.value))}
                  required
                />
                
                <FormField
                  label="Y Coordinate (m)"
                  name="y_coordinate"
                  type="number"
                  value={source.y_coordinate}
                  onChange={(e) => updateSource(source.id, 'y_coordinate', parseFloat(e.target.value))}
                  required
                />
                
                <FormField
                  label="Base Elevation (m)"
                  name="base_elevation"
                  type="number"
                  value={source.base_elevation}
                  onChange={(e) => updateSource(source.id, 'base_elevation', parseFloat(e.target.value))}
                  required
                />
                
                {source.type === 'POINT' && (
                  <>
                    <FormField
                      label="Stack Height (m)"
                      name="stack_height"
                      type="number"
                      value={source.stack_height || ''}
                      onChange={(e) => updateSource(source.id, 'stack_height', parseFloat(e.target.value))}
                      required
                    />
                    
                    <FormField
                      label="Stack Diameter (m)"
                      name="stack_diameter"
                      type="number"
                      value={source.stack_diameter || ''}
                      onChange={(e) => updateSource(source.id, 'stack_diameter', parseFloat(e.target.value))}
                      required
                    />
                    
                    <FormField
                      label="Exit Velocity (m/s)"
                      name="exit_velocity"
                      type="number"
                      value={source.exit_velocity || ''}
                      onChange={(e) => updateSource(source.id, 'exit_velocity', parseFloat(e.target.value))}
                      required
                    />
                    
                    <FormField
                      label="Exit Temperature (K)"
                      name="exit_temperature"
                      type="number"
                      value={source.exit_temperature || ''}
                      onChange={(e) => updateSource(source.id, 'exit_temperature', parseFloat(e.target.value))}
                      required
                    />
                  </>
                )}
                
                <FormField
                  label="Emission Rate (g/s)"
                  name="emission_rate"
                  type="number"
                  value={source.emission_rate}
                  onChange={(e) => updateSource(source.id, 'emission_rate', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addNewSource}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Another Source</span>
          </button>
        </div>
      )}

      {/* File Upload */}
      {sourceMethod === 'upload' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm text-gray-600 mb-4">
              Upload your source parameter file (.txt, .dat, or .csv)
            </div>
            <input
              type="file"
              accept=".txt,.dat,.csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadedFile && (
              <div className="mt-2 text-sm text-green-600">
                File uploaded: {uploadedFile.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Previous Run Selection */}
      {sourceMethod === 'previous' && (
        <div className="space-y-4">
          {isLoadingRuns ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div className="mt-2 text-sm text-gray-600">Loading previous runs...</div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium">Select Previous Run</label>
              {previousRuns.length === 0 ? (
                <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded-md">
                  No previous runs found
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {previousRuns.map((run) => (
                    <label key={run.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="previousRun"
                        value={run.id}
                        checked={selectedPreviousRun === run.id}
                        onChange={(e) => setSelectedPreviousRun(e.target.value)}
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
    </SectionContainer>
  );
};

export default Sources;