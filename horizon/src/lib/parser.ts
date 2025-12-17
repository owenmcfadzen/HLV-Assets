// Markdown parsing utilities for Horizon

import type { DailyPlan, TimeBlock, InboxTask, Project, Client, Milestone, Decision } from '../types';

/**
 * Parse a daily markdown file into structured data
 */
export function parseDaily(frontmatter: Record<string, unknown>, content: string): DailyPlan {
  const timeBlocks: TimeBlock[] = [];
  const inbox: InboxTask[] = [];
  let reflections = '';

  // Split content into sections
  const sections = content.split(/^## /m);

  for (const section of sections) {
    if (section.startsWith('Time Blocks')) {
      // Parse time blocks section
      const blockMatches = section.matchAll(
        /### (\d{2}:\d{2}) - (\d{2}:\d{2})\n([\s\S]*?)(?=\n###|\n## |$)/g
      );

      for (const match of blockMatches) {
        const [, startTime, endTime, blockContent] = match;
        const block = parseTimeBlock(startTime, endTime, blockContent);
        if (block) {
          timeBlocks.push(block);
        }
      }
    } else if (section.startsWith('Inbox')) {
      // Parse inbox section
      const taskMatches = section.matchAll(
        /- \[([ x])\] (.+?)(?:\s*\((\d+)min\))?(?:\s*(#\w+))?$/gm
      );

      for (const match of taskMatches) {
        const [, completed, title, minutes, tag] = match;
        inbox.push({
          id: `inbox_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          title: title.trim(),
          estimatedMinutes: minutes ? parseInt(minutes) : undefined,
          completed: completed === 'x',
          tags: tag ? [tag.slice(1)] : [],
          projectId: extractProjectId(tag || ''),
          clientId: extractClientId(tag || ''),
        });
      }
    } else if (section.startsWith('Reflections')) {
      reflections = section.replace('Reflections\n', '').trim();
    }
  }

  return {
    date: frontmatter.date as string,
    targetHours: (frontmatter.targetHours as number) || 8,
    notes: frontmatter.notes as string | undefined,
    timeBlocks,
    inbox,
    reflections: reflections || undefined,
  };
}

function parseTimeBlock(startTime: string, endTime: string, content: string): TimeBlock | null {
  const lines = content.trim().split('\n').filter(Boolean);
  const data: Record<string, string> = {};

  for (const line of lines) {
    const match = line.match(/^- (\w+): (.+)$/);
    if (match) {
      data[match[1]] = match[2];
    }
  }

  if (!data.id || !data.title) {
    return null;
  }

  return {
    id: data.id,
    projectId: data.projectId,
    title: data.title,
    startTime,
    endTime,
    estimatedMinutes: data.estimatedMinutes ? parseInt(data.estimatedMinutes) : undefined,
    actualMinutes: data.actualMinutes ? parseInt(data.actualMinutes) : undefined,
    status: (data.status as TimeBlock['status']) || 'planned',
    type: (data.type as TimeBlock['type']) || 'deep-work',
    notes: data.notes,
  };
}

function extractProjectId(text: string): string | undefined {
  const match = text.match(/#(proj_\w+)/);
  return match?.[1];
}

function extractClientId(text: string): string | undefined {
  const match = text.match(/#(client_\w+)/);
  return match?.[1];
}

/**
 * Serialize a daily plan back to markdown
 */
export function serializeDaily(plan: DailyPlan): { frontmatter: Record<string, unknown>; content: string } {
  const frontmatter: Record<string, unknown> = {
    date: plan.date,
    targetHours: plan.targetHours,
  };

  if (plan.notes) {
    frontmatter.notes = plan.notes;
  }

  const dayName = new Date(plan.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let content = `# ${dayName}\n\n`;

  // Time Blocks section
  content += '## Time Blocks\n\n';

  for (const block of plan.timeBlocks) {
    content += `### ${block.startTime} - ${block.endTime}\n`;
    content += `- id: ${block.id}\n`;
    if (block.projectId) {
      content += `- projectId: ${block.projectId}\n`;
    }
    content += `- title: ${block.title}\n`;
    if (block.estimatedMinutes) {
      content += `- estimatedMinutes: ${block.estimatedMinutes}\n`;
    }
    if (block.actualMinutes) {
      content += `- actualMinutes: ${block.actualMinutes}\n`;
    }
    content += `- status: ${block.status}\n`;
    content += `- type: ${block.type}\n`;
    if (block.notes) {
      content += `- notes: ${block.notes}\n`;
    }
    content += '\n';
  }

  // Inbox section
  content += '## Inbox\n';
  content += '<!-- Unscheduled tasks for this day -->\n';

  for (const task of plan.inbox) {
    const checkbox = task.completed ? '[x]' : '[ ]';
    let line = `- ${checkbox} ${task.title}`;
    if (task.estimatedMinutes) {
      line += ` (${task.estimatedMinutes}min)`;
    }
    if (task.projectId) {
      line += ` #${task.projectId}`;
    } else if (task.clientId) {
      line += ` #${task.clientId}`;
    }
    content += line + '\n';
  }

  content += '\n';

  // Reflections section
  content += '## Reflections\n';
  content += plan.reflections || '';
  content += '\n';

  return { frontmatter, content };
}

/**
 * Parse a project markdown file
 */
export function parseProject(frontmatter: Record<string, unknown>, content: string): Project {
  const milestones: Milestone[] = [];
  const decisions: Decision[] = [];
  let scope = '';

  const sections = content.split(/^## /m);

  for (const section of sections) {
    if (section.startsWith('Scope')) {
      scope = section.replace('Scope\n', '').trim();
    } else if (section.startsWith('Milestones')) {
      const milestoneMatches = section.matchAll(
        /- \[([ x])\] (.+?) \((\d{4}-\d{2}-\d{2})\)/g
      );
      for (const match of milestoneMatches) {
        milestones.push({
          id: `milestone_${Math.random().toString(36).slice(2, 9)}`,
          title: match[2],
          dueDate: match[3],
          completed: match[1] === 'x',
        });
      }
    } else if (section.startsWith('Decisions Log')) {
      const decisionMatches = section.matchAll(
        /- (\d{4}-\d{2}-\d{2}): (.+?) \(type: (\w+)\)/g
      );
      for (const match of decisionMatches) {
        decisions.push({
          date: match[1],
          description: match[2],
          type: match[3] as Decision['type'],
        });
      }
    }
  }

  return {
    id: frontmatter.id as string,
    clientId: frontmatter.clientId as string | undefined,
    name: frontmatter.name as string,
    color: frontmatter.color as string || '#3b82f6',
    startDate: frontmatter.startDate as string | undefined,
    endDate: frontmatter.endDate as string | undefined,
    budget: frontmatter.budget as number | undefined,
    budgetType: (frontmatter.budgetType as 'fixed' | 'hourly') || 'hourly',
    estimatedHours: frontmatter.estimatedHours as number | undefined,
    status: (frontmatter.status as Project['status']) || 'active',
    tags: (frontmatter.tags as string[]) || [],
    scope,
    milestones,
    decisions,
  };
}

/**
 * Parse a client markdown file
 */
export function parseClient(frontmatter: Record<string, unknown>, content: string): Client {
  let notes = '';
  let paymentTerms = '';

  const sections = content.split(/^## /m);

  for (const section of sections) {
    if (section.startsWith('Notes')) {
      notes = section.replace('Notes\n', '').trim();
    } else if (section.startsWith('Payment Terms')) {
      paymentTerms = section.replace('Payment Terms\n', '').trim();
    }
  }

  return {
    id: frontmatter.id as string,
    name: frontmatter.name as string,
    color: frontmatter.color as string || '#3b82f6',
    hourlyRate: frontmatter.hourlyRate as number | undefined,
    status: (frontmatter.status as Client['status']) || 'active',
    createdAt: frontmatter.createdAt as string || new Date().toISOString(),
    updatedAt: frontmatter.updatedAt as string || new Date().toISOString(),
    notes: notes || undefined,
    paymentTerms: paymentTerms || undefined,
  };
}

/**
 * Serialize a client to markdown
 */
export function serializeClient(client: Client): { frontmatter: Record<string, unknown>; content: string } {
  const frontmatter: Record<string, unknown> = {
    id: client.id,
    name: client.name,
    color: client.color,
    status: client.status,
    createdAt: client.createdAt,
    updatedAt: new Date().toISOString(),
  };

  if (client.hourlyRate) {
    frontmatter.hourlyRate = client.hourlyRate;
  }

  let content = `# ${client.name}\n\n`;

  content += '## Notes\n';
  content += client.notes || '';
  content += '\n\n';

  content += '## Payment Terms\n';
  content += client.paymentTerms || '';
  content += '\n';

  return { frontmatter, content };
}

/**
 * Serialize a project to markdown
 */
export function serializeProject(project: Project): { frontmatter: Record<string, unknown>; content: string } {
  const frontmatter: Record<string, unknown> = {
    id: project.id,
    name: project.name,
    color: project.color,
    budgetType: project.budgetType,
    status: project.status,
    tags: project.tags,
  };

  if (project.clientId) frontmatter.clientId = project.clientId;
  if (project.startDate) frontmatter.startDate = project.startDate;
  if (project.endDate) frontmatter.endDate = project.endDate;
  if (project.budget) frontmatter.budget = project.budget;
  if (project.estimatedHours) frontmatter.estimatedHours = project.estimatedHours;

  let content = `# ${project.name}\n\n`;

  content += '## Scope\n';
  content += project.scope || '';
  content += '\n\n';

  content += '## Milestones\n';
  for (const milestone of project.milestones) {
    const checkbox = milestone.completed ? '[x]' : '[ ]';
    content += `- ${checkbox} ${milestone.title} (${milestone.dueDate})\n`;
  }
  content += '\n';

  content += '## Decisions Log\n';
  content += '<!-- Structured observations for future reference -->\n';
  for (const decision of project.decisions) {
    content += `- ${decision.date}: ${decision.description} (type: ${decision.type})\n`;
  }
  content += '\n';

  return { frontmatter, content };
}

/**
 * Generate a date string for daily file names
 */
export function formatDateForFile(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse time string to minutes from midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes from midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Calculate duration in minutes between two time strings
 */
export function calculateDuration(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}
