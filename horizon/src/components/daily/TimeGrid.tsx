import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { clsx } from 'clsx';
import type { TimeBlock as TimeBlockType } from '../../types';
import { TimeBlock } from './TimeBlock';

interface TimeGridProps {
  timeBlocks: TimeBlockType[];
  onBlockEdit?: (block: TimeBlockType) => void;
  onBlockStatusChange?: (blockId: string, status: TimeBlockType['status']) => void;
  startHour?: number;
  endHour?: number;
}

export function TimeGrid({
  timeBlocks,
  onBlockEdit,
  onBlockStatusChange,
  startHour = 6,
  endHour = 22,
}: TimeGridProps) {
  const timeSlots = generateTimeSlots(startHour, endHour, 60);

  // Group blocks by their start time slot
  const blocksByHour = new Map<string, TimeBlockType[]>();
  for (const block of timeBlocks) {
    const hour = block.startTime.split(':')[0] + ':00';
    if (!blocksByHour.has(hour)) {
      blocksByHour.set(hour, []);
    }
    blocksByHour.get(hour)!.push(block);
  }

  return (
    <div className="relative flex-1 overflow-y-auto">
      <SortableContext
        items={timeBlocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-full">
          {timeSlots.map((slot, index) => {
            const blocks = blocksByHour.get(slot) || [];
            const isHour = slot.endsWith(':00');

            return (
              <TimeSlot
                key={slot}
                time={slot}
                blocks={blocks}
                onBlockEdit={onBlockEdit}
                onBlockStatusChange={onBlockStatusChange}
                isHour={isHour}
              />
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
}

interface TimeSlotProps {
  time: string;
  blocks: TimeBlockType[];
  onBlockEdit?: (block: TimeBlockType) => void;
  onBlockStatusChange?: (blockId: string, status: TimeBlockType['status']) => void;
  isHour: boolean;
}

function TimeSlot({
  time,
  blocks,
  onBlockEdit,
  onBlockStatusChange,
  isHour,
}: TimeSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${time}`,
    data: { type: 'time-slot', time },
  });

  const hour = parseInt(time.split(':')[0]);
  const displayTime = hour > 12 ? `${hour - 12}pm` : hour === 12 ? '12pm' : `${hour}am`;

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'flex min-h-[80px] border-b',
        isHour ? 'border-border' : 'border-border-muted',
        isOver && 'bg-accent/5'
      )}
    >
      {/* Time label */}
      <div className="w-16 flex-shrink-0 pr-3 pt-2 text-right">
        {isHour && (
          <span className="text-xs font-medium text-text-muted">{displayTime}</span>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 py-1 pr-4">
        {blocks.length > 0 ? (
          <div className="space-y-2">
            {blocks.map((block) => (
              <TimeBlock
                key={block.id}
                block={block}
                onEdit={onBlockEdit}
                onStatusChange={(status) => onBlockStatusChange?.(block.id, status)}
              />
            ))}
          </div>
        ) : (
          <div
            className={clsx(
              'h-full min-h-[60px] rounded-lg border-2 border-dashed transition-colors',
              isOver ? 'border-accent bg-accent/5' : 'border-transparent'
            )}
          />
        )}
      </div>
    </div>
  );
}

// Utility to calculate minutes from time string
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function generateTimeSlots(startHour: number, endHour: number, interval: number): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}
