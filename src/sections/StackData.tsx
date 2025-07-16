import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { useAerscreen } from '../context/AerscreenContext';
import { AerscreenSourceData as StackDataType } from '../types/api';
import { DistanceUnit, VelocityUnit, FlowRateUnit, TemperatureUnit, EmissionRateUnit } from '../types/enums';
import LoadingOverlay from '../components/LoadingOverlay';
import InfoSection from 'components/InfoSection';

enum SourceType {
  POINT = 'point',
  CAPPED_POINT = 'capped_point',
  HORIZONTAL_POINT = 'horizontal_point',
  FLARE = 'flare',
  VOLUME = 'volume',
  RECTANGULAR_AREA = 'rectangular_area',
  CIRCULAR_AREA = 'circular_area'
}

const makeDefaults = (t: SourceType): Partial<StackDataType> => {
  switch (t) {
    case SourceType.FLARE:
      return {
        rate: 0,
        height: 0,
        heat_release_rate: 0,
        heat_loss_fraction: 0.55,
      };
    case SourceType.VOLUME:
      return {
        rate: 0,
        release_height_agl: 0,
        initial_lateral_dimension: 0,
        initial_vertical_dimension: 0,
      };
    case SourceType.RECTANGULAR_AREA:
      return {
        rate: 0,
        release_height_agl: 0,
        width: 0,
        length: 0,
        vertical_dimension: 0,
      };
    case SourceType.CIRCULAR_AREA:
      return {
        rate: 0,
        release_height_agl: 0,
        radius: 0,
        num_vertices: 20,
        vertical_dimension: 0,
      };
    /* point-like sources share the same five groups of fields */
    default:
      return {
        rate: 0,
        height: 0,
        diam: 0,
        temp_k: 0,
        vel: 0,
        flow_rate: 0,
      };
  }
};

/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */
const StackData: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const { isLoadingRunData } = useAerscreen();
  const navigate = useNavigate();
  
  const defaultStackData: StackDataType & { sourceType: SourceType } = {
    rate: 0,
    height: 0,
    diam: 0,
    temp_k: 0,
    vel: 0,
    flow_rate: 0,
    rate_unit: EmissionRateUnit.GRAMS_PER_SECOND,
    height_unit: DistanceUnit.METERS,
    diam_unit: DistanceUnit.METERS,
    temp_unit: TemperatureUnit.KELVIN,
    vel_unit: VelocityUnit.METERS_PER_SECOND,
    flow_rate_unit: FlowRateUnit.CUBIC_METERS_PER_SECOND,
    heat_release_rate: 0,
    heat_loss_fraction: 0.55,
    release_height_agl: 0,
    initial_lateral_dimension: 0,
    initial_vertical_dimension: 0,
    length: 0,
    width: 0,
    vertical_dimension: 0,
    radius: 0,
    num_vertices: 20,
    sourceType: SourceType.POINT
  };
  
  const [stackData, setStackData] = useState<StackDataType & { sourceType: SourceType }>(
    formData.stack_data
      ? { ...defaultStackData, ...formData.stack_data, sourceType: SourceType.POINT }
      : defaultStackData
  );

  /* ------------- change handler ----------------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    /* when user switches the sourceType, reset to clean defaults */
    if (name === 'sourceType') {
      const newType = value as SourceType;

      // create a brand-new state object that satisfies the full type
      setStackData({
        ...defaultStackData,          // ← full template (all required keys)
        ...makeDefaults(newType),     // ← type-specific minimal set
        sourceType: newType           // ← finally update the selector
      });

      return;
    }

    /* numeric sanitation (unchanged) */
    const sanitised =
      name === 'heat_loss_fraction'
        ? Math.max(0.0001, Math.min(1, parseFloat(value) || 0))
        : value;

    setStackData(prev => ({
      ...prev,
      [name]:
        /* list of numeric fields */
        [
          'rate', 'height', 'diam', 'temp_k', 'vel', 'flow_rate',
          'heat_release_rate', 'heat_loss_fraction', 'release_height_agl',
          'initial_lateral_dimension', 'initial_vertical_dimension',
          'length', 'width', 'vertical_dimension', 'radius', 'num_vertices',
        ].includes(name)
          ? parseFloat(sanitised as string) || 0
          : sanitised,
    }));
  };

  /* ──────────────────────────────────────────────────────────────
   * keep-list for every source-type
   * ──────────────────────────────────────────────────────────── */
  const allowedFields: Record<SourceType, (keyof StackDataType)[]> = {
    [SourceType.POINT]: [
      'rate', 'height', 'diam', 'temp_k', 'vel', 'flow_rate',
      'rate_unit', 'height_unit', 'diam_unit', 'temp_unit',
      'vel_unit', 'flow_rate_unit'
    ],
    [SourceType.CAPPED_POINT]: [
      'rate', 'height', 'diam', 'temp_k', 'vel', 'flow_rate',
      'rate_unit', 'height_unit', 'diam_unit', 'temp_unit',
      'vel_unit', 'flow_rate_unit'
    ],
    [SourceType.HORIZONTAL_POINT]: [
      'rate', 'height', 'diam', 'temp_k', 'vel', 'flow_rate',
      'rate_unit', 'height_unit', 'diam_unit', 'temp_unit',
      'vel_unit', 'flow_rate_unit'
    ],
    [SourceType.FLARE]: [
      'rate', 'height', 'heat_release_rate', 'heat_loss_fraction'
    ],
    [SourceType.VOLUME]: [
      'rate', 'release_height_agl',
      'initial_lateral_dimension', 'initial_vertical_dimension'
    ],
    [SourceType.RECTANGULAR_AREA]: [
      'rate', 'release_height_agl', 'length', 'width', 'vertical_dimension'
    ],
    [SourceType.CIRCULAR_AREA]: [
      'rate', 'release_height_agl',
      'radius', 'num_vertices', 'vertical_dimension'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* ② validation for flare – heat-loss-fraction must be 0 < x ≤ 1 */
    if (
      stackData.sourceType === SourceType.FLARE &&
      (stackData.heat_loss_fraction! <= 0 || stackData.heat_loss_fraction! > 1)
    ) {
      alert('Heat-loss fraction must be greater than 0 and less or equal 1.');
      return;
    }

    // -------- existing payload build --------
    const { sourceType, ...rest } = stackData;
    const core = allowedFields[sourceType].reduce<Record<string, unknown>>(
      (obj, k) => {
        if (rest[k] !== undefined) obj[k as string] = rest[k];
        return obj;
      },
      {}
    );
    const payload = { source_type: sourceType, ...core };

    updateFormData('stack_data', payload as StackDataType);
    navigate('/building-data');
  };

  const sourceTypeOptions = [
    { value: SourceType.POINT, label: 'Point' },
    { value: SourceType.CAPPED_POINT, label: 'Capped point' },
    { value: SourceType.HORIZONTAL_POINT, label: 'Horizontal point' },
    { value: SourceType.FLARE, label: 'Flare' },
    { value: SourceType.VOLUME, label: 'Volume' },
    { value: SourceType.RECTANGULAR_AREA, label: 'Rectangular area' },
    { value: SourceType.CIRCULAR_AREA, label: 'Circular area' }
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

  const isPointLike = (t: SourceType) =>
    [SourceType.POINT, SourceType.CAPPED_POINT, SourceType.HORIZONTAL_POINT].includes(t);

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
          type="select"
          value={stackData.sourceType}
          onChange={handleChange}
          options={sourceTypeOptions}
          required
          tooltip="Select the type of emission source you are modeling"
        />
        <div className="md:col-span-1"></div>
        
        {isPointLike(stackData.sourceType) && (
          <Fragment>
            <FormField
              label="Emission Rate"
              name="rate"
              type="number"
              value={stackData.rate}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
            />
            <FormField
              label="Emission Rate Unit"
              name="rate_unit"
              type="select"
              value={stackData.rate_unit}
              onChange={handleChange}
              options={emissionRateUnits}
              required
              tooltip="Select the unit for emission rate"
            />
            <FormField
              label="Stack Height"
              name="height"
              type="number"
              value={stackData.height}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the height of the stack opening above ground level in feet or meters"
            />
            <FormField
              label="Stack Height Unit"
              name="height_unit"
              type="select"
              value={stackData.height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for stack height"
            />
            <FormField
              label="Stack Diameter"
              name="diam"
              type="number"
              value={stackData.diam}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the internal exit diameter of the stack in inches or meters"
            />
            <FormField
              label="Stack Diameter Unit"
              name="diam_unit"
              type="select"
              value={stackData.diam_unit}
              onChange={handleChange}
              options={stackDiamUnits}
              required
              tooltip="Select the unit for stack diameter"
            />
            <FormField
              label="Stack Gas Exit Temperature"
              name="temp_k"
              type="number"
              value={stackData.temp_k}
              onChange={handleChange}
              required
              tooltip="Enter the temperature of the gas exiting the stack in F or K. Negatives are relative to ambient temperature."
            />
            <FormField
              label="Temperature Unit"
              name="temp_unit"
              type="select"
              value={stackData.temp_unit}
              onChange={handleChange}
              options={temperatureUnits}
              required
              tooltip="Select the unit for temperature"
            />
            <FormField
              label="Stack Gas Exit Rate"
              name="vel"
              type="number"
              value={stackData.vel}
              onChange={handleChange}
              required
              tooltip="Enter the velocity of gas exiting the stack in ft/s or m/s"
            />
            <FormField
              label="Rate Unit"
              name="vel_unit"
              type="select"
              value={stackData.vel_unit}
              onChange={handleChange}
              options={velocityUnits}
              required
              tooltip="Select the unit for velocity"
            />
          </Fragment>
        )}

        {stackData.sourceType === SourceType.FLARE && (
          <Fragment>
            <FormField
              label="Emission Rate"
              name="rate"
              type="number"
              value={stackData.rate}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
            />
            <FormField
              label="Emission Rate Unit"
              name="rate_unit"
              type="select"
              value={stackData.rate_unit}
              onChange={handleChange}
              options={emissionRateUnits}
              required
              tooltip="Select the unit for emission rate"
            />
            <FormField
              label="Stack Height"
              name="height"
              type="number"
              value={stackData.height}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the height of the stack opening above ground level in feet or meters"
            />
            <FormField
              label="Stack Height Unit"
              name="height_unit"
              type="select"
              value={stackData.height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for stack height"
            />
            <FormField
              label="Heat Release Rate (cal/sec)"
              name="heat_release_rate"
              type="number"
              value={stackData.heat_release_rate ?? 0}
              onChange={handleChange}
              required
			  tooltip="Enter the total heat release rate in cal/sec"
            />
            <FormField
              label="Heat Loss Fraction (0–1)"
              name="heat_loss_fraction"
              type="number"
              value={stackData.heat_loss_fraction ?? 0}
              onChange={handleChange}
              min={0}
              max={1}
              step={0.01}
              required
			  tooltip="Enter the total radiative heat loss fraction as a value from 0 to 1"
            />
          </Fragment>
        )}

        {stackData.sourceType === SourceType.VOLUME && (
          <Fragment>
            <FormField
              label="Emission Rate"
              name="rate"
              type="number"
              value={stackData.rate}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
            />
            <FormField
              label="Emission Rate Unit"
              name="rate_unit"
              type="select"
              value={stackData.rate_unit}
              onChange={handleChange}
              options={emissionRateUnits}
              required
              tooltip="Select the unit for emission rate"
            />
            <FormField
              label="Release Height AGL"
              name="release_height_agl"
              type="number"
              value={stackData.release_height_agl}
              onChange={handleChange}
              required
			  tooltip="Enter release height, i.e center of volumne, in feet or meters"
            />
            <FormField
              label="Release Height Unit"
              name="height_unit"
              type="select"
              value={stackData.height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for release height"
            />
            <FormField
              label="Initial Lateral Dimension"
              name="initial_lateral_dimension"
              type="number"
              value={stackData.initial_lateral_dimension}
              onChange={handleChange}
              required
              tooltip="Enter the initial lateral dimension of the volume in feet or meters"
            />
            <FormField
              label="Lateral Dimension Unit"
              name="lateral_dimension_height_unit"
              type="select"
              value={stackData.lateral_dimension_height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for initial lateral dimension"
            />
            <FormField
              label="Initial Vertical Dimension"
              name="initial_vertical_dimension"
              type="number"
              value={stackData.initial_vertical_dimension}
              onChange={handleChange}
              required
              tooltip="Enter the initial vertical dimension of the volume in feet or meters"
            />
            <FormField
              label="Vertical Dimension Unit"
              name="vertical_dimension_height_unit"
              type="select"
              value={stackData.vertical_dimension_height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for initial vertical dimension"
            />
          </Fragment>
        )}

        {stackData.sourceType === SourceType.RECTANGULAR_AREA && (
          <Fragment>
            <FormField
              label="Emission Rate"
              name="rate"
              type="number"
              value={stackData.rate}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
            />
            <FormField
              label="Emission Rate Unit"
              name="rate_unit"
              type="select"
              value={stackData.rate_unit}
              onChange={handleChange}
              options={emissionRateUnits}
              required
              tooltip="Select the unit for emission rate"
            />
            <FormField
              label="Release Height AGL"
              name="release_height_agl"
              type="number"
              value={stackData.release_height_agl}
              onChange={handleChange}
              required
			  tooltip="Enter release height, i.e center of volumne, in feet or meters"
            />
            <FormField
              label="Release Height Unit"
              name="height_unit"
              type="select"
              value={stackData.height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for release height"
            />
            <FormField
              label="Length"
              name="length"
              type="number"
              value={stackData.length}
              onChange={handleChange}
              required
              tooltip="Enter the length of the area source"
            />
            <FormField
              label="Length Unit"
              name="length_unit"
              type="select"
              value={stackData.length_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for area length"
            />
            <FormField
              label="Width"
              name="width"
              type="number"
              value={stackData.width}
              onChange={handleChange}
              required
              tooltip="Enter the width of the area source"
            />
            <FormField
              label="Width Unit"
              name="width_unit"
              type="select"
              value={stackData.width_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for area width"
            />
            <FormField
              label="Vertical Dimension"
              name="vertical_dimension"
              type="number"
              value={stackData.vertical_dimension}
              onChange={handleChange}
              required
              tooltip="Enter the initial initial vertical dimension of the plume"
            />
            <FormField
              label="Width Unit"
              name="width_unit"
              type="select"
              value={stackData.width_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for initial vertical dimension"
            />
          </Fragment>
        )}

        {stackData.sourceType === SourceType.CIRCULAR_AREA && (
          <Fragment>
            <FormField
              label="Emission Rate"
              name="rate"
              type="number"
              value={stackData.rate}
              onChange={handleChange}
			  min={0}
              required
              tooltip="Enter the emission rate of the pollutant in g/s or lb/hr"
            />
            <FormField
              label="Emission Rate Unit"
              name="rate_unit"
              type="select"
              value={stackData.rate_unit}
              onChange={handleChange}
              options={emissionRateUnits}
              required
              tooltip="Select the unit for emission rate"
            />
            <FormField
              label="Release Height AGL"
              name="release_height_agl"
              type="number"
              value={stackData.release_height_agl}
              onChange={handleChange}
              required
			  tooltip="Enter release height, i.e center of volumne, in feet or meters"
            />
            <FormField
              label="Release Height Unit"
              name="height_unit"
              type="select"
              value={stackData.height_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for release height"
            />
            <FormField
              label="Vertical Dimension"
              name="vertical_dimension"
              type="number"
              value={stackData.vertical_dimension}
              onChange={handleChange}
              required
              tooltip="Enter the initial initial vertical dimension of the plume"
            />
            <FormField
              label="Width Unit"
              name="width_unit"
              type="select"
              value={stackData.width_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for initial vertical dimension"
            />
            <FormField
              label="Radius"
              name="radius"
              type="number"
              value={stackData.radius}
              onChange={handleChange}
              required
              tooltip="Enter the radius of the circle"
            />
            <FormField
              label="Radius Unit"
              name="radius_unit"
              type="select"
              value={stackData.radius_unit}
              onChange={handleChange}
              options={distanceUnits}
              required
              tooltip="Select the unit for radius"
            />
            <FormField
              label="Number of vertices"
              name="num_vertices"
              type="number"
              value={stackData.num_vertices}
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
