import { monthKey, moveMonth, totals } from './finance';
import type { Goal, Operation } from './models';

export interface Achievement {
  id: 'first' | 'beyond' | 'summit' | 'three' | 'streak';
  name: string;
  description: string;
  earned: boolean;
  progress: number;
  target: number;
  unit: '%' | 'мес.';
}

export function achievements(operations: Operation[], goals: Goal[], today: string): Achievement[] {
  const currentMonth = monthKey(today);
  const results = goals.map(goal => {
    const key = `${goal.year}-${String(goal.month).padStart(2, '0')}`;
    const profit = totals(operations.filter(o => monthKey(o.date) === key && o.date <= today)).profit;
    return { key, profit, target: goal.targetAmountKopecks };
  }).filter(result => result.key <= currentMonth && result.target > 0);
  const bestPercent = Math.max(0, ...results.map(result => result.profit / result.target * 100));
  // Compare integer amounts instead of rounded percentages at award boundaries.
  const reached = (percent: number) => results.some(result =>
    BigInt(result.profit) * 100n >= BigInt(result.target) * BigInt(percent));
  const completed = results.filter(result => result.key < currentMonth && result.profit >= result.target)
    .map(result => result.key).sort();
  let streak = 0;
  let longestStreak = 0;
  let previous: string | undefined;
  for (const key of completed) {
    streak = previous && moveMonth(previous, 1) === key ? streak + 1 : 1;
    longestStreak = Math.max(longestStreak, streak);
    previous = key;
  }
  return [
    { id: 'first', name: 'Первая вершина', description: 'Выполнить цель любого месяца на 100%.', earned: reached(100), progress: bestPercent, target: 100, unit: '%' },
    { id: 'beyond', name: 'Выше планки', description: 'Выполнить цель любого месяца на 120%.', earned: reached(120), progress: bestPercent, target: 120, unit: '%' },
    { id: 'summit', name: 'На высоте', description: 'Выполнить цель любого месяца на 150%.', earned: reached(150), progress: bestPercent, target: 150, unit: '%' },
    { id: 'three', name: 'Свой ритм', description: 'Завершить три месяца с выполненной целью. Можно не подряд.', earned: completed.length >= 3, progress: completed.length, target: 3, unit: 'мес.' },
    { id: 'streak', name: 'Стабильность', description: 'Завершить три календарных месяца подряд с выполненной целью.', earned: longestStreak >= 3, progress: longestStreak, target: 3, unit: 'мес.' },
  ];
}
