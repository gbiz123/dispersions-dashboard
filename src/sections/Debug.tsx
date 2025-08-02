import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import Tooltip from '../components/Tooltip';
import { useRunContext } from '../context/RunContext';
import { AerscreenDebug as DebugType } from '../types/api';

const Debug: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();


  // single checkbox toggles save_debug only
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    updateFormData('debug', {
      ...formData.debug,
      debug: checked
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/results');
  };

  return (
    <SectionContainer
      title="Debug Options"
      onSubmit={handleSubmit}
      nextSection="/results"
      nextSectionLabel="Results"
      previousSection={formData.other_inputs?.is_fumigation ? '/fumigation' : '/other-inputs'}
    >
      <InfoSection content="Info section: Enable debug options to save intermediate files for troubleshooting. Debug files can help diagnose issues with model runs." />
      
      <div className="space-y-4">
        <p className="text-gray-600 mb-4">
          Check the box below if you want AERSCREEN to save debug files.
        </p>

        <div className="flex items-start">
          <Tooltip content="Dummy tooltip: Enable to save debug output files">
            <div className="flex items-center h-5">
              <input
                id="save_debug"
                name="save_debug"
                type="checkbox"
                checked={formData.debug?.debug || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </Tooltip>
          <div className="ml-3 text-sm">
            <label htmlFor="save_debug" className="font-medium text-gray-700">
              Save Debug Files
            </label>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Debug;
