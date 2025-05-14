import React, { useState, useEffect } from 'react';
import { useRunContext } from '../context/RunContext';
import { resultService } from '../services/resultService';
import { runService } from '../services/runService';
import { FlowSectorConcentration, DistanceMaxConcentration, RunInfo } from '../types/api';
import FlowSectorChart from '../components/charts/FlowSectorChart';
import DistanceConcentrationChart from '../components/charts/DistanceConcentrationChart';
import FlowSectorPolarChart from '../components/charts/FlowSectorPolarChart';
import axios, { CancelTokenSource } from 'axios';
import { createCancelToken } from '../services/api';
import {
  NormalisedFlowSector,
  NormalisedDistanceConc,
} from '../services/resultService';

// Map numeric status codes to their meaning
const STATUS_MAPPING: {[key: string]: string} = {
  '1': 'pending',
  '2': 'running',
  '3': 'completed',
  '4': 'failed'
};

const Results: React.FC = () => {
  const {
    runId,
    setRunId,
    formData,
    isRunning,
    setIsRunning,
  } = useRunContext();
  const [runInfo, setRunInfo] = useState<RunInfo | null>(null);
  const [flowSectorData, setFlowSectorData] = useState<NormalisedFlowSector[]>([]);
  const [distanceData, setDistanceData] = useState<NormalisedDistanceConc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [localIsRunning, setLocalIsRunning] = useState(false);
  const [runList, setRunList] = useState<string[]>([]);
  const [selectedRun, setSelectedRun] = useState<string>('');

  // helper ─ detect "completed" even when /info throws 422
  const loadResults = async (id: string) => {
    try {
      const info = await runService.getRunInfo(id);
      setRunInfo(info as any);
      const flow = await resultService.getFlowSectorConcentrations(id);
      const dist = await resultService.getDistanceMaxConcentrations(id);
      setFlowSectorData(flow || []);
      setDistanceData(dist || []);
    } finally {
      setIsRunning(false);
      setLocalIsRunning(false);
    }
  };

  useEffect(() => {
    // start polling only while the run is actually in progress
    if (!runId || !isRunning) return;

    const cancelSource = createCancelToken();

    const checkRunStatus = async () => {
      try {
        const info = await runService.getRunInfo(runId, cancelSource.token);

        /* ---------- normal happy-path ---------- */
        const statusRaw    = info.status;
        const statusString = String(statusRaw).trim();
        const statusText   = STATUS_MAPPING[statusString] || statusString;

        /* ✱ new helper ─ only 1 & 2 really mean "still running" */
        const stillRunning =
          statusText === 'pending'  || statusString === '1' ||
          statusText === 'running'  || statusString === '2';

        /* ---------- finished? then fetch results & stop ---------- */
        if (!stillRunning) {
          setRunInfo(info as any);
          await loadResults(runId);
          return;
        }

      } catch (err: any) {
        /* ---------- mock API returns 422 ---------- */
        if (axios.isAxiosError(err) && err.response?.status === 422) {
          console.warn('Mock API sent 422 – assume run is finished.');
          await loadResults(runId);
          return;
        }

        if (axios.isCancel(err)) {
          // harmless – the effect is being cleaned up
          return;
        }

        /* real error */
        console.error('Error checking run status:', err);
        setError(
          'Error fetching run status: ' +
            (err instanceof Error ? err.message : String(err))
        );
        setIsRunning(false);
        setLocalIsRunning(false);
      }
    };

    const intId = setInterval(checkRunStatus, 2000);
    return () => {
      clearInterval(intId);
      cancelSource.cancel('component unmounted');
    };
  }, [runId, isRunning]);

  useEffect(() => {
    // console.log("isRunning state changed to:", isRunning);
  }, [isRunning]);

  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (localIsRunning) {
      // Safety timeout - force stop loading after 60 seconds
      timeoutId = window.setTimeout(() => {
        console.log("Safety timeout triggered - forcing loading to stop");
        setLocalIsRunning(false);
        setIsRunning(false);
      }, 60000); // 60 seconds
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [localIsRunning]);

  useEffect(() => {
    const src = createCancelToken();
    runService
      .listRuns(src.token)
      .then(ids => setRunList(ids.map(String)))
      .catch(err => console.error('run list error', err));
    return () => src.cancel('unmount');
  }, []);

  const handleSelectRun = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedRun(id);
    if (!id) return;
    setLoading(true);
    setError(null);
    await loadResults(id);
    setRunId(id);        // show in header
    setLoading(false);
  };

  // Start a new run
  const handleStartRun = async () => {
    if (!Object.keys(formData).length) {
      setError('Please complete the form sections before starting a run');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Starting new run...');
      // Clear previous results
      setFlowSectorData([]);
      setDistanceData([]);
      
      // Start the run
      const response = await runService.startRun(formData as any);
      // console.log("Run started response:", response);
      setDebugInfo(prev => prev + "\n" + JSON.stringify(response, null, 2));
      
      // Store the run ID so the poller starts
      setRunId(String(response.run_id));

      // Mark running flags
      setIsRunning(true);
      setLocalIsRunning(true);
    } catch (err) {
      console.error('Error starting run:', err);
      setError('Failed to start run: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color based on run status
  const getStatusColor = (status: string): string => {
    const statusValue = STATUS_MAPPING[status] || status;
    switch (statusValue) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Results Dashboard
          </span>
        </h2>
        
        <div className="flex items-center gap-3">
          {runId && (
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-500 border border-gray-200">
              Run ID: {runId}
            </div>
          )}
          
          {runList.length > 0 && (
            <select
              value={selectedRun}
              onChange={handleSelectRun}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
            >
              <option value="">Previous runs…</option>
              {runList.map(id => (
                <option key={id} value={id}>
                  Run #{id}
                </option>
              ))}
            </select>
          )}
          
          <button
            onClick={handleStartRun}
            disabled={loading || isRunning}
            className={`px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 flex items-center gap-2 ${
              loading || isRunning
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-md'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting Analysis
              </>
            ) : isRunning ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Run
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start Analysis
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Small debug text - only visible during development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 py-1 px-2 rounded-md bg-gray-50 border border-gray-100 font-mono">
          Debug: isRunning={isRunning ? "true" : "false"}, 
          localIsRunning={localIsRunning ? "true" : "false"}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-medium text-red-800">Analysis Error</h3>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {localIsRunning && (
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 animate-pulse"></div>
          <div className="relative flex flex-col items-center justify-center py-10">
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Analysis</h3>
            <p className="text-gray-500 max-w-md text-center">
              AERSCREEN is currently analyzing your input data. Results will appear automatically when processing is complete.
            </p>
          </div>
        </div>
      )}
      
      {/* Results Panel */}
      {!localIsRunning && (runInfo || flowSectorData.length > 0 || distanceData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Run Info */}
          <div className="lg:col-span-1">
            {runInfo && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Run Information
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(String(runInfo.status))}`}>
                      {STATUS_MAPPING[String(runInfo.status)] || runInfo.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-800 font-medium">
                      {runInfo.created_at ? new Date(runInfo.created_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Updated</span>
                    <span className="text-gray-800 font-medium">
                      {runInfo.updated_at ? new Date(runInfo.updated_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  
                  {runInfo.message && (
                    <div className="pt-2">
                      <span className="text-gray-600 block mb-1">Message</span>
                      <p className="text-gray-800 bg-gray-50 p-2 rounded border border-gray-100 text-sm">
                        {runInfo.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Right panel - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flow Sector Chart */}
            {flowSectorData && flowSectorData.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    Flow Sector Concentrations
                  </h3>
                </div>
                <div className="px-4 py-4">
                  <FlowSectorChart data={flowSectorData} />
                </div>
              </div>
            )}
            
            {/* Flow Sector Polar Chart - make more visible */}
            {flowSectorData.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    Flow Sector Concentrations (Polar)
                  </h3>
                </div>
                <div className="px-4 py-4 h-[300px]">
                  {/* {(()=>{console.log("Rendering polar chart with data:", flowSectorData); return null})()} */}
                  <FlowSectorPolarChart key={`polar-${runId}`} data={flowSectorData} />
                </div>
              </div>
            )}
            
            {/* Distance Max Chart */}
            {distanceData && distanceData.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
                    </svg>
                    Distance Max Concentrations
                  </h3>
                </div>
                <div className="px-4 py-4">
                  <DistanceConcentrationChart 
                    data={distanceData.map(item => ({
                      distance: item.dist,
                      concentration: item.conc,
                      date: new Date().toISOString()
                    }))} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!localIsRunning && !runInfo && !flowSectorData.length && !distanceData.length && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Yet</h3>
          <p className="text-gray-500 max-w-md">
            Complete all required form sections and start your analysis to view results here.
          </p>
        </div>
      )}
      
      {/* Debug info - collapsed by default */}
      {debugInfo && process.env.NODE_ENV === 'development' && (
        <details className="mt-8 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <summary className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 cursor-pointer font-medium text-gray-700 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            Debug API Response (Development Only)
          </summary>
          <div className="p-4">
            <pre className="text-xs overflow-auto whitespace-pre-wrap bg-gray-800 text-gray-100 p-4 rounded font-mono">{debugInfo}</pre>
          </div>
        </details>
      )}
    </div>
  );
};

export default Results;