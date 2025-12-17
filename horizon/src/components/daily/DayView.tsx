import { useEffect, useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useAppStore } from '../../stores/appStore';
import { TimeGrid } from './TimeGrid';
import { Inbox } from './Inbox';
import { DailyStats } from './DailyStats';
import { TimeBlock } from './TimeBlock';
import { InboxTask } from './InboxTask';
import type { DailyPlan, TimeBlock as TimeBlockType, InboxTask as InboxTaskType } from '../../types';
import { formatDate } from '../../lib/dateUtils';
import { v4 as uuidv4 } from 'uuid';

export function DayView() {
  const {
    selectedDate,
    loadDailyPlan,
    saveDailyPlan,
    updateTimeBlock,
    addInboxTask,
    updateInboxTask,
    removeInboxTask,
    isConnected,
  } = useAppStore();

  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [activeItem, setActiveItem] = useState<TimeBlockType | InboxTaskType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load daily plan when date changes
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const loadedPlan = await loadDailyPlan(selectedDate);
      setPlan(
        loadedPlan || {
          date: formatDate(selectedDate),
          targetHours: 8,
          timeBlocks: [],
          inbox: [],
        }
      );
      setIsLoading(false);
    }

    if (isConnected) {
      load();
    } else {
      // Demo mode with empty plan
      setPlan({
        date: formatDate(selectedDate),
        targetHours: 8,
        timeBlocks: [],
        inbox: [],
        notes: 'Connect a data folder to save your plans',
      });
      setIsLoading(false);
    }
  }, [selectedDate, loadDailyPlan, isConnected]);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === 'inbox-task') {
      setActiveItem(active.data.current.task);
    } else {
      // Find time block
      const block = plan?.timeBlocks.find((b) => b.id === active.id);
      if (block) {
        setActiveItem(block);
      }
    }
  }, [plan]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);

      if (!over || !plan) return;

      // Handle inbox task dropped on time slot
      if (active.data.current?.type === 'inbox-task' && over.id.toString().startsWith('slot-')) {
        const task = active.data.current.task as InboxTaskType;
        const time = over.data.current?.time as string;

        if (time) {
          // Calculate end time based on estimated minutes
          const duration = task.estimatedMinutes || 30;
          const [hours, minutes] = time.split(':').map(Number);
          const endMinutes = hours * 60 + minutes + duration;
          const endHours = Math.floor(endMinutes / 60);
          const endMins = endMinutes % 60;
          const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

          // Create new time block
          const newBlock: TimeBlockType = {
            id: `task_${uuidv4().slice(0, 8)}`,
            projectId: task.projectId,
            title: task.title,
            startTime: time,
            endTime,
            estimatedMinutes: task.estimatedMinutes,
            status: 'planned',
            type: 'deep-work',
          };

          // Update plan
          const updatedPlan = {
            ...plan,
            timeBlocks: [...plan.timeBlocks, newBlock].sort((a, b) =>
              a.startTime.localeCompare(b.startTime)
            ),
            inbox: plan.inbox.filter((t) => t.id !== task.id),
          };

          setPlan(updatedPlan);
          await saveDailyPlan(updatedPlan);
        }
        return;
      }

      // Handle time block reordering
      if (active.id !== over.id) {
        const oldIndex = plan.timeBlocks.findIndex((b) => b.id === active.id);
        const newIndex = plan.timeBlocks.findIndex((b) => b.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newBlocks = arrayMove(plan.timeBlocks, oldIndex, newIndex);
          const updatedPlan = { ...plan, timeBlocks: newBlocks };
          setPlan(updatedPlan);
          await saveDailyPlan(updatedPlan);
        }
      }
    },
    [plan, saveDailyPlan]
  );

  const handleBlockStatusChange = useCallback(
    async (blockId: string, status: TimeBlockType['status']) => {
      if (!plan) return;

      const updatedBlocks = plan.timeBlocks.map((b) =>
        b.id === blockId ? { ...b, status } : b
      );
      const updatedPlan = { ...plan, timeBlocks: updatedBlocks };
      setPlan(updatedPlan);
      await saveDailyPlan(updatedPlan);
    },
    [plan, saveDailyPlan]
  );

  const handleBlockEdit = useCallback((block: TimeBlockType) => {
    // TODO: Open edit modal
    console.log('Edit block:', block);
  }, []);

  const handleTaskToggle = useCallback(
    async (taskId: string, completed: boolean) => {
      if (!plan) return;

      const updatedInbox = plan.inbox.map((t) =>
        t.id === taskId ? { ...t, completed } : t
      );
      const updatedPlan = { ...plan, inbox: updatedInbox };
      setPlan(updatedPlan);
      await saveDailyPlan(updatedPlan);
    },
    [plan, saveDailyPlan]
  );

  const handleTaskAdd = useCallback(
    async (task: InboxTaskType) => {
      if (!plan) return;

      const updatedPlan = { ...plan, inbox: [...plan.inbox, task] };
      setPlan(updatedPlan);
      await saveDailyPlan(updatedPlan);
    },
    [plan, saveDailyPlan]
  );

  const handleTaskDelete = useCallback(
    async (taskId: string) => {
      if (!plan) return;

      const updatedPlan = { ...plan, inbox: plan.inbox.filter((t) => t.id !== taskId) };
      setPlan(updatedPlan);
      await saveDailyPlan(updatedPlan);
    },
    [plan, saveDailyPlan]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-muted">No plan data</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-4rem)] gap-6 p-6">
        {/* Left: Inbox */}
        <div className="w-80 flex-shrink-0 bg-surface-secondary border border-border rounded-lg p-4">
          <Inbox
            tasks={plan.inbox}
            onTaskToggle={handleTaskToggle}
            onTaskAdd={handleTaskAdd}
            onTaskDelete={handleTaskDelete}
          />
        </div>

        {/* Center: Time Grid */}
        <div className="flex-1 bg-surface-secondary border border-border rounded-lg overflow-hidden">
          <TimeGrid
            timeBlocks={plan.timeBlocks}
            onBlockEdit={handleBlockEdit}
            onBlockStatusChange={handleBlockStatusChange}
          />
        </div>

        {/* Right: Stats */}
        <div className="w-72 flex-shrink-0 bg-surface-secondary border border-border rounded-lg p-4">
          <DailyStats plan={plan} />
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeItem && 'startTime' in activeItem ? (
          <div className="drag-overlay">
            <TimeBlock block={activeItem as TimeBlockType} />
          </div>
        ) : activeItem ? (
          <div className="drag-overlay">
            <InboxTask task={activeItem as InboxTaskType} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
