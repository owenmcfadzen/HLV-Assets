import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DayView } from './components/daily/DayView';
import { SetupView } from './components/SetupView';
import { clsx } from 'clsx';

function App() {
  const { isConnected, isDarkMode, currentView } = useAppStore();

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useAppStore.getState().toggleCommandPalette();
      }

      // Navigation shortcuts
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key) {
          case '1':
            useAppStore.getState().setCurrentView('daily');
            break;
          case '2':
            useAppStore.getState().setCurrentView('week');
            break;
          case '3':
            useAppStore.getState().setCurrentView('roadmap');
            break;
          case '4':
            useAppStore.getState().setCurrentView('forecast');
            break;
          case 't':
            useAppStore.getState().setSelectedDate(new Date());
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show setup view if not connected
  if (!isConnected) {
    return <SetupView />;
  }

  return (
    <div className={clsx('min-h-screen bg-surface')}>
      <Sidebar />

      <div className="ml-16 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          {currentView === 'daily' && <DayView />}
          {currentView === 'week' && (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center text-text-muted">
                <div className="text-4xl mb-4">📅</div>
                <div className="text-lg font-medium text-text">Week View</div>
                <div className="text-sm">Coming in Phase 2</div>
              </div>
            </div>
          )}
          {currentView === 'roadmap' && (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center text-text-muted">
                <div className="text-4xl mb-4">🗺️</div>
                <div className="text-lg font-medium text-text">Roadmap View</div>
                <div className="text-sm">Coming in Phase 2</div>
              </div>
            </div>
          )}
          {currentView === 'forecast' && (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center text-text-muted">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-lg font-medium text-text">Forecast View</div>
                <div className="text-sm">Coming in Phase 2</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
