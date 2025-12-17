// Date utility functions for Horizon

import { format, startOfWeek, endOfWeek, addDays, isToday, isSameDay, parseISO } from 'date-fns';

export function formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
  return format(date, formatStr);
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatShortDate(date: Date): string {
  return format(date, 'MMM d');
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

export function isCurrentDay(date: Date): boolean {
  return isToday(date);
}

export function areSameDay(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

export function parseDateString(dateStr: string): Date {
  return parseISO(dateStr);
}

export function getDayFileName(date: Date): string {
  return `daily/${formatDate(date)}.md`;
}

export function generateTimeSlots(
  startHour: number = 6,
  endHour: number = 22,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
      if (hour === endHour && minutes > 0) break;
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      );
    }
  }

  return slots;
}

export function getHoursFromTimeBlocks(
  blocks: { startTime: string; endTime: string }[]
): number {
  let totalMinutes = 0;

  for (const block of blocks) {
    const [startH, startM] = block.startTime.split(':').map(Number);
    const [endH, endM] = block.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    totalMinutes += endMinutes - startMinutes;
  }

  return totalMinutes / 60;
}

export function formatHoursDisplay(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
