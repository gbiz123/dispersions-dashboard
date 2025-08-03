import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useModule } from '../context/ModuleContext';
import { useTeam } from '../context/TeamContext';
import dashboardService, { RunInfo } from '../services/dashboardService';
import { 
  CloudIcon, 
  MapIcon, 
  BeakerIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  CalendarIcon,
  ServerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { PencilIcon } from '@heroicons/react/24/outline';

interface DashboardStats {
  runs_in_progress: number;
  runs_completed: number;
  runs_failed: number;
  subscription_status: 'active' | 'expired' | 'trial';
  subscription_expires: string;
  total_runs_this_month: number;
  storage_used_gb: number;
  storage_limit_gb: number;
}



const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setModule } = useModule();
  const { currentTeam } = useTeam();
  const [stats, setStats] = useState<DashboardStats>({
    runs_in_progress: 0,
    runs_completed: 0,
    runs_failed: 0,
    subscription_status: 'active',
    subscription_expires: '2024-12-31',
    total_runs_this_month: 0,
    storage_used_gb: 0,
    storage_limit_gb: 100
  });

  const [recentRuns, setRecentRuns] = useState<RunInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats from API
      const dashboardStats = await dashboardService.fetchDashboardStats();
      
      // Calculate runs this month
      const allRuns = await dashboardService.fetchAllRuns();
      const runsThisMonth = dashboardService.getRunsThisMonth(allRuns);
      
      setStats({
        runs_in_progress: dashboardStats.runs_in_progress,
        runs_completed: dashboardStats.runs_completed,
        runs_failed: dashboardStats.runs_failed,
        subscription_status: 'active', // TODO: Get from user API when available
        subscription_expires: '2024-12-31', // TODO: Get from user API when available
        total_runs_this_month: runsThisMonth.length,
        storage_used_gb: 23.5, // TODO: Get from user API when available
        storage_limit_gb: 100 // TODO: Get from user API when available
      });

      // Set recent runs
      setRecentRuns(dashboardStats.recent_runs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Show error message to user if needed
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data when team changes
  useEffect(() => {
    if (currentTeam) {
      fetchDashboardData();
    }
  }, [currentTeam]);

  const handleStartAnalysis = (toolType: 'AERMOD' | 'AERSCREEN' | 'AERSURFACE') => {
    setModule(toolType);
    
    switch (toolType) {
      case 'AERSCREEN':
        navigate('/stack-data');
        break;
      case 'AERSURFACE':
        navigate('/aersurface/basic-info');
        break;
      case 'AERMOD':
        navigate('/aermod/run-info');
        break;
    }
  };

  const handleEditRun = (run: RunInfo) => {
    // Set the module context
    setModule(run.run_type as 'AERSCREEN' | 'AERSURFACE' | 'AERMOD');
    
    // Navigate to the appropriate starting page with the run ID
    const startingPaths = {
      'AERSCREEN': '/stack-data',
      'AERSURFACE': '/aersurface/basic-info',
      'AERMOD': '/aermod/run-info'
    };
    
    const path = startingPaths[run.run_type as 'AERSCREEN' | 'AERSURFACE' | 'AERMOD'];
    navigate(`${path}?run_id=${run.run_id}`);
  };

  const tools = [
    {
      name: 'AERMOD',
      description: 'Advanced steady-state plume modeling',
      icon: <CloudIcon className="h-6 w-6" />,
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/25',
      available: true,
      stats: { runs: 23, avgTime: '45 min' }
    },
    {
      name: 'AERSCREEN',
      description: 'EPA screening-level air dispersion',
      icon: <BeakerIcon className="h-6 w-6" />,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-orange-500/25',
      available: true,
      stats: { runs: 15, avgTime: '12 min' }
    },
    {
      name: 'AERSURFACE',
      description: 'Surface characteristics processor',
      icon: <MapIcon className="h-6 w-6" />,
      gradient: 'from-emerald-500 to-green-600',
      shadow: 'shadow-green-500/25',
      available: true,
      stats: { runs: 9, avgTime: '8 min' }
    },
    {
      name: 'AERMET',
      description: 'Meteorological data preprocessor',
      icon: <GlobeAltIcon className="h-6 w-6" />,
      gradient: 'from-purple-500 to-purple-600',
      shadow: 'shadow-purple-500/25',
      available: false,
      stats: { runs: 0, avgTime: 'N/A' }
    }
  ];

  const quickStats = [
    {
      label: 'Active Runs',
      value: stats.runs_in_progress,
      change: '+23%',
      trend: 'up',
      icon: <ClockIcon className="h-5 w-5" />,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Completed',
      value: stats.runs_completed,
      change: '+18%',
      trend: 'up',
      icon: <CheckCircleIcon className="h-5 w-5" />,
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      label: 'Failed',
      value: stats.runs_failed,
      change: '-12%',
      trend: 'down',
      icon: <XCircleIcon className="h-5 w-5" />,
      gradient: 'from-red-500 to-rose-600'
    },
    {
      label: 'This Month',
      value: stats.total_runs_this_month,
      change: '+8%',
      trend: 'up',
      icon: <CalendarIcon className="h-5 w-5" />,
      gradient: 'from-violet-500 to-purple-600'
    }
  ];


  // Re-fetch data when team changes
  useEffect(() => {
    fetchDashboardData();
  }, [currentTeam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin mx-auto"></div>
            <CloudIcon className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 text-lg mt-4 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 md:py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Welcome back, User
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  {currentTeam ? `Viewing ${currentTeam.name} analytics` : 'Monitor your air quality modeling projects and analytics'}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Account Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-slate-900">Enterprise Plan</span>
                  </div>
                </div>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  <CogIcon className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-xl text-white`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Modeling Tools - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Modeling Tools</h2>
                    <p className="text-sm text-slate-500 mt-1">Start a new analysis or continue existing projects</p>
                  </div>
                  <SparklesIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <div
                    key={tool.name}
                    className={`relative group rounded-xl border ${
                      tool.available ? 'border-slate-200 hover:border-slate-300' : 'border-slate-100'
                    } p-5 transition-all duration-200 ${
                      tool.available ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'
                    }`}
                    onClick={() => tool.available && handleStartAnalysis(tool.name as any)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 bg-gradient-to-br ${tool.gradient} rounded-xl text-white shadow-lg ${tool.shadow}`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg mb-1">{tool.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">{tool.description}</p>
                        
                        {tool.available ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <span>{tool.stats.runs} runs</span>
                              <span>Avg: {tool.stats.avgTime}</span>
                            </div>
                            <ChevronRightIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-500">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Storage Usage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Storage Usage</h3>
                <ServerIcon className="h-5 w-5 text-slate-400" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Used</span>
                    <span className="font-semibold text-slate-900">{stats.storage_used_gb}GB / {stats.storage_limit_gb}GB</span>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 relative"
                        style={{ width: `${(stats.storage_used_gb / stats.storage_limit_gb) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {(stats.storage_limit_gb - stats.storage_used_gb).toFixed(1)}GB remaining
                  </p>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                  Manage Storage
                </button>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Subscription</h3>
                <ShieldCheckIcon className="h-5 w-5 text-white/80" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-blue-100 text-sm">Current Plan</p>
                  <p className="text-xl font-bold">Enterprise</p>
                </div>
                
                <div>
                  <p className="text-blue-100 text-sm">Valid Until</p>
                  <p className="font-semibold">{new Date(stats.subscription_expires).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-lg transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
                <p className="text-sm text-slate-500 mt-1">Your latest modeling runs and analysis</p>
              </div>
              <Link to="/activity" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <span>View All</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {recentRuns.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No recent runs found
              </div>
            ) : (
              recentRuns.map((run) => (
                <div key={run.run_id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2.5 rounded-xl ${
                      run.run_type === 'AERMOD' ? 'bg-blue-100 text-blue-600' :
                      run.run_type === 'AERSCREEN' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {run.run_type === 'AERMOD' && <CloudIcon className="h-5 w-5" />}
                      {run.run_type === 'AERSCREEN' && <BeakerIcon className="h-5 w-5" />}
                      {run.run_type === 'AERSURFACE' && <MapIcon className="h-5 w-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900 truncate">{run.title}</h4>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {run.run_type}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                            run.status === 'FINISHED' ? 'bg-emerald-50 text-emerald-700' :
                            run.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' :
                            run.status === 'FAIL' ? 'bg-red-50 text-red-700' :
                            'bg-yellow-50 text-yellow-700'
                          }`}>
                            {run.status === 'FINISHED' && <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />}
                            {run.status === 'IN_PROGRESS' && <ClockIcon className="h-3.5 w-3.5 mr-1 animate-spin" />}
                            {run.status === 'FAIL' && <XCircleIcon className="h-3.5 w-3.5 mr-1" />}
                            {run.status}
                          </span>
                          <button
                            onClick={() => handleEditRun(run)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit run"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                        <span>{new Date(run.created_on).toLocaleString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Quick Actions Bar */}
        <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Need help getting started?</h3>
              <p className="text-slate-300 text-sm">Access documentation, tutorials, and support resources</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-sm font-medium rounded-lg transition-colors">
                View Documentation
              </button>
              <button className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-sm font-medium rounded-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;