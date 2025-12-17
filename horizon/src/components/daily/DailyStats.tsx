import { clsx } from 'clsx';
import type { TimeBlock, DailyPlan } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { calculateDuration } from '../../lib/parser';
import { formatHoursDisplay } from '../../lib/dateUtils';

interface DailyStatsProps {
  plan: DailyPlan;
}

export function DailyStats({ plan }: DailyStatsProps) {
  const { projects } = useAppStore();

  // Calculate total hours
  const totalMinutes = plan.timeBlocks.reduce((acc, block) => {
    return acc + calculateDuration(block.startTime, block.endTime);
  }, 0);
  const totalHours = totalMinutes / 60;

  // Calculate completed hours
  const completedMinutes = plan.timeBlocks
    .filter((b) => b.status === 'completed')
    .reduce((acc, block) => {
      return acc + (block.actualMinutes || calculateDuration(block.startTime, block.endTime));
    }, 0);
  const completedHours = completedMinutes / 60;

  // Calculate hours by project
  const projectHours = new Map<string, number>();
  for (const block of plan.timeBlocks) {
    const key = block.projectId || 'other';
    const duration = calculateDuration(block.startTime, block.endTime);
    projectHours.set(key, (projectHours.get(key) || 0) + duration);
  }

  // Calculate hours by type
  const typeHours = new Map<string, number>();
  for (const block of plan.timeBlocks) {
    const duration = calculateDuration(block.startTime, block.endTime);
    typeHours.set(block.type, (typeHours.get(block.type) || 0) + duration);
  }

  const capacityPercentage = Math.min((totalHours / plan.targetHours) * 100, 100);
  const completedPercentage = Math.min((completedHours / plan.targetHours) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Capacity bar */}
      <div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-muted">Today's capacity</span>
          <span className="font-medium text-text">
            {formatHoursDisplay(totalHours)} / {plan.targetHours}h
          </span>
        </div>
        <div className="h-3 bg-surface-tertiary rounded-full overflow-hidden">
          <div className="h-full flex">
            <div
              className="bg-green-500 transition-all duration-300"
              style={{ width: `${completedPercentage}%` }}
            />
            <div
              className="bg-accent transition-all duration-300"
              style={{ width: `${capacityPercentage - completedPercentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Planned</span>
          </div>
        </div>
      </div>

      {/* Task stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-surface-secondary rounded-lg border border-border">
          <div className="text-2xl font-bold text-text">
            {plan.timeBlocks.filter((b) => b.status === 'completed').length}
          </div>
          <div className="text-xs text-text-muted">Completed</div>
        </div>
        <div className="text-center p-3 bg-surface-secondary rounded-lg border border-border">
          <div className="text-2xl font-bold text-text">
            {plan.timeBlocks.filter((b) => b.status === 'in-progress').length}
          </div>
          <div className="text-xs text-text-muted">In Progress</div>
        </div>
        <div className="text-center p-3 bg-surface-secondary rounded-lg border border-border">
          <div className="text-2xl font-bold text-text">
            {plan.timeBlocks.filter((b) => b.status === 'planned').length}
          </div>
          <div className="text-xs text-text-muted">Planned</div>
        </div>
      </div>

      {/* Hours by project */}
      {projectHours.size > 0 && (
        <div>
          <h3 className="text-sm font-medium text-text mb-3">By Project</h3>
          <div className="space-y-2">
            {Array.from(projectHours.entries()).map(([projectId, minutes]) => {
              const project = projectId !== 'other' ? projects.get(projectId) : null;
              const hours = minutes / 60;
              const percentage = (hours / totalHours) * 100;

              return (
                <div key={projectId} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: project?.color || '#6b7280',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate text-text-muted">
                        {project?.name || 'Other'}
                      </span>
                      <span className="text-text">{formatHoursDisplay(hours)}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: project?.color || '#6b7280',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inbox summary */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Inbox tasks</span>
          <span className="text-text">
            {plan.inbox.filter((t) => t.completed).length} / {plan.inbox.length}
          </span>
        </div>
      </div>
    </div>
  );
}
