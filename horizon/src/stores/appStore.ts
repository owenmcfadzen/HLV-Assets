// Zustand store for Horizon app state

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Client,
  Project,
  DailyPlan,
  Manifest,
  ViewType,
  TimeBlock,
  InboxTask,
} from '../types';
import {
  selectDirectory,
  verifyPermission,
  scaffoldDirectory,
  readJsonFile,
  readMarkdownFile,
  writeMarkdownFile,
  buildManifest,
  listFiles,
} from '../lib/storage';
import { parseDaily, serializeDaily, parseClient, parseProject } from '../lib/parser';
import { formatDate } from '../lib/dateUtils';

interface AppStore {
  // File system
  dataDir: FileSystemDirectoryHandle | null;
  isConnected: boolean;

  // Data
  manifest: Manifest | null;
  clients: Map<string, Client>;
  projects: Map<string, Project>;
  dailyCache: Map<string, DailyPlan>;

  // UI state
  currentView: ViewType;
  selectedDate: Date;
  selectedProject: string | null;
  isDarkMode: boolean;
  isCommandPaletteOpen: boolean;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  connectDirectory: () => Promise<boolean>;
  disconnectDirectory: () => void;
  loadData: () => Promise<void>;

  // Daily operations
  loadDailyPlan: (date: Date) => Promise<DailyPlan | null>;
  saveDailyPlan: (plan: DailyPlan) => Promise<void>;
  addTimeBlock: (date: Date, block: TimeBlock) => Promise<void>;
  updateTimeBlock: (date: Date, blockId: string, updates: Partial<TimeBlock>) => Promise<void>;
  removeTimeBlock: (date: Date, blockId: string) => Promise<void>;
  addInboxTask: (date: Date, task: InboxTask) => Promise<void>;
  updateInboxTask: (date: Date, taskId: string, updates: Partial<InboxTask>) => Promise<void>;
  removeInboxTask: (date: Date, taskId: string) => Promise<void>;
  moveTaskToTimeBlock: (date: Date, taskId: string, startTime: string) => Promise<void>;

  // UI actions
  setCurrentView: (view: ViewType) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedProject: (projectId: string | null) => void;
  toggleDarkMode: () => void;
  toggleCommandPalette: () => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      dataDir: null,
      isConnected: false,
      manifest: null,
      clients: new Map(),
      projects: new Map(),
      dailyCache: new Map(),
      currentView: 'daily',
      selectedDate: new Date(),
      selectedProject: null,
      isDarkMode: true,
      isCommandPaletteOpen: false,
      isLoading: false,
      error: null,

      // Connect to data directory
      connectDirectory: async () => {
        set({ isLoading: true, error: null });

        try {
          const handle = await selectDirectory();
          if (!handle) {
            set({ isLoading: false });
            return false;
          }

          const hasPermission = await verifyPermission(handle);
          if (!hasPermission) {
            set({ error: 'Permission denied to access directory', isLoading: false });
            return false;
          }

          // Scaffold if needed
          await scaffoldDirectory(handle);

          set({ dataDir: handle, isConnected: true });

          // Load initial data
          await get().loadData();

          set({ isLoading: false });
          return true;
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
          return false;
        }
      },

      disconnectDirectory: () => {
        set({
          dataDir: null,
          isConnected: false,
          manifest: null,
          clients: new Map(),
          projects: new Map(),
          dailyCache: new Map(),
        });
      },

      loadData: async () => {
        const { dataDir } = get();
        if (!dataDir) return;

        set({ isLoading: true });

        try {
          // Load or build manifest
          let manifest: Manifest;
          try {
            manifest = await readJsonFile<Manifest>(dataDir, 'manifest.json');
          } catch {
            manifest = await buildManifest(dataDir);
          }

          // Load clients
          const clients = new Map<string, Client>();
          const clientFiles = await listFiles(dataDir, 'clients');
          for (const file of clientFiles) {
            try {
              const { frontmatter, content } = await readMarkdownFile<Record<string, unknown>>(
                dataDir,
                file
              );
              const client = parseClient(frontmatter, content);
              clients.set(client.id, client);
            } catch (err) {
              console.error(`Failed to load ${file}:`, err);
            }
          }

          // Load projects
          const projects = new Map<string, Project>();
          const projectFiles = await listFiles(dataDir, 'projects');
          for (const file of projectFiles) {
            try {
              const { frontmatter, content } = await readMarkdownFile<Record<string, unknown>>(
                dataDir,
                file
              );
              const project = parseProject(frontmatter, content);
              projects.set(project.id, project);
            } catch (err) {
              console.error(`Failed to load ${file}:`, err);
            }
          }

          set({ manifest, clients, projects, isLoading: false });
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
        }
      },

      loadDailyPlan: async (date: Date) => {
        const { dataDir, dailyCache } = get();
        if (!dataDir) return null;

        const dateStr = formatDate(date);

        // Check cache first
        if (dailyCache.has(dateStr)) {
          return dailyCache.get(dateStr)!;
        }

        try {
          const { frontmatter, content } = await readMarkdownFile<Record<string, unknown>>(
            dataDir,
            `daily/${dateStr}.md`
          );
          const plan = parseDaily(frontmatter, content);

          // Update cache
          const newCache = new Map(dailyCache);
          newCache.set(dateStr, plan);
          set({ dailyCache: newCache });

          return plan;
        } catch {
          // Return empty plan for new days
          const emptyPlan: DailyPlan = {
            date: dateStr,
            targetHours: 8,
            timeBlocks: [],
            inbox: [],
          };
          return emptyPlan;
        }
      },

      saveDailyPlan: async (plan: DailyPlan) => {
        const { dataDir, dailyCache } = get();
        if (!dataDir) return;

        try {
          const { frontmatter, content } = serializeDaily(plan);
          await writeMarkdownFile(dataDir, `daily/${plan.date}.md`, frontmatter, content);

          // Update cache
          const newCache = new Map(dailyCache);
          newCache.set(plan.date, plan);
          set({ dailyCache: newCache });
        } catch (err) {
          set({ error: (err as Error).message });
        }
      },

      addTimeBlock: async (date: Date, block: TimeBlock) => {
        const plan = await get().loadDailyPlan(date);
        if (!plan) return;

        plan.timeBlocks.push(block);
        plan.timeBlocks.sort((a, b) => a.startTime.localeCompare(b.startTime));

        await get().saveDailyPlan(plan);
      },

      updateTimeBlock: async (date: Date, blockId: string, updates: Partial<TimeBlock>) => {
        const plan = await get().loadDailyPlan(date);
        if (!plan) return;

        const blockIndex = plan.timeBlocks.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return;

        plan.timeBlocks[blockIndex] = { ...plan.timeBlocks[blockIndex], ...updates };
        plan.timeBlocks.sort((a, b) => a.startTime.localeCompare(b.startTime));

        await get().saveDailyPlan(plan);
      },

      removeTimeBlock: async (date: Date, blockId: string) => {
        const plan = await get().loadDailyPlan(date);
        if (!plan) return;

        plan.timeBlocks = plan.timeBlocks.filter((b) => b.id !== blockId);
        await get().saveDailyPlan(plan);
      },

      addInboxTask: async (date: Date, task: InboxTask) => {
        const plan = await get().loadDailyPlan(date);
        if (!plan) return;

        plan.inbox.push(task);
        await get().saveDailyPlan(plan);
      },

      updateInboxTask: async (date: Date, taskId: string, updates: Partial<InboxTask>) => {
        const plan = await get().loadDailyPlan(date);
        if (!plan) return;

        const taskIndex = plan.inbox.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return;

        plan.inbox[taskIndex] = { ...plan.inbox[taskIndex], ...updates };
        await get().saveDailyPlan(plan);
      },

      removeInboxTask: async (date: Date, taskId: string) => {
        const plan = await get().loadDailyPlan(date);
        if (!plan) return;

        plan.inbox = plan.inbox.filter((t) => t.id !== taskId);
        await get().saveDailyPlan(plan);
      },

      moveTaskToTimeBlock: async (date: Date, taskId: string, startTime: string) => {
        const plan = await get().loadDailyPlan(date);
        if (!plan) return;

        const task = plan.inbox.find((t) => t.id === taskId);
        if (!task) return;

        // Calculate end time based on estimated minutes or default 30 min
        const duration = task.estimatedMinutes || 30;
        const [hours, minutes] = startTime.split(':').map(Number);
        const endMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

        // Create time block from task
        const timeBlock: TimeBlock = {
          id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          projectId: task.projectId,
          title: task.title,
          startTime,
          endTime,
          estimatedMinutes: task.estimatedMinutes,
          status: 'planned',
          type: 'deep-work',
        };

        // Remove from inbox and add to time blocks
        plan.inbox = plan.inbox.filter((t) => t.id !== taskId);
        plan.timeBlocks.push(timeBlock);
        plan.timeBlocks.sort((a, b) => a.startTime.localeCompare(b.startTime));

        await get().saveDailyPlan(plan);
      },

      // UI actions
      setCurrentView: (view: ViewType) => set({ currentView: view }),
      setSelectedDate: (date: Date) => set({ selectedDate: date }),
      setSelectedProject: (projectId: string | null) => set({ selectedProject: projectId }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleCommandPalette: () =>
        set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'horizon-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        currentView: state.currentView,
      }),
    }
  )
);
