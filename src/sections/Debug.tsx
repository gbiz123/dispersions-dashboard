import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import { useRunContext } from '../context/RunContext';
import { Debug as DebugType } from '../types/api';

const Debug: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();

  // keep the full shape but we will only expose save_debug in the UI
  const defaultDebug: DebugType = {
    save_input:          false,
    save_aermap_input:   false,
    save_debug:          false,
    save_aermap_debug:   false,
  };

  const [debug, setDebug] = useState<DebugType>(
    formData.debug || defaultDebug
  );

  // single checkbox toggles save_debug only
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setDebug(prev => ({ ...prev, save_debug: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData('debug', debug);
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
      <div className="space-y-4">
        <p className="text-gray-600 mb-4">
          Check the box below if you want AERSCREEN to save debug files.
        </p>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="save_debug"
              name="save_debug"
              type="checkbox"
              checked={debug.save_debug}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
          </div>
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