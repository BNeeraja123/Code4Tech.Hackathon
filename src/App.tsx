import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import DashboardView from './components/Dashboard/DashboardView';
import JobsView from './components/Jobs/JobsView';
import ResumesView from './components/Resumes/ResumesView';
import ResultsView from './components/Results/ResultsView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'jobs':
        return <JobsView />;
      case 'resumes':
        return <ResumesView />;
      case 'results':
        return <ResultsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentView={currentView} onViewChange={setCurrentView} />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderCurrentView()}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;