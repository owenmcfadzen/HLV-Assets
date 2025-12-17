import { useDraggable } from '@dnd-kit/core';
import { clsx } from 'clsx';
import type { InboxTask as InboxTaskType } from '../../types';
import { useAppStore } from '../../stores/appStore';

interface InboxTaskProps {
  task: InboxTaskType;
  onToggle?: (completed: boolean) => void;
  onEdit?: (task: InboxTaskType) => void;
  onDelete?: () => void;
}

export function InboxTask({ task, onToggle, onEdit, onDelete }: InboxTaskProps) {
  const { projects, clients } = useAppStore();
  const project = task.projectId ? projects.get(task.projectId) : null;
  const client = task.clientId ? clients.get(task.clientId) : null;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: 'inbox-task', task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'group flex items-start gap-3 rounded-lg border border-border bg-surface-secondary p-3',
        'hover:border-border-muted transition-all cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg z-50',
        task.completed && 'opacity-60'
      )}
      {...attributes}
      {...listeners}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(!task.completed);
        }}
        className={clsx(
          'flex-shrink-0 mt-0.5 h-5 w-5 rounded border-2 transition-colors',
          task.completed
            ? 'bg-green-500 border-green-500'
            : 'border-text-muted hover:border-text'
        )}
      >
        {task.completed && (
          <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={clsx('text-sm text-text', task.completed && 'line-through')}>
          {task.title}
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
          {task.estimatedMinutes && <span>{task.estimatedMinutes}min</span>}

          {project && (
            <span
              className="inline-flex items-center gap-1"
              style={{ color: project.color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </span>
          )}

          {client && !project && (
            <span
              className="inline-flex items-center gap-1"
              style={{ color: client.color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: client.color }}
              />
              {client.name}
            </span>
          )}

          {task.tags.length > 0 && (
            <span className="text-text-subtle">
              {task.tags.map((t) => `#${t}`).join(' ')}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(task);
          }}
          className="p-1 text-text-muted hover:text-text transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1 text-text-muted hover:text-red-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
