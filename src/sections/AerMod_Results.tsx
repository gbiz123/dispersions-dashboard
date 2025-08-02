import React, { useState, useEffect, useRef } from 'react';
import InfoSection from '../components/InfoSection';
import { useAermod  } from '../context/AermodContext';
import { 
  DocumentArrowDownIcon, 
  ChartBarIcon, 
  MapIcon, 
  TableCellsIcon,
  EyeIcon,
  ArrowPathIcon,
  XMarkIcon,
  PhotoIcon,
  ShareIcon,
  ArrowsPointingOutIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';

// Enhanced Google Maps component with error handling
const GoogleMapWithKML: React.FC<{ kmlData: string; onMapReady?: (map: google.maps.Map) => void }> = ({ 
  kmlData, 
  onMapReady 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const kmlLayerRef = useRef<google.maps.KmlLayer | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'satellite' | 'roadmap' | 'hybrid'>('hybrid');

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      try {
        // Initialize the map with error handling
        const map = new google.maps.Map(mapRef.current!, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false,
          gestureHandling: 'cooperative',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = map;
        onMapReady?.(map);

        // Add error event listeners
        map.addListener('idle', () => {
          // Map is ready and idle
        });

        // Create KML layer with better error handling
        try {
          const kmlBlob = new Blob([kmlData], { type: 'application/vnd.google-earth.kml+xml' });
          const kmlUrl = URL.createObjectURL(kmlBlob);
          
          const kmlLayer = new google.maps.KmlLayer({
            url: kmlUrl,
            suppressInfoWindows: false,
            map: map,
            preserveViewport: false
          });

          kmlLayerRef.current = kmlLayer;

          // Handle KML layer events with better error handling
          kmlLayer.addListener('status_changed', () => {
            const status = kmlLayer.getStatus();
            if (status !== google.maps.KmlLayerStatus.OK) {
              console.warn('KML layer status:', status);
              // Don't show error for common status changes
            }
          });

          // Parse KML for center coordinates
          try {
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(kmlData, 'text/xml');
            const coordinates = kmlDoc.querySelector('coordinates');
            
            if (coordinates?.textContent) {
              const coords = coordinates.textContent.trim().split(',');
              if (coords.length >= 2) {
                const lng = parseFloat(coords[0]);
                const lat = parseFloat(coords[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                  map.setCenter({ lat, lng });
                  map.setZoom(12);
                }
              }
            }
          } catch (parseError) {
            console.warn('KML parsing warning:', parseError);
          }

        } catch (kmlError) {
          console.warn('KML layer creation warning:', kmlError);
        }

      } catch (mapError) {
        console.error('Map initialization error:', mapError);
        setMapError('Failed to initialize map');
      }
    };

    // Load Google Maps API if needed
    if (typeof google !== 'undefined' && google.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => setMapError('Failed to load Google Maps API');
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (kmlLayerRef.current) {
        kmlLayerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, [kmlData, onMapReady]);

  const changeMapType = (type: 'satellite' | 'roadmap' | 'hybrid') => {
    if (mapInstanceRef.current) {
      const googleMapType = type === 'satellite' 
        ? google.maps.MapTypeId.SATELLITE
        : type === 'roadmap' 
        ? google.maps.MapTypeId.ROADMAP 
        : google.maps.MapTypeId.HYBRID;
      
      mapInstanceRef.current.setMapTypeId(googleMapType);
      setMapType(type);
    }
  };

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 10;
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 10;
      mapInstanceRef.current.setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  const centerMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 40.7128, lng: -74.0060 });
      mapInstanceRef.current.setZoom(10);
    }
  };

  if (mapError) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-red-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <MapIcon className="h-8 w-8 text-red-500" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">Map Loading Error</h4>
          <p className="text-red-600 mb-4">{mapError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div 
        ref={mapRef} 
        className="h-full w-full rounded-xl"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Type Controls */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          {(['hybrid', 'satellite', 'roadmap'] as const).map((type) => (
            <button
              key={type}
              onClick={() => changeMapType(type)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                mapType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 flex flex-col">
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Zoom In"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Zoom Out"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <button
          onClick={centerMap}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Center Map"
        >
          <ArrowPathRoundedSquareIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

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

interface KMLResponse {
  kml_data?: string;
  metadata?: {
    run_title: string;
    generated_at: string;
    file_size: number;
  };
}

const AermodResults: React.FC = () => {
  const { formData } = useAermod();
  const [resultsData, setResultsData] = useState<ResultsData>({
    recent_runs: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'summary' | 'detailed' | 'plots' | 'statistics'>('summary');
  const [showEarthView, setShowEarthView] = useState(false);
  const [currentKMLData, setCurrentKMLData] = useState<string | null>(null);
  const [earthViewLoading, setEarthViewLoading] = useState(false);
  const [currentViewRunTitle, setCurrentViewRunTitle] = useState<string>('');
  const [currentRunData, setCurrentRunData] = useState<RunResult | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://l47qj.wiremockapi.cloud/aermod/run/list');
      if (response.ok) {
        const runs = await response.json();
        
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

  const fetchKMLData = async (runId: string, runTitle: string, runData: RunResult) => {
    setEarthViewLoading(true);
    setCurrentViewRunTitle(runTitle);
    setCurrentRunData(runData);
    
    try {
      const response = await fetch(`https://l47qj.wiremockapi.cloud/aermod/results/${runId}/kmz`);
      if (response.ok) {
        const kmlResponse: KMLResponse = await response.json();
        
        if (kmlResponse.kml_data) {
          const decodedKML = atob(kmlResponse.kml_data);
          setCurrentKMLData(decodedKML);
          setShowEarthView(true);
        } else {
          alert('KML data not available yet. This is a demo - please set up the base64 KML data in your WireMock stub.');
        }
      } else {
        throw new Error('Failed to fetch KML data');
      }
    } catch (error) {
      console.error('Error fetching KML data:', error);
      alert('Failed to load KML data. Please check the API endpoint.');
    } finally {
      setEarthViewLoading(false);
    }
  };

  const viewRunResults = (run: RunResult) => {
    fetchKMLData(run.run_id, run.run_title, run);
  };

  const downloadFile = async (filename: string, displayName: string) => {
    try {
      alert(`Demo: Would download file "${displayName}"`);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. This is a demo.');
    }
  };

  const exportMapImage = () => {
    alert('Export map image functionality will be implemented here');
  };

  const shareMapLink = () => {
    alert('Share map link functionality will be implemented here');
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
      
      {/* Enhanced Earth View Modal */}
      {showEarthView && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-2xl w-full max-w-[98vw] h-[96vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Streamlined Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <MapIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{currentViewRunTitle}</h3>
                  <p className="text-blue-100 text-sm">Spatial Analysis • Interactive View</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={exportMapImage}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all tooltip"
                  title="Export Image"
                >
                  <PhotoIcon className="h-4 w-4 text-white" />
                </button>
                <button 
                  onClick={shareMapLink}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  title="Share"
                >
                  <ShareIcon className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => setShowEarthView(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all group"
                  title="Close"
                >
                  <XMarkIcon className="h-4 w-4 text-white group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Main Content Area - Optimized Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Map Area */}
              <div className="flex-1 relative bg-gray-50">
                {earthViewLoading ? (
                  <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-lg font-medium text-gray-700">Loading spatial data...</div>
                      <div className="text-sm text-gray-500 mt-1">Preparing interactive visualization</div>
                    </div>
                  </div>
                ) : currentKMLData ? (
                  <GoogleMapWithKML kmlData={currentKMLData} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-gray-200 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                        <MapIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No Spatial Data</h4>
                      <p className="text-gray-500">KML data is not available for this analysis</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Panel */}
              {currentRunData && (
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Analysis Results
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                        <div className="text-sm text-blue-700 font-medium">Max Concentration</div>
                        <div className="text-xl font-bold text-blue-900">
                          {currentRunData.summary.max_concentration.toFixed(2)} μg/m³
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-600">Location</div>
                          <div className="font-semibold text-gray-800 text-sm">
                            ({currentRunData.summary.max_location.x}, {currentRunData.summary.max_location.y})
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-600">Receptors</div>
                          <div className="font-semibold text-gray-800 text-sm">
                            {currentRunData.summary.total_receptors.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600">Modeling Period</div>
                        <div className="font-semibold text-gray-800">
                          {currentRunData.summary.modeling_period}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Concentration Legend */}
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="font-medium text-gray-800 mb-3">Concentration Scale</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-3 bg-green-400 rounded"></div>
                          <span>Low</span>
                        </div>
                        <span className="text-gray-600">0-5 μg/m³</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-3 bg-yellow-400 rounded"></div>
                          <span>Moderate</span>
                        </div>
                        <span className="text-gray-600">5-15 μg/m³</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-3 bg-orange-400 rounded"></div>
                          <span>High</span>
                        </div>
                        <span className="text-gray-600">15-25 μg/m³</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-3 bg-red-500 rounded"></div>
                          <span>Very High</span>
                        </div>
                        <span className="text-gray-600">&gt;25 μg/m³</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 flex-1">
                    <h5 className="font-medium text-gray-800 mb-3">Quick Actions</h5>
                    <div className="space-y-2">
                      <button 
                        onClick={() => downloadFile(currentRunData.files.summary_report, 'Summary Report')}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-2"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                        <span>Download Report</span>
                      </button>
                      <button 
                        onClick={exportMapImage}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center space-x-2"
                      >
                        <PhotoIcon className="h-4 w-4" />
                        <span>Export Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Minimal Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>© 2024 AERMOD Analysis Tool • WGS84</span>
              <span>Map data ©2024 Google</span>
            </div>
          </div>
        </div>
      )}
      
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
                <div className="mt-1 flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Demo Results from WireMock API
                  </span>
                  <button
                    onClick={() => viewRunResults(resultsData.current_run!)}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    <EyeIcon className="h-3 w-3 mr-1" />
                    View in Earth
                  </button>
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
                      onClick={() => viewRunResults(run)}
                      className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-700 transition-colors"
                      disabled={earthViewLoading}
                    >
                      {earthViewLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                      <span>View</span>
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