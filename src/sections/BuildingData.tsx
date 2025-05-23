import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { BuildingData as BuildingDataType } from '../types/api';
import { DistanceUnit } from '../types/enums';
import { validateBuildingData } from '../utils/validation';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import InfoSection from '../components/InfoSection';
import Tooltip from '../components/Tooltip';

const BuildingData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Default values
  const defaultBuildingData: BuildingDataType = {
    has_building: false,
    bldg_height: 0,
    bldg_width_max: 0,
    bldg_width_min: 0,
    bldg_height_unit: DistanceUnit.METERS,
    bldg_width_max_unit: DistanceUnit.METERS,
    bldg_width_min_unit: DistanceUnit.METERS,
    useexistingbpipprm_file: null
  };
  
  // Initialize state with existing data or defaults
  const [buildingData, setBuildingData] = useState<BuildingDataType>(
    formData.building_data || defaultBuildingData
  );

  // Add validation state
  const [errors, setErrors] = useState<Partial<Record<keyof BuildingDataType, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BuildingDataType, boolean>>>({});
  const [useManualInputs, setUseManualInputs] = useState(!buildingData.useexistingbpipprm_file);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setBuildingData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setBuildingData(prev => ({
        ...prev,
        [name]: name.includes('bldg_height') || name.includes('bldg_width') 
          ? parseFloat(value) || 0 
          : value
      }));
    }
    
    // Clear error for this field when it changes
    if (errors[name as keyof BuildingDataType]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Switch to file upload mode
      setUseManualInputs(false);
      setBuildingData(prev => ({
        ...prev,
        useexistingbpipprm_file: file
      }));
    } else {
      // If file is removed, clear the field
      setBuildingData(prev => ({
        ...prev,
        useexistingbpipprm_file: null
      }));
    }
  };

  const handleInputModeChange = (mode: 'manual' | 'file') => {
    if (mode === 'manual') {
      // Switch to manual input mode
      setUseManualInputs(true);
      setBuildingData(prev => ({
        ...prev,
        useexistingbpipprm_file: null
      }));
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      // Switch to file upload mode
      setUseManualInputs(false);
    }
  };

  const validateField = (name: string, value: any): string => {
    if (name.includes('bldg_height') || name.includes('bldg_width')) {
      if (value <= 0) return 'Value must be greater than 0';
    }
    return '';
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check all fields for errors
    const newErrors: Partial<Record<keyof BuildingDataType, string>> = {};
    let hasErrors = false;
    
    if (buildingData.has_building) {
      if (useManualInputs) {
        // Only validate manual inputs if using manual mode
        Object.entries(buildingData).forEach(([key, value]) => {
          if (key !== 'has_building' && key !== 'useexistingbpipprm_file') {
            const error = validateField(key, value);
            if (error) {
              newErrors[key as keyof BuildingDataType] = error;
              hasErrors = true;
            }
          }
        });
      } else if (!buildingData.useexistingbpipprm_file) {
        // If using file mode but no file is selected
        newErrors.useexistingbpipprm_file = 'Please upload a BPIP PRM file';
        hasErrors = true;
      }
    }
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    const newTouched: Partial<Record<keyof BuildingDataType, boolean>> = {};
    Object.keys(buildingData).forEach(key => {
      newTouched[key as keyof BuildingDataType] = true;
    });
    setTouched(newTouched);
    
    if (hasErrors || !validateBuildingData(buildingData)) {
      return; // Don't proceed if validation fails
    }
    
    updateFormData('building_data', buildingData);
    navigate('/makemet-data');
  };

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

  return (
    <SectionContainer
      title="Building Data"
      onSubmit={handleSubmit}
      nextSection="/makemet-data"
      nextSectionLabel="Makemet Data"
      previousSection="/stack-data"
    >
      <InfoSection content="Info section: Configure building parameters for downwash analysis. Building downwash can significantly affect pollutant dispersion near structures." />
      
      {/* Single container with better spacing */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        {/* Checkbox with better tooltip positioning */}
        <div className="flex items-center mb-6">
          <Tooltip content="Dummy tooltip: Enable if your source is near a building">
            <label className="inline-flex items-center cursor-pointer">
              <input
                disabled={false}
                type="checkbox"
                name="has_building"
                checked={buildingData.has_building}
                onChange={handleChange}
                className="checkbox checkbox-primary h-5 w-5"
              />
              <span className="ml-3 text-base font-medium">Building Downwash Considered</span>
            </label>
          </Tooltip>
          <div className="ml-2 group relative">
            <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-help" />
            <div className="opacity-0 group-hover:opacity-100 absolute z-10 w-64 p-3 text-sm bg-gray-800 text-white rounded shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
              Enable this option if your source is near a building and downwash effects should be considered.
            </div>
          </div>
        </div>
        
        {buildingData.has_building && (
          <>
            {/* Input mode selection */}
            <div className="mb-6 border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-4">Building Data Input Method</h3>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="input_mode"
                    checked={useManualInputs}
                    onChange={() => handleInputModeChange('manual')}
                    className="radio radio-primary"
                  />
                  <span className="ml-2 text-base">Manual Input</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="input_mode"
                    checked={!useManualInputs}
                    onChange={() => handleInputModeChange('file')}
                    className="radio radio-primary"
                  />
                  <span className="ml-2 text-base">Upload BPIP PRM File</span>
                </label>
              </div>
            </div>
            
            {/* File upload option */}
            {!useManualInputs && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col space-y-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    BPIP PRM File
                    <div className="group relative inline-block ml-2">
                      <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-help inline" />
                      <div className="opacity-0 group-hover:opacity-100 absolute z-10 w-64 p-3 text-sm bg-gray-800 text-white rounded shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
                        Upload an existing BPIP PRM file with building information.
                      </div>
                    </div>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".dat,.prm,.txt"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered file-input-primary w-full max-w-md"
                  />
                  {errors.useexistingbpipprm_file && (
                    <p className="text-red-500 text-sm mt-1">{errors.useexistingbpipprm_file}</p>
                  )}
                  {buildingData.useexistingbpipprm_file && (
                    <p className="text-green-600 text-sm mt-1">
                      File selected: {buildingData.useexistingbpipprm_file.name}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Manual inputs */}
            {useManualInputs && (
              <>
                {/* Simplified header with lighter border */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-4">Building Dimensions</h3>
                  
                  {/* Flattened grid layout with better spacing */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {/* Height section */}
                    <div>
                      <h4 className="font-medium text-gray-600 mb-3">Building Height</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Value"
                          name="bldg_height"
                          type="number"
                          value={buildingData.bldg_height || 0}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.bldg_height ? errors.bldg_height : undefined}
                          min={0.1}
                          step={0.1}
                          required
                          tooltip="Dummy tooltip: Enter the height of the building"
                        />
                        <FormField
                          label="Unit"
                          name="bldg_height_unit"
                          type="select"
                          value={buildingData.bldg_height_unit || ''}
                          onChange={handleChange}
                          options={distanceUnits}
                          required
                          tooltip="Dummy tooltip: Select the unit for building height"
                        />
                      </div>
                    </div>
                    
                    {/* Max Width section */}
                    <div>
                      <h4 className="font-medium text-gray-600 mb-3">Maximum Building Width</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Value"
                          name="bldg_width_max"
                          type="number"
                          value={buildingData.bldg_width_max || 0}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.bldg_width_max ? errors.bldg_width_max : undefined}
                          min={0.1}
                          step={0.1}
                          required
                        />
                        <FormField
                          label="Unit"
                          name="bldg_width_max_unit"
                          type="select"
                          value={buildingData.bldg_width_max_unit || ''}
                          onChange={handleChange}
                          options={distanceUnits}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Min Width section */}
                    <div>
                      <h4 className="font-medium text-gray-600 mb-3">Minimum Building Width</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Value"
                          name="bldg_width_min"
                          type="number"
                          value={buildingData.bldg_width_min || 0}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.bldg_width_min ? errors.bldg_width_min : undefined}
                          min={0.1}
                          step={0.1}
                          required
                        />
                        <FormField
                          label="Unit" 
                          name="bldg_width_min_unit"
                          type="select"
                          value={buildingData.bldg_width_min_unit || ''}
                          onChange={handleChange}
                          options={distanceUnits}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </SectionContainer>
  );
};

export default BuildingData;