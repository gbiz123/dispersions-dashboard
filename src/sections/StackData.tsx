import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { useAerscreen } from '../context/AerscreenContext';
import { AerscreenSourceData as StackDataType } from '../types/api';
import { DistanceUnit, VelocityUnit, FlowRateUnit, TemperatureUnit, EmissionRateUnit, AerscreenSourceType } from '../types/enums';
import LoadingOverlay from '../components/LoadingOverlay';
import InfoSection from 'components/InfoSection';


/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */
const StackData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const { isLoadingRunData } = useAerscreen();
  const navigate = useNavigate();

  /* ------------- change handler ----------------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

	updateFormData('source_data', {
		...formData.source_data,
		[name]: value
	})

	console.log("Stack data", formData.source_data)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/building-data');
  };

  const sourceTypeOptions = [
    { value: AerscreenSourceType.POINT, label: 'Point' },
    { value: AerscreenSourceType.CAPPED_POINT, label: 'Capped point' },
    { value: AerscreenSourceType.HORIZONTAL_POINT, label: 'Horizontal point' },
    { value: AerscreenSourceType.FLARE, label: 'Flare' },
    { value: AerscreenSourceType.VOLUME, label: 'Volume' },
    { value: AerscreenSourceType.RECTANGULAR_AREA, label: 'Rectangular area' },
    { value: AerscreenSourceType.CIRCULAR_AREA, label: 'Circular area' }
  ];

  const emissionRateUnits = [
    { value: EmissionRateUnit.GRAMS_PER_SECOND, label: 'Grams per second (g/s)' },
    { value: EmissionRateUnit.POUNDS_PER_HOUR, label: 'Pounds per hour (lb/hr)' }
  ];

  const stackDiamUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.INCHES, label: 'Inches (in)' }
  ];

  const distanceUnits = [
    { value: DistanceUnit.METERS, label: 'Meters (m)' },
    { value: DistanceUnit.FEET, label: 'Feet (ft)' }
  ];

  const temperatureUnits = [
    { value: TemperatureUnit.KELVIN, label: 'Kelvin (K)' },
    { value: TemperatureUnit.FAHRENHEIT, label: 'Fahrenheit (°F)' }
  ];

  const velocityUnits = [
    { value: VelocityUnit.METERS_PER_SECOND, label: 'Meters per second (m/s)' },
    { value: VelocityUnit.FEET_PER_SECOND, label: 'Feet per second (ft/s)' },
    { value: FlowRateUnit.CUBIC_FEET_PER_MINUTE, label: 'Cubic feet per minute (AFCM)' }
  ];

  const isPointLike = (t: AerscreenSourceType) =>
    [AerscreenSourceType.POINT, AerscreenSourceType.CAPPED_POINT, AerscreenSourceType.HORIZONTAL_POINT].includes(t);

  if (isLoadingRunData) {
    return <LoadingOverlay message="Loading previous run data..." />;
  }

  return (

		<SectionContainer
		  title="Emission Source"
		  onSubmit={handleSubmit}
		  nextSection="/building-data"
		  nextSectionLabel="Building Data"
		>
		  <InfoSection content="Configure a single point, flare, capped stack, horizontal stack, volume, rectangular area, or circular area source." />

		  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<FormField
			  label="Source Type"
			  name="sourceType"
			  defaultNoneSelected={true}
			  defaultNoneSelectedMessage="Select a source type"
			  type="select"
			  value={formData.source_data.sourceType}
			  onChange={handleChange}
			  options={sourceTypeOptions}
			  required
			  tooltip="Select the type of emission source you are modeling"
			/>
			<div className="md:col-span-1"></div>
			
			{isPointLike(formData.source_data.sourceType) && (
			  <Fragment>
				<FormField
				  label="Emission Rate"
				  name="rate"
				  type="number"
				  value={formData.source_data.rate}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
				/>
				<FormField
				  label="Emission Rate Unit"
				  name="rate_unit"
				  type="select"
				  value={formData.source_data.rate_unit}
				  onChange={handleChange}
				  options={emissionRateUnits}
				  required
				  tooltip="Select the unit for emission rate"
				/>
				<FormField
				  label="Stack Height"
				  name="height"
				  type="number"
				  value={formData.source_data.height}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the height of the stack opening above ground level in feet or meters"
				/>
				<FormField
				  label="Stack Height Unit"
				  name="height_unit"
				  type="select"
				  value={formData.source_data.height_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for stack height"
				/>
				<FormField
				  label="Stack Diameter"
				  name="diam"
				  type="number"
				  value={formData.source_data.diam}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the internal exit diameter of the stack in inches or meters"
				/>
				<FormField
				  label="Stack Diameter Unit"
				  name="diam_unit"
				  type="select"
				  value={formData.source_data.diam_unit}
				  onChange={handleChange}
				  options={stackDiamUnits}
				  required
				  tooltip="Select the unit for stack diameter"
				/>
				<FormField
				  label="Stack Gas Exit Temperature"
				  name="temp_k"
				  type="number"
				  value={formData.source_data.temp_k}
				  onChange={handleChange}
				  required
				  tooltip="Enter the temperature of the gas exiting the stack in F or K. Negatives are relative to ambient temperature."
				/>
				<FormField
				  label="Temperature Unit"
				  name="temp_unit"
				  type="select"
				  value={formData.source_data.temp_unit}
				  onChange={handleChange}
				  options={temperatureUnits}
				  required
				  tooltip="Select the unit for temperature"
				/>
				<FormField
				  label="Stack Gas Exit Rate"
				  name="vel"
				  type="number"
				  value={formData.source_data.vel}
				  onChange={handleChange}
				  required
				  tooltip="Enter the velocity of gas exiting the stack in ft/s or m/s"
				/>
				<FormField
				  label="Rate Unit"
				  name="vel_unit"
				  type="select"
				  value={formData.source_data.vel_unit}
				  onChange={handleChange}
				  options={velocityUnits}
				  required
				  tooltip="Select the unit for velocity"
				/>
			  </Fragment>
			)}

			{formData.source_data.sourceType === AerscreenSourceType.FLARE && (
			  <Fragment>
				<FormField
				  label="Emission Rate"
				  name="rate"
				  type="number"
				  value={formData.source_data.rate}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
				/>
				<FormField
				  label="Emission Rate Unit"
				  name="rate_unit"
				  type="select"
				  value={formData.source_data.rate_unit}
				  onChange={handleChange}
				  options={emissionRateUnits}
				  required
				  tooltip="Select the unit for emission rate"
				/>
				<FormField
				  label="Stack Height"
				  name="height"
				  type="number"
				  value={formData.source_data.height}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the height of the stack opening above ground level in feet or meters"
				/>
				<FormField
				  label="Stack Height Unit"
				  name="height_unit"
				  type="select"
				  value={formData.source_data.height_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for stack height"
				/>
				<FormField
				  label="Heat Release Rate (cal/sec)"
				  name="heat_release_rate"
				  type="number"
				  value={formData.source_data.heat_release_rate ?? 0}
				  onChange={handleChange}
				  required
				  tooltip="Enter the total heat release rate in cal/sec"
				/>
				<FormField
				  label="Heat Loss Fraction (0–1)"
				  name="heat_loss_fraction"
				  type="number"
				  value={formData.source_data.heat_loss_fraction ?? 0}
				  onChange={handleChange}
				  min={0}
				  max={1}
				  step={0.01}
				  required
				  tooltip="Enter the total radiative heat loss fraction as a value from 0 to 1"
				/>
			  </Fragment>
			)}

			{formData.source_data.sourceType === AerscreenSourceType.VOLUME && (
			  <Fragment>
				<FormField
				  label="Emission Rate"
				  name="rate"
				  type="number"
				  value={formData.source_data.rate}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
				/>
				<FormField
				  label="Emission Rate Unit"
				  name="rate_unit"
				  type="select"
				  value={formData.source_data.rate_unit}
				  onChange={handleChange}
				  options={emissionRateUnits}
				  required
				  tooltip="Select the unit for emission rate"
				/>
				<FormField
				  label="Release Height AGL"
				  name="release_height_agl"
				  type="number"
				  value={formData.source_data.release_height_agl}
				  onChange={handleChange}
				  required
				  tooltip="Enter release height, i.e center of volumne, in feet or meters"
				/>
				<FormField
				  label="Release Height Unit"
				  name="height_unit"
				  type="select"
				  value={formData.source_data.height_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for release height"
				/>
				<FormField
				  label="Initial Lateral Dimension"
				  name="initial_lateral_dimension"
				  type="number"
				  value={formData.source_data.initial_lateral_dimension}
				  onChange={handleChange}
				  required
				  tooltip="Enter the initial lateral dimension of the volume in feet or meters"
				/>
				<FormField
				  label="Lateral Dimension Unit"
				  name="lateral_dimension_height_unit"
				  type="select"
				  value={formData.source_data.lateral_dimension_height_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for initial lateral dimension"
				/>
				<FormField
				  label="Initial Vertical Dimension"
				  name="initial_vertical_dimension"
				  type="number"
				  value={formData.source_data.initial_vertical_dimension}
				  onChange={handleChange}
				  required
				  tooltip="Enter the initial vertical dimension of the volume in feet or meters"
				/>
				<FormField
				  label="Vertical Dimension Unit"
				  name="vertical_dimension_height_unit"
				  type="select"
				  value={formData.source_data.vertical_dimension_height_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for initial vertical dimension"
				/>
			  </Fragment>
			)}

			{formData.source_data.sourceType === AerscreenSourceType.RECTANGULAR_AREA && (
			  <Fragment>
				<FormField
				  label="Emission Rate"
				  name="rate"
				  type="number"
				  value={formData.source_data.rate}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
				/>
				<FormField
				  label="Emission Rate Unit"
				  name="rate_unit"
				  type="select"
				  value={formData.source_data.rate_unit}
				  onChange={handleChange}
				  options={emissionRateUnits}
				  required
				  tooltip="Select the unit for emission rate"
				/>
				<FormField
				  label="Release Height AGL"
				  name="release_height_agl"
				  type="number"
				  value={formData.source_data.release_height_agl}
				  onChange={handleChange}
				  required
				  tooltip="Enter release height, i.e center of volumne, in feet or meters"
				/>
				<FormField
				  label="Release Height Unit"
				  name="height_unit"
				  type="select"
				  value={formData.source_data.height_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for release height"
				/>
				<FormField
				  label="Length"
				  name="length"
				  type="number"
				  value={formData.source_data.length}
				  onChange={handleChange}
				  required
				  tooltip="Enter the length of the area source"
				/>
				<FormField
				  label="Length Unit"
				  name="length_unit"
				  type="select"
				  value={formData.source_data.length_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for area length"
				/>
				<FormField
				  label="Width"
				  name="width"
				  type="number"
				  value={formData.source_data.width}
				  onChange={handleChange}
				  required
				  tooltip="Enter the width of the area source"
				/>
				<FormField
				  label="Width Unit"
				  name="width_unit"
				  type="select"
				  value={formData.source_data.width_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for area width"
				/>
				<FormField
				  label="Vertical Dimension"
				  name="vertical_dimension"
				  type="number"
				  value={formData.source_data.vertical_dimension}
				  onChange={handleChange}
				  required
				  tooltip="Enter the initial initial vertical dimension of the plume"
				/>
				<FormField
				  label="Width Unit"
				  name="width_unit"
				  type="select"
				  value={formData.source_data.width_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for initial vertical dimension"
				/>
			  </Fragment>
			)}

			{formData.source_data.sourceType === AerscreenSourceType.CIRCULAR_AREA && (
			  <Fragment>
				<FormField
				  label="Emission Rate"
				  name="rate"
				  type="number"
				  value={formData.source_data.rate}
				  onChange={handleChange}
				  min={0}
				  required
				  tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
				/>
				<FormField
				  label="Emission Rate Unit"
				  name="rate_unit"
				  type="select"
				  value={formData.source_data.rate_unit}
				  onChange={handleChange}
				  options={emissionRateUnits}
				  required
				  tooltip="Select the unit for emission rate"
				/>
				<FormField
				  label="Release Height AGL"
				  name="release_height_agl"
				  type="number"
				  value={formData.source_data.release_height_agl}
				  onChange={handleChange}
				  required
				  tooltip="Enter release height, i.e center of volumne, in feet or meters"
				/>
				<FormField
				  label="Release Height Unit"
				  name="height_unit"
				  type="select"
				  value={formData.source_data.height_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for release height"
				/>
				<FormField
				  label="Vertical Dimension"
				  name="vertical_dimension"
				  type="number"
				  value={formData.source_data.vertical_dimension}
				  onChange={handleChange}
				  required
				  tooltip="Enter the initial initial vertical dimension of the plume"
				/>
				<FormField
				  label="Width Unit"
				  name="width_unit"
				  type="select"
				  value={formData.source_data.width_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for initial vertical dimension"
				/>
				<FormField
				  label="Radius"
				  name="radius"
				  type="number"
				  value={formData.source_data.radius}
				  onChange={handleChange}
				  required
				  tooltip="Enter the radius of the circle"
				/>
				<FormField
				  label="Radius Unit"
				  name="radius_unit"
				  type="select"
				  value={formData.source_data.radius_unit}
				  onChange={handleChange}
				  options={distanceUnits}
				  required
				  tooltip="Select the unit for radius"
				/>
				<FormField
				  label="Number of vertices"
				  name="num_vertices"
				  type="number"
				  value={formData.source_data.num_vertices}
				  onChange={handleChange}
				  required
				  tooltip="Increase the number of vertices to make the shape smoother, but increase processing time"
				/>
			  </Fragment>
			)}
		  </div>
		</SectionContainer>
  );
};

export default StackData;
