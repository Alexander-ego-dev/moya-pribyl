import { monthKey, totals } from './finance';
import type { Goal, Operation } from './models';

export interface Achievement {
  id: 'first' | 'beyond' | 'summit' | 'ultra';
  name: string;
  description: string;
  earned: boolean;
  progress: number;
  target: number;
  unit: '%';
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
  return [
    { id: 'first', name: 'Буся на высоте', description: 'Выполнить цель любого месяца на 100%.', earned: reached(100), progress: bestPercent, target: 100, unit: '%' },
    { id: 'beyond', name: 'Супер Буся', description: 'Выполнить цель любого месяца на 120%.', earned: reached(120), progress: bestPercent, target: 120, unit: '%' },
    { id: 'summit', name: 'Гипер Буся', description: 'Выполнить цель любого месяца на 150%.', earned: reached(150), progress: bestPercent, target: 150, unit: '%' },
    { id: 'ultra', name: 'Ультра Буся', description: 'Выполнить цель любого месяца на 200%.', earned: reached(200), progress: bestPercent, target: 200, unit: '%' },
  ];
}
