import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RunProvider } from './context/RunContext';
import { AersurfaceProvider } from './context/AersurfaceContext';
import { AermodProvider } from './context/AermodContext';
import { AerscreenProvider } from './context/AerscreenContext';
import Layout from './components/Layout';
import AerSurfaceBasicInfo from './sections/AerSurface_BasicInfo';
import AerSurfaceRoughness from './sections/AerSurface_SurfaceRoughness';
import AerSurfaceMeteorology from 'sections/AerSurface_Meteorology';
import AerSurfaceLandCover from './sections/AerSurface_LandCover';
import AerSurfaceTemporalFrequency from './sections/AerSurface_TemporalFrequency';
import AerSurfaceSectors from './sections/AerSurface_Sector';
import AerSurfaceRun from './sections/AerSurface_Run';

import RunInfo from './sections/AerMod_RunInfo';
import Sources from './sections/AerMod_Sources';
import FenceLine from './sections/AerMod_FenceLine';
import BuildingFile from './sections/AerMod_BuildingFile';
import ReceptorGrids from './sections/AerMod_ReceptorGrids';
import Climate from './sections/AerMod_Climate';
import Meteorology from './sections/AerMod_Meteorology';
import AermodRun from './sections/AerMod_Run';
import AermodResults from './sections/AerMod_Results';

import { ModuleProvider, useModule } from './context/ModuleContext';
import { TeamProvider } from './context/TeamContext';
import TeamManagement from './pages/TeamManagement';

// Import actual section components
import StackData from './sections/StackData';
import BuildingData from './sections/BuildingData';
import MakemetData from './sections/MakemetData';
import TerrainData from './sections/TerrainData';
import DiscreteReceptors from './sections/DiscreteReceptors';
import OtherInputs from './sections/OtherInputs';
import Fumigation from './sections/Fumigation';
import Debug from './sections/Debug';
import Results from './sections/Results';
import TestPage from './pages/TestPage';
import Dashboard from './pages/Dashboard';

const AerscreenRoutes = () => (
  <Routes>
    <Route path="/stack-data" element={<StackData />} />
    <Route path="/building-data" element={<BuildingData />} />
    <Route path="/makemet-data" element={<MakemetData />} />
    <Route path="/terrain-data" element={<TerrainData />} />
    <Route path="/discrete-receptors" element={<DiscreteReceptors />} />
    <Route path="/other-inputs" element={<OtherInputs />} />
    <Route path="/fumigation" element={<Fumigation />} />
    <Route path="/debug" element={<Debug />} />
    <Route path="/results" element={<Results />} />
    <Route path="/test" element={<TestPage />} />
  </Routes>
);

const AersurfaceRoutes = () => (
  <>
    <Route
      path="/aersurface/basic-info"
      element={
        <AersurfaceProvider>
          <AerSurfaceBasicInfo />
        </AersurfaceProvider>
      }
    />  
    <Route
      path="/aersurface/surface-roughness"
      element={
        <AersurfaceProvider>
          <AerSurfaceRoughness />
        </AersurfaceProvider>
      }
    />
    <Route
      path="/aersurface/meteorology"
      element={
        <AersurfaceProvider>
          <AerSurfaceMeteorology />
        </AersurfaceProvider>
      }
    />
    <Route
      path="/aersurface/land-cover"
      element={
        <AersurfaceProvider>
          <AerSurfaceLandCover />
        </AersurfaceProvider>
      }
    />
    <Route
      path="/aersurface/temporal-frequency"
      element={
        <AersurfaceProvider>
          <AerSurfaceTemporalFrequency />
        </AersurfaceProvider>
      }
    />
    <Route
      path="/aersurface/sectors"
      element={
        <AersurfaceProvider>
          <AerSurfaceSectors />
        </AersurfaceProvider>
      }
    />
    <Route
      path="/aersurface/run"
      element={
        <AersurfaceProvider>
          <AerSurfaceRun />
        </AersurfaceProvider>
      }
    />
  </>
);

const AerModRoutes = () => (
  <>
    <Route path="/aermod/run-info" element={<AermodProvider><RunInfo /></AermodProvider>} />
    <Route path="/aermod/sources" element={<AermodProvider><Sources /></AermodProvider>} />
    <Route path="/aermod/fence-line" element={<AermodProvider><FenceLine /></AermodProvider>} />
    <Route path="/aermod/building-file" element={<AermodProvider><BuildingFile /></AermodProvider>} />
    <Route path="/aermod/receptor-grids" element={<AermodProvider><ReceptorGrids /></AermodProvider>} />
    <Route path="/aermod/climate" element={<AermodProvider><Climate /></AermodProvider>} />
    <Route path="/aermod/meteorology" element={<AermodProvider><Meteorology /></AermodProvider>} />
    <Route path="/aermod/run" element={<AermodProvider><AermodRun /></AermodProvider>} />
    <Route path="/aermod/results" element={<AermodProvider><AermodResults /></AermodProvider>} />
    <Route path="*" element={<Navigate to="/aermod/run-info" replace />} />
  </>
);

const RoutedApp = () => {
  const { module } = useModule();
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Global routes - these take precedence */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/team-management" element={<TeamManagement />} />
          
          {/* Module-specific routes wrapped with providers */}
          {module === 'AERSCREEN' && (
            <Route path="/*" element={
              <AerscreenProvider>
                <AerscreenRoutes />
              </AerscreenProvider>
            } />
          )}
          
          {module === 'AERSURFACE' && AersurfaceRoutes()}
          {module === 'AERMOD' && AerModRoutes()}
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch-all redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

function App() {
  return (
    <RunProvider>
      <TeamProvider>
        <ModuleProvider>
          <RoutedApp />
        </ModuleProvider>
      </TeamProvider>
    </RunProvider>
  );
}

export default App;
