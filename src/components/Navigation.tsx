import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRunContext } from '../context/RunContext';
import { useModule } from '../context/ModuleContext';
import {
  FireIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  Cog6ToothIcon,
  MapPinIcon,
  CloudIcon,
  Squares2X2Icon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  PlayCircleIcon,
  Bars3Icon,
  HomeIcon,
  BeakerIcon,
  MapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Add props interface with onCollapse callback
interface NavigationProps {
  onCollapse?: (collapsed: boolean) => void;
}

const aerscreenGroups = [
  {
    title: 'Input Parameters',
    items: [
      { path: '/stack-data',      label: 'Source',            icon: <FireIcon               className="h-5 w-5" /> },
      { path: '/building-data',   label: 'Building',         icon: <BuildingOffice2Icon    className="h-5 w-5" /> },
      { path: '/makemet-data',    label: 'Meteorology',          icon: <CloudIcon              className="h-5 w-5" /> },
      { path: '/terrain-data',    label: 'Terrain',          icon: <ChartBarIcon           className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Advanced Settings',
    items: [
      { path: '/discrete-receptors', label: 'Discrete Receptors', icon: <MapPinIcon              className="h-5 w-5" /> },
      { path: '/other-inputs',       label: 'Other Inputs',       icon: <Cog6ToothIcon           className="h-5 w-5" /> },
      { path: '/fumigation',         label: 'Fumigation',         icon: <CloudIcon               className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Results & Diagnostics',
    items: [
      { path: '/debug',   label: 'Debug',   icon: <Squares2X2Icon className="h-5 w-5" /> },
      { path: '/results', label: 'Results', icon: <ChartBarIcon   className="h-5 w-5" /> },
    ],
  },
];

const aersurfaceGroups = [
  {
    title: 'Input Parameters',
    items: [
      { path: '/aersurface/basic-info',        label: 'Basic Info',          icon: <Squares2X2Icon            className="h-5 w-5" /> },
      { path: '/aersurface/surface-roughness', label: 'Surface Roughness',   icon: <AdjustmentsHorizontalIcon className="h-5 w-5" /> },
      { path: '/aersurface/meteorology',       label: 'Meteorology',         icon: <CloudIcon                 className="h-5 w-5" /> },
      { path: '/aersurface/land-cover',        label: 'Land Cover',          icon: <ChartBarIcon              className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Advanced Settings',
    items: [
      { path: '/aersurface/temporal-frequency', label: 'Temporal Frequency', icon: <ClockIcon      className="h-5 w-5" /> },
      { path: '/aersurface/sectors',            label: 'Sectors',            icon: <AdjustmentsHorizontalIcon className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Run & Results',
    items: [
      { path: '/aersurface/run', label: 'Run AERSURFACE', icon: <PlayCircleIcon className="h-5 w-5" /> },
    ],
  },
];

const aerModGroups = [
  {
    title: 'Input Parameters',
    items: [
      { path: '/aermod/run-info',        label: 'Run Info',           icon: <Squares2X2Icon            className="h-5 w-5" /> },
      { path: '/aermod/sources',         label: 'Sources',            icon: <FireIcon                  className="h-5 w-5" /> },
      { path: '/aermod/fence-line',      label: 'Fence Line',         icon: <MapPinIcon                className="h-5 w-5" /> },
      { path: '/aermod/building-file',   label: 'Building File',      icon: <BuildingOffice2Icon       className="h-5 w-5" /> },
      { path: '/aermod/receptor-grids',  label: 'Receptor Grids',     icon: <Squares2X2Icon            className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Advanced Settings',
    items: [
      { path: '/aermod/climate',         label: 'Climate',            icon: <CloudIcon                 className="h-5 w-5" /> },
      { path: '/aermod/meteorology',     label: 'Meteorology',        icon: <AdjustmentsHorizontalIcon className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Run & Results',
    items: [
      { path: '/aermod/run',             label: 'Run AERMOD',         icon: <PlayCircleIcon            className="h-5 w-5" /> },
      { path: '/aermod/results',         label: 'Results',            icon: <ChartBarIcon              className="h-5 w-5" /> },
    ],
  },
];

const Navigation: React.FC<NavigationProps> = ({ onCollapse }) => {
  const { isRunning } = useRunContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { module, setModule, toggle } = useModule();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigationGroups =
    module === 'AERSCREEN' ? aerscreenGroups :
    module === 'AERSURFACE' ? aersurfaceGroups :
    aerModGroups

  // Notify parent component when collapse state changes
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  /* close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) =>
      menuRef.current && !menuRef.current.contains(e.target as Node) && setMenuOpen(false);
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [menuOpen]);

  /* choose module */
  const chooseModule = (target: 'AERSCREEN' | 'AERSURFACE' | 'AERMOD') => {
    if (target !== module) {
      setModule(target);
      
      // Navigate to the default route for each module
      switch (target) {
        case 'AERSCREEN':
          navigate('/stack-data');
          break;
        case 'AERSURFACE':
          navigate('/aersurface/basic-info');
          break;
        case 'AERMOD':
          navigate('/aermod/run-info');
          break;
        default:
          navigate('/');
      }
    }
    setMenuOpen(false);
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear any module-specific state if needed
    navigate('/dashboard');
    setMenuOpen(false);
  };

  return (
    <nav className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen fixed transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Header with logo and toggle */}
      <div className="border-b border-gray-700 p-4 flex items-center justify-between relative">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold tracking-wide text-white">{module}</h1>}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleCollapse}
            className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>

          {/* hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            title="Select module"
            className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>

        {/* drop-down */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-4 top-12 w-44 bg-gray-800 border border-gray-700 rounded-md
                       shadow-lg z-50 divide-y divide-gray-700"
          >
            <button
              onClick={handleDashboardClick}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center space-x-2 ${
                location.pathname === '/dashboard' ? 'text-blue-400' : 'text-gray-200'
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => chooseModule('AERSCREEN')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center space-x-2 ${
                module === 'AERSCREEN' ? 'text-blue-400' : 'text-gray-200'
              }`}
            >
              <BeakerIcon className="h-4 w-4" />
              <span>AERSCREEN</span>
            </button>
            <button
              onClick={() => chooseModule('AERSURFACE')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center space-x-2 ${
                module === 'AERSURFACE' ? 'text-blue-400' : 'text-gray-200'
              }`}
            >
              <MapIcon className="h-4 w-4" />
              <span>AERSURFACE</span>
            </button>
            <button
              onClick={() => chooseModule('AERMOD')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center space-x-2 ${
                module === 'AERMOD' ? 'text-blue-400' : 'text-gray-200'
              }`}
            >
              <CloudIcon className="h-4 w-4" />
              <span>AERMOD</span>
            </button>
          </div>
        )}
      </div>

      {/* Dashboard Quick Access - Always visible */}
      <div className="px-3 py-2 border-b border-gray-700">
        <a
          href="/dashboard"
          onClick={handleDashboardClick}
          className={`group flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} ${
            location.pathname === '/dashboard'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-700/60'
          } rounded-md px-3 py-2 transition-all duration-200 relative ${isCollapsed ? 'mx-auto w-12' : 'w-full'} cursor-pointer`}
        >
          <span className={`flex items-center ${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400'}`}>
            <HomeIcon className="h-5 w-5" />
          </span>

          {isCollapsed && (
            <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-800 text-sm font-medium text-white w-auto min-w-max 
                            opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 invisible group-hover:visible z-50 shadow-lg">
              Dashboard
            </div>
          )}

          {!isCollapsed && (
            <span className={`ml-3 ${location.pathname === '/dashboard' ? 'font-medium' : ''}`}>
              Dashboard
            </span>
          )}
        </a>
        
        {/* Add Team Management link here */}
        <Link
          to="/team-management"
          className={`group flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} ${
            location.pathname === '/team-management'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-700/60'
          } rounded-md px-3 py-2 mt-1 transition-all duration-200 relative ${isCollapsed ? 'mx-auto w-12' : 'w-full'}`}
        >
          <span className={`flex items-center ${location.pathname === '/team-management' ? 'text-white' : 'text-gray-400'}`}>
            <UserGroupIcon className="h-5 w-5" />
          </span>

          {isCollapsed && (
            <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-800 text-sm font-medium text-white w-auto min-w-max 
                            opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 invisible group-hover:visible z-50 shadow-lg">
              Team Management
            </div>
          )}

          {!isCollapsed && (
            <span className={`ml-3 ${location.pathname === '/team-management' ? 'font-medium' : ''}`}>
              Team Management
            </span>
          )}
        </Link>
      </div>

      {/* Status indicator for running analysis */}
      {isRunning && (
        <div className={`${isCollapsed ? 'mx-2' : 'mx-4'} my-3 p-2 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center gap-2`}>
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
          {!isCollapsed && <p className="text-xs text-blue-200">Analysis Running</p>}
        </div>
      )}

      {/* Navigation links */}
      <div className="mt-2 flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {navigationGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {!isCollapsed && (
              <h3 className="ml-2 text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                {group.title}
              </h3>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              const isDisabled = isRunning && item.path !== '/results';

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={e => {
                    if (isDisabled) {
                      e.preventDefault();
                      alert('Please wait for the current run to complete.');
                    }
                  }}
                  className={`group flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : isDisabled
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-gray-700/60'
                    } rounded-md px-3 py-2 transition-all duration-200 relative ${isCollapsed ? 'mx-auto w-12' : 'w-full'}`}
                >
                  <span className={`flex items-center ${isActive ? 'text-white' : isDisabled ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>

                  {isCollapsed && !isDisabled && (
                    <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-800 text-sm font-medium text-white w-auto min-w-max 
                                    opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 invisible group-hover:visible z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}

                  {!isCollapsed && (
                    <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && isDisabled && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer area */}
      <div className={`p-4 border-t border-gray-700 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-gray-300 text-sm hover:text-gray-100 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help & Documentation</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
