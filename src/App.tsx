import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FloatingAssistant } from './components/FloatingAssistant';
import { KeralaLocationModal } from './components/KeralaLocationModal';

import { DashboardView } from './components/views/DashboardView';
import { SoilAnalysisView } from './components/views/SoilAnalysisView';
import { WeatherView } from './components/views/WeatherView';
import { CropRecommendationView } from './components/views/CropRecommendationView';
import { CropFeasibilityView } from './components/views/CropFeasibilityView';
import { SmartIrrigationView } from './components/views/SmartIrrigationView';
import { FertilizerView } from './components/views/FertilizerView';
import { DiseaseRiskView } from './components/views/DiseaseRiskView';
import { CropHealthView } from './components/views/CropHealthView';
import { MarketAnalysisView } from './components/views/MarketAnalysisView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useFarm();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'soil':
        return <SoilAnalysisView />;
      case 'weather':
        return <WeatherView />;
      case 'recommendation':
        return <CropRecommendationView />;
      case 'feasibility':
        return <CropFeasibilityView />;
      case 'irrigation':
        return <SmartIrrigationView />;
      case 'fertilizer':
        return <FertilizerView />;
      case 'disease':
        return <DiseaseRiskView />;
      case 'health':
        return <CropHealthView />;
      case 'market':
        return <MarketAnalysisView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/60 text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileMenuOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      <FloatingAssistant />
      <KeralaLocationModal />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainContent />
    </FarmProvider>
  );
}
