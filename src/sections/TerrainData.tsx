import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { AerscreenTerrainData as TerrainDataType, TerrainInputFiles } from '../types/api';
import { TerrainType, NADDatum, TerrainFileType, TerrainSource, DemFileResolution, DemFileUnits, DistanceUnit } from '../types/enums';
import InfoSection from 'components/InfoSection';

const TerrainData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();
  

  const handleTerrainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (name.includes('hill_height') || name.includes('utm_zone')) {
      processedValue = parseFloat(value) || 0;
    }
    
    updateFormData('terrain_data', {
      ...formData.terrain_data,
      [name]: processedValue
    });

	console.log(formData)
  };
  
  const handleTerrainFilesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'terrain_source') {
      updateFormData('terrain_input_files', {
        ...formData.terrain_input_files,
        terrain_source: value as TerrainSource,
        file: null // clear any previously chosen file
      });
      return;
    }

    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] ?? null;
      updateFormData('terrain_input_files', {
        ...formData.terrain_input_files,
        file
      });
      return;
    }

    const processedValue = ['probe_dist'].includes(name) ? parseFloat(value) || 0 : value;
    updateFormData('terrain_input_files', {
      ...formData.terrain_input_files,
      [name]: processedValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate based on selection
    navigate('/other-inputs');
  };

  // Distance units options
  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

  const demFileResolutionOptions = [
	{ value: DemFileResolution.NED_1_ARC_SECOND, label: 'NED (1 Arc Second)' },
	{ value: DemFileResolution.NED_1_3RD_ARC_SECOND, label: 'NED (1/3 Arc Second)' },
	{ value: DemFileResolution.NED_1_9TH_ARC_SECOND, label: 'NED (1/9 Arc Second)' },
	{ value: DemFileResolution.NED_2_ARC_SECOND_ALASKA, label: 'NED (2 Arc Second Alaska)' },
	{ value: DemFileResolution.DEM_1_METER, label: 'DEM (1 Meter)' }
  ]
  
  // NAD Datum options
  const nadDatumOptions = [
    { value: NADDatum.NAD27, label: 'NAD27' },
    { value: NADDatum.NAD83, label: 'NAD83' },
  ];

  // UTM Zone options
  const utmZoneOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1)
  }));

  // File type options
  const fileTypeOptions = [
    { value: TerrainFileType.NED, label: 'NED' },
    { value: TerrainFileType.DEM, label: 'DEM' }
  ];

  // Unit system options
  const demFileUnitOptions = [
	  { value: DemFileUnits.METERS, label:  "Meters" },
	  { value: DemFileUnits.DECIMETERS, label:  "Deci-meters" },
	  { value: DemFileUnits.DECAMETERS, label:  "Deca-meters" },
	  { value: DemFileUnits.FEET, label:  "Feet" },
	  { value: DemFileUnits.DECIFEET, label:  "Deci-feet" },
	  { value: DemFileUnits.DECAFEET, label:  "Deca-feet" }
  ];

  // Terrain source options
  const terrainSourceOptions = [
    { value: TerrainSource.UPLOAD_FILE, label: 'Upload terrain file' },
    { value: TerrainSource.NATIONAL_MAP, label: 'Pull from National Elevation Dataset' }
  ];

  return (
    <SectionContainer
      title="Terrain"
      onSubmit={handleSubmit}
      nextSection="/discrete-receptors"
      nextSectionLabel="Discrete Receptors"
      previousSection="/makemet-data"
    >
      <InfoSection content="Include terrain processing provided by AERMAP." />
      <div className="space-y-4">
        <div className="mb-6 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="use_terrain"
              checked={formData.terrain_data?.use_terrain || false}
              onChange={handleTerrainChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span>Use Terrain</span>
          </label>
        </div>
        
        {formData.terrain_data?.use_terrain && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">Location Inputs</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="UTM X Coordinate"
                name="utm_x"
                type="number"
                value={formData.terrain_data?.utm_x || ''}
                onChange={handleTerrainChange}
                required
				tooltip="Enter the UTM X coordinate (Easting) of the emission source"
              />
              <FormField
                label="UTM Y Coordinate"
                name="utm_y"
                type="number"
                value={formData.terrain_data?.utm_y || ''}
                onChange={handleTerrainChange}
                required
				tooltip="Enter the UTM Y coordinate (Northing) of the emission source"
              />
              <FormField
                label="UTM Zone"
                name="utm_zone"
                type="select"
                value={formData.terrain_data?.utm_zone || ''}
                onChange={handleTerrainChange}
                options={utmZoneOptions}
                required
				tooltip="Enter the UTM zone of the emission source"
              />
			  
			  <FormField
				label="NAD Datum"
				name="nad_datum"
				type="select"
				value={formData.terrain_data?.nad_datum || ''}
				onChange={handleTerrainFilesChange}
				options={nadDatumOptions}
				required
				tooltip="Enter the NAD datum of the source location"
			  />
			  <FormField
				label="Probe Distance"
				name="probe_dist"
				type="number"
				value={formData.terrain_data?.probe_distance || 0}
				onChange={handleTerrainFilesChange}
				tooltip="Enter the maximum distance to the probe in feet or meters"
			  />
			  
			  <FormField
				label="Probe Distance Unit"
				name="probe_dist_unit"
				type="select"
				value={formData.terrain_data?.probe_distance_units || ''}
				onChange={handleTerrainFilesChange}
				options={distanceUnits}
				tooltip="Enter the units of probe distance"
			  />
			  <FormField
				label="Source Elevation"
				name="probe_dist"
				type="number"
				value={formData.terrain_data?.elevation || 0}
				onChange={handleTerrainFilesChange}
				tooltip="Enter the elevation of the emission source in feet or meters"
			  />
              <FormField
                label="Source Elevation Unit"
                name="elevation_units"
                type="select"
                value={formData.terrain_data?.elevation_units || ''}
                onChange={handleTerrainChange}
                options={distanceUnits}
                required
				tooltip="Enter the units of source elevation"
              />
              <FormField
                label="Override Source Elevation"
                name="override_elevation_with_aermap_val"
                type="checkbox"
                value={formData.terrain_data?.override_elevation_with_aermap_val || false}
                onChange={handleTerrainChange}
                required
				tooltip="Override the emission source value with the value calculated by AERMAP"
              />
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Terrain Input Files</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Terrain source"
                name="terrain_source"
				defaultNoneSelected={true}
				defaultNoneSelectedMessage="Select terrain source"
                type="select"
                value={formData.terrain_input_files?.terrain_source}
                onChange={handleTerrainFilesChange}
                options={terrainSourceOptions}
				tooltip="Select whether to upload your own terrain files, or to pull from the National Elevation Dataset automatically"
              />
              {formData.terrain_input_files?.terrain_source === TerrainSource.NATIONAL_MAP && (
                  <FormField
                    label="NED File Resolution"
                    name="dem_file_resolution"
                    type="select"
                    value={formData.terrain_input_files?.dem_file_resolution || ''}
                    onChange={handleTerrainFilesChange}
                    options={demFileResolutionOptions}
                    required={!!formData.terrain_input_files?.file}
					tooltip="Choose the resolution of the NED file you would like to pull"
                  />
			  )}

              {formData.terrain_input_files?.terrain_source === TerrainSource.UPLOAD_FILE && (
                <>
					<div></div>
                  <FormField
                    label="File Type"
                    name="file_type"
                    type="select"
                    value={formData.terrain_input_files?.file_type || ''}
                    onChange={handleTerrainFilesChange}
                    options={fileTypeOptions}
                    required={!!formData.terrain_input_files?.file}
					tooltip="Choose the type of file as NED or DEM"
                  />

				  {formData.terrain_input_files?.file_type === TerrainFileType.NED && (
					  <FormField
						label="NED File Units"
						name="units"
						type="select"
						value={formData.terrain_input_files?.units || ''}
						onChange={handleTerrainFilesChange}
						options={demFileUnitOptions}
						required={!!formData.terrain_input_files?.file && formData.terrain_input_files?.file_type === TerrainFileType.NED}
						tooltip="Choose the units of the terrain data for NED file"
					  />
					)}

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Upload Terrain File
                    </label>
                    <input
                      type="file"
                      accept=".dem,.dted,.tif,.tiff,.geotiff"
                      onChange={handleTerrainFilesChange}
                      className="block w-full text-sm"
                    />
                  </div>
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
