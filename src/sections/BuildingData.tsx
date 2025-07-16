import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { AerscreenBuildingData as BuildingDataType } from '../types/api';
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
	use_building_downwash: false,
    height: 0,
    max_horizontal_dim: 0,
    min_horizontal_dim: 0,
    deg_from_north_of_max_hor_dim: 0,
    deg_from_north_of_stack_rel_to_center: 0,
    dist_stack_to_center: 0
  };
  
  // Initialize state with existing data or defaults
  const [buildingData, setBuildingData] = useState<BuildingDataType>(
    formData.building_data || defaultBuildingData
  );


  // Add validation state
  const [errors, setErrors] = useState<Partial<Record<keyof BuildingDataType, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BuildingDataType, boolean>>>({});
  const [bpipprmFilename, setBpipprmFilename] = useState<string>("");
  const [useManualInputs, setUseManualInputs] = useState(!buildingData.use_existing_bpipprm_file);

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
      setUseManualInputs(false);
      setBpipprmFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setBuildingData(prev => ({
          ...prev,
          use_existing_bpipprm_file: fileContent
        }));
      };
      reader.readAsText(file);
    } else {
      setBuildingData(prev => ({
        ...prev,
        use_existing_bpipprm_file: undefined
      }));
      setBpipprmFilename("");
    }
  };

  const handleInputModeChange = (mode: 'manual' | 'file') => {
    if (mode === 'manual') {
      // Switch to manual input mode
      setUseManualInputs(true);
      setBuildingData(prev => ({
        ...prev,
        use_existing_bpipprm_file: null
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
    
    if (buildingData.use_building_downwash) {
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
      } else if (!buildingData.use_existing_bpipprm_file) {
        // If using file mode but no file is selected
        newErrors.use_existing_bpipprm_file = 'Please upload a BPIP PRM file';
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

  let showMoreInfo = true;
  return (
    <SectionContainer
      title="Building Downwash"
      onSubmit={handleSubmit}
      nextSection="/makemet-data"
      nextSectionLabel="Makemet Data"
      previousSection="/stack-data"
    >
      <InfoSection content="Configure building parameters for downwash analysis. Building downwash can significantly affect pollutant dispersion near structures." />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center mb-6">
          <Tooltip content="Check this box to process building downwash effects">
            <label className="inline-flex items-center cursor-pointer">
              <input
                disabled={false}
                type="checkbox"
                name="use_building_downwash"
                checked={buildingData.use_building_downwash}
                onChange={handleChange}
                className="checkbox checkbox-primary h-5 w-5"
              />
              <span className="ml-3 text-base font-medium">Use Building Downwash</span>
            </label>
          </Tooltip>
        </div>
        
        {buildingData.use_building_downwash && (
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
                    accept=".dat,.prm,.txt,.out"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered file-input-primary w-full max-w-md"
                  />
                  {errors.use_existing_bpipprm_file && (
                    <p className="text-red-500 text-sm mt-1">{errors.use_existing_bpipprm_file}</p>
                  )}
                  {buildingData.use_existing_bpipprm_file && (
                    <p className="text-green-600 text-sm mt-1">
                      File selected: {bpipprmFilename}
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
					<FormField
					  label="Height"
					  name="height"
					  type="number"
					  value={buildingData.height}
					  onChange={handleChange}
					  required
					  min={0.1}
					  step={0.1}
					  tooltip="Enter the height of the building in feet or meters"
					/>
					<FormField
					  label="Height Unit"
					  name="height_units"
					  type="select"
					  value={buildingData.height_units}
					  onChange={handleChange}
					  options={distanceUnits}
					  required
					  tooltip="Select the unit for building height"
					/>
					<FormField
					  label="Maximum Horizontal Dimension"
					  name="max_horizontal_dim"
					  type="number"
					  value={buildingData.max_horizontal_dim}
					  onChange={handleChange}
					  required
					  min={0.1}
					  step={0.1}
					  tooltip="Enter the maximum horizontal dimension of the building in feet or meters"
					/>
					<FormField
					  label="Maximum Horizontal Dimension Units"
					  name="max_horizontal_dim_units"
					  type="select"
					  value={buildingData.max_horizontal_dim_units}
					  onChange={handleChange}
					  options={distanceUnits}
					  required
					  tooltip="Select the unit for maximum horizontal dimension"
					/>
					<FormField
					  label="Minimum Horizontal Dimension"
					  name="min_horizontal_dim"
					  type="number"
					  value={buildingData.min_horizontal_dim}
					  onChange={handleChange}
					  required
					  min={0.1}
					  step={0.1}
					  tooltip="Enter the minimum horizontal dimension of the building in feet or meters"
					/>
					<FormField
					  label="Minimum Horizontal Dimension Units"
					  name="min_horizontal_dim_units"
					  type="select"
					  value={buildingData.min_horizontal_dim_units}
					  onChange={handleChange}
					  options={distanceUnits}
					  required
					  tooltip="Select the unit for minimum horizontal dimension"
					/>
					<FormField
					  label="Building Angle (deg)"
					  name="deg_from_north_of_max_hor_dim"
					  type="number"
					  value={buildingData.deg_from_north_of_max_hor_dim}
					  onChange={handleChange}
					  required
					  min={0.0}
					  max={179.0}
					  step={0.1}
					  tooltip="Enter the maximum building dimension's angle to true north (0-179 degrees)"
					/>
					<FormField
					  label="Stack Direction (deg)"
					  name="deg_from_north_of_stack_rel_to_center"
					  type="number"
					  value={buildingData.deg_from_north_of_stack_rel_to_center}
					  onChange={handleChange}
					  required
					  min={0.0}
					  max={360.0}
					  step={0.1}
					  tooltip="Enter the degrees from North of the stack location relative to the building center"
					/>
					<FormField
					  label="Stack Distance"
					  name="dist_stack_to_center"
					  type="number"
					  value={buildingData.dist_stack_to_center}
					  onChange={handleChange}
					  required
					  min={0.0}
					  max={360.0}
					  step={0.1}
					  tooltip="Enter the distance from the stack location to the building center in feet or meters"
					/>
					<FormField
					  label="Stack Distance Units"
					  name="dist_to_stack_center_units"
					  type="select"
					  value={buildingData.dist_to_stack_center_units}
					  onChange={handleChange}
					  options={distanceUnits}
					  required
					  tooltip="Select the unit for stack distance to building center"
					/>

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
