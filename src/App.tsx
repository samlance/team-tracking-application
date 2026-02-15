import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Import pages
import Dashboard from './pages/Dashboard';
import DailyStatus from './pages/DailyStatus';
import DeploymentPage from './pages/DeploymentPage';
import SonarPage from './pages/SonarPage';
import UnitTestPage from './pages/UnitTestPage';
import SprintPage from './pages/SprintPage';
import MergeRequestPage from './pages/MergeRequestPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily-status" element={<DailyStatus />} />
          <Route path="/deployments" element={<DeploymentPage />} />
          <Route path="/sonar" element={<SonarPage />} />
          <Route path="/unit-tests" element={<UnitTestPage />} />
          <Route path="/sprints" element={<SprintPage />} />
          <Route path="/merge-requests" element={<MergeRequestPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;