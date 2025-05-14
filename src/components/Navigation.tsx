import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRunContext } from '../context/RunContext';

// Add props interface with onCollapse callback
interface NavigationProps {
  onCollapse?: (collapsed: boolean) => void;
}

// Navigation sections with icons and grouping
const navigationGroups = [
  {
    title: "Input Parameters",
    items: [
      { 
        path: '/stack-data', 
        label: 'Stack Data',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      },
      { 
        path: '/building-data', 
        label: 'Building Data',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      },
      { 
        path: '/makemet-data', 
        label: 'Makemet Data',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )
      },
      { 
        path: '/terrain-data', 
        label: 'Terrain Data',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      }
    ]
  },
  {
    title: "Advanced Settings",
    items: [
      { 
        path: '/discrete-receptors', 
        label: 'Discrete Receptors',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
      { 
        path: '/other-inputs', 
        label: 'Other Inputs',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        )
      },
      { 
        path: '/fumigation', 
        label: 'Fumigation',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      }
    ]
  },
  {
    title: "Results & Diagnostics",
    items: [
      { 
        path: '/debug', 
        label: 'Debug',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )
      },
      { 
        path: '/results', 
        label: 'Results',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      }
    ]
  }
];

const Navigation: React.FC<NavigationProps> = ({ onCollapse }) => {
  const { isRunning } = useRunContext();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Notify parent component when collapse state changes
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    // Call the onCollapse prop if provided
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };
  
  return (
    <nav className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen fixed transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Header with logo and toggle */}
      <div className="border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold tracking-wide text-white">AERSCREEN</h1>}
        </div>
        <button 
          onClick={handleToggleCollapse} // Change this to use the new handler
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
                      // Using a tooltip library would be better, but for now:
                      alert('Please wait for the current run to complete.');
                    }
                  }}
                  className={`group flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} ${
                    isActive 
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