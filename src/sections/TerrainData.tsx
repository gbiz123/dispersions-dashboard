import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { AerscreenTerrainData as TerrainDataType, TerrainInputFiles } from '../types/api';
import { DistanceUnit, TerrainType, NADDatum, TerrainFileType, TerrainSource } from '../types/enums';
import { UnitSystem } from '../types/api';

const TerrainData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  
  // Default values
  const defaultTerrainData: TerrainDataType = {
    use_terrain: false,
    use_discrete_receptors: false,
    terrain_type: TerrainType.FLAT,
    elev_unit: DistanceUnit.METERS,
    hill_height: 0,
    hill_height_unit: DistanceUnit.METERS,
    utm_zone: 0
  };
  
  const defaultTerrainInputFiles: TerrainInputFiles = {
    us_county: '',
    us_state: '',
    nad_datum: NADDatum.NAD83,
    probe_dist: 0,
    probe_dist_unit: DistanceUnit.METERS,
    file_type: TerrainFileType.DEM,
    units: UnitSystem.METRIC,
    file: null,
    terrain_source: TerrainSource.UPLOAD_FILE
  };
  
  // Initialize state with existing data or defaults
  const [terrainData, setTerrainData] = useState<TerrainDataType>(
    formData.terrain_data || defaultTerrainData
  );
  
  const [terrainInputFiles, setTerrainInputFiles] = useState<TerrainInputFiles>(
    formData.terrain_input_files || defaultTerrainInputFiles
  );

  const handleTerrainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setTerrainData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setTerrainData(prev => ({
        ...prev,
        [name]: name.includes('hill_height') || name.includes('utm_zone') ? parseFloat(value) || 0 : value
      }));
    }
  };
  
  const handleTerrainFilesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'terrain_source') {
      setTerrainInputFiles(prev => ({
        ...prev,
        terrain_source: value as TerrainSource,
        file: null // clear any previously chosen file
      }));
      return;
    }

    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] ?? null;
      setTerrainInputFiles(prev => ({ ...prev, file }));
      return;
    }

    setTerrainInputFiles(prev => ({
      ...prev,
      [name]: ['probe_dist'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateFormData('terrain_data', terrainData);
    
    if (terrainData.use_terrain) {
      updateFormData('terrain_input_files', terrainInputFiles);
    }
    
    // Navigate based on selection
    navigate('/other-inputs');
  };

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];
  
  // Terrain type options
  const terrainTypeOptions = [
    { value: TerrainType.FLAT, label: 'Flat' },
    { value: TerrainType.SIMPLE, label: 'Simple' },
    { value: TerrainType.COMPLEX, label: 'Complex' }
  ];
  
  // NAD Datum options
  const nadDatumOptions = [
    { value: NADDatum.NAD27, label: 'NAD27' },
    { value: NADDatum.NAD83, label: 'NAD83' },
    { value: NADDatum.WGS84, label: 'WGS84' }
  ];

  // UTM Zone options
  const utmZoneOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1)
  }));

  // File type options
  const fileTypeOptions = [
    { value: TerrainFileType.DEM, label: 'DEM' },
    { value: TerrainFileType.DTED, label: 'DTED' },
    { value: TerrainFileType.GEO_TIFF, label: 'GeoTIFF' }
  ];

  // Unit system options
  const unitSystemOptions = [
    { value: UnitSystem.METRIC, label: 'Metric' },
    { value: UnitSystem.ENGLISH, label: 'English' }
  ];

  // Terrain source options
  const terrainSourceOptions = [
    { value: TerrainSource.UPLOAD_FILE, label: 'Upload terrain file' },
    { value: TerrainSource.NATIONAL_MAP, label: 'Pull from national map' }
  ];

  return (
    <SectionContainer
      title="Terrain Data"
      onSubmit={handleSubmit}
      nextSection="/other-inputs"
      nextSectionLabel="Other Inputs"
      previousSection="/makemet-data"
    >
      <div className="space-y-4">
        <div className="mb-6 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="has_terrain"
              checked={terrainData.use_terrain}
              onChange={handleTerrainChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span>Has Terrain</span>
          </label>
        </div>
        
        {terrainData.use_terrain && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Terrain Type"
                name="terrain_type"
                type="select"
                value={terrainData.terrain_type || ''}
                onChange={handleTerrainChange}
                options={terrainTypeOptions}
                required
              />
              
              <FormField
                label="Elevation Unit"
                name="elev_unit"
                type="select"
                value={terrainData.elev_unit || ''}
                onChange={handleTerrainChange}
                options={distanceUnits}
                required
              />
              
              {terrainData.terrain_type === TerrainType.SIMPLE && (
                <>
                  <FormField
                    label="Hill Height"
                    name="hill_height"
                    type="number"
                    value={terrainData.hill_height || 0}
                    onChange={handleTerrainChange}
                    required
                  />
                  
                  <FormField
                    label="Hill Height Unit"
                    name="hill_height_unit"
                    type="select"
                    value={terrainData.hill_height_unit || ''}
                    onChange={handleTerrainChange}
                    options={distanceUnits}
                    required
                  />
                </>
              )}

              <FormField
                label="UTM Zone"
                name="utm_zone"
                type="select"
                value={terrainData.utm_zone || ''}
                onChange={handleTerrainChange}
                options={utmZoneOptions}
                required
              />
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Terrain Input Files</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Terrain source"
                name="terrain_source"
                type="select"
                value={terrainInputFiles.terrain_source}
                onChange={handleTerrainFilesChange}
                options={terrainSourceOptions}
              />

              {terrainInputFiles.terrain_source === TerrainSource.UPLOAD_FILE && (
                <>
                  <FormField
                    label="US County ID"
                    name="us_county"
                    type="text"
                    value={terrainInputFiles.us_county || ''}
                    onChange={handleTerrainFilesChange}
                  />
                  
                  <FormField
                    label="US State"
                    name="us_state"
                    type="text"
                    value={terrainInputFiles.us_state || ''}
                    onChange={handleTerrainFilesChange}
                  />
                  
                  <FormField
                    label="NAD Datum"
                    name="nad_datum"
                    type="select"
                    value={terrainInputFiles.nad_datum || ''}
                    onChange={handleTerrainFilesChange}
                    options={nadDatumOptions}
                    required
                  />
                  
                  <FormField
                    label="Probe Distance"
                    name="probe_dist"
                    type="number"
                    value={terrainInputFiles.probe_dist || 0}
                    onChange={handleTerrainFilesChange}
                  />
                  
                  <FormField
                    label="Probe Distance Unit"
                    name="probe_dist_unit"
                    type="select"
                    value={terrainInputFiles.probe_dist_unit || ''}
                    onChange={handleTerrainFilesChange}
                    options={distanceUnits}
                  />

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Upload Terrain File
                    </label>
                    <input
                      type="file"
                      accept=".dem,.dted,.tif,.tiff"
                      onChange={handleTerrainFilesChange}
                      className="block w-full text-sm"
                    />
                  </div>

                  <FormField
                    label="File Type"
                    name="file_type"
                    type="select"
                    value={terrainInputFiles.file_type || ''}
                    onChange={handleTerrainFilesChange}
                    options={fileTypeOptions}
                    required={!!terrainInputFiles.file}
                  />

                  <FormField
                    label="Units"
                    name="units"
                    type="select"
                    value={terrainInputFiles.units || ''}
                    onChange={handleTerrainFilesChange}
                    options={unitSystemOptions}
                    required={!!terrainInputFiles.file}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </SectionContainer>
  );
};

export default TerrainData;
