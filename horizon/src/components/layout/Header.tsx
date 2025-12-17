import { format, addDays, subDays } from 'date-fns';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../shared/Button';

export function Header() {
  const { selectedDate, setSelectedDate, currentView, toggleCommandPalette } = useAppStore();

  const goToToday = () => setSelectedDate(new Date());
  const goToPrevious = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNext = () => setSelectedDate(addDays(selectedDate, 1));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      {/* Left: Date navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevious}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-secondary hover:text-text transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-secondary hover:text-text transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <h1 className="text-xl font-semibold text-text">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h1>

        <Button variant="secondary" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 rounded-md border border-border bg-surface-secondary px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search</span>
          <kbd className="ml-2">⌘K</kbd>
        </button>

        <Button variant="primary" size="sm">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>
    </header>
  );
}
