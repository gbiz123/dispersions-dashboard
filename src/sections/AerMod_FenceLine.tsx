import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useAermod } from '../context/AermodContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface FenceLinePoint {
  id: string;
  x_coordinate: number;
  y_coordinate: number;
  elevation: number;
}

interface FenceLineData {
  enabled: boolean;
  points: FenceLinePoint[];
  receptor_height: number;
  spacing: number;
}

const FenceLine: React.FC = () => {
  const { formData, update } = useAermod();
  const navigate = useNavigate();

  const [fenceLineData, setFenceLineData] = useState<FenceLineData>(
    (formData.fence_line as FenceLineData) ?? {
      enabled: false,
      points: [],
      receptor_height: 1.5,
      spacing: 10
    }
  );

  const addPoint = () => {
    const newPoint: FenceLinePoint = {
      id: `point_${Date.now()}`,
      x_coordinate: 0,
      y_coordinate: 0,
      elevation: 0
    };
    setFenceLineData(prev => ({
      ...prev,
      points: [...prev.points, newPoint]
    }));
  };

  const removePoint = (id: string) => {
    setFenceLineData(prev => ({
      ...prev,
      points: prev.points.filter(point => point.id !== id)
    }));
  };

  const updatePoint = (id: string, field: keyof FenceLinePoint, value: any) => {
    setFenceLineData(prev => ({
      ...prev,
      points: prev.points.map(point => 
        point.id === id ? { ...point, [field]: value } : point
      )
    }));
  };

  // Fix: Update handleChange to accept both HTMLInputElement and HTMLSelectElement
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFenceLineData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (fenceLineData.enabled && fenceLineData.points.length < 2) {
      alert('Please add at least 2 points to define a fence line.');
      return;
    }

    update('fence_line', fenceLineData);
    navigate('/aermod/building-file');
  };

  return (
    <SectionContainer
      title="🛡️ AERMOD Fence Line"
      onSubmit={handleSubmit}
      nextSection="/aermod/building-file"
      nextSectionLabel="Building File"
    >
      <InfoSection content="Define fence line receptors to monitor concentrations at property boundaries. Fence line receptors are automatically placed between specified points." />
      
      <div className="space-y-6">
        {/* Enable/Disable Fence Line */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="enabled"
            checked={fenceLineData.enabled}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="text-sm font-medium">Enable Fence Line Receptors</label>
        </div>

        {fenceLineData.enabled && (
          <>
            {/* Fence Line Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Receptor Height (m)"
                name="receptor_height"
                type="number"
                value={fenceLineData.receptor_height}
                onChange={handleChange}
                step={0.1}
                min={0}
                required
                tooltip="Height above ground for fence line receptors"
              />
              
              <FormField
                label="Receptor Spacing (m)"
                name="spacing"
                type="number"
                value={fenceLineData.spacing}
                onChange={handleChange}
                step={1}
                min={1}
                required
                tooltip="Distance between receptors along the fence line"
              />
            </div>

            {/* Fence Line Points */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Fence Line Points</h3>
                <button
                  type="button"
                  onClick={addPoint}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Point</span>
                </button>
              </div>

              {fenceLineData.points.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-md">
                  No fence line points defined. Click "Add Point" to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {fenceLineData.points.map((point, index) => (
                    <div key={point.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Point {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removePoint(point.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <FormField
                          label="X Coordinate (m)"
                          name="x_coordinate"
                          type="number"
                          value={point.x_coordinate}
                          onChange={(e) => updatePoint(point.id, 'x_coordinate', parseFloat(e.target.value))}
                          required
                        />
                        
                        <FormField
                          label="Y Coordinate (m)"
                          name="y_coordinate"
                          type="number"
                          value={point.y_coordinate}
                          onChange={(e) => updatePoint(point.id, 'y_coordinate', parseFloat(e.target.value))}
                          required
                        />
                        
                        <FormField
                          label="Elevation (m)"
                          name="elevation"
                          type="number"
                          value={point.elevation}
                          onChange={(e) => updatePoint(point.id, 'elevation', parseFloat(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {fenceLineData.points.length > 0 && fenceLineData.points.length < 2 && (
                <div className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  ⚠️ At least 2 points are required to define a fence line.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SectionContainer>
  );
};

export default FenceLine;