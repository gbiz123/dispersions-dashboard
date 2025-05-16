import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { useRunContext } from '../context/RunContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isRunning } = useRunContext();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // 👉 helper to turn "surface-roughness" → "Surface Roughness"
  const toTitle = (slug: string) =>
    slug
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;

    const titleMap: Record<string, string> = {
      '/': 'Dashboard',
      '/stack-data': 'Stack Parameters',
      '/building-data': 'Building Configuration',
      '/makemet-data': 'Meteorological Data',
      '/terrain-data': 'Terrain Analysis',
      '/discrete-receptors': 'Discrete Receptors',
      '/other-inputs': 'Additional Parameters',
      '/fumigation': 'Fumigation Settings',
      '/results': 'Analysis Results',
      '/debug': 'Debug Information',
      '/aersurface/basic-info': 'Basic Info',
      '/aersurface/surface-roughness': 'Surface Roughness',
      '/aersurface/meteorology': 'Meteorology',
      '/aersurface/land-cover': 'Land Cover',
      '/aersurface/temporal-frequency': 'Temporal Frequency',
      '/aersurface/sectors': 'Sectors',
      '/aersurface/run': 'Run AERSURFACE'
    };

    // If not in map and under /aersurface, derive from last segment
    if (path.startsWith('/aersurface') && !titleMap[path]) {
      const last = path.split('/').filter(Boolean).pop() || '';
      titleMap[path] = toTitle(last);
    }

    setPageTitle(titleMap[path] || 'AERSCREEN');
  }, [location]);

  // 👉 decide which product name to show
  const isAersurface = /^\/aersurface(\/|$)/i.test(location.pathname);
  const appName = isAersurface ? 'AERSURFACE' : 'AERSCREEN';

  // Handle sidebar collapse state from Navigation component
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Pass the collapse handler to Navigation */}
      <Navigation onCollapse={handleSidebarCollapse} />
      
      {/* Main content area - adjust padding based on sidebar state */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        {/* Header bar with breadcrumbs/title */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                <span>{appName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-700 font-medium">{pageTitle}</span>
              </div>
            </div>
            
            {/* Running indicator in header */}
            {isRunning && (
              <div className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm font-medium flex items-center border border-blue-200">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Analysis in Progress
              </div>
            )}
          </div>
        </div>
        
        {/* Page content with responsive padding and background pattern */}
        <div className="p-6 md:p-8 relative min-h-[calc(100vh-4rem)]">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
          
          {/* Content container with shadow and border */}
          {children}
          
          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>AERSCREEN Analysis Tool &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Add this to your global CSS or as a style tag in your HTML
// <style>
//   .bg-grid-pattern {
//     background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
//     background-size: 20px 20px;
//   }
// </style>

export default Layout;