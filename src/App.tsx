import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RunProvider } from './context/RunContext';
import { AersurfaceProvider } from './context/AersurfaceContext';
import Layout from './components/Layout';
import AerSurfaceBasicInfo from './sections/AerSurface_BasicInfo';
import AerSurfaceRoughness from './sections/AerSurface_SurfaceRoughness';
import AerSurfaceMeteorology from 'sections/AerSurface_Meteorology';
import AerSurfaceLandCover from './sections/AerSurface_LandCover';
import AerSurfaceTemporalFrequency from './sections/AerSurface_TemporalFrequency';
import AerSurfaceSectors from './sections/AerSurface_Sector';
import AerSurfaceRun from './sections/AerSurface_Run';
import { ModuleProvider, useModule } from './context/ModuleContext';

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

const AerscreenRoutes = () => (
  <>
    <Route path="/stack-data" element={<StackData />} />
    <Route path="/building-data" element={<BuildingData />} />
    <Route path="/makemet-data" element={<MakemetData />} />
    <Route path="/terrain-data" element={<TerrainData />} />
    <Route path="/discrete-receptors" element={<DiscreteReceptors />} />
    <Route path="/other-inputs" element={<OtherInputs />} />
    <Route path="/fumigation" element={<Fumigation />} />
    <Route path="/debug" element={<Debug />} />
    <Route path="/results" element={<Results />} />
    <Route path="*" element={<Navigate to="/stack-data" replace />} />
    <Route path="/test" element={<TestPage />} />
  </>
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

const RoutedApp = () => {
  const { module } = useModule();
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* choose the fragment that contains the real <Route> elements */}
          {module === 'AERSCREEN' ? AerscreenRoutes() : AersurfaceRoutes()}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

function App() {
  return (
    <RunProvider>
      <ModuleProvider>
        <RoutedApp />
      </ModuleProvider>
    </RunProvider>
  );
}

export default App;