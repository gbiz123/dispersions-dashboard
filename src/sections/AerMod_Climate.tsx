import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useRunContext } from '../context/RunContext';

interface ClimateData {
  seasonal_category: 'ANNUAL' | 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'CUSTOM';
  precipitation_category: 'WET' | 'DRY' | 'AVERAGE' | 'CUSTOM';
  custom_seasons?: {
    spring_start: number;
    summer_start: number;
    autumn_start: number;
    winter_start: number;
  };
  custom_precipitation?: {
    wet_threshold: number;
    dry_threshold: number;
  };
}

const Climate: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();

  // Get current climate data from global state
  const climateData = formData.climate || {
    seasonal_category: 'ANNUAL',
    precipitation_category: 'AVERAGE'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData('climate', {
      ...climateData,
      [name]: value
    });
  };

  const handleCustomChange = (field: string, value: number, category: 'seasons' | 'precipitation') => {
    if (category === 'seasons') {
      updateFormData('climate', {
        ...climateData,
        custom_seasons: {
          ...climateData.custom_seasons,
          [field]: value
        } as ClimateData['custom_seasons']
      });
    } else {
      updateFormData('climate', {
        ...climateData,
        custom_precipitation: {
          ...climateData.custom_precipitation,
          [field]: value
        } as ClimateData['custom_precipitation']
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for custom seasons
    if (climateData.seasonal_category === 'CUSTOM') {
      if (!climateData.custom_seasons || 
          !climateData.custom_seasons.spring_start ||
          !climateData.custom_seasons.summer_start ||
          !climateData.custom_seasons.autumn_start ||
          !climateData.custom_seasons.winter_start) {
        alert('Please define all custom season start dates.');
        return;
      }
    }

    // Validation for custom precipitation
    if (climateData.precipitation_category === 'CUSTOM') {
      if (!climateData.custom_precipitation ||
          climateData.custom_precipitation.wet_threshold === undefined ||
          climateData.custom_precipitation.dry_threshold === undefined) {
        alert('Please define custom precipitation thresholds.');
        return;
      }
    }

    // Data is already saved to global context through handleChange and handleCustomChange
    navigate('/aermod/meteorology');
  };

  const seasonalOptions = [
    { value: 'ANNUAL', label: 'Annual Average' },
    { value: 'SPRING', label: 'Spring (Mar-May)' },
    { value: 'SUMMER', label: 'Summer (Jun-Aug)' },
    { value: 'AUTUMN', label: 'Autumn (Sep-Nov)' },
    { value: 'WINTER', label: 'Winter (Dec-Feb)' },
    { value: 'CUSTOM', label: 'Custom Seasons' }
  ];

  const precipitationOptions = [
    { value: 'AVERAGE', label: 'Average Conditions' },
    { value: 'WET', label: 'Wet Conditions' },
    { value: 'DRY', label: 'Dry Conditions' },
    { value: 'CUSTOM', label: 'Custom Thresholds' }
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString('en', { month: 'long' })
  }));

  return (
    <SectionContainer
      title="🌤️ AERMOD Climate"
      onSubmit={handleSubmit}
      nextSection="/aermod/meteorology"
      nextSectionLabel="Meteorology"
    >
      <InfoSection content="Configure climate parameters for your AERMOD analysis. These settings affect how meteorological data is processed and applied to your model." />
      
      <div className="space-y-6">
        {/* Seasonal Category */}
        <div className="space-y-4">
          <FormField
            label="Seasonal Category"
            name="seasonal_category"
            type="select"
            value={climateData.seasonal_category}
            onChange={handleChange}
            options={seasonalOptions}
            required
            tooltip="Defines how meteorological data is categorized by season"
          />

          {/* Custom Seasons Configuration */}
          {climateData.seasonal_category === 'CUSTOM' && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Custom Season Definition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Spring Starts</label>
                  <select
                    value={climateData.custom_seasons?.spring_start || 3}
                    onChange={(e) => handleCustomChange('spring_start', parseInt(e.target.value), 'seasons')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Summer Starts</label>
                  <select
                    value={climateData.custom_seasons?.summer_start || 6}
                    onChange={(e) => handleCustomChange('summer_start', parseInt(e.target.value), 'seasons')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Autumn Starts</label>
                  <select
                    value={climateData.custom_seasons?.autumn_start || 9}
                    onChange={(e) => handleCustomChange('autumn_start', parseInt(e.target.value), 'seasons')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Winter Starts</label>
                  <select
                    value={climateData.custom_seasons?.winter_start || 12}
                    onChange={(e) => handleCustomChange('winter_start', parseInt(e.target.value), 'seasons')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Climate Precipitation Category */}
        <div className="space-y-4">
          <FormField
            label="Climate Precipitation Category"
            name="precipitation_category"
            type="select"
            value={climateData.precipitation_category}
            onChange={handleChange}
            options={precipitationOptions}
            required
            tooltip="Categorizes precipitation levels for meteorological processing"
          />

          {/* Custom Precipitation Configuration */}
          {climateData.precipitation_category === 'CUSTOM' && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Custom Precipitation Thresholds</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Wet Threshold (mm/month)</label>
                  <input
                    type="number"
                    value={climateData.custom_precipitation?.wet_threshold || ''}
                    onChange={(e) => handleCustomChange('wet_threshold', parseFloat(e.target.value), 'precipitation')}
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Monthly precipitation above this is considered "wet"</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Dry Threshold (mm/month)</label>
                  <input
                    type="number"
                    value={climateData.custom_precipitation?.dry_threshold || ''}
                    onChange={(e) => handleCustomChange('dry_threshold', parseFloat(e.target.value), 'precipitation')}
                    placeholder="e.g., 25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Monthly precipitation below this is considered "dry"</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Climate Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Climate Settings Impact</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Seasonal Category:</strong> Determines how meteorological data is grouped for analysis</p>
            <p>• <strong>Precipitation Category:</strong> Affects surface roughness and atmospheric stability calculations</p>
            <p>• These settings influence dispersion coefficients and plume behavior in your model</p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Climate;