import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RunProvider } from './context/RunContext';
import Layout from './components/Layout';

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

function App() {
  return (
    <RunProvider>
      <BrowserRouter>
        <Layout>
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
            <Route path="*" element={<Navigate to="/stack-data" replace />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </RunProvider>
  );
}

export default App;