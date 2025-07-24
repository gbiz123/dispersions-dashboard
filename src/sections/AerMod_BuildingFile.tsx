import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useRunContext } from '../context/RunContext';
import { DocumentArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';

interface BuildingFileData {
  enabled: boolean;
  file?: File; // Changed from File | null to File | undefined
  filename?: string;
  use_existing: boolean;
  existing_filename?: string;
}

const BuildingFile: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();

  // Get current building_file data from global state
  const buildingData = formData.building_file || {
    enabled: false,
    file: undefined,
    use_existing: false
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('building_file', {
        ...buildingData,
        file,
        filename: file.name,
        use_existing: false
      });
    }
  };

  const clearFile = () => {
    updateFormData('building_file', {
      ...buildingData,
      file: undefined,
      filename: undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    updateFormData('building_file', {
      ...buildingData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (buildingData.enabled && !buildingData.file && !buildingData.use_existing) {
      alert('Please upload a building file or select an existing one.');
      return;
    }

    // Data is already saved to global context through handleChange and other handlers
    navigate('/aermod/receptor-grids');
  };

  return (
    <SectionContainer
      title="🏢 AERMOD Building File"
      onSubmit={handleSubmit}
      nextSection="/aermod/receptor-grids"
      nextSectionLabel="Receptor Grids"
    >
      <InfoSection content="Upload building data files to account for building wake effects in your AERMOD analysis. Building files should be in AERMOD BPIP format." />
      
      <div className="space-y-6">
        {/* Enable/Disable Building File */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="enabled"
            checked={buildingData.enabled}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="text-sm font-medium">Include Building Wake Effects</label>
        </div>

        {buildingData.enabled && (
          <div className="space-y-6">
            {/* Upload Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateFormData('building_file', { ...buildingData, use_existing: false })}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  !buildingData.use_existing
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">Upload New File</div>
                <div className="text-sm text-gray-600">Upload a new building data file</div>
              </button>
              
              <button
                type="button"
                onClick={() => updateFormData('building_file', { ...buildingData, use_existing: true })}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  buildingData.use_existing
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">Use Existing File</div>
                <div className="text-sm text-gray-600">Select from previously uploaded files</div>
              </button>
            </div>

            {/* File Upload */}
            {!buildingData.use_existing && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm text-gray-600 mb-4">
                    Upload building data file (.bld, .bpip, or .txt)
                  </div>
                  <input
                    type="file"
                    accept=".bld,.bpip,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                  {buildingData.file && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-green-600">
                      <span>File uploaded: {buildingData.filename}</span>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Building files should be in AERMOD BPIP format</p>
                  <p>• Include building coordinates, heights, and dimensions</p>
                  <p>• Files should use the same coordinate system as sources</p>
                </div>
              </div>
            )}

            {/* Existing File Selection */}
            {buildingData.use_existing && (
              <div className="space-y-4">
                <label className="block text-sm font-medium">Select Existing Building File</label>
                <select
                  name="existing_filename"
                  value={buildingData.existing_filename || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a file...</option>
                  <option value="building1.bld">building1.bld</option>
                  <option value="complex_buildings.bpip">complex_buildings.bpip</option>
                  <option value="industrial_site.txt">industrial_site.txt</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default BuildingFile;