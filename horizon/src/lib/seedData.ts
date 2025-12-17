// Seed data generator for Horizon

import { v4 as uuidv4 } from 'uuid';
import { format, addDays, subDays } from 'date-fns';
import type { Client, Project, DailyPlan, TimeBlock, InboxTask } from '../types';
import { writeMarkdownFile, writeJsonFile, scaffoldDirectory } from './storage';
import { serializeDaily, serializeClient, serializeProject } from './parser';
import type { Manifest } from '../types';

export async function generateSeedData(handle: FileSystemDirectoryHandle): Promise<void> {
  await scaffoldDirectory(handle);

  // Generate clients
  const clients = generateClients();
  for (const client of clients) {
    const { frontmatter, content } = serializeClient(client);
    const fileName = client.name.toLowerCase().replace(/\s+/g, '-');
    await writeMarkdownFile(handle, `clients/${fileName}.md`, frontmatter, content);
  }

  // Generate projects
  const projects = generateProjects(clients);
  for (const project of projects) {
    const { frontmatter, content } = serializeProject(project);
    const fileName = project.name.toLowerCase().replace(/\s+/g, '-');
    await writeMarkdownFile(handle, `projects/${fileName}.md`, frontmatter, content);
  }

  // Generate daily plans for past week and next few days
  const dailyPlans = generateDailyPlans(projects, clients);
  for (const plan of dailyPlans) {
    const { frontmatter, content } = serializeDaily(plan);
    await writeMarkdownFile(handle, `daily/${plan.date}.md`, frontmatter, content);
  }

  // Generate manifest
  const manifest = generateManifest(clients, projects, dailyPlans);
  await writeJsonFile(handle, 'manifest.json', manifest);
}

function generateClients(): Client[] {
  const now = new Date().toISOString();

  return [
    {
      id: `client_${uuidv4().slice(0, 8)}`,
      name: 'Acme Corp',
      color: '#3B82F6',
      hourlyRate: 150,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      notes: 'Key contact: Jane Smith (jane@acme.com)\nPrefers async communication.',
      paymentTerms: 'Net 30, invoices on 1st of month.',
    },
    {
      id: `client_${uuidv4().slice(0, 8)}`,
      name: 'TechStart Inc',
      color: '#10B981',
      hourlyRate: 175,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      notes: 'Fast-moving startup. Weekly sync calls on Mondays.',
      paymentTerms: 'Net 15.',
    },
    {
      id: `client_${uuidv4().slice(0, 8)}`,
      name: 'Creative Studio',
      color: '#F59E0B',
      hourlyRate: 125,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      notes: 'Design agency collaboration. Flexible on timelines.',
      paymentTerms: '50% upfront, 50% on completion.',
    },
  ];
}

function generateProjects(clients: Client[]): Project[] {
  const today = new Date();

  return [
    {
      id: `proj_${uuidv4().slice(0, 8)}`,
      clientId: clients[0].id,
      name: 'Website Redesign',
      color: '#3B82F6',
      startDate: format(subDays(today, 7), 'yyyy-MM-dd'),
      endDate: format(addDays(today, 60), 'yyyy-MM-dd'),
      budget: 15000,
      budgetType: 'fixed',
      estimatedHours: 100,
      status: 'active',
      tags: ['design', 'frontend', 'priority'],
      scope: 'Complete redesign of marketing site with new CMS.',
      milestones: [
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Discovery complete',
          dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
          completed: false,
        },
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Design approval',
          dueDate: format(addDays(today, 21), 'yyyy-MM-dd'),
          completed: false,
        },
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Development complete',
          dueDate: format(addDays(today, 45), 'yyyy-MM-dd'),
          completed: false,
        },
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Launch',
          dueDate: format(addDays(today, 60), 'yyyy-MM-dd'),
          completed: false,
        },
      ],
      decisions: [
        {
          date: format(subDays(today, 5), 'yyyy-MM-dd'),
          description: 'Chose Next.js over Gatsby for SSR capabilities',
          type: 'decision',
        },
        {
          date: format(subDays(today, 3), 'yyyy-MM-dd'),
          description: 'Client approved moodboard v2',
          type: 'milestone',
        },
      ],
    },
    {
      id: `proj_${uuidv4().slice(0, 8)}`,
      clientId: clients[1].id,
      name: 'Mobile App MVP',
      color: '#10B981',
      startDate: format(subDays(today, 14), 'yyyy-MM-dd'),
      endDate: format(addDays(today, 45), 'yyyy-MM-dd'),
      budget: 25000,
      budgetType: 'fixed',
      estimatedHours: 160,
      status: 'active',
      tags: ['mobile', 'react-native', 'priority'],
      scope: 'React Native app for iOS and Android with auth and core features.',
      milestones: [
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Auth flow complete',
          dueDate: format(subDays(today, 3), 'yyyy-MM-dd'),
          completed: true,
        },
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Core features done',
          dueDate: format(addDays(today, 20), 'yyyy-MM-dd'),
          completed: false,
        },
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Beta release',
          dueDate: format(addDays(today, 45), 'yyyy-MM-dd'),
          completed: false,
        },
      ],
      decisions: [
        {
          date: format(subDays(today, 10), 'yyyy-MM-dd'),
          description: 'Using Expo for faster development',
          type: 'decision',
        },
      ],
    },
    {
      id: `proj_${uuidv4().slice(0, 8)}`,
      clientId: clients[2].id,
      name: 'Brand Guidelines',
      color: '#F59E0B',
      startDate: format(subDays(today, 3), 'yyyy-MM-dd'),
      endDate: format(addDays(today, 14), 'yyyy-MM-dd'),
      budget: 5000,
      budgetType: 'fixed',
      estimatedHours: 40,
      status: 'active',
      tags: ['design', 'branding'],
      scope: 'Comprehensive brand guidelines document with logo usage, typography, and color specs.',
      milestones: [
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Draft complete',
          dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
          completed: false,
        },
        {
          id: `milestone_${uuidv4().slice(0, 6)}`,
          title: 'Final delivery',
          dueDate: format(addDays(today, 14), 'yyyy-MM-dd'),
          completed: false,
        },
      ],
      decisions: [],
    },
  ];
}

function generateDailyPlans(projects: Project[], clients: Client[]): DailyPlan[] {
  const plans: DailyPlan[] = [];
  const today = new Date();

  // Yesterday
  plans.push(generateDayPlan(subDays(today, 1), projects, 'past'));

  // Today
  plans.push(generateDayPlan(today, projects, 'today'));

  // Tomorrow
  plans.push(generateDayPlan(addDays(today, 1), projects, 'future'));

  return plans;
}

function generateDayPlan(
  date: Date,
  projects: Project[],
  type: 'past' | 'today' | 'future'
): DailyPlan {
  const dateStr = format(date, 'yyyy-MM-dd');
  const proj1 = projects[0];
  const proj2 = projects[1];

  const timeBlocks: TimeBlock[] = [];
  const inbox: InboxTask[] = [];

  if (type === 'past') {
    // Yesterday - all completed
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      projectId: proj1.id,
      title: 'Wireframe review with client',
      startTime: '09:00',
      endTime: '10:30',
      estimatedMinutes: 90,
      actualMinutes: 85,
      status: 'completed',
      type: 'meeting',
    });
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      projectId: proj2.id,
      title: 'API integration',
      startTime: '11:00',
      endTime: '13:00',
      estimatedMinutes: 120,
      actualMinutes: 130,
      status: 'completed',
      type: 'deep-work',
    });
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      projectId: proj1.id,
      title: 'Homepage design iteration',
      startTime: '14:00',
      endTime: '17:00',
      estimatedMinutes: 180,
      actualMinutes: 175,
      status: 'completed',
      type: 'deep-work',
    });
  } else if (type === 'today') {
    // Today - mixed status
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      projectId: proj1.id,
      title: 'Design system components',
      startTime: '09:00',
      endTime: '11:00',
      estimatedMinutes: 120,
      status: 'completed',
      actualMinutes: 110,
      type: 'deep-work',
    });
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      title: 'Team standup',
      startTime: '11:00',
      endTime: '11:30',
      estimatedMinutes: 30,
      status: 'completed',
      type: 'meeting',
    });
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      projectId: proj2.id,
      title: 'Navigation component',
      startTime: '14:00',
      endTime: '16:00',
      estimatedMinutes: 120,
      status: 'in-progress',
      type: 'deep-work',
    });

    // Inbox items
    inbox.push({
      id: `inbox_${uuidv4().slice(0, 8)}`,
      projectId: proj1.id,
      title: 'Review client feedback',
      estimatedMinutes: 30,
      completed: false,
      tags: ['review'],
    });
    inbox.push({
      id: `inbox_${uuidv4().slice(0, 8)}`,
      title: 'Invoice Acme Corp',
      estimatedMinutes: 15,
      completed: false,
      tags: ['admin'],
    });
    inbox.push({
      id: `inbox_${uuidv4().slice(0, 8)}`,
      projectId: proj2.id,
      title: 'Write unit tests for auth',
      estimatedMinutes: 45,
      completed: false,
      tags: ['testing'],
    });
  } else {
    // Tomorrow - planned
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      projectId: proj1.id,
      title: 'About page design',
      startTime: '09:00',
      endTime: '12:00',
      estimatedMinutes: 180,
      status: 'planned',
      type: 'deep-work',
    });
    timeBlocks.push({
      id: `task_${uuidv4().slice(0, 8)}`,
      projectId: proj2.id,
      title: 'Push notification setup',
      startTime: '13:00',
      endTime: '15:00',
      estimatedMinutes: 120,
      status: 'planned',
      type: 'deep-work',
    });

    inbox.push({
      id: `inbox_${uuidv4().slice(0, 8)}`,
      title: 'Catch up on emails',
      estimatedMinutes: 30,
      completed: false,
      tags: ['admin'],
    });
  }

  return {
    date: dateStr,
    targetHours: 8,
    notes: type === 'today' ? 'Focus day - deep work only' : undefined,
    timeBlocks,
    inbox,
    reflections:
      type === 'past'
        ? 'Good focus session in morning. Afternoon got interrupted by urgent call.'
        : undefined,
  };
}

function generateManifest(
  clients: Client[],
  projects: Project[],
  dailyPlans: DailyPlan[]
): Manifest {
  const manifest: Manifest = {
    version: '1.0.0',
    lastSync: new Date().toISOString(),
    indices: {
      clients: {},
      projects: {},
      tasks: {},
    },
  };

  for (const client of clients) {
    const fileName = client.name.toLowerCase().replace(/\s+/g, '-');
    manifest.indices.clients[client.id] = {
      file: `clients/${fileName}.md`,
      name: client.name,
      status: client.status,
    };
  }

  for (const project of projects) {
    const fileName = project.name.toLowerCase().replace(/\s+/g, '-');
    manifest.indices.projects[project.id] = {
      file: `projects/${fileName}.md`,
      clientId: project.clientId,
      name: project.name,
      status: project.status,
    };
  }

  for (const plan of dailyPlans) {
    for (const block of plan.timeBlocks) {
      manifest.indices.tasks[block.id] = {
        file: `daily/${plan.date}.md`,
        projectId: block.projectId,
        status: block.status,
      };
    }
  }

  return manifest;
}
