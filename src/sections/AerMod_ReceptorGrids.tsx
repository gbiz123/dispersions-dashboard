import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/forms/FormField';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useAermod } from '../context/AermodContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ReceptorGrid {
  id: string;
  name: string;
  enabled: boolean;
  x_start: number;
  x_end: number;
  x_spacing: number;
  y_start: number;
  y_end: number;
  y_spacing: number;
  elevation: number;
  height: number;
}

interface ReceptorGridsData {
  grids: ReceptorGrid[];
}

const ReceptorGrids: React.FC = () => {
  const { formData, update } = useAermod();
  const navigate = useNavigate();

  const [gridsData, setGridsData] = useState<ReceptorGridsData>(
    (formData.receptor_grids as ReceptorGridsData) ?? {
      grids: []
    }
  );

  const addGrid = () => {
    if (gridsData.grids.length >= 3) {
      alert('Maximum of 3 receptor grids allowed.');
      return;
    }

    const newGrid: ReceptorGrid = {
      id: `grid_${Date.now()}`,
      name: `Grid ${gridsData.grids.length + 1}`,
      enabled: true,
      x_start: 0,
      x_end: 1000,
      x_spacing: 100,
      y_start: 0,
      y_end: 1000,
      y_spacing: 100,
      elevation: 0,
      height: 1.5
    };

    setGridsData(prev => ({
      grids: [...prev.grids, newGrid]
    }));
  };

  const removeGrid = (id: string) => {
    setGridsData(prev => ({
      grids: prev.grids.filter(grid => grid.id !== id)
    }));
  };

  const updateGrid = (id: string, field: keyof ReceptorGrid, value: any) => {
    setGridsData(prev => ({
      grids: prev.grids.map(grid => 
        grid.id === id ? { ...grid, [field]: value } : grid
      )
    }));
  };

  const calculateReceptorCount = (grid: ReceptorGrid): number => {
    if (!grid.enabled) return 0;
    
    const xCount = Math.floor((grid.x_end - grid.x_start) / grid.x_spacing) + 1;
    const yCount = Math.floor((grid.y_end - grid.y_start) / grid.y_spacing) + 1;
    return xCount * yCount;
  };

  const getTotalReceptors = (): number => {
    return gridsData.grids.reduce((total, grid) => total + calculateReceptorCount(grid), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const enabledGrids = gridsData.grids.filter(grid => grid.enabled);
    if (enabledGrids.length === 0) {
      alert('Please enable at least one receptor grid.');
      return;
    }

    // Validate grid parameters
    for (const grid of enabledGrids) {
      if (grid.x_end <= grid.x_start || grid.y_end <= grid.y_start) {
        alert(`Grid "${grid.name}": End coordinates must be greater than start coordinates.`);
        return;
      }
      if (grid.x_spacing <= 0 || grid.y_spacing <= 0) {
        alert(`Grid "${grid.name}": Spacing values must be greater than 0.`);
        return;
      }
    }

    update('receptor_grids', gridsData);
    navigate('/aermod/climate');
  };

  return (
    <SectionContainer
      title="📊 AERMOD Receptor Grids"
      onSubmit={handleSubmit}
      nextSection="/aermod/climate"
      nextSectionLabel="Climate"
    >
      <InfoSection content="Define up to 3 rectangular receptor grids for concentration calculations. Grids automatically generate receptors at specified intervals." />
      
      <div className="space-y-6">
        {/* Grid Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Receptor Grid Summary</h3>
              <p className="text-sm text-blue-700">
                {gridsData.grids.length} grid(s) defined • {getTotalReceptors()} total receptors
              </p>
            </div>
            <button
              type="button"
              onClick={addGrid}
              disabled={gridsData.grids.length >= 3}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                gridsData.grids.length >= 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Grid ({gridsData.grids.length}/3)</span>
            </button>
          </div>
        </div>

        {/* Receptor Grids */}
        {gridsData.grids.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-md">
            No receptor grids defined. Click "Add Grid" to create your first grid.
          </div>
        ) : (
          <div className="space-y-4">
            {gridsData.grids.map((grid, index) => (
              <div key={grid.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={grid.enabled}
                      onChange={(e) => updateGrid(grid.id, 'enabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <h3 className="text-lg font-medium">
                      {grid.name} ({calculateReceptorCount(grid)} receptors)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGrid(grid.id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>
                
                {grid.enabled && (
                  <div className="space-y-4">
                    {/* Grid Name */}
                    <FormField
                      label="Grid Name"
                      name="name"
                      type="text"
                      value={grid.name}
                      onChange={(e) => updateGrid(grid.id, 'name', e.target.value)}
                      required
                    />
                    
                    {/* X Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="X Start (m)"
                        name="x_start"
                        type="number"
                        value={grid.x_start}
                        onChange={(e) => updateGrid(grid.id, 'x_start', parseFloat(e.target.value))}
                        required
                      />
                      <FormField
                        label="X End (m)"
                        name="x_end"
                        type="number"
                        value={grid.x_end}
                        onChange={(e) => updateGrid(grid.id, 'x_end', parseFloat(e.target.value))}
                        required
                      />
                      <FormField
                        label="X Spacing (m)"
                        name="x_spacing"
                        type="number"
                        value={grid.x_spacing}
                        onChange={(e) => updateGrid(grid.id, 'x_spacing', parseFloat(e.target.value))}
                        min={1}
                        required
                      />
                    </div>
                    
                    {/* Y Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Y Start (m)"
                        name="y_start"
                        type="number"
                        value={grid.y_start}
                        onChange={(e) => updateGrid(grid.id, 'y_start', parseFloat(e.target.value))}
                        required
                      />
                      <FormField
                        label="Y End (m)"
                        name="y_end"
                        type="number"
                        value={grid.y_end}
                        onChange={(e) => updateGrid(grid.id, 'y_end', parseFloat(e.target.value))}
                        required
                      />
                      <FormField
                        label="Y Spacing (m)"
                        name="y_spacing"
                        type="number"
                        value={grid.y_spacing}
                        onChange={(e) => updateGrid(grid.id, 'y_spacing', parseFloat(e.target.value))}
                        min={1}
                        required
                      />
                    </div>
                    
                    {/* Elevation and Height */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Elevation (m)"
                        name="elevation"
                        type="number"
                        value={grid.elevation}
                        onChange={(e) => updateGrid(grid.id, 'elevation', parseFloat(e.target.value))}
                        required
                        tooltip="Base elevation of the receptor grid"
                      />
                      <FormField
                        label="Receptor Height (m)"
                        name="height"
                        type="number"
                        value={grid.height}
                        onChange={(e) => updateGrid(grid.id, 'height', parseFloat(e.target.value))}
                        min={0}
                        step={0.1}
                        required
                        tooltip="Height above ground for receptors"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default ReceptorGrids;