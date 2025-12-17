import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { Button } from './shared/Button';
import { generateSeedData } from '../lib/seedData';

export function SetupView() {
  const { connectDirectory, dataDir, error, isLoading } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleConnect = async () => {
    await connectDirectory();
  };

  const handleGenerateSeed = async () => {
    if (!dataDir) return;

    setIsGenerating(true);
    try {
      await generateSeedData(dataDir);
      // Reload data
      await useAppStore.getState().loadData();
    } catch (err) {
      console.error('Failed to generate seed data:', err);
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white text-2xl font-bold">
          H
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-text">Welcome to Horizon</h1>
          <p className="mt-2 text-text-muted">
            Your offline-first visual planning tool
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-surface-secondary rounded-lg border border-border">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm text-text-muted">Daily Planning</div>
          </div>
          <div className="p-4 bg-surface-secondary rounded-lg border border-border">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm text-text-muted">Project Roadmaps</div>
          </div>
          <div className="p-4 bg-surface-secondary rounded-lg border border-border">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm text-text-muted">Capacity Forecast</div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-surface-secondary border border-border rounded-lg p-6 text-left">
          <h2 className="font-semibold text-text mb-3">How it works</h2>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="text-accent">1.</span>
              <span>Select a folder on your computer to store your planning data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">2.</span>
              <span>All data is saved as readable Markdown files with YAML frontmatter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">3.</span>
              <span>Works completely offline - your data stays on your machine</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">4.</span>
              <span>Edit files in VS Code, Obsidian, or any text editor</span>
            </li>
          </ul>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                Select Data Folder
              </span>
            )}
          </Button>

          {dataDir && (
            <Button
              variant="secondary"
              onClick={handleGenerateSeed}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Sample Data'}
            </Button>
          )}
        </div>

        {/* Browser support note */}
        <p className="text-xs text-text-subtle">
          Requires Chrome, Edge, or another browser with File System Access API support.
          Your data never leaves your computer.
        </p>
      </div>
    </div>
  );
}
