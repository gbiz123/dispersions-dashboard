import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import InfoSection from '../components/InfoSection';
import { useRunContext } from '../context/RunContext';
import { PlayCircleIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface RunConfiguration {
  run_title: string;
  run_description: string;
  output_options: {
    include_summary: boolean;
    include_detailed: boolean;
    include_plots: boolean;
    include_statistics: boolean;
  };
  advanced_options: {
    max_hours: number;
    convergence_criteria: number;
    debug_mode: boolean;
  };
}

const AermodRun: React.FC = () => {
  const { formData, updateFormData } = useRunContext();
  const navigate = useNavigate();

  // Get current run_configuration data from global state
  const runConfig = formData.run_configuration || {
    run_title: '',
    run_description: '',
    output_options: {
      include_summary: true,
      include_detailed: false,
      include_plots: true,
      include_statistics: true
    },
    advanced_options: {
      max_hours: 8760,
      convergence_criteria: 0.01,
      debug_mode: false
    }
  };

  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [runProgress, setRunProgress] = useState(0);
  const [runLogs, setRunLogs] = useState<string[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      updateFormData('run_configuration', {
        ...runConfig,
        [section]: {
          ...(runConfig[section as keyof RunConfiguration] as any),
          [field]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
        }
      });
    } else {
      updateFormData('run_configuration', {
        ...runConfig,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
      });
    }
  };

  const validateInputs = (): boolean => {
    // Check if all required sections have data
    const requiredSections = ['run_info', 'sources'];
    const missingSections = requiredSections.filter((section: any) => {
      const sectionData = formData[section as keyof typeof formData];
      return !sectionData;
    });
    
    if (missingSections.length > 0) {
      alert(`Missing required data for: ${missingSections.join(', ')}`);
      return false;
    }

    if (!runConfig.run_title.trim()) {
      alert('Please provide a run title.');
      return false;
    }

    return true;
  };

  const startAermodRun = async () => {
    if (!validateInputs()) return;

    try {
      setRunStatus('running');
      setRunProgress(0);
      setRunLogs(['Starting AERMOD run...']);
      // Remove this line
      // startRun();

      // Configuration is already saved to global context through handleChange

      // Use the wiremock API endpoint
      const response = await fetch('https://l47qj.wiremockapi.cloud/aermod/run/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          run_configuration: runConfig
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentRunId(result.aermod_run_id);
        setRunLogs(prev => [...prev, `Run started successfully. ID: ${result.aermod_run_id}`]);
        setRunLogs(prev => [...prev, `Created on: ${new Date(result.created_on).toLocaleString()}`]);
        
        // Since wiremock returns completed status immediately, simulate progress
        simulateProgress(result);
      } else {
        throw new Error('Failed to start AERMOD run');
      }
    } catch (error) {
      console.error('Error starting run:', error);
      setRunStatus('error');
      setRunLogs(prev => [...prev, `Error: ${error}`]);
      // Remove this line
      // stopRun();
    }
  };

  const simulateProgress = (runData: any) => {
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Increment by 5-20%
      setRunProgress(Math.min(progress, 95));
      
      // Add some simulation logs
      if (progress > 25 && progress < 30) {
        setRunLogs(prev => [...prev, 'Processing meteorological data...']);
      } else if (progress > 50 && progress < 55) {
        setRunLogs(prev => [...prev, 'Calculating dispersion coefficients...']);
      } else if (progress > 75 && progress < 80) {
        setRunLogs(prev => [...prev, 'Generating concentration fields...']);
      }

      if (progress >= 95) {
        clearInterval(progressInterval);
        // Complete the run
        setTimeout(() => {
          setRunStatus('completed');
          setRunProgress(100);
          setRunLogs(prev => [...prev, 'AERMOD run completed successfully!']);
          setRunLogs(prev => [...prev, `Finished on: ${new Date(runData.finished_on).toLocaleString()}`]);
          // Remove this line
          // stopRun();
        }, 1000);
      }
    }, 500);
  };

  const stopAermodRun = async () => {
    try {
      // No stop endpoint in wiremock, so just stop locally
      setRunStatus('idle');
      setRunProgress(0);
      setRunLogs(prev => [...prev, 'Run stopped by user.']);
      setCurrentRunId(null);
      // Remove this line
      // stopRun();
    } catch (error) {
      console.error('Error stopping run:', error);
    }
  };

  const viewResults = () => {
    // Store the current run ID for results page
    if (currentRunId) {
      sessionStorage.setItem('currentAermodRunId', currentRunId);
    }
    navigate('/aermod/results');
  };

  return (
    <SectionContainer
      title="🚀 Run AERMOD"
      onSubmit={() => {}} // Empty function since this page doesn't use form submission
      nextSection="" // Empty string since this is the run page
    >
      <InfoSection content="Configure and execute your AERMOD analysis. Monitor progress and review results when complete." />
      
      <div className="space-y-6">
        {/* Run Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Run Configuration</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Run Title *</label>
              <input
                type="text"
                name="run_title"
                value={runConfig.run_title}
                onChange={handleChange}
                placeholder="e.g., Industrial Facility Assessment - 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Run Description</label>
              <textarea
                name="run_description"
                value={runConfig.run_description}
                onChange={handleChange}
                placeholder="Describe the purpose and scope of this AERMOD analysis..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Output Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Output Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(runConfig.output_options).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name={`output_options.${key}`}
                  checked={value as boolean}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Advanced Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Hours</label>
              <input
                type="number"
                name="advanced_options.max_hours"
                value={runConfig.advanced_options.max_hours}
                onChange={handleChange}
                min="1"
                max="8760"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Convergence Criteria</label>
              <input
                type="number"
                name="advanced_options.convergence_criteria"
                value={runConfig.advanced_options.convergence_criteria}
                onChange={handleChange}
                step="0.001"
                min="0.001"
                max="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="advanced_options.debug_mode"
                  checked={runConfig.advanced_options.debug_mode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm">Enable Debug Mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* Run Controls */}
        <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Run Controls</h3>
            <div className="flex items-center space-x-2">
              {runStatus === 'idle' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Ready
                </span>
              )}
              {runStatus === 'running' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Running
                </span>
              )}
              {runStatus === 'completed' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Completed
                </span>
              )}
              {runStatus === 'error' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <XCircleIcon className="h-3 w-3 mr-1" />
                  Error
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {(runStatus === 'running' || runStatus === 'completed') && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(runProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${runProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {runStatus === 'idle' && (
              <button
                onClick={startAermodRun}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <PlayCircleIcon className="h-4 w-4" />
                <span>Start AERMOD Run</span>
              </button>
            )}
            
            {runStatus === 'running' && (
              <button
                onClick={stopAermodRun}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <XCircleIcon className="h-4 w-4" />
                <span>Stop Run</span>
              </button>
            )}
            
            {runStatus === 'completed' && (
              <button
                onClick={viewResults}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>View Results</span>
              </button>
            )}
          </div>
        </div>

        {/* Run Logs */}
        {runLogs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Run Logs</h3>
            <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-y-auto">
              {runLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default AermodRun;