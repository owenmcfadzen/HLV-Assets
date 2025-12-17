import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import type { TimeBlock as TimeBlockType } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { calculateDuration } from '../../lib/parser';

interface TimeBlockProps {
  block: TimeBlockType;
  onEdit?: (block: TimeBlockType) => void;
  onStatusChange?: (status: TimeBlockType['status']) => void;
}

const statusColors = {
  planned: 'border-l-blue-500',
  'in-progress': 'border-l-amber-500',
  completed: 'border-l-green-500',
  overdue: 'border-l-red-500',
};

const typeIcons = {
  'deep-work': '🎯',
  meeting: '👥',
  admin: '📋',
  break: '☕',
  personal: '🏠',
};

export function TimeBlock({ block, onEdit, onStatusChange }: TimeBlockProps) {
  const { projects } = useAppStore();
  const project = block.projectId ? projects.get(block.projectId) : null;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const duration = calculateDuration(block.startTime, block.endTime);
  const height = Math.max(duration / 30 * 40, 60); // 40px per 30 min, min 60px

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onStatusChange) return;

    const nextStatus: Record<TimeBlockType['status'], TimeBlockType['status']> = {
      planned: 'in-progress',
      'in-progress': 'completed',
      completed: 'planned',
      overdue: 'in-progress',
    };

    onStatusChange(nextStatus[block.status]);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, height: `${height}px` }}
      className={clsx(
        'group relative rounded-lg border-l-4 bg-surface-secondary',
        'border border-border hover:border-border-muted transition-all',
        'cursor-grab active:cursor-grabbing',
        statusColors[block.status],
        isDragging && 'opacity-50 shadow-lg z-50'
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex h-full flex-col p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">{typeIcons[block.type]}</span>
            <span className="font-medium text-text truncate">{block.title}</span>
          </div>

          <button
            onClick={handleStatusToggle}
            className={clsx(
              'flex-shrink-0 h-5 w-5 rounded-full border-2 transition-colors',
              block.status === 'completed'
                ? 'bg-green-500 border-green-500'
                : 'border-text-muted hover:border-text'
            )}
          >
            {block.status === 'completed' && (
              <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Time & Project */}
        <div className="mt-1 flex items-center gap-2 text-sm text-text-muted">
          <span>
            {block.startTime} - {block.endTime}
          </span>
          {project && (
            <>
              <span>•</span>
              <span
                className="inline-flex items-center gap-1"
                style={{ color: project.color }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            </>
          )}
        </div>

        {/* Duration info */}
        {block.actualMinutes && (
          <div className="mt-auto pt-2 text-xs text-text-subtle">
            {block.actualMinutes}min / {block.estimatedMinutes || duration}min
          </div>
        )}
      </div>

      {/* Edit button on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(block);
        }}
        className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text"
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
    </div>
  );
}
