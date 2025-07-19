import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config';

interface UseRunDataProps {
  runId?: string;
  module?: 'AERSCREEN' | 'AERSURFACE' | 'AERMOD';
}

// Mock data for testing
const mockRunData = {
  AERSCREEN: {
    source_data: {
      source_type: 'point',
      rate: 10.5,
      height: 50,
      diameter: 2.5,
      velocity: 15.0,
      temperature: 350,
      rate_units: 'G_S',
      height_units: 'METERS',
      diameter_units: 'METERS',
      velocity_units: 'M_S',
      temperature_units: 'KELVIN'
    },
    building_data: {
      has_building: true,
      height: 20,
      width: 30,
      length: 40,
      angle: 45,
      distance: 100,
      height_units: 'METERS',
      width_units: 'METERS',
      length_units: 'METERS',
      distance_units: 'METERS'
    },
    makemet_data: {
      anemometer_height: 10,
      wind_speed: 5,
      ambient_temperature: 293,
      anemometer_height_units: 'METERS'
    },
    terrain_data: {
      terrain_type: 'elevated',
      elevation: 100,
      elevation_units: 'METERS'
    }
  },
  AERSURFACE: {
    basic_info: {
      title1: 'Test AERSURFACE Run',
      title2: 'Previous Run Data',
      location: 'Primary',
      debug: 'EFFRAD'
    },
    surface_roughness: {
      method: 'zorad',
      roughness_length: 0.5
    }
  },
  AERMOD: {
    run_info: {
      title: 'Test AERMOD Run',
      description: 'This is a test run loaded from previous data',
      modeling_type: 'AERMOD',
      regulatory: true,
      urban_rural: 'URBAN',
      elevation_units: 'METERS',
      output_units: 'MICROGRAMS'
    },
    sources: {
      method: 'manual',
      data: [
        {
          id: '1',
          name: 'Stack1',
          x: 100,
          y: 200,
          emission_rate: 5.5
        }
      ]
    },
    receptor_grids: {
      grids: [
        {
          id: '1',
          name: 'Grid1',
          x_init: 0,
          y_init: 0,
          x_count: 10,
          y_count: 10,
          x_delta: 50,
          y_delta: 50,
          height: 1.5
        }
      ]
    }
  }
};

export const useRunData = ({ runId, module }: UseRunDataProps) => {
  const [runData, setRunData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!runId || !module) return;

    const fetchRunData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // For testing, use mock data
        // Comment this out and uncomment the fetch below when backend is ready
        setTimeout(() => {
          setRunData(mockRunData[module]);
          setIsLoading(false);
        }, 1000); // Simulate network delay

        // Uncomment for real API:
        // const response = await fetch(
        //   `${API_CONFIG.BASE_URL}/run/request/fetch?run_id=${runId}&module=${module}`
        // );
        // if (!response.ok) {
        //   throw new Error('Failed to fetch run data');
        // }
        // const data = await response.json();
        // setRunData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchRunData();
  }, [runId, module]);

  return { runData, isLoading, error };
};
