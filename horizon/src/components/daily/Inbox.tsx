import { useState } from 'react';
import { clsx } from 'clsx';
import type { InboxTask as InboxTaskType } from '../../types';
import { InboxTask } from './InboxTask';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { v4 as uuidv4 } from 'uuid';

interface InboxProps {
  tasks: InboxTaskType[];
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  onTaskEdit?: (task: InboxTaskType) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskAdd?: (task: InboxTaskType) => void;
}

export function Inbox({
  tasks,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onTaskAdd,
}: InboxProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState('');

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const task: InboxTaskType = {
      id: `inbox_${uuidv4().slice(0, 8)}`,
      title: newTaskTitle.trim(),
      estimatedMinutes: newTaskMinutes ? parseInt(newTaskMinutes) : undefined,
      completed: false,
      tags: [],
    };

    onTaskAdd?.(task);
    setNewTaskTitle('');
    setNewTaskMinutes('');
    setIsAddingTask(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
      setNewTaskMinutes('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h2 className="font-semibold text-text">Inbox</h2>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add
        </button>
      </div>

      {/* Add task form */}
      {isAddingTask && (
        <div className="py-4 space-y-3 border-b border-border">
          <Input
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Est. minutes"
              className="w-24"
              value={newTaskMinutes}
              onChange={(e) => setNewTaskMinutes(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button size="sm" onClick={handleAddTask}>
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskTitle('');
                setNewTaskMinutes('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Incomplete tasks */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {incompleteTasks.length === 0 && !isAddingTask && (
          <div className="text-center py-8 text-text-subtle text-sm">
            <p>No tasks in inbox</p>
            <p className="mt-1 text-xs">
              Press <kbd>n</kbd> to add a new task
            </p>
          </div>
        )}

        {incompleteTasks.map((task) => (
          <InboxTask
            key={task.id}
            task={task}
            onToggle={(completed) => onTaskToggle?.(task.id, completed)}
            onEdit={onTaskEdit}
            onDelete={() => onTaskDelete?.(task.id)}
          />
        ))}
      </div>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className="border-t border-border pt-4">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm text-text-muted hover:text-text">
              <svg
                className="h-4 w-4 transition-transform group-open:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Completed ({completedTasks.length})
            </summary>
            <div className="mt-3 space-y-2">
              {completedTasks.map((task) => (
                <InboxTask
                  key={task.id}
                  task={task}
                  onToggle={(completed) => onTaskToggle?.(task.id, completed)}
                  onEdit={onTaskEdit}
                  onDelete={() => onTaskDelete?.(task.id)}
                />
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
