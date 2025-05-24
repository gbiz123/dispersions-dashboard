import React, { useState, useEffect } from 'react';
import InfoSection from '../components/InfoSection';
import { useAermod } from '../context/AermodContext';
import { 
  DocumentArrowDownIcon, 
  ChartBarIcon, 
  MapIcon, 
  TableCellsIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface RunResult {
  run_id: string;
  run_title: string;
  status: 'completed' | 'running' | 'error';
  completion_date: string;
  summary: {
    max_concentration: number;
    max_location: { x: number; y: number };
    total_receptors: number;
    modeling_period: string;
  };
  files: {
    summary_report: string;
    detailed_output: string;
    plot_files: string[];
    input_file: string;
  };
}

interface ResultsData {
  current_run?: RunResult;
  recent_runs: RunResult[];
}

const AermodResults: React.FC = () => {
  const { formData } = useAermod();
  const [resultsData, setResultsData] = useState<ResultsData>({
    recent_runs: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'summary' | 'detailed' | 'plots' | 'statistics'>('summary');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      // Fetch recent runs from the demo API
      const response = await fetch('https://l47qj.wiremockapi.cloud/aermod/run/list');
      if (response.ok) {
        const runs = await response.json();
        
        // Generate mock result data based on API response
        const mockResults: ResultsData = {
          current_run: {
            run_id: "4144231437265513500",
            run_title: formData.run_configuration?.run_title || "Industrial Facility Assessment - 2024",
            status: "completed",
            completion_date: "2025-10-09T03:39:12.01Z",
            summary: {
              max_concentration: 24.5,
              max_location: { x: 150, y: 75 },
              total_receptors: 1024,
              modeling_period: "Annual 2024"
            },
            files: {
              summary_report: "aermod_summary_report.pdf",
              detailed_output: "aermod_detailed_output.txt",
              plot_files: ["concentration_contour.png", "source_receptor_map.png", "wind_rose.png"],
              input_file: "aermod_input.inp"
            }
          },
          recent_runs: runs.map((run: any, index: number) => ({
            run_id: run.run_id.toString(),
            run_title: run.title_one,
            status: "completed" as const,
            completion_date: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
            summary: {
              max_concentration: Math.random() * 50 + 10,
              max_location: { x: Math.random() * 200, y: Math.random() * 200 },
              total_receptors: Math.floor(Math.random() * 1000) + 500,
              modeling_period: run.title_two
            },
            files: {
              summary_report: `summary_${run.run_id}.pdf`,
              detailed_output: `detailed_${run.run_id}.txt`,
              plot_files: [`plot_${run.run_id}_1.png`, `plot_${run.run_id}_2.png`],
              input_file: `input_${run.run_id}.inp`
            }
          }))
        };
        
        setResultsData(mockResults);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      // Fallback to default demo data
      setResultsData({
        current_run: {
          run_id: "demo",
          run_title: "Demo AERMOD Analysis",
          status: "completed",
          completion_date: new Date().toISOString(),
          summary: {
            max_concentration: 24.5,
            max_location: { x: 150, y: 75 },
            total_receptors: 1024,
            modeling_period: "Annual Demo"
          },
          files: {
            summary_report: "demo_summary.pdf",
            detailed_output: "demo_detailed.txt",
            plot_files: ["demo_plot1.png", "demo_plot2.png"],
            input_file: "demo_input.inp"
          }
        },
        recent_runs: []
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filename: string, displayName: string) => {
    try {
      // Simulate file download for demo
      alert(`Demo: Would download file "${displayName}"`);
      
      // In a real implementation, you would:
      // const response = await fetch(`https://l47qj.wiremockapi.cloud/aermod/results/download/${filename}`);
      // if (response.ok) {
      //   const blob = await response.blob();
      //   const url = window.URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.style.display = 'none';
      //   a.href = url;
      //   a.download = displayName;
      //   document.body.appendChild(a);
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      //   document.body.removeChild(a);
      // }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. This is a demo.');
    }
  };

  const viewTabOptions = [
    { key: 'summary', label: 'Summary', icon: <ChartBarIcon className="h-4 w-4" /> },
    { key: 'detailed', label: 'Detailed Output', icon: <TableCellsIcon className="h-4 w-4" /> },
    { key: 'plots', label: 'Plots & Maps', icon: <MapIcon className="h-4 w-4" /> },
    { key: 'statistics', label: 'Statistics', icon: <ChartBarIcon className="h-4 w-4" /> }
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">📊 AERMOD Results</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="mt-4 text-gray-600">Loading results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📊 AERMOD Results</h1>
      <InfoSection content="Review and download your AERMOD analysis results. View concentration summaries, detailed outputs, and visualization plots." />
      
      <div className="space-y-6">
        {/* Current Run Results */}
        {resultsData.current_run ? (
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-medium">{resultsData.current_run.run_title}</h3>
                <p className="text-sm text-gray-600">
                  Completed on {new Date(resultsData.current_run.completion_date).toLocaleString()}
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Demo Results from WireMock API
                  </span>
                </div>
              </div>
              <button
                onClick={fetchResults}
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Results Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-600">Max Concentration</div>
                <div className="text-2xl font-bold text-blue-900">
                  {resultsData.current_run.summary.max_concentration.toFixed(2)} μg/m³
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-green-600">Max Location</div>
                <div className="text-lg font-medium text-green-900">
                  ({resultsData.current_run.summary.max_location.x}, {resultsData.current_run.summary.max_location.y})
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm text-purple-600">Total Receptors</div>
                <div className="text-2xl font-bold text-purple-900">
                  {resultsData.current_run.summary.total_receptors.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm text-orange-600">Modeling Period</div>
                <div className="text-lg font-medium text-orange-900">
                  {resultsData.current_run.summary.modeling_period}
                </div>
              </div>
            </div>

            {/* View Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                {viewTabOptions.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedView(tab.key as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedView === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Based on Selected View */}
            <div className="space-y-4">
              {selectedView === 'summary' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Summary Report</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      The summary report provides an overview of your AERMOD analysis results including 
                      maximum concentrations, receptor statistics, and model configuration details.
                    </p>
                    <button
                      onClick={() => downloadFile(resultsData.current_run!.files.summary_report, 'AERMOD_Summary_Report.pdf')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      <span>Download Summary Report (Demo)</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedView === 'detailed' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Detailed Output Files</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <div className="font-medium">Detailed Concentration Output</div>
                        <div className="text-sm text-gray-600">Complete receptor-by-receptor concentration data</div>
                      </div>
                      <button
                        onClick={() => downloadFile(resultsData.current_run!.files.detailed_output, 'AERMOD_Detailed_Output.txt')}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <div className="font-medium">Model Input File</div>
                        <div className="text-sm text-gray-600">Complete AERMOD input file used for this run</div>
                      </div>
                      <button
                        onClick={() => downloadFile(resultsData.current_run!.files.input_file, 'AERMOD_Input.inp')}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedView === 'plots' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Visualization Files</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resultsData.current_run.files.plot_files.map((plotFile, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {plotFile.replace(/\.\w+$/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            <div className="text-sm text-gray-600">Spatial concentration visualization</div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => alert('Demo: Plot preview would open here')}
                              className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => downloadFile(plotFile, plotFile)}
                              className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedView === 'statistics' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Statistical Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="font-medium">Concentration Statistics</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Maximum:</span>
                          <span>{resultsData.current_run.summary.max_concentration.toFixed(2)} μg/m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span>95th Percentile:</span>
                          <span>{(resultsData.current_run.summary.max_concentration * 0.85).toFixed(2)} μg/m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span>50th Percentile:</span>
                          <span>{(resultsData.current_run.summary.max_concentration * 0.45).toFixed(2)} μg/m³</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium">Model Performance</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Receptors:</span>
                          <span>{resultsData.current_run.summary.total_receptors.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Receptors &gt; 1 μg/m³:</span>
                          <span>{Math.floor(resultsData.current_run.summary.total_receptors * 0.15).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Modeling Period:</span>
                          <span>{resultsData.current_run.summary.modeling_period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
            <p className="text-gray-600">
              Run your AERMOD analysis to see results here. Go to the Run section to start your analysis.
            </p>
          </div>
        )}

        {/* Recent Runs */}
        {resultsData.recent_runs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Runs (From Demo API)</h3>
            <div className="space-y-2">
              {resultsData.recent_runs.map((run) => (
                <div key={run.run_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{run.run_title}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(run.completion_date).toLocaleDateString()} • 
                      Max: {run.summary.max_concentration.toFixed(2)} μg/m³
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setResultsData(prev => ({ ...prev, current_run: run }))}
                      className="px-3 py-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => downloadFile(run.files.summary_report, `${run.run_title}_Summary.pdf`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Download (Demo)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AermodResults;