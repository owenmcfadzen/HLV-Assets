// Core data types for Horizon

export type TaskStatus = 'planned' | 'in-progress' | 'completed' | 'overdue';
export type TaskType = 'deep-work' | 'meeting' | 'admin' | 'break' | 'personal';
export type ClientStatus = 'active' | 'archived';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type BudgetType = 'fixed' | 'hourly';
export type ViewType = 'daily' | 'week' | 'roadmap' | 'forecast';

export interface Client {
  id: string;
  name: string;
  color: string;
  hourlyRate?: number;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  paymentTerms?: string;
}

export interface Project {
  id: string;
  clientId?: string;
  name: string;
  color: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  budgetType: BudgetType;
  estimatedHours?: number;
  status: ProjectStatus;
  tags: string[];
  scope?: string;
  milestones: Milestone[];
  decisions: Decision[];
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Decision {
  date: string;
  description: string;
  type: 'decision' | 'milestone' | 'discovery' | 'change';
}

export interface TimeBlock {
  id: string;
  projectId?: string;
  title: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  estimatedMinutes?: number;
  actualMinutes?: number;
  status: TaskStatus;
  type: TaskType;
  notes?: string;
}

export interface InboxTask {
  id: string;
  projectId?: string;
  clientId?: string;
  title: string;
  estimatedMinutes?: number;
  completed: boolean;
  tags: string[];
}

export interface DailyPlan {
  date: string;
  targetHours: number;
  notes?: string;
  timeBlocks: TimeBlock[];
  inbox: InboxTask[];
  reflections?: string;
}

export interface Observation {
  date: string;
  type: 'decisions' | 'discoveries' | 'patterns';
  entries: ObservationEntry[];
}

export interface ObservationEntry {
  category: string;
  title: string;
  description: string;
  context?: string;
  alternatives?: string[];
  confidence?: 'low' | 'medium' | 'high';
}

export interface ManifestIndex {
  clients: Record<string, { file: string; name: string; status: ClientStatus }>;
  projects: Record<string, { file: string; clientId?: string; name: string; status: ProjectStatus }>;
  tasks: Record<string, { file: string; projectId?: string; status: TaskStatus }>;
}

export interface Manifest {
  version: string;
  lastSync: string;
  indices: ManifestIndex;
}

// File System types
export interface ParsedMarkdownFile<T> {
  frontmatter: T;
  content: string;
  path: string;
}

// App state types
export interface AppState {
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
}
